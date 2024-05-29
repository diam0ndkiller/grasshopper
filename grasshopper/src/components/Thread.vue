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
        <button @click="thread__click" class="navigation__item navigation__thread flex-grow-1" v-bind:class="{'active_thread': active_thread}">
            <span class="navigation__item navigation__thread logo__thread">
                <img class="logo__thread" v-bind:src="o.imgSrc"/>
            </span>
            <span class="inline navigation__item navigation__thread">
                <h3 class="heading__thread">{{ o.name }}</h3>
                <p class="heading__thread">{{ o.id }}</p>
            </span>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    emits: ['navigation-thread-click'],
    computed: {
        id() {
            return this.o.id
        }
    },
    watch: {
        
    },
    methods: {
        thread__click() {
            this.$emit('navigation-thread-click', this.o);
        }
    }
}
</script>

<style>
</style>