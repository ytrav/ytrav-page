<script>
import axios from 'axios';
import { useVarStore } from '../stores/varStore';
import { useFeedStore } from '../stores/feedStore';
import { mapStores } from 'pinia';
import { RouterLink } from 'vue-router';



export default {
    data() {
        return {
            wave: {
                duration: 0.2,
                color: '#AE6A7D',
                initialOpacity: 0.2,
                easing: 'ease-out'
            },
            messages: [],
            myProfile: {},
            myHandle: '',
            posts: null,
            scrollPosition: 0,
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
        ...mapStores(useVarStore, useFeedStore),
    },
    components: {
        RouterLink
    },
    mounted() {
        this.fetchPosts();
    },
    activated() {
        this.$el.scrollTop = this.scrollPosition;
    },
    beforeRouteLeave(to, from, next) {
        this.scrollPosition = this.$el.scrollTop;        
        next();
    },
    methods: {
        async fetchPosts() {
            if (this.feedStore.posts.length > 0) {
                this.posts = this.feedStore.posts;
                return;
            }
            try {
                const response = await axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=ytrav.me');
                if (response.data.feed) {
                    // console.log('Posts:', response.data.posts);
                    this.posts = response.data.feed;
                    this.feedStore.setPosts(response.data.feed);
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
        getInteractionCount(type, index, isReply) {
            if (isReply) {
                if (type === 'repostCount') {
                    return this.posts[index].reply.parent.repostCount + this.posts[index].post.quoteCount;
                }
                return this.posts[index].reply.parent[type];
            } else {
                if (type === 'repostCount') {
                    return this.posts[index].post.repostCount + this.posts[index].post.quoteCount;
                }
                return this.posts[index].post[type];
            }
        },
        // getFormattedText(text) {
        //     return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        // },
        getFormattedLink(link, author) {
            // console.log('link:', link, ' author:', author);

            if (author !== undefined && link !== undefined) {
                return `https://bsky.app/profile/${author.handle}/post/${link.split('/')[4]}`;
            }
            return `https://bsky.app/`
        },
        getFormattedText(text) {
            const urlRegex = /https?:\/\/[^\s]+/g;
            const simpleUrlRegex = /\b[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}(\/[^\s]*)?/g;
            const handleRegex = /@([a-zA-Z0-9._]+)/g;

            // Replace line breaks with <br>
            let processedText = text.replace(/(?:\r\n|\r|\n)/g, '<br>');

            // Replace handles first
            processedText = processedText.replace(handleRegex, (handle) => {
                return `<a href="https://bsky.app/profile/${handle.slice(1)}" target="_blank">${handle}</a>`;
            });

            // Temporarily replace existing <a> tags with placeholders to avoid double wrapping
            let linkPlaceholderIndex = 0;
            const linkPlaceholders = {};

            // Store all existing <a> tags in placeholders
            processedText = processedText.replace(/<a[^>]*>(.*?)<\/a>/g, (match) => {
                const placeholder = `[[LINK_PLACEHOLDER_${linkPlaceholderIndex}]]`;
                linkPlaceholders[placeholder] = match;
                linkPlaceholderIndex++;
                return placeholder;
            });

            // Now replace URLs with http/https
            processedText = processedText.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank">${url}</a>`;
            });

            // Replace domain-like URLs without http/https
            processedText = processedText.replace(simpleUrlRegex, (url) => {
                return `<a href="https://${url}" target="_blank">${url}</a>`;
            });

            // Restore the placeholders back to the original <a> tags
            Object.keys(linkPlaceholders).forEach((placeholder) => {
                processedText = processedText.replace(placeholder, linkPlaceholders[placeholder]);
            });

            return processedText;
        },
        copyLink(link) {
            navigator.clipboard.writeText(link);
            this.varStore.callToast('Post link copied to clipboard', 'copy-outline');
        },
        async translate(text, index, isReply, showOriginal) {
            if (!showOriginal) {
                if (this.posts[index].reply?.parent?.record?.translatedText) {
                    this.posts[index].reply.parent.record.translated = true;
                } else if (this.posts[index].post?.record?.translatedText) {
                    this.posts[index].post.record.translated = true;
                } else {
                    if (text !== undefined || text !== '') {
                        const response = await axios.post('/api/translate', {
                            text: text
                        });

                        if (isReply) {
                            this.posts[index].reply.parent.record.translatedText = response.data.translations[0];
                            this.posts[index].reply.parent.record.translated = true;
                            // console.log('Translated:', response.data.translations[0]);
                            // console.log('saved:', this.posts[index].reply.parent.record.translatedText);
                        } else {
                            this.posts[index].post.record.translatedText = response.data.translations[0];
                            this.posts[index].post.record.translated = true;
                        }
                    } else {
                        this.varStore.callToast('No text to translate', 'close-circle-outline');
                    }
                }
            } else {
                if (isReply) {
                    this.posts[index].reply.parent.record.translated = false;
                } else {
                    this.posts[index].post.record.translated = false;
                }
            }
            //     q: text,
            //     target: 'en',
            //     source: ''
            // });
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
                        <div v-if="post.reply" class="reply-wrapper">
                            <div class="pfp-divider-container">
                                <a v-if="post.reply?.parent?.author" v-wave="{
                                    duration: 0.3,
                                    color: '#AE6A7D',
                                    initialOpacity: 0.2,
                                    easing: 'ease-out'
                                }" target="_blank" class="avatar"
                                    :href="'https://bsky.app/profile/' + post.reply?.parent?.author.handle">
                                    <img :src="post.reply?.parent?.author.avatar" alt="pfp">
                                </a>
                                <div class="divider"></div>
                            </div>
                            <div v-if="post.reply?.parent?.author" class="reply-body">
                                <div class="reply-header">
                                    <a target="_blank"
                                        :href="'https://bsky.app/profile/' + post.reply.parent.author.handle"
                                        class="name" v-wave="wave">{{
                                            post.reply.parent.author.displayName }}</a>
                                    <a target="_blank"
                                        :href="'https://bsky.app/profile/' + post.reply.parent.author.handle"
                                        class="handle" v-wave="wave">@{{
                                            post.reply.parent.author.handle }}</a>
                                    <span class="time">{{ timeSinceShort(post.reply.parent.record.createdAt) }}</span>
                                </div>
                                <p v-html="getFormattedText(post.reply?.parent?.record?.text)" class="text"></p>
                                <button v-wave="{
                                    duration: 0.3,
                                    color: '#AE6A7D',
                                    initialOpacity: 0.2,
                                    easing: 'ease-out'
                                }" @click="translate(post.reply?.parent?.record?.text, index, true)" class="translate"
                                    v-if="(post.reply?.parent?.record?.langs).some(item => item !== 'en') && !post.reply?.parent?.record?.translated">Translate
                                    post</button>
                                <button v-wave="{
                                    duration: 0.3,
                                    color: '#AE6A7D',
                                    initialOpacity: 0.2,
                                    easing: 'ease-out'
                                }" @click="translate(post.reply?.parent?.record?.text, index, true, true)"
                                    class="translate" v-else-if="post.reply?.parent?.record?.translated">Hide
                                    translation</button>
                                <p v-if="post.reply?.parent?.record?.translatedText && post.reply?.parent?.record?.translated"
                                    class="text translation">{{
                                        post.reply?.parent?.record?.translatedText }}
                                </p>
                                <div class="embed" v-if="post.reply?.parent?.embed">
                                    <div v-if="post.reply?.parent?.embed.images" class="image-layout">
                                        <RouterLink v-wave="{
                                            duration: 0.3,
                                            color: '#AE6A7D',
                                            initialOpacity: 0.2,
                                            easing: 'ease-out'
                                        }" v-for="(image, idx) in post.reply?.parent?.embed?.images" :key="idx"
                                            :to="`/posts/reply/${index}/media/image/${idx}`">
                                            <img :src="image.thumb" :alt="image.alt">
                                        </RouterLink>
                                    </div>
                                    <div v-else-if="(post?.post?.embed?.media?.images) !== undefined" class="embed">
                                        <div v-if="post?.post?.embed?.media?.images" class="image-layout">
                                            <RouterLink v-wave="{
                                                duration: 0.3,
                                                color: '#AE6A7D',
                                                initialOpacity: 0.2,
                                                easing: 'ease-out'
                                            }" v-for="(image, idx) in post.post.embed.media.images" :key="idx"
                                                :to="`/posts/post/${index}/media/image/${idx}`">
                                                <img :src="image.thumb" :alt="image.alt">
                                            </RouterLink>
                                        </div>
                                    </div>

                                    <a v-if="post?.post?.embed?.record?.author" target="_blank" v-wave="{
                                        duration: 0.3,
                                        color: '#AE6A7D',
                                        initialOpacity: 0.2,
                                        easing: 'ease-out'
                                    }" :href="getFormattedLink(post.post.embed.record.uri, post.post.embed.record.author)"
                                        class="quote">
                                        <div class="post-header">
                                            <div class="head-wrap">
                                                <img :src="post.post.embed.record.author.avatar" alt="avatar">
                                                <span class="name">{{ post.post.embed.record.author.displayName
                                                    }}</span>
                                            </div>
                                            <div class="head-second">
                                                <span class="handle">@{{ post.post.embed.record.author.handle }}</span>
                                                <span class="time">{{
                                                    timeSinceShort(post.post.embed.record.value.createdAt)
                                                    }}</span>
                                            </div>
                                        </div>
                                        <p class="text">
                                            {{ post.post.embed.record.value.text }}
                                        </p>
                                        <div v-if="post?.post?.embed?.record?.embeds && (post?.post?.embed?.record?.embeds)?.length > 0"
                                            class="embed">
                                            <div v-if="post.post.embed.record.embeds[0].media.images"
                                                class="image-layout">
                                                <img class="embedded"
                                                    v-for="(image, index) in post.post.embed.record.embeds[0].media.images"
                                                    :key="index" :src="image.thumb" :alt="image.alt">
                                            </div>
                                        </div>
                                    </a>
                                    <a v-else-if="post?.post?.embed?.record?.record" target="_blank" v-wave="{
                                        duration: 0.3,
                                        color: '#AE6A7D',
                                        initialOpacity: 0.2,
                                        easing: 'ease-out'
                                    }" :href="getFormattedLink(post.post.embed.record.uri, post.post.embed.record.record.author.handle)"
                                        class="quote">
                                        <div class="post-header">
                                            <div class="head-wrap">
                                                <img :src="post.post.embed.record.record.author.avatar" alt="avatar">
                                                <span class="name">{{ post.post.embed.record.record.author.displayName
                                                    }}</span>
                                            </div>
                                            <div class="head-second">
                                                <span class="handle">@{{ post.post.embed.record.record.author.handle
                                                    }}</span>
                                                <span class="time">
                                                    {{ timeSinceShort(post.post.embed.record.record.value.createdAt) }}
                                                </span>
                                            </div>
                                        </div>

                                        <p class="text">
                                            {{ post.post.embed.record.record.value.text }}
                                        </p>
                                        <div v-if="(post?.post?.embed?.record?.record?.embeds[0]?.images)?.length > 0"
                                            class="embed">
                                            <div class="image-layout">
                                                <img class="embedded"
                                                    v-for="(image, index) in post?.post?.embed?.record?.record?.embeds[0]?.images"
                                                    :key="index" :src="image.thumb" :alt="image.alt">
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="interactions reply-interactions">
                                    <div v-for="(interaction, interIndex) in interactions" :key="interIndex">
                                        <ion-icon :name="interaction.icon + '-outline'"></ion-icon>
                                        <span>{{ getInteractionCount(interaction.type, index, true) }}</span>
                                    </div>
                                    <button
                                        @click="copyLink(`https://bsky.app/profile/${post.reply.parent.author.handle}/post/${(post.reply.parent.uri).split('/')[4]}`)"
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
                        </div>
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
                                        class="name" v-wave="wave">{{
                                            post.post.author.displayName }}</a>
                                    <a target="_blank" :href="'https://bsky.app/profile/' + post.post.author.handle"
                                        class="handle" v-wave="wave">@{{
                                            post.post.author.handle }}</a>
                                    <span class="time">{{ timeSinceShort(post.post.record.createdAt) }}</span>
                                </div>
                                <p v-html="getFormattedText(post.post.record.text)" class="text"></p>
                                <button v-wave="{
                                    duration: 0.3,
                                    color: '#AE6A7D',
                                    initialOpacity: 0.2,
                                    easing: 'ease-out'
                                }" @click="translate(post.post?.record?.text, index, false)" class="translate"
                                    v-if="(post.post?.record?.langs).some(item => item !== 'en') && !post.post?.record?.translated">Translate
                                    post</button>
                                <button v-wave="{
                                    duration: 0.3,
                                    color: '#AE6A7D',
                                    initialOpacity: 0.2,
                                    easing: 'ease-out'
                                }" @click="translate(post.post?.record?.text, index, false, true)" class="translate"
                                    v-else-if="post.post?.record?.translated">Hide translation</button>
                                <p v-if="post.post?.record?.translatedText && post.post?.record?.translated"
                                    class="text translation">{{
                                        post.post?.record?.translatedText }}</p>
                                <div class="embed" v-if="post.post.embed">
                                    <div v-if="post.post.embed.images" class="image-layout">
                                        <RouterLink v-wave="{
                                            duration: 0.3,
                                            color: '#AE6A7D',
                                            initialOpacity: 0.2,
                                            easing: 'ease-out'
                                        }" v-for="(image, idx) in post.post.embed.images" :key="idx"
                                            :to="`/posts/post/${index}/media/image/${idx}`">
                                            <img :src="image.thumb" :alt="image.alt">
                                        </RouterLink>
                                    </div>
                                    <div v-else-if="(post?.post?.embed?.media?.images) !== undefined" class="embed">
                                        <div v-if="post?.post?.embed?.media?.images" class="image-layout">
                                            <a v-wave="{
                                                duration: 0.3,
                                                color: '#AE6A7D',
                                                initialOpacity: 0.2,
                                                easing: 'ease-out'
                                            }" target="_blank" v-for="(image, idx) in post.post.embed.media.images"
                                                :key="idx" :href="image.fullsize">
                                                <img :src="image.thumb" :alt="image.alt">
                                            </a>
                                        </div>
                                    </div>

                                    <a v-if="post?.post?.embed?.record?.author" target="_blank" v-wave="{
                                        duration: 0.3,
                                        color: '#AE6A7D',
                                        initialOpacity: 0.2,
                                        easing: 'ease-out'
                                    }" :href="getFormattedLink(post.post.embed.record.uri, post.post.embed.record.author)"
                                        class="quote">
                                        <div class="post-header">
                                            <div class="head-wrap">
                                                <img :src="post.post.embed.record.author.avatar" alt="avatar">
                                                <span class="name">{{ post.post.embed.record.author.displayName
                                                    }}</span>
                                            </div>
                                            <div class="head-second">
                                                <span class="handle">@{{ post.post.embed.record.author.handle }}</span>
                                                <span class="time">{{
                                                    timeSinceShort(post.post.embed.record.value.createdAt)
                                                }}</span>
                                            </div>
                                        </div>
                                        <p class="text">
                                            {{ post.post.embed.record.value.text }}
                                        </p>
                                        <div v-if="post?.post?.embed?.record?.embeds && (post?.post?.embed?.record?.embeds)?.length > 0"
                                            class="embed">
                                            <div v-if="post.post?.embed?.record?.embeds[0]?.media?.images"
                                                class="image-layout">
                                                <img class="embedded"
                                                    v-for="(image, index) in post.post.embed.record.embeds[0].media.images"
                                                    :key="index" :src="image.thumb" :alt="image.alt">
                                            </div>
                                        </div>
                                    </a>
                                    <a v-else-if="post?.post?.embed?.record?.record" target="_blank" v-wave="{
                                        duration: 0.3,
                                        color: '#AE6A7D',
                                        initialOpacity: 0.2,
                                        easing: 'ease-out'
                                    }" :href="getFormattedLink(post.post.embed.record.uri, post.post.embed.record.record.author.handle)"
                                        class="quote">
                                        <div class="post-header">
                                            <div class="head-wrap">
                                                <img :src="post.post.embed.record.record.author.avatar" alt="avatar">
                                                <span class="name">{{ post.post.embed.record.record.author.displayName
                                                    }}</span>
                                            </div>
                                            <div class="head-second">
                                                <span class="handle">@{{ post.post.embed.record.record.author.handle
                                                    }}</span>
                                                <span class="time">
                                                    {{ timeSinceShort(post.post.embed.record.record.value.createdAt) }}
                                                </span>
                                            </div>
                                        </div>

                                        <p class="text">
                                            {{ post.post.embed.record.record.value.text }}
                                        </p>
                                        <div v-if="(post?.post?.embed?.record?.record?.embeds[0]?.images)?.length > 0"
                                            class="embed">
                                            <div class="image-layout">
                                                <img class="embedded"
                                                    v-for="(image, index) in post?.post?.embed?.record?.record?.embeds[0]?.images"
                                                    :key="index" :src="image.thumb" :alt="image.alt">
                                            </div>
                                        </div>
                                    </a>
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