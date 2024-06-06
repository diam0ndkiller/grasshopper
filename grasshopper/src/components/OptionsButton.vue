<script setup>

</script>

<template>
    <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
            <v-btn
            :color="color"
            v-bind="props"
            icon="mdi-dots-vertical"
            >
            </v-btn>
        </template>
        <v-list>
            <template v-for="(item, index) in items">
                <v-list-item
                v-if="item.visible(checkItem)"
                :key="index"
                :value="index"
                :prepend-icon="item.icon"
                :base-color="item.color"
                @click="item.action(actionItem)"
                :id="item.id"
                >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
            </template>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    props: {
        items: {
            type: Object,
            required: true
        },
        color: {
            type: String,
            default: '#323232'
        },
        checkItem: {
            default: undefined
        },
        actionItem: {
            default: undefined
        }
    },
    watch: {
        
    },
    methods: {
        
    }
}
</script>

<style>

</style>