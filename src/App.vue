<script>
import AppHeader from './components/AppHeader.vue';
import { RouterView } from 'vue-router'

export default {
  components: {
    RouterView,
    AppHeader,
  },
}
</script>

<template>
  <AppHeader />
  <RouterView />
</template>
