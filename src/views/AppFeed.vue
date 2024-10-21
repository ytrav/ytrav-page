<script>
import axios from 'axios';
import { useVarStore } from '../stores/varStore';
import { mapStores } from 'pinia';



export default {
    data() {
        return {
            messages: [],
            myProfile: {},
            myHandle: '',
            posts: null,
            interactions: [
                {
                    type: 'replyCount',
                    icon: 'chatbubbles'
                },
                {
                    type: 'repostCount',
                    icon: 'repeat'
                },
                {
                    type: 'likeCount',
                    icon: 'heart'
                },
            ]
        }
    },
    computed: {
        ...mapStores(useVarStore),
    },
    mounted() {
        this.fetchPosts();
    },
    methods: {
        async fetchPosts() {
            try {
                const response = await axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=ytrav.me');
                if (response.data.feed) {
                    // console.log('Posts:', response.data.posts);
                    this.posts = response.data.feed;
                }
            }
            catch (error) {
                console.error('Error fetching posts:', error.response ? error.response.data : error);
                this.myHandle = 'Failed to fetch posts:' + error.response ? error.response.data : error;
            }
        },
        timeSince(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);

            let interval = Math.floor(seconds / 31536000); // years
            if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

            interval = Math.floor(seconds / 2592000); // months
            if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

            interval = Math.floor(seconds / 86400); // days
            if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

            interval = Math.floor(seconds / 3600); // hours
            if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

            interval = Math.floor(seconds / 60); // minutes
            if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

            return 'just now';
        },
        timeSinceShort(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);

            let interval = Math.floor(seconds / 31536000); // years
            if (interval >= 1) return `${interval}y`;

            interval = Math.floor(seconds / 2592000); // months
            if (interval >= 1) return `${interval}mo`;

            interval = Math.floor(seconds / 86400); // days
            if (interval >= 1) return `${interval}d`;

            interval = Math.floor(seconds / 3600); // hours
            if (interval >= 1) return `${interval}h`;

            interval = Math.floor(seconds / 60); // minutes
            if (interval >= 1) return `${interval}m`;

            return 'now';
        },
        getInteractionCount(type, index) {
            if (type === 'repostCount') {
                return this.posts[index].post.repostCount + this.posts[index].post.quoteCount;
            }
            return this.posts[index].post[type];
        },
        getFormattedText(text) {
            return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        },
        copyLink(link) {
            navigator.clipboard.writeText(link);
            this.varStore.callToast('Post link copied to clipboard', 'copy-outline');
        }
    }
}
</script>

<template>
    <div class="posts">
        <div class="wrapper">
            <h1>Maeve's latest posts & replies</h1>

            <div v-if="posts !== null" class="posts-list">

                <TransitionGroup name="load-in" appear>
                    <div v-for="(post, index) in posts" :key="index" class="post" :style="{
                        transitionDelay: `${index * 0.1}s`
                    }">
                        <div class="post-wrapper">
                            <a v-wave="{
                                duration: 0.3,
                                color: '#AE6A7D',
                                initialOpacity: 0.2,
                                easing: 'ease-out'
                            }" target="_blank" class="avatar"
                                :href="'https://bsky.app/profile/' + post.post.author.handle">
                                <img :src="post.post.author.avatar" alt="pfp">
                            </a>
                            <div class="post-body">
                                <div class="post-header">
                                    <a target="_blank" :href="'https://bsky.app/profile/' + post.post.author.handle"
                                        class="name">{{
                                            post.post.author.displayName }}</a>
                                    <a target="_blank" :href="'https://bsky.app/profile/' + post.post.author.handle"
                                        class="handle">@{{
                                            post.post.author.handle }}</a>
                                    <span class="time">{{ timeSinceShort(post.post.record.createdAt) }}</span>
                                </div>
                                <p v-html="getFormattedText(post.post.record.text)" class="text"></p>
                                <div class="embed" v-if="post.post.embed">
                                    <div v-if="post.post.embed.images" class="image-layout">
                                        <a v-wave="{
                                            duration: 0.3,
                                            color: '#AE6A7D',
                                            initialOpacity: 0.2,
                                            easing: 'ease-out'
                                        }" target="_blank" v-for="(image, idx) in post.post.embed.images" :key="idx"
                                            :href="image.fullsize">
                                            <img :src="image.thumb" :alt="image.alt">
                                        </a>
                                    </div>
                                    <a target="_blank" v-wave="{
                                        duration: 0.3,
                                        color: '#AE6A7D',
                                        initialOpacity: 0.2,
                                        easing: 'ease-out'
                                    }" :href="`https://bsky.app/profile/${post.post.embed.record.author.handle}/post/${(post.post.embed.record.uri).split('/')[4]}`"
                                        v-if="post.post.embed.record" class="quote">
                                        <div class="post-header">
                                            <div class="head-wrap">
                                                <img :src="post.post.embed.record.author.avatar" alt="avatar">
                                                <span class="name">{{ post.post.embed.record.author.displayName
                                                    }}</span>
                                            </div>
                                            <div class="head-second">
                                                <span class="handle">@{{ post.post.embed.record.author.handle }}</span>
                                                <span class="time">{{
                                                    timeSinceShort(post.post.embed.record.author.createdAt)
                                                }}</span>
                                            </div>
                                        </div>
                                        <p class="text">
                                            {{ post.post.embed.record.value.text }}
                                        </p>
                                        <div v-if="(post.post.embed.record.embeds).length > 0" class="embed">
                                            <div v-if="post.post.embed.record.embeds[0].media.images"
                                                class="image-layout">
                                                <img class="embedded"
                                                    v-for="(image, index) in post.post.embed.record.embeds[0].media.images"
                                                    :key="index" :src="image.thumb" :alt="image.alt">
                                            </div>
                                        </div>


                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="interactions">
                            <div v-for="(interaction, interIndex) in interactions" :key="interIndex">
                                <ion-icon :name="interaction.icon + '-outline'"></ion-icon>
                                <span>{{ getInteractionCount(interaction.type, index) }}</span>
                            </div>
                            <button
                                @click="copyLink(`https://bsky.app/profile/${post.post.author.handle}/post/${(post.post.uri).split('/')[4]}`)"
                                v-wave="{
                                    duration: 0.2,
                                    color: '#AE6A7D',
                                    initialOpacity: 0.2,
                                    easing: 'ease-out'
                                }">
                                <ion-icon name="link-outline"></ion-icon>
                            </button>
                            <a v-wave="{
                                duration: 0.2,
                                color: '#AE6A7D',
                                initialOpacity: 0.2,
                                easing: 'ease-out'
                            }" target="_blank"
                                :href="`https://bsky.app/profile/${post.post.author.handle}/post/${(post.post.uri).split('/')[4]}`"><ion-icon
                                    name="open-outline"></ion-icon>
                            </a>
                        </div>
                    </div>
                </TransitionGroup>
                <div class="footer">
                    <span>-- And then the posts ended --</span>
                </div>
            </div>
            <div v-else class="loader-wrapper">
                <span class="loader"></span>
            </div>
        </div>
    </div>
</template>