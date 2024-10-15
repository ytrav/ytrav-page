<script>

export default {
    props: {
        about: {
            type: Object,
            required: true
        }
    }
}
</script>

<template>
    <div class="block">
        <h3>{{ about.heading}}</h3>
        <p v-for="(paragraph, index) in about.content" :key="index" v-html="paragraph"></p>
    </div>
</template>