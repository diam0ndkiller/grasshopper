<script setup>
defineProps({
    message: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="message">
        <div class="inline message__icon">
            <img :src="message.author.imgSrc" class="message__icon">
        </div>
        <div class="inline message__text">
            <div class="message__author">
                <p>
                    {{ message.author.name }}
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
            
        }
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