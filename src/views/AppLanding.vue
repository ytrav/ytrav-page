<script>
import LandingCover from '../components/landing/LandingCover.vue';
import LandingBlock from '../components/landing/LandingBlock.vue';
import LandingWebrings from '../components/landing/LandingWebrings.vue';
import SpotifyPlayer from '../components/SpotifyPlayer.vue';

import about from '../assets/about.json';

import { useVarStore } from '../stores/varStore';
import { mapStores } from 'pinia';

export default {
    components: {
        LandingCover,
        LandingBlock,
        LandingWebrings,
        SpotifyPlayer,
    },
    data() {
        return {
            about
        }
    },
    computed: {
        ...mapStores(useVarStore)
    },
    mounted() {
        this.$refs.page.addEventListener('scroll', this.handleScroll);
        this.handleScroll()
    },
    methods: {
        handleScroll() {
            let st = this.$refs.page.scrollTop;
            if (st > 100) {
                this.varStore.setScrolled(true);
            } else {
                this.varStore.setScrolled(false);
            }
        }
    }
}
</script>

<template>
    <div class="landing" ref="page">
        <div class="wrapper">
            <LandingCover />
            <Transition name="spotify">
                <SpotifyPlayer />
            </Transition>
            <div class="about">
                <LandingBlock v-for="(block, index) in about" :key="index" :about="block" />
            </div>
            <LandingWebrings />
        </div>
    </div>
</template>