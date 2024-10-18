import { createRouter, createWebHistory } from 'vue-router'
import AppLanding from '../views/AppLanding.vue'
import AppAsk from '../views/AppAsk.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: AppLanding
    },
    {
      path: '/ask',
      name: 'ask',
      component: AppAsk
    }
  ]
})

export default router
