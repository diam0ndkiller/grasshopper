<template>
    <div class="helloworld">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: {
        message: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: "Hello, World!"
        }
    }
}
</script>

<style>
.helloworld {
    font-family: Arial, Helvetica, sans-serif
}
</style>