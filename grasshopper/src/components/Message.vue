<script setup>
import { Backend } from '@/scripts/backend';
import { format } from 'date-fns'

defineProps({
    message: {
        type: Object,
        required: true
    }
})

</script>

<template>
    <div class="message">
        <div v-if="author != undefined" class="inline message__icon">
            <img :src="author.imgSrc" class="message__icon">
        </div>
        <div class="inline message__text">
            <div v-if="author != undefined" class="message__author">
                <p>
                    <b>{{ author.name }}</b> [{{ format(message.timestamp * 1000, "MM/dd/yyyy @ HH:mm") }}]
                </p>
            </div>
            <div class="message__content">
                <p>
                    {{ message.content }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            author: undefined
        }
    },
    async mounted() {
        let data = await Backend.getUserById(this.message.author_id);
        data = {...data};
        this.author = data.user;
    },
    computed: {
    },
    watch: {
        
    },
    methods: {
        
    }
}
</script>

<style>

</style>