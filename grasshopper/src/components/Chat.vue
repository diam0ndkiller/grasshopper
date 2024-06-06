<script setup>
import Message from '@/components/Message.vue';
import { Backend } from '@/scripts/backend';
defineProps({
    o: {
        type: Object,
        required: true
    },
    current_notifications: {
        type: Object,
        default: {}
    }
})
</script>

<template>
    <div class="chat">
        <v-infinite-scroll v-if="chat != undefined" side="both" class="messages" @load="load">
            <template v-for="(item, index) in messages" :key="item">
                <Suspense>
                    <Message :message="item" :can-write="chat.can_write" :get-edited-messages="getEditedMessages"/>
                </Suspense>
            </template>
            <template v-slot:loading>
            </template>
        </v-infinite-scroll>
        <v-form v-if="chat != undefined && chat.can_write" @submit.prevent="sendMessage">
            <div class="message_box_wrapper">
                <v-text-field 
                    clearable
                    :label="'Message '+o.name+'...'"
                    prepend-inner-icon="mdi-comment"
                    rows="1"
                    auto-grow
                    v-model="message"/>
                <div class="send_button_wrapper">
                    <v-btn type="submit" icon="mdi-send"/>
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
            messages: [],
            savestates: {},
            chatId: this.o.id,
            lastTimestamp: Math.floor(Date.now() / 1000),
            lastEditedTimestamp: Math.floor(Date.now() / 1000),
            messageLoadCount: 10,
            reachedChatEnd: false,
            notificationReceived: true,
            message: ''
        }
    },
    async mounted() {
        let data = await Backend.getChatById(this.o.id);
        data = {...data};
        this.chat = data.chat;
        setInterval(this.getEditedMessages, 5000);
    },
    computed: {
        newestTimestamp() {
            try { return this.messages[this.messages.length - 1].timestamp; }
            catch { return Math.floor(Date.now() / 1000); }
        },
    },
    watch: {
        o: async function(o) {
            let data = await Backend.getChatById(this.o.id);
            data = {...data};
            this.chat = data.chat;
            this.savestates[this.chatId] = {
                messages: [...this.messages],
                lastTimestamp: this.lastTimestamp,
                lastEditedTimestamp: this.lastEditedTimestamp,
                message: this.message
            };
            this.chatId = this.o.id;
            if (this.savestates.hasOwnProperty(this.chatId)) {
                this.messages = this.savestates[this.chatId].messages;
                this.lastTimestamp = this.savestates[this.chatId].lastTimestamp;
                this.lastEditedTimestamp = this.savestates[this.chatId].lastEditedTimestamp;
                this.message = this.savestates[this.chatId].message;
            }
            else {
                this.messages = [];
                this.lastTimestamp = Math.floor(Date.now() / 1000) - 2;
                this.lastEditedTimestamp = Math.floor(Date.now() / 1000) - 2;
                this.message = '';
            }
            this.reachedChatEnd = false;
            this.notificationReceived = true;
        },
        current_notifications: {
            handler: async function(current_notifications) {
                this.notificationReceived = (Object.keys(current_notifications).length > 0 || this.notificationReceived);
            },
            deep: true
        }
    },
    methods: {
        async sendMessage() {
            Backend.sendMessage(this.o.id, this.message);
            this.message = '';
            this.$emit('message-sent');
        },
        async load ({ side, done }) {
            if (side === "start") {
                setTimeout(async () => {
                    if (this.reachedChatEnd) return done('ok');
                    console.log("loading old messages...")
                    let data = await Backend.getMessagesByChatId(this.chat.id, this.lastTimestamp, this.messageLoadCount);
                    data = {...data};
                    let newMessages = data.messages;
                    if (newMessages.length > 0) this.lastTimestamp = newMessages[0].timestamp;
                    this.messages.unshift(...newMessages);
                    if (newMessages.length < this.messageLoadCount) this.reachedChatEnd = true;
                    done('ok');
                }, 100)
            } else if (side === "end") {
                await this.until(_ => this.notificationReceived);
                this.notificationReceived = false;
                console.log("loading message updates...");
                let data = await Backend.getChatUpdates(this.chat.id, this.newestTimestamp);
                data = {...data};
                let newMessages = data.messages;
                this.messages.push(...newMessages);
                done('ok');
            }
        },
        getNewestMessage() {
            let all = document.querySelector(".message");
            console.log("all: ", all);
            let latest = all[all.length - 1];
            console.log(latest);
            return latest;
        },
        messageSent() {
            this.notificationReceived = true;
        },
        until(conditionFunction) {
            const poll = resolve => {
            if(conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 100);
            }

            return new Promise(poll);
        },
        async getEditedMessages() {
            let { edited, deleted } = await Backend.getEditedMessages(this.chatId, this.lastEditedTimestamp);
            this.lastEditedTimestamp = Math.floor(Date.now() / 1000) - 2;
            deleted.forEach(element => {
                let e = document.getElementById("message-"+element.id);
                if (e != undefined) {
                    e.remove();
                }
            });
            edited.forEach(element => {
                let e = document.getElementById("message-"+element.id);
                if (e != undefined) {
                    let content = e.querySelector(".message__content");
                    content.innerHTML = element.content;
                }
            });
            this.messages.forEach((element) => {
                if (element.id in deleted) {
                    this.messages.splice(this.messages.indexOf(element), 1)
                } else if (element.id in edited) {
                    element.content = edited[element.id].content;
                }
            });
        }
    }
}
</script>

<style>

</style>