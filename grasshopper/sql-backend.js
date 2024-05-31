// Import the mariadb library
import express from 'express';
import { createPool } from 'mariadb';

const app = express();

const pool = createPool({
    host: 'localhost', // The hostname of the database server
    user: 'mariadb', // The username to connect to the database
    password: 'mariadb', // The password for the username
    database: 'testdb', // The database to connect to
    connectionLimit: 5 // The maximum number of connections in the pool
});

app.get('/api/chats/:userId', async (req, res) => {
    const userId = req.params.userId;
    let conn;
    try {
        conn = await pool.getConnection();
        let request = "SELECT c.* FROM chats c JOIN chats_users cu ON c.id = cu.chat_id WHERE cu.user_id = ?;";
        let rows = await conn.query(request, [userId]);
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Server error');
    } finally {
        if (conn) return conn.end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});