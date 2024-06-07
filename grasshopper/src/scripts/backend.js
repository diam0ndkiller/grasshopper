export class Backend {
    static users = {};
    static chats = {};

    static api_path = 'https://localhost:3000/api/';
    static user_id = 0;
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
            if (data.success) {
                this.token = data.token;
                this.user_id = data.user_id;
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    }

    static async changeUsername(new_username) {
        let body = JSON.stringify({ new_username });
        try {
            const response = await fetch(this.api_path+'change_username/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    }

    static async updateUserImage(base64Image) {
        let body = JSON.stringify({ image: base64Image });
        try {
            const response = await fetch(this.api_path+'update_user_image/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Updating user image failed');
            }
            await this.recacheUser();
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating user image:', error);
            throw new Error('Updating user image failed');
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

    static async getUserById(userID) {
        try {
            const response = await fetch(this.api_path+'user/'+userID, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Getting user failed');
            }
    
            const data = await response.json();
            this.users[""+data.user.id] = data;
            return data;
        } catch (error) {
            console.error('Error getting user '+userID+':', error);
            throw new Error('Getting user failed');
        }
    }

    static async recacheUser() {
        try {
            const response = await fetch(this.api_path+'user/'+this.user_id, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "reload"
            });
    
            if (!response.ok) {
                throw new Error('Getting user failed');
            }
    
            const data = await response.json();
            this.users[""+data.user.id] = data;
            return data;
        } catch (error) {
            console.error('Error getting user '+userID+':', error);
            throw new Error('Getting user failed');
        }
    }

    static async sendMessage(chat_id, content) {
        let body = JSON.stringify({chat_id, author_id: this.user_id, content});
        console.log(body);
        try {
            const response = await fetch(this.api_path+'send-message/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Writing message failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error writing message:', error);
            throw new Error('Writing message failed');
        }
    }

    static async deleteMessage(message_id) {
        let body = JSON.stringify({message_id});
        console.log(body);
        try {
            const response = await fetch(this.api_path+'delete-message/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Deleting message failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting message:', error);
            throw new Error('Deleting message failed');
        }
    }

    static async addReaction(message_id, emoji) {
        let body = JSON.stringify({message_id, emoji});
        try {
            const response = await fetch(this.api_path+'add-reaction/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Adding reaction failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding reaction:', error);
            throw new Error('Adding reaction failed');
        }
    }

    static async removeReaction(reaction_id) {
        let body = JSON.stringify({reaction_id});
        try {
            const response = await fetch(this.api_path+'remove-reaction/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: body,
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Removing reaction failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error removing reaction:', error);
            throw new Error('Removing reaction failed');
        }
    }

    static async getChatUpdates(chatID, newest_timestamp) {
        try {
            const response = await fetch(this.api_path+'chat-updates/'+chatID+'/'+newest_timestamp, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting chat updates failed');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting chat updates in '+chatID+':', error);
            throw new Error('Getting chat updates failed');
        }
    }

    static async getNewNotifications(newest_timestamp) {
        try {
            const response = await fetch(this.api_path+'new-notifications/'+newest_timestamp, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting new notifications failed');
            }
    
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (error) {
            console.error('Error getting new notifications:' + error);
            throw new Error('Getting new notifications failed');
        }
    }

    static async getEditedMessages(chat_id, newest_timestamp) {
        try {
            const response = await fetch(this.api_path+'edited-messages/'+chat_id+'/'+newest_timestamp, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                cache: "no-store"
            });
    
            if (!response.ok) {
                throw new Error('Getting edited messages failed');
            }
    
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (error) {
            console.error('Error getting edited messages:' + error);
            throw new Error('Getting edited messages failed');
        }
    }
}