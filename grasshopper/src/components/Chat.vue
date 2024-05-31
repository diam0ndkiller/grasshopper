<script setup>
import { FakeBackend } from '@/scripts/fake-backend';
import Message from '@/components/Message.vue';
defineProps({
    o: {
        type: Object,
        required: true
    }
})
</script>

<template>
  <v-infinite-scroll side="start" @load="load" style="height: calc(100vh - 50px);">
    <template v-for="(item, index) in messages" :key="item">
      <Message :message="item"/>
    </template>
  </v-infinite-scroll>
</template>

<script>
export default {
    data() {
        return {
            chat: FakeBackend.getChatById(this.o.id),
            messages: [],
            savestates: {},
            chatId: this.o.id,
            currentIndex: 0,
            messageLoadCount: 10,
            reachedChatEnd: false
        }
    },
    computed: {
        
    },
    watch: {
        o: function(o) {
            this.chat = FakeBackend.getChatById(this.o.id);
            this.savestates[this.chatId] = {
                messages: [...this.messages],
                currentIndex: this.currentIndex
            };
            this.chatId = this.o.id;
            if (this.savestates.hasOwnProperty(this.chatId)) {
                this.messages = this.savestates[this.chatId].messages;
                this.currentIndex = this.savestates[this.chatId].currentIndex;
            }
            else {
                this.messages = [];
                this.currentIndex = 0;
            }
            this.reachedChatEnd = false;
        }
    },
    methods: {
        load ({ done }) {
            setTimeout(() => {
                if (this.reachedChatEnd) return done('ok');
                let newMessages = FakeBackend.getMessagesByChatId(this.chat.id, this.currentIndex, 10);
                this.currentIndex += newMessages.length;
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