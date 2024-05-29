export class FakeBackend {
    static getChats() {
        let chats = {};
        chats['0'] = {id: '0', name: 'internal'};
        for (let chatID = 1; chatID < 100; chatID++) {
            chats[""+chatID] = {id: ""+chatID, name: "demo chat id="+chatID, imgSrc: "/assets/chat/"+chatID+".png"};
        }
        return chats;
    }

    static getChatById(chatID) {
        let chat = {id: chatID};
        chat.messages = {};
        for (let messageID = 0; messageID < 100; messageID++) {
            chat.messages[""+messageID] = this.getMessageById(chatID, ""+messageID);
        }
        chat.participants = {};
        for (let participantID = 0; participantID < 5; participantID++) {
            chat.participants[""+participantID] = this.getParticipantById(""+participantID);
        }
        return chat;
    }

    static getMessageById(chatID, messageID) {
        let message = {id: messageID, chatID: chatID};
        message.content = "demo message id="+messageID;
        message.reactions = {"✅": [this.getParticipantById('-1')]};
        return message;
    }

    static getParticipantById(participantID) {
        let participant = {id: participantID};
        participant.name = "demo participant id="+participantID;
        return participant;
    }
}