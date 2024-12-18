<script>
import { useFeedStore } from '../stores/feedStore';
import { mapStores } from 'pinia';

export default {
    data() {
        return {
            postType: this.$route.params.type,
            id: this.$route.params.id,
            mediaType: this.$route.params.mediaType,
            mediaId: this.$route.params.mediaId,
        }
    },
    computed: {
        ...mapStores(useFeedStore),
    },
    methods: {
        getImage(type) {
            if (type === 'fullsize') {
                if (this.postType === 'post') {
                    return this.feedStore.posts[this.id].post.embed.images[this.mediaId].fullsize;
                } else {
                    return this.feedStore.posts[this.id].reply.parent.embed.images[this.mediaId].fullsize;
                }
            } else {
                if (this.postType === 'post') {
                    return this.feedStore.posts[this.id].post.embed.images[this.mediaId].thumb;
                } else {
                    return this.feedStore.posts[this.id].reply.parent.embed.images[this.mediaId].thumb;
                }
            }
        }
    },
    activated() {
        // Update data properties when the component is reactivated
        this.postType = this.$route.params.type;
        this.id = this.$route.params.id;
        this.mediaType = this.$route.params.mediaType;
        this.mediaId = this.$route.params.mediaId;
    },
}

</script>

<template>
    <div class="image media">
        <img :src="getImage('fullsize')" alt="alt">
    </div>
</template>