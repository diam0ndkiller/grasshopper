<script setup>
import helloworld from './components/HelloWorld.vue'
import fooditem from './components/FoodItem.vue'
</script>

<template>
    <helloworld v-bind:message="text"/>
    <div id="wrapper">
        <fooditem
        v-for="x in foods"
        v-bind:food-name="x"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: 'This is Vue Text!',
            foods: ['Apples','Pizza','Rice','Fish','Cake']
        }
    }
}
</script>

<style>
#app > :hover {
  cursor: pointer;
}
</style>