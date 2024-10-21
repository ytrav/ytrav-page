<script>
import { RouterLink } from 'vue-router';
// import NavbarIcon from './NavbarIcon.vue';

// import IconHome from './icons/IconHome.vue';
// import IconHomeFilled from './icons/IconHomeFilled.vue';
// import IconMessage from './icons/IconMessage.vue';
// import IconMessageFilled from './icons/IconMessageFilled.vue';

export default {
    components: {
        RouterLink,
    },
    data() {
        return {
            nav: [
                {
                    label: 'Home',
                    path: '/',
                    icon: 'home'
                },
                {
                    label: 'Ask',
                    path: '/ask',
                    icon: 'chatbox-ellipses'
                },
                {
                    label: 'Posts',
                    path: '/posts',
                    icon: 'at'
                },
                {
                    label: 'Socials',
                    path: '/socials',
                    icon: 'share-social'
                },
                {
                    label: 'Messages',
                    path: '/messages',
                    icon: 'person'
                },
            ],
        }
    },
    methods: {
        getIconType(icon, path) {
            if (this.$route.fullPath !== path) {
                return icon + '-outline';
            } else {
                return icon;
            }
        }
    }
}
</script>


<template>
    <nav>
        <RouterLink v-for="(link, index) in nav" :key="index" :to="link.path">
            <ion-icon :name="getIconType(link.icon, link.path)"></ion-icon>
            <span>{{ link.label }}</span>

        </RouterLink>
    </nav>
</template>