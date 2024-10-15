<script>
import LandingCover from '../components/landing/LandingCover.vue';
import LandingBlock from '../components/landing/LandingBlock.vue';

import about from '../assets/about.json';

export default {
    components: {
        LandingCover,
        LandingBlock
    },
    data() {
        return {
            about
        }
    },
}
</script>

<template>
    <div class="landing">
        <div class="wrapper">
            <LandingCover />
            <div class="about">
                <LandingBlock v-for="(block, index) in about" :key="index" :about="block" />

            </div>
        </div>
    </div>
</template>