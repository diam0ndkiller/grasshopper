<script setup>
import { Backend } from '@/scripts/backend';
import Thread from './Thread.vue'
defineProps({
    current_chat_id: {
        type: Number,
        default: null
    },
    notifications: {
        type: Object,
        default: {}
    }
})
</script>

<template>
    <div class="navigation__header flex-grow-1">
        <div class="navigation__header__grid">
            <div class="hiddenWhenBig navigation__header__item">
                <v-btn
                    @click="navigation__close__click"
                    color="#222222"
                    icon="mdi-close"
                ></v-btn>
            </div>
            <div class="navigation__header__item">
                <img class="logo" src="../../public/favicon.png">
            </div>
            <div class="navigation__header__item">
                <h1 class="inline heading">grasshopper</h1>
            </div>
        </div>
    </div>
    <div class="navigation__threads__wrapper">
        <v-virtual-scroll v-if="chats != undefined" class="navigation__threads" :items="Object.values(chats)" style="height: calc(100vh - 50px);">
            <template v-slot:default="{ item }">
                <Thread :notifications="notifications[item.id]" @navigation-chat-click="navigation__chat__click" @chat-options-click="chat__options__click" v-bind:o='item' v-bind:active_thread="item.id == current_chat_id"/>
            </template>
        </v-virtual-scroll>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chats: undefined,
            chatsById: {}
        }
    },
    emits: ['navigation-chat-click','chat-options-click'],
    async mounted() {
        await this.getChats();
    },
    methods: {
        navigation__chat__click(o) {
            console.log(o)
            this.$emit('navigation-chat-click', o);
        },
        navigation__close__click() {
            console.log(this.chats)
            this.navigation__chat__click(this.chatsById[this.current_chat_id]);
        },
        chat__options__click(o) {
            this.$emit('chat-options-click', o);
        },
        async getChats() {
            let res = await Backend.getChats();
            console.log("chatlist:", res);
            this.chats = res.chats;
            res.chats.forEach(element => {
                this.chatsById[element.id] = element;
            });
        }
    },
    watch: {
        notifications: async () => {
            await this.getChats();
        }
    }
}
</script>

<style>
</style>