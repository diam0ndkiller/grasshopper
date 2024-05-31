<script setup>
import Chat from '@/components/Chat.vue'
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
                    @click="navigation__expanded__click"
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
            <span>
                <v-btn
                    @click="chat__options__click"
                    color="#222222"
                    icon="mdi-dots-vertical"
                ></v-btn>
            </span>
        </div>
        <div class="chat">
            <Chat :o="o"/>
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
    emits: ['navigation-expanded-click','chat-options-click'],
    methods: {
        navigation__expanded__click() {
            this.$emit('navigation-expanded-click');
        },
        chat__options__click() {
            this.$emit('chat-options-click');
        }
    }
}
</script>

<style>

</style>