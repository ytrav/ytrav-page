<script>

export default {
    props: {
        webring: {
            type: Object,
            required: true
        }
    },
    computed: {
        prettyLink() {
            return this.webring.url.replace(/https?:\/\//, '').replace(/\/$/, '');
        }
    }
}

</script>

<template>
    <div class="webring-nav">
        <a title="Go to the previous website in the ring" class="previous"
            :href="`${webring.url}/${webring.mySlug}/previous`"><span class="arrow">←</span></a>
        <a :title="`${webring.name} main page`" class="ring" :href="webring.url">
            <div class="text">{{ webring.name }} <span>{{ prettyLink }}</span></div>
        </a>
        <a title="Go to the next website in the ring" class="next" :href="`${webring.url}/${webring.mySlug}/next`"><span
                class="arrow">→</span></a>
    </div>
</template>