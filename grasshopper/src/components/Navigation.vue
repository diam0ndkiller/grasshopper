<script setup>
import { FakeBackend } from '@/scripts/fake-backend';
//import { SQLBackend } from '@/scripts/sql-backend';
import Thread from './Thread.vue'
defineProps({
    current_chat_id: {
        type: String,
        default: null
    }
})
let res = await fetch("http://localhost:3000/api/chats/0")
let chats = res.json().value;
console.log(chats);
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
        <v-virtual-scroll class="navigation__threads" :items="chats" style="height: calc(100vh - 50px);">
            <template v-slot:default="{ item }">
                {{ item }}
                <Thread @navigation-chat-click="navigation__chat__click" @chat-options-click="chat__options__click" v-bind:o='item' v-bind:active_thread="item.id == current_chat_id"/>
            </template>
        </v-virtual-scroll>
    </div>
</template>

<script>
export default {
    data() {
        return {
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