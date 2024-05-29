<script setup>
import Navigation from './components/Navigation.vue'
import Content from './components/Content.vue'
</script>

<template>
  <nav class="navigation" v-bind:class="{hiddenWhenSmall: !navigation__expanded}">
    <Navigation v-bind:current_chat_id="o.id" @navigation-thread-click="navigation__thread__click"/>
  </nav>
  
  <main class="content" v-bind:class="{hiddenWhenSmall: navigation__expanded}">
    <Content v-bind:o="o" @navigation-expanded-click="navigation__expand__click"/>
  </main>
</template>

<script>
export default {
    data() {
        return {
            navigation__expanded: true,
            o: {id: "-1"}
        }
    },
    computed: {
    },
    methods: {
      navigation__thread__click(o) {
        this.o = o;
        this.navigation__expanded = false;
      },
      navigation__expand__click() {
        this.navigation__expanded = true;
      }
    }
}
</script>

<style scoped>
</style>
