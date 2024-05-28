<template>
    <span>
        <img src="../assets/logo.svg">
    </span>
    <span>
        <h2>grasshopper</h2>
        <v-btn><v-icon icon="mdi-checkbox-marked-circle" end></v-icon></v-btn>
    </span>
</template>

<script>
import { VBtn, VIcon } from 'vuetify/lib/components/index.mjs';

export default {
    components: {
        VBtn,
        VIcon
    }
}
</script>

<style>
</style>