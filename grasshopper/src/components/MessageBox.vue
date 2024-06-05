<script setup>
import { Backend } from '@/scripts/backend';

defineProps({
    o: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <v-form @submit.prevent="sendMessage">
        <div class="message_box_wrapper">
            <v-text-field 
                clearable
                :label="'Message '+o.name+'...'"
                prepend-inner-icon="mdi-comment"
                rows="1"
                auto-grow
                v-model="message"/>
            <div class="send_button_wrapper">
                <v-btn type="submit" icon="mdi-send"/>
            </div>
        </div>
    </v-form>
</template>

<script>
export default {
    data() {
        return {
            message: ''
        }
    },
    computed: {
        
    },
    emits: ['message-sent'],
    watch: {
        
    },
    methods: {
        async sendMessage() {
            Backend.sendMessage(this.o.id, this.message);
            this.message = '';
            this.$emit('message-sent');
        }
    }
}
</script>

<style>

</style>