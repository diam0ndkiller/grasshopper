<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
    <HelloWorld/>
    <p>{{ text }}</p>
</template>

<script>
export default {
    data() {
        return {
            text: 'This is Vue Text!'
        }
    }
}
</script>

<style>
</style>