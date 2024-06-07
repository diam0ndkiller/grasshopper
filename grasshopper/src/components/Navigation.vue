<script setup>
import { Backend } from '@/scripts/backend';
import Thread from './Thread.vue'
import ProfileBanner from './ProfileBanner.vue';
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
                <img class="logo" src="/assets/grasshopper.png">
            </div>
            <div class="navigation__header__item">
                <h1 class="inline heading">Chats</h1>
            </div>
        </div>
    </div>
    <div class="navigation__threads__wrapper">
        <v-virtual-scroll v-if="chats != undefined" class="navigation__threads" :items="Object.values(chats)" style="height: calc(100vh - 116px);">
            <template v-slot:default="{ item }">
                <Thread :chatOptions="chatOptions" :notifications="notifications[item.id]" @navigation-chat-click="navigation__chat__click" @chat-options-click="chat__options__click" v-bind:o='item' v-bind:active_thread="item.id == current_chat_id"/>
            </template>
        </v-virtual-scroll>
    </div>
    <ProfileBanner/>
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
    props: {
        current_chat_id: {
            type: Number,
            default: null
        },
        notifications: {
            type: Object,
            default: {}
        },
        chatOptions: {
            type: Array,
            default: []
        }
    },
    methods: {
        navigation__chat__click(o) {
            this.$emit('navigation-chat-click', o);
        },
        navigation__close__click() {
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
        notifications: {
            handler: async function(notifications) {
                console.log("watch -> getChats");
                await this.getChats();
            },
            immediate: true, // Optional: If you want to run it immediately when the component is created
            deep: true // Optional: If you are watching deep changes in the array/object
        }
    }
}
</script>

<style>
</style>