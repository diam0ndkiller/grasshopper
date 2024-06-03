export class Backend {
    static chatMessages = {};
    static chatMessagesById = {};

    static api_path = 'https://localhost:3000/api/';
    static token = '';

    static async ping() {
        try {
            let response = await fetch(this.api_path+'ping/', {
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();
            console.log("ping", data);
            return data;
        } catch (error) {
            console.error('Ping failed:', error);
            return {success: false};
        }
    }

    static acceptCertificate = () => {
        window.open(this.api_path+'ping/', '_blank');
    }

    static async register(username, password) {
        let body = JSON.stringify({ username, password });
        try {
            const response = await fetch(this.api_path+'register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Registration failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Registration failed');
        }
    }

    static async login(username, password) {
        let body = JSON.stringify({ username, password });
        try {
            const response = await fetch(this.api_path+'login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const data = await response.json();
            this.token = data.token;
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    }

    static async getChats() {
        try {
            const response = await fetch(this.api_path+'chatlist/', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting chats failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting chats:', error);
            throw new Error('Getting chats failed');
        }
    }

    static async getChatById(chatID) {
        try {
            const response = await fetch(this.api_path+'chat/'+chatID, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting chat failed');
            }
    
            let data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting chat '+chatID+':', error);
            throw new Error('Getting chat failed');
        }
    }

    static async getMessagesByChatId(chatID, last_timestamp, messageCount) {
        try {
            const response = await fetch(this.api_path+'messages/'+chatID+'/'+last_timestamp+'/'+messageCount, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting messages failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting messages in '+chatID+':', error);
            throw new Error('Getting messages failed');
        }
    }

    static getMessageById(chatID, messageID) {
        let message = {id: messageID, chatID: chatID};
        message.content = "demo message id="+messageID;
        message.reactions = {"✅": [this.getParticipantById('-1')]};
        message.author = this.getParticipantById(chatID);
        return message;
    }

    static async getUserById(userID) {
        try {
            const response = await fetch(this.api_path+'user/'+userID, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting user failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting user '+userID+':', error);
            throw new Error('Getting user failed');
        }
    }
}