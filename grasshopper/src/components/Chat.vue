<script setup>
import Message from '@/components/Message.vue';
import { Backend } from '@/scripts/backend';
import { until } from '@/scripts/functions';
import EmojiPicker from './EmojiPicker.vue';
</script>

<template>
    <EmojiPicker v-model="emojiPicker" @select="emojiSelect"/>
    <div class="chat">
        <v-infinite-scroll v-if="chat != undefined" side="both" class="messages" @load="load">
            <template v-for="(item, index) in messages[chat.id]" :key="item">
                <Suspense>
                    <Message :message="item" :can-write="chat.can_write" :get-edited-messages="getEditedMessages" :reactions="reactions[chat.id][item.id]"/>
                </Suspense>
            </template>
            <template v-slot:loading>
            </template>
        </v-infinite-scroll>
        <v-form v-if="chat != undefined" @submit.prevent="sendMessage">
            <div class="message_box_wrapper">
                <div class="">
                    <v-checkbox title="Show larger message input box" color="primary" v-model="showTextarea" />
                </div>
                <v-textarea v-if="showTextarea"
                    clearable
                    :label="'Message '+o.name+'...'"
                    prepend-inner-icon="mdi-comment"
                    rows="1"
                    max-rows="8"
                    auto-grow
                    :disabled="!chat.can_write"
                    :color="chat.can_write?'primary-light':'default'"
                    v-model="message[chat.id]"/>
                <v-text-field v-if="!showTextarea"
                    clearable
                    :label="'Message '+o.name+'...'"
                    prepend-inner-icon="mdi-comment"
                    rows="1"
                    :disabled="!chat.can_write"
                    :color="chat.can_write?'primary-light':'default'"
                    v-model="message[chat.id]"/>
                <div class="send_button_wrapper">
                    <v-btn @click="() => emojiPicker = true" icon="mdi-emoticon" :color="chat.can_write?'#323232':'default'" :disabled="!chat.can_write"/>
                </div>
                <div class="send_button_wrapper">
                    <v-btn type="submit" icon="mdi-send" :color="chat.can_write?'primary':'default'" :disabled="!chat.can_write"/>
                </div>
            </div>
        </v-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chat: undefined,
            notificationReceived: true,
            emojiPicker: false,
            showTextarea: false,

            messageLoadCount: 10,
            editedMessagesInterval: localStorage.getItem('editedMessagesInterval') || 5000,

            messages: {},
            reactions: {},
            lastTimestamp: {},
            lastEditedTimestamp: {},
            newestTimestamp: {},
            reachedChatEnd: {},
            message: {},
        }
    },
    props: {
        o: {
            type: Object,
            required: true
        },
        current_notifications: {
            type: Object,
            default: {}
        }
    },
    async mounted() {
        await this.updateChat();
        setInterval(this.getEditedMessages, this.editedMessagesInterval);
    },
    watch: {
        o: function() {this.updateChat()},

        current_notifications: {
            handler: async function(current_notifications) {
                this.notificationReceived = (Object.keys(current_notifications).length > 0 || this.notificationReceived);
            },
            deep: true
        }
    },
    methods: {
        /*
        Updating the this.chat element
        */
        async updateChat() {
            if (this.o == undefined) return;

            // get the new chat from the backend
            let data = await Backend.getChatById(this.o.id);
            data = {...data};
            this.chat = data.chat;
            this.notificationReceived = true;

            // define default values to chat-specific properties
            if (!this.lastTimestamp.hasOwnProperty(this.chat.id)) this.lastTimestamp[this.chat.id] = Math.floor(Date.now() / 1000);
            if (!this.lastEditedTimestamp.hasOwnProperty(this.chat.id)) this.lastEditedTimestamp[this.chat.id] = Math.floor(Date.now() / 1000);
            if (!this.newestTimestamp.hasOwnProperty(this.chat.id)) this.newestTimestamp[this.chat.id] = Math.floor(Date.now() / 1000);
            if (!this.messages.hasOwnProperty(this.chat.id)) this.messages[this.chat.id] = [];
            if (!this.reactions.hasOwnProperty(this.chat.id)) this.reactions[this.chat.id] = {};
            if (!this.message.hasOwnProperty(this.chat.id)) this.message[this.chat.id] = "";
            if (!this.reachedChatEnd.hasOwnProperty(this.chat.id)) this.reachedChatEnd[this.chat.id] = "";
        },
        /*
        Loading Function for Messages Scroller
        */
        async load({ side, done }) {
            // check for old messages every 100 ms when scrolling up
            if (side === "start") {
                setTimeout(async () => {

                    // extract current values to prevent bugs while switching chats during await
                    let chatId = this.chat.id;

                    // if the current chat is fully loaded; return
                    if (this.reachedChatEnd[chatId]) return done('ok');

                    // get messages
                    await this.getMessages(chatId);
                    done('ok');
                }, 100)
            // check for new messages when notification received and scrolling down
            } else if (side === "end") {

                // wait until a notification is received
                await until(_ => this.notificationReceived);
                this.notificationReceived = false;

                // get chat updates
                this.getChatUpdates();
                done('ok');
            }
        },
        /*
        Get (Old) Messages
        */
        async getMessages(chatId) {
            // extract current values to prevent bugs while switching chats during await
            let lastTimestamp = this.lastTimestamp[chatId];

            // request messages
            let data = await Backend.getMessagesByChatId(chatId, lastTimestamp, this.messageLoadCount);
            data = {...data};
            let newMessages = data.messages;

            // add messages to internal list
            this.messages[chatId].unshift(...newMessages);
            if (newMessages.length > 0) this.lastTimestamp[chatId] = newMessages[0].timestamp;
            if (newMessages.length < this.messageLoadCount) this.reachedChatEnd[chatId] = true;

            // add reactions to internal list
            for (let messageID in data.reactions) {
                this.reactions[chatId][messageID] = data.reactions[messageID];
            }
        },
        /*
        Get New Messages (Chat Updates)
        */
        async getChatUpdates() {
            // extract current values to prevent bugs while switching chats during await
            let chatId = this.chat.id;
            let newestTimestamp = this.newestTimestamp[chatId];

            console.log("getChatUpdates");

            // get new messages
            let data = await Backend.getChatUpdates(chatId, newestTimestamp);
            data = {...data};
            let newMessages = data.messages;

            // add messages to internal list
            this.messages[chatId].push(...newMessages);
            newMessages.forEach(element => {
                this.reactions[chatId][element.id] = data.reactions[element.id] || {};
            });
            if (newMessages.length > 0) this.newestTimestamp[chatId] = newMessages[newMessages.length - 1].timestamp;
        },
        /*
        Get Edited / Deleted Messages & Updated Reactions
        */
        async getEditedMessages() {
            // extract current values to prevent bugs while switching chats during await
            let chatId = this.chat.id;
            let lastEditedTimestamp = this.lastEditedTimestamp[chatId];

            // get data from backend
            let { edited, deleted, reactions } = await Backend.getEditedMessages(chatId, lastEditedTimestamp);

            // create temporary message_id lists
            let deleted_ids = [], edited_ids = [];

            // remove deleted message-divs
            deleted.forEach(element => {
                deleted_ids.push(element.id);
                let e = document.getElementById("chat-"+chatId+"-message-"+element.id);
                if (e != undefined) {
                    e.remove();
                }
            });

            // change content of edited message-divs
            edited.forEach(element => {
                edited_ids.push(element.id);
                let e = document.getElementById("chat-"+chatId+"-message-"+element.id);
                if (e != undefined) {
                    let content = e.querySelector(".message__content");
                    content.innerHTML = element.content;
                }
            });

            // update reactions to internal list
            reactions.forEach(element => {
                this.reactions[chatId][element.message_id][element.emoji] = element;
            });

            // create new temporary messages list
            let checked_messages = [];

            // check through internal messages list to edit and remove
            this.messages[chatId].forEach((element) => {
                if (deleted_ids.includes(element.id)) {
                    this.messages[chatId].splice(this.messages[chatId].indexOf(element), 1);
                    console.log('deleted '+element.id);
                } else if (edited_ids.includes(element.id)) {
                    element.content = edited[element.id].content;
                }
            });

            // set time of this check
            this.lastEditedTimestamp[chatId] = Math.floor(Date.now() / 1000) - 2;
        },
        /*
        Send a message to the current channel
        */
        async sendMessage() {
            // extract current values to prevent bugs while switching chats during await
            let chatId = this.chat.id;

            // send message to backend
            Backend.sendMessage(chatId, this.message[chatId]);

            // reset and check to download the new message
            this.message[chatId] = '';
            this.notificationReceived = true;
        },
        /*
        Select an emoji in the picker
        */
        emojiSelect(event) {
            this.message[this.chat.id] += event.i;
            this.emojiPicker = false;
        }
    }
}
</script>

<style>

</style>