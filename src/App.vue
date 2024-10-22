<script>
import AppHeader from './components/AppHeader.vue';
import AppNavbar from './components/AppNavbar.vue';
import AppToast from './components/AppToast.vue';
import { RouterView } from 'vue-router'
import { useVarStore } from './stores/varStore';
import { mapStores } from 'pinia';


export default {
  components: {
    RouterView,
    AppHeader,
    AppNavbar,
    AppToast
  },
  computed: {
    ...mapStores(useVarStore)
  },
}
</script>

<template>
  <AppHeader />
  <RouterView class="page" />
  <Transition name="navbar">
    <AppNavbar />
  </Transition>
  <Transition name="toast" appear>
    <AppToast v-if="varStore.toast.show" />
  </Transition>
</template>
