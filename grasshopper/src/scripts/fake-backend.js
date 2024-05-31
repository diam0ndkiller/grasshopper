export class FakeBackend {
    static chatMessages = {};
    static chatMessagesById = {};

    static getChats() {
        let chats = {};
        chats['-1'] = {id: '-1', name: 'welcome'}
        chats['0'] = {id: '0', name: 'internal'};
        for (let chatID = 1; chatID < 100; chatID++) {
            chats[""+chatID] = {id: ""+chatID, name: "demo chat id="+chatID, imgSrc: "/assets/chat/"+chatID+".png"};
        }
        return chats;
    }

    static getChatById(chatID) {
        let chat = {id: chatID};
        chat.participants = {};
        for (let participantID = 0; participantID < 5; participantID++) {
            chat.participants[""+participantID] = this.getParticipantById(""+participantID);
        }
        this.chatMessages[chatID] = [];
        this.chatMessagesById[chatID] = {};
        for (let i = 0; i < 89; i++) {
            let messageID = 89 - i;
            this.chatMessages[chatID].push(this.getMessageById(chatID, ""+messageID));
            this.chatMessagesById[chatID][""+messageID] = i;
        }
        return chat;
    }

    static getMessagesByChatId(chatID, begin, messageCount) {
        let messages = [];
        for (let i = begin + messageCount - 1; i >= begin; i--){
            if (this.chatMessages[chatID].length > i) {
                messages.push(this.chatMessages[chatID][i]);
            }
        }
        return messages;
    }

    static getMessageById(chatID, messageID) {
        let message = {id: messageID, chatID: chatID};
        message.content = "demo message id="+messageID;
        message.reactions = {"✅": [this.getParticipantById('-1')]};
        message.author = this.getParticipantById(chatID);
        return message;
    }

    static getParticipantById(participantID) {
        let participant = {id: participantID};
        participant.name = "demo participant id="+participantID;
        participant.imgSrc = "assets/participants/"+participantID+".png";
        return participant;
    }
}