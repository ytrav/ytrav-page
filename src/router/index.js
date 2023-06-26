import { createRouter, createWebHistory } from 'vue-router'
import AppLanding from '../views/AppLanding.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: AppLanding
    },
  ]
})

export default router
