<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMenu } from '@mdi/js'
import { mapStores } from 'pinia';
import { useLocaleStore } from '../stores/localeStore';



export default {
    name: 'AppHeader',
    components: {
        'mdicon': SvgIcon,
    },
    computed: {
        ...mapStores(useLocaleStore)
    },
    data() {
        return {
            menu: mdiMenu,
        }
    },
}
</script>


<template>
    <header>
        <h2>ytrav</h2>
        <div class="links">
            <RouterLink to="/" />
        </div>
        <mdicon class="mdi" type="mdi" :path="menu" />
    </header>
</template>
