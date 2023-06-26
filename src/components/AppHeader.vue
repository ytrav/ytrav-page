<template>
    <header>
        <h2>ytrav</h2>
        <mdicon class="mdi" type="mdi" :path="menu" />
    </header>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMenu } from '@mdi/js'

export default {
    name: 'AppHeader',
    components: {
        'mdicon': SvgIcon,
    },
    data() {
        return {
            menu: mdiMenu,
        }
    },
}

</script>