<script setup>
import { short_time } from '@/scripts/functions';
import OptionsButton from './OptionsButton.vue';
</script>

<template>
    <div class="d-flex navigation__item navigation__thread">
        <button @click="chat__click" class="navigation__item navigation__thread flex-grow-1" v-bind:class="{'active_thread': active_thread, 'notification_thread': Object.keys(notifications).length > 0 && !active_thread}">
            <span class="navigation__item navigation__thread logo__thread">
                <img class="logo__thread" v-bind:src="o.image"/>
            </span>
            <span class="inline navigation__item navigation__thread">
                <h3 class="heading__thread">{{ o.name }}</h3>
                <p class="heading__thread">{{ short_time(o.latest_timestamp) }}:  {{ o.content }}</p>
            </span>
        </button>
        <span class="inline navigation__item navigation__thread navigation__thread__options">
            <OptionsButton color="#282828" :items="chatOptions" :check-item="o" :action-item="o"/>
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    props: {
        o: {
            type: Object,
            required: true
        },
        active_thread: {
            type: Boolean,
            default: false
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
    emits: ['navigation-chat-click','chat-options-click'],
    computed: {

    },
    watch: {
        
    },
    methods: {
        chat__click() {
            this.$emit('navigation-chat-click', this.o);
        },
        option__click() {
            this.$emit('chat-options-click', this.o);
        }
    }
}
</script>

<style>
</style>