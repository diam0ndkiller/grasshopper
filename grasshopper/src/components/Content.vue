<script setup>
import Chat from '@/components/Chat.vue'
defineProps({
    o: {
        type: Object,
        required: true
    },
    current_notifications: {
        type: Object,
        default: {}
    }
})
</script>

<template>
    <div class="content flex-grow-1">
        <div class="inline content__header content__header__grid">
            <div class="hiddenWhenBig content__header__item">
                <v-btn
                    @click="navigation__expanded__click"
                    color="#222222"
                    icon="mdi-menu"
                ></v-btn>
            </div>
            <div class="content__header__item content__header__logo">
                <img class="content__header__logo inline" v-bind:src="o.image"/>
            </div>
            <div class="content__header__item">
                <h1 class="inline heading">{{ o.name }}</h1>
            </div>
            <div class="content__header__item">
                <v-btn
                    @click="chat__options__click"
                    color="#222222"
                    icon="mdi-dots-vertical"
                ></v-btn>
            </div>
        </div>
        <Chat :current_notifications="current_notifications" :o="o"/>
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