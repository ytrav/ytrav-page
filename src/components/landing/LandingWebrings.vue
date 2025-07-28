<script>
import WebringNav from '../WebringNav.vue';
import webrings from '../../assets/webrings.json';

export default {
    components: {
        WebringNav
    },
    data() {
        return {
            webrings
        };
    }
}
</script>

<template>
    <div class="webrings">
        <h2>Webrings</h2>
        <p>A webring is a set of websites that each link to the next one in the chain, eventually bringing you back
            where you started^^</p>
        <p>This is a list of webrings ytrav.me is a part of ✨</p>
        <WebringNav v-for="webring in webrings" :key="webring" :webring="webring" />
    </div>
</template>