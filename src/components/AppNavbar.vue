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
                    label: 'Temp1',
                    path: '/temp',
                    icon: 'home'
                },
                {
                    label: 'Temp2',
                    path: '/temp',
                    icon: 'home'
                },
                {
                    label: 'Temp3',
                    path: '/temp',
                    icon: 'home'
                },
            ],
        }
    }
}
</script>


<template>
    <nav>
        <RouterLink v-for="(link, index) in nav" :key="index" :to="link.path">
            <ion-icon :name="link.icon"></ion-icon>
            <span>{{ link.label }}</span>
        </RouterLink>
    </nav>
</template>