import { createRouter, createWebHistory } from 'vue-router'
import AppLanding from '../views/AppLanding.vue'
import AppAsk from '../views/AppAsk.vue'
import AppLogin from '../views/AppLogin.vue'
import AppMessages from '../views/AppMessages.vue'
import axios from 'axios'

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
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin,
      beforeEnter: (to, from, next) => {
        axios
          .get('/api/get-messages')
          .then(() => next('/messages'))
          .catch(() => next())
      }
    },
    {
      path: '/messages',
      name: 'messages',
      component: AppMessages,
      beforeEnter: (to, from, next) => {
        axios
          .get('/api/get-messages')
          .then(() => next())
          .catch(() => next('/login'))
      }
    }
  ]
})

export default router
