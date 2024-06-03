<script setup>
import Message from '@/components/Message.vue';
import { Backend } from '@/scripts/backend';
import { format } from 'date-fns';
defineProps({
    o: {
        type: Object,
        required: true
    }
})
</script>

<template>
  <v-infinite-scroll v-if="chat != undefined" side="start" @load="load" style="height: calc(100vh - 50px); z-index: -1; justify-content: flex-end; flex-direction: column;">
    <template v-for="(item, index) in messages" :key="item">
      <Suspense>
        <Message :message="item"/>
      </Suspense>
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
            lastTimestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            messageLoadCount: 10,
            reachedChatEnd: false
        }
    },
    async mounted() {
        let data = await Backend.getChatById(this.o.id);
        data = {...data};
        this.chat = data.chat;
    },
    computed: {
        
    },
    watch: {
        o: async function(o) {
            let data = await Backend.getChatById(this.o.id);
            data = {...data};
            this.chat = data.chat;
            this.savestates[this.chatId] = {
                messages: [...this.messages],
                lastTimestamp: this.lastTimestamp
            };
            this.chatId = this.o.id;
            if (this.savestates.hasOwnProperty(this.chatId)) {
                this.messages = this.savestates[this.chatId].messages;
                this.lastTimestamp = this.savestates[this.chatId].lastTimestamp;
            }
            else {
                this.messages = [];
                this.lastTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            }
            this.reachedChatEnd = false;
        }
    },
    methods: {
        async load ({ done }) {
            setTimeout(async () => {
                if (this.reachedChatEnd) return done('ok');
                let data = await Backend.getMessagesByChatId(this.chat.id, this.lastTimestamp, this.messageLoadCount);
                data = {...data};
                let newMessages = data.messages;
                if (newMessages.length > 0) this.lastTimestamp = newMessages[0].timestamp;
                this.messages.unshift(...newMessages);
                if (newMessages.length < this.messageLoadCount) this.reachedChatEnd = true;
                done('ok');
            }, 100)
        },
    }
}
</script>

<style>

</style>