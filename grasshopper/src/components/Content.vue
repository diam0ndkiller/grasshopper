<script setup>
defineProps({
    o: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="content flex-grow-1">
        <div class="inline content__header content__header__grid">
            <span class="hiddenWhenBig">
                <v-btn
                    @click="navigation__expanded__click()"
                    color="#222222"
                    icon="mdi-menu"
                ></v-btn>
            </span>
            <span class="content__header content__header__logo">
                <img class="content__header__logo inline" v-bind:src="o.imgSrc"/>
            </span>
            <span class="content__header">
                <h1 class="inline">{{ o.name }}</h1>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        
    },
    watch: {
        
    },
    emits: ['navigation-expanded-click'],
    methods: {
        navigation__expanded__click() {
            this.$emit('navigation-expanded-click');
        }
    }
}
</script>

<style>

</style>