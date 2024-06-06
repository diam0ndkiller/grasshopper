<script setup>
import { Backend } from '@/scripts/backend';
import { long_time, short_time } from '@/scripts/functions';
import OptionsButton from '@/components/OptionsButton.vue';
import EmojiPicker from '@/components/EmojiPicker.vue';

</script>

<template>
    <EmojiPicker v-model="reactionPicker" @select="reactionSelect"/>
    <div class="message_wrapper" :id="'message-'+message.id">
        <div class="message">
            <div v-if="author != undefined" class="inline message__icon">
                <img :src="author.image" class="message__icon">
            </div>
            <div class="inline message__text">
                <div v-if="author != undefined" class="message__author">
                    <p>
                        <b>{{ author.name }}</b> [{{ long_time(message.timestamp) }}]
                    </p>
                </div>
                <div class="message__content">
                    <p>
                        {{ message.content }}
                    </p>
                </div>
            </div>
        </div>
        <div class="message_options_wrapper flex-grow-1">
            <OptionsButton :items="messageOptions"/>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            author: undefined,
            messageOptions: [
              {icon: "mdi-pencil", text: "Edit", color: "#07f", action: this.editMessage, visible: () => (this.message.author_id === Backend.user_id)},
              {icon: "mdi-delete", text: "Delete", color: "#f00", action: this.deleteMessage, visible: () => (this.message.author_id === Backend.user_id)},
              {icon: "mdi-reply", text: "Reply", color: "#0f0", action: this.replyToMessage, visible: () => (this.canWrite)},
              {icon: "mdi-thumbs-up-down-outline", text: "React", color: "#ff0", action: this.showReactionPicker, visible: () => true}
            ],
            reactionPicker: false
        }
    },
    props: {
        message: {
            type: Object,
            required: true
        },
        canWrite: {
            type: Number,
            default: false
        },
        getEditedMessages: {
            type: Function,
            default: () => {}
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
        async deleteMessage() {
            await Backend.deleteMessage(this.message.id);
            await this.getEditedMessages();
        },
        showReactionPicker() {
            this.reactionPicker = true;
        },
        async reactionSelect(event) {
            this.reactionPicker = false;
            console.log(event);
        }
    }
}
</script>

<style>

</style>