<script setup>
import { FakeBackend } from '@/scripts/fake-backend';
import Thread from './Thread.vue'
defineProps({
    current_chat_id: {
        type: String,
        default: null
    }
})
</script>

<template>
    <div class="navigation__header flex-grow-1">
        <div class="navigation__header__grid">
            <span class="hiddenWhenBig">
                <v-btn
                    @click="navigation__close__click"
                    color="#222222"
                    icon="mdi-close"
                ></v-btn>
            </span>
            <span class="navigation__header">
                <img class="logo" src="../assets/logo.svg">
            </span>
            <span class="navigation__header">
                <h1 class="inline">grasshopper</h1>
            </span>
        </div>
    </div>
    <div class="navigation__threads__wrapper">
        <div class="navigation__threads">
            <Thread @navigation-chat-click="navigation__chat__click" @chat-options-click="chat__options__click" v-for="x in Object.keys(chats)" :o='chats[x]' :active_thread="x == current_chat_id"/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chats: FakeBackend.getChats()
        }
    },
    emits: ['navigation-chat-click','chat-options-click'],
    methods: {
        navigation__chat__click(o) {
            this.$emit('navigation-chat-click', o);
        },
        navigation__close__click() {
            this.navigation__chat__click(this.chats[this.current_chat_id]);
        },
        chat__options__click(o) {
            this.$emit('chat-options-click', o);
        }
    }
}
</script>

<style>
</style>