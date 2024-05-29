<script setup>
import { FakeBackend } from '@/scripts/fake-backend';
import Thread from './Thread.vue'
import { VBtn, VIcon } from 'vuetify/lib/components/index.mjs';
defineProps({
    current_chat_id: {
        type: String,
        default: null
    }
})
</script>

<template>
    <div class="navigation__header flex-grow-1">
        <span class="navigation__header">
            <img class="logo" src="../assets/logo.svg">
        </span>
        <span class="navigation__header">
            <h2  class="inline">grasshopper</h2>
        </span>
    </div>
    <div class="navigation__threads">
        <div v-for="x in Object.keys(chats)">
            <Thread @navigation-thread-click="navigation__thread__click" v-bind:o='chats[x]' v-bind:active_thread="x == current_chat_id"/>
        </div>
    </div>
</template>

<script>
export default {
    components: {
        VBtn,
        VIcon
    },
    data() {
        return {
            chats: FakeBackend.getChats()
        }
    },
    emits: ['navigation-thread-click'],
    methods: {
        navigation__thread__click(id) {
            this.$emit('navigation-thread-click', id);
        }
    }
}
</script>

<style>
</style>