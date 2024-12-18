<script>
import { useDataStore } from '../../stores/dataStore';
import { mapStores } from 'pinia';
import { RouterLink } from 'vue-router';


import TwitterIcon from '@/assets/socials/twitter.svg?component';
import BlueskyIcon from '@/assets/socials/bluesky.svg?component';
import TelegramIcon from '@/assets/socials/telegram.svg?component';

export default {
    computed: {
        ...mapStores(useDataStore),
        cycleName() {
            return this.names[this.nameIndex];
        },
        cycleIntroduction() {
            return this.introductions[this.nameIndex];
        },
        nameClass() {
            return this.nameIndex === 1
        }
    },
    data() {
        return {
            socials: [
                {
                    name: 'Twitter',
                    handle: '@ytrav_v',
                    icon: 'twitter',
                    link: 'https://twitter.com/ytrav_v'
                },
                {
                    name: 'Bluesky',
                    handle: '@ytrav.me',
                    icon: 'bluesky',
                    link: 'https://bsky.app/profile/ytrav.me'
                },
                {
                    name: 'Telegram',
                    handle: '@ytrav_v',
                    icon: 'telegram',
                    link: 'https://t.me/ytrav_v'
                }
            ],
            names: ['Maeve', 'Мейв', 'Mejw'],
            introductions: [
                "Hello, I'm",
                "Привіт, я",
                "Siema, jestem"
            ],
            nameIndex: 0,
            iconComponents: Object.freeze({
                twitter: TwitterIcon,
                bluesky: BlueskyIcon,
                telegram: TelegramIcon
            }),
            isHovering: false,
            hoverTimeout: null,
            currentHovered: null
        };
    },
    mounted() {
        this.nameCycle();
    },
    beforeUnmount() {
        clearInterval(this.nameInterval);
    },
    methods: {
        nameCycle() {
            this.nameInterval = setInterval(() => {
                this.nameIndex = (this.nameIndex + 1) % this.names.length;
            }, 2500);
        },
        handleHover(index) {
            // If hovering over a different link or starting fresh
            if (this.currentHovered !== index) {
                // Clear any existing timeout
                clearTimeout(this.hoverTimeout);

                // Set the current hovered index
                this.currentHovered = index;

                // If tooltips aren't shown immediately yet
                if (!this.isHovering) {
                    this.hoverTimeout = setTimeout(() => {
                        this.isHovering = true;
                    }, 1000);
                } else {
                    // If already hovering, show tooltip immediately
                    this.isHovering = true;
                }
            }
        },
        handleMouseOut() {
            // Clear the timer to prevent the tooltip from showing
            clearTimeout(this.hoverTimeout);

            // Set a short timeout to reset hovering state, allows time to move to next link
            this.hoverTimeout = setTimeout(() => {
                this.isHovering = false;
                this.currentHovered = null;
            }, 100); // Short delay to see if the user moves to another item
        }
    },
    components: {
        RouterLink
    }
}
</script>

<template>
    <div class="cover">
        <div class="greeting">
            <div class="introduction-container">
                <Transition name="name-fade">
                    <h2 :key="cycleName" :class="{ fix: nameClass }"> {{ cycleIntroduction }} </h2>
                </Transition>
            </div>
            <h1>
                <Transition name="name-fade"><span :key="cycleName" :class="{ fix: nameClass }"> {{ cycleName }} </span>
                </Transition>
                <span>・メイヴ</span>
            </h1>
        </div>
        <div class="caption">
            <span>and this is my little website :3</span>
            <span>read about me and where to find me here^^</span>
        </div>
        <div class="social-block">
            <div class="social-shortcut">
                <a target="_blank" v-for="(social, index) in socials" :key="index" :href="social.link"
                    @mouseenter="handleHover(index)" @mouseleave="handleMouseOut">
                    <Component :is="iconComponents[social.icon]" />
                    <Transition name="tooltip">
                        <div v-if="isHovering && currentHovered === index" class="tooltip">
                            <span>{{ social.name }}</span>
                            <span>{{ social.handle }}</span>
                        </div>
                    </Transition>
                </a>
            </div>
            <RouterLink v-wave="{
                duration: 0.2,
                color: '#AE6A7D',
                initialOpacity: 0.2,
                easing: 'ease-out'
            }" class="see-all-socials" to="/socials">
                <span>See all socials</span>
                <ion-icon name="arrow-forward-circle-outline"></ion-icon>
            </RouterLink>
        </div>
    </div>
</template>
