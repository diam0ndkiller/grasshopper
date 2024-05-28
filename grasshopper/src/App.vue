<script setup>
import TheWelcome from './components/TheWelcome.vue'
import NavigationHeader from './components/NavigationHeader.vue'
</script>

<template>
  <nav class="navigation" v-bind:class="{hidden: !navigation__expanded}">
    <NavigationHeader/>
  </nav>

  <main class="content" v-bind:class="{hidden: navigation__expanded}">
    <TheWelcome />
  </main>
</template>

<script>
export default {
    data() {
        return {
            navigation__expanded: false,
        }
    },
    computed: {
    }
}
</script>

<style scoped>
</style>
