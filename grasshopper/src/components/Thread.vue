<script setup>
defineProps({
  o: {
    type: Object,
    required: true
  },
  active_thread: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
    <div class="d-flex navigation__item navigation__thread">
        <button @click="chat__click" class="navigation__item navigation__thread flex-grow-1" v-bind:class="{'active_thread': active_thread}">
            <span class="navigation__item navigation__thread logo__thread">
                <img class="logo__thread" v-bind:src="o.imgSrc"/>
            </span>
            <span class="inline navigation__item navigation__thread">
                <h3 class="heading__thread">{{ o.name }}</h3>
                <p class="heading__thread">{{ o.id }}</p>
            </span>
        </button>
        <span class="inline navigation__item navigation__thread navigation__thread__options">
            <v-btn class="inline navigation__item" :color="'#282828'" icon="mdi-dots-vertical" @click="option__click"></v-btn>
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    emits: ['navigation-chat-click','chat-options-click'],
    computed: {
        color() {
            if (this.active_thread) return "#007f7f";
            else return "#282828";
        }
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