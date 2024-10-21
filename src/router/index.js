import { createRouter, createWebHistory } from 'vue-router'
import AppLanding from '../views/AppLanding.vue'
import AppAsk from '../views/AppAsk.vue'
import AppFeed from '../views/AppFeed.vue'
import AppSocials from '../views/AppSocials.vue'
import AppLogin from '../views/AppLogin.vue'
import AppMessages from '../views/AppMessages.vue'
import axios from 'axios'
import { useVarStore } from '../stores/varStore'

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
      path: '/posts',
      name: 'posts',
      component: AppFeed
    },
    {
      path: '/socials',
      name: 'socials',
      component: AppSocials
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin,
      // beforeEnter: (to, from, next) => {
      //   if (!useVarStore().loggedIn) {
      //     next()
      //   }
      //   // axios
      //   //   .get('/api/get-messages')
      //   //   .then(() => next('/messages'))
      //   //   .catch(() => next())
      // }
    },
    {
      path: '/messages',
      name: 'messages',
      component: AppMessages,
      beforeEnter: (to, from, next) => {
        if (useVarStore().loggedIn) {
          next()
        } else {
          axios
            .get('/api/get-messages')
            .then(() => {
              useVarStore().setLoggedIn(true)
              next()
            })
            .catch(() => {
              useVarStore().setLoggedIn(false)
              next('/login')
            })
        }
      }
    }
  ]
})

export default router
