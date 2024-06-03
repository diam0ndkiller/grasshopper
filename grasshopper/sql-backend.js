// Import the mariadb library
import express from 'express';
import { createPool } from 'mariadb';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import bcrypt from 'bcrypt';

const jwt_secret = process.env.JWT_SECRET || "asiobnwiavhubjnqlwöoeia89vhu3qnw90a7821ß03u4injavslasduhflöu29q4uoiajsdfk";

const app = express();

const pool = createPool({
    host: '144.24.166.159', // The hostname of the database server
    user: 'mariadb', // The username to connect to the database
    password: 'mariadb', // The password for the username
    database: 'grasshopper_dev', // The database to connect to
    connectionLimit: 5 // The maximum number of connections in the pool
});

async function getNextUniqueId(table) {
    let conn, result;
    try {
        conn = await pool.getConnection();
        result = await conn.query('SELECT MAX(id) AS maxId FROM '+table+';');
    } catch (error) {
        console.error('Error generating unique ID:', error);
        throw new Error('Failed to generate unique ID');
    } finally {
        if (conn) conn.end();
    }
    let nextId = result[0].maxId + 1 || 1;
    console.log(nextId);
    return nextId;
}

app.use(cors({
    origin: '*' // Replace with your ViteJS server's origin
}));

app.use(express.json());

app.post('/api/register/', async (req, res) => {
    const { username, password } = req.body;
    console.log("registering user '"+username+"' with password '"+password+"'...");
    let conn;

    try {
        conn = await pool.getConnection();
        const users = await conn.query('SELECT * FROM users WHERE name = ?;', [username]);
        if (users.length > 0) {
            console.log("username already taken.");
            return res.json({success: false, message: 'username already taken.'});
        }

        const user_id = await getNextUniqueId("users");
        await conn.query('INSERT INTO users(id, name) VALUES (?, ?);', [user_id, username]);

        bcrypt.genSalt(10, async function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                await conn.query('INSERT INTO users_passwords(user_id, password) VALUES(?, ?)', [user_id, hash]);
            });
        });

        await conn.query('INSERT INTO chats_users(chat_id, user_id) VALUES(-1, ?)', [user_id]);
        await conn.query('INSERT INTO chats_users(chat_id, user_id) VALUES(0, ?)', [user_id]);

        console.log("successful (id "+user_id+").");

        return res.json({success: true, user_id: user_id});
    } catch (error) {
        console.error('register error:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) return conn.end();
    }
})

app.post('/api/login/', async (req, res) => {
    const { username, password } = req.body;
    console.log("logging in user '" + username + "'...");
    let conn;

    try {
        conn = await pool.getConnection();
        const users = await conn.query('SELECT * FROM users WHERE name = ?', [username]);
        if (users.length === 0) {
            console.log('invalid username.');
            return res.json({success: false, message: 'invalid username.'});
        }
        const user_id = users[0].id;

        const passwords = await conn.query('SELECT * FROM users_passwords WHERE user_id = ?', [user_id])
        bcrypt.compare(password, passwords[0].password, function(err, result) {
            if (err){
                console.log('error comparing passwords.');
                return res.json({success: false, message: 'error comparing passwords.'});
            }
            if (result) {
                const token = jwt.sign({ user_id: user_id }, jwt_secret, {expiresIn: '10d'});
                console.log("successful.");
                return res.json({ success: true, user_id: user_id, token: token });
            } else {
                console.log('passwords do not match.');
                return res.json({success: false, message: 'passwords do not match.'});
            }
          });
    } catch (error) {
        console.error('login error:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.end();
    }
})

app.get('/api/chatlist/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("accessing chatlist with token '"+token+"'...");

    if (!token) {
        console.log('no token provided');
        return res.json({success: false, message: 'no token provided.'});
    }

    let user_id = jwt.verify(token, jwt_secret).user_id;
    if (user_id == undefined) {
        console.log('token invalid.');
        return res.json({success: false, message: 'token invalid.'});
    }

    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT c.* FROM chats c JOIN chats_users cu ON c.id = cu.chat_id WHERE cu.user_id = "+user_id+";");
        console.log("successful.");
        return res.json({success: true, chats: rows});
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.end();
    }
})

app.get('/api/chat/:chat_id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const chat_id = req.params.chat_id;
    console.log("accessing chat with id "+chat_id+" and token '"+token+"'...");

    if (!token) {
        console.log('no token provided');
        return res.json({success: false, message: 'no token provided.'});
    }

    let user_id = jwt.verify(token, jwt_secret).user_id;
    if (user_id == undefined) {
        console.log('token invalid.');
        return res.json({success: false, message: 'token invalid.'});
    }

    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * from chats where id = "+chat_id+";");
        if (rows.length == 0) {
            console.log('invalid chat id.');
            return res.json({success: false, message: 'invalid chat id.'});
        }
        console.log("successful.");
        return res.json({success: true, chat: rows[0]});
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.end();
    }
})

app.get('/api/messages/:chat_id/:last_timestamp/:message_count', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { chat_id, last_timestamp, message_count } = req.params;
    console.log("accessing "+message_count+" messages of chat id "+chat_id+" and token '"+token+"' last_timestamp '"+last_timestamp+"'...");

    if (!token) {
        console.log('no token provided');
        return res.json({success: false, message: 'no token provided.'});
    }

    let user_id = jwt.verify(token, jwt_secret).user_id;
    if (user_id == undefined) {
        console.log('token invalid.');
        return res.json({success: false, message: 'token invalid.'});
    }

    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * from (select * from messages where chat_id = "+chat_id+" and timestamp < '"+last_timestamp+"' order by timestamp desc limit "+message_count+") as subquery order by timestamp asc;");
        console.log("successful.");
        return res.json({success: true, messages: rows});
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.end();
    }
})

app.get('/api/user/:user_id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user_id = req.params.user_id;
    console.log("accessing user with id "+user_id+" and token '"+token+"'...");

    if (!token) {
        console.log('no token provided');
        return res.json({success: false, message: 'no token provided.'});
    }

    let own_user_id = jwt.verify(token, jwt_secret).user_id;
    if (own_user_id == undefined) {
        console.log('token invalid.');
        return res.json({success: false, message: 'token invalid.'});
    }

    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT * from users where id = "+user_id+";");
        if (rows.length == 0) {
            console.log('invalid chat id.');
            return res.json({success: false, message: 'invalid user id.'});
        }
        console.log("successful.");
        return res.json({success: true, user: rows[0]});
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) conn.end();
    }
})

app.get('/api/ping/', async (req, res) => {
    console.log("ping: pong");
    let json = {success: true, ping: "pong"};
    res.json(json);
})

const privateKey = fs.readFileSync('/home/diam0ndkiller/cert/ssl-cert-dia.key', 'utf8');
const certificate = fs.readFileSync('/home/diam0ndkiller/cert/ssl-cert-dia.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate }

const httpsServer = https.createServer(credentials, app);

const PORT = process.env.PORT || 3000;
httpsServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});