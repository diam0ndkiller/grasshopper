<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <nav class="navigation" v-bind:class="{hidden: !expanded}">
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <HelloWorld msg="You did it!" />
  </nav>

  <main class="content" v-bind:class="{hidden: expanded}">
    <TheWelcome />
  </main>
</template>

<script>
export default {
    data() {
        return {
            expanded: false,
        }
    },
    computed: {
    }
}
</script>

<style scoped>
</style>
