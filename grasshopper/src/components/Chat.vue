<script setup>
import Message from '@/components/Message.vue';
import { Backend } from '@/scripts/backend';
import { format } from 'date-fns';
defineProps({
    o: {
        type: Object,
        required: true
    },
    current_notifications: {
        type: Array,
        default: []
    }
})
</script>

<template>
    <v-infinite-scroll v-if="chat != undefined" side="both" class="messages" @load="load" style="height: calc(100vh - 50px);">
        <template v-for="(item, index) in messages" :key="item">
            <Suspense>
                <Message :message="item"/>
            </Suspense>
        </template>
        <template v-slot:loading>
        </template>
    </v-infinite-scroll>
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
            notificationReceived: true
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
        }
    },
    watch: {
        o: async function(o) {
            let data = await Backend.getChatById(this.o.id);
            data = {...data};
            this.chat = data.chat;
            this.savestates[this.chatId] = {
                messages: [...this.messages],
                lastTimestamp: this.lastTimestamp,
                lastEditedTimestamp: this.lastEditedTimestamp
            };
            this.chatId = this.o.id;
            if (this.savestates.hasOwnProperty(this.chatId)) {
                this.messages = this.savestates[this.chatId].messages;
                this.lastTimestamp = this.savestates[this.chatId].lastTimestamp;
                this.lastEditedTimestamp = this.savestates[this.chatId].lastEditedTimestamp;
            }
            else {
                this.messages = [];
                this.lastTimestamp = Math.floor(Date.now() / 1000);
                this.lastEditedTimestamp = Math.floor(Date.now() / 1000);
            }
            this.reachedChatEnd = false;
        },
        current_notifications: function(current_notifications) {
            this.notificationReceived = current_notifications.length > 0;
        }
    },
    methods: {
        async load ({ side, done }) {
            if (side == "start") {
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
            } else if (side == "end") {
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
        until(conditionFunction) {
            const poll = resolve => {
            if(conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 100);
            }

            return new Promise(poll);
        },
        getNewestMessage() {
            let all = document.querySelectorAll(".message");
            return all[all.length - 1];
        },
        async getEditedMessages() {
            let { edited, deleted } = await Backend.getEditedMessages(this.chatId, this.lastEditedTimestamp);
            this.lastEditedTimestamp = Math.floor(Date.now() / 1000);
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
        }
    }
}
</script>

<style>

</style>