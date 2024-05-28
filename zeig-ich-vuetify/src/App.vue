<script setup>
import TheWelcome from './components/TheWelcome.vue'
import NavigationHeader from './components/NavigationHeader.vue'
</script>

<template>
  <nav class="navigation" v-bind:class="{hidden: !expanded}">
    <NavigationHeader/>
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
