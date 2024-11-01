<script>
import { useDataStore } from '../../stores/dataStore';
import { mapStores } from 'pinia';

export default {
    computed: {
        ...mapStores(useDataStore)
    },
}
</script>

<template>
    <div class="cover">
        <div class="greeting">
            <h2>Welcome, {{ dataStore.user.name }}!</h2>
            <h1>Glad you stopped by!</h1>
        </div>
        <div class="caption">
            <span>this is ytrav's page</span>
            <span>like a carrd but more <strong>uwu :3</strong></span>
        </div>
    </div>
</template>