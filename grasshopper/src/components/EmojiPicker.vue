<script setup>
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
</script>

<template>
    <v-dialog class="emoji_picker_dialog" :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
        <EmojiPicker theme="dark" :native="true" :display-recent="true" @select="$emit('select', $event)"/>
    </v-dialog>
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
    emits: ["update:model-value", "select"],
    props: {
        modelValue: {
            type: Boolean,
            required: true
        }
    },
    methods: {
    }
}
</script>

<style>

</style>