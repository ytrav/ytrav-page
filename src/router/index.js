import { createRouter, createWebHistory } from 'vue-router'
import AppLanding from '../views/AppLanding.vue'
import AppAsk from '../views/AppAsk.vue'
import AppFeed from '../views/AppFeed.vue'
import PostMedia from '../views/PostMedia.vue'
import AppSocials from '../views/AppSocials.vue'
import AppLogin from '../views/AppLogin.vue'
import AppMessages from '../views/AppMessages.vue'
import axios from 'axios'
import { useVarStore } from '../stores/varStore'
import { useFeedStore } from '../stores/feedStore'

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
      path: '/posts/:type/:id/media/:mediaType/:mediaId',
      name: 'media',
      component: PostMedia,
      beforeEnter: (to, from, next) => {
        const feedStore = useFeedStore()
        const { type, id, mediaType, mediaId } = to.params
        if (type === 'post') {
          if (feedStore.posts[id]?.post?.embed) {
            if (mediaType == 'image') {
              if (feedStore.posts[id].post?.embed?.images[mediaId]) {
                next()
              } else {
                next('/')
                useVarStore().callToast('Image not found', 'warning-outline')
              }
            } else {
              next('/')
              useVarStore().callToast('Unsupported media type', 'warning-outline')
            }
          } else {
            next('/')
            useVarStore().callToast('Post not found', 'warning-outline')
          }
        } else if (type === 'reply') {
          if (feedStore.posts[id]?.reply?.parent?.embed) {
            // reply
            if (mediaType == 'image') {
              if (feedStore.posts[id].reply?.parent?.embed?.images[mediaId]) {
                next()
              } else {
                next('/')
                useVarStore().callToast('Image not found', 'warning-outline')
              }
            } else {
              next('/')
              useVarStore().callToast('Unsupported media type', 'warning-outline')
            }
          } else {
            // console.log('reply not found');
            // console.log(feedStore.posts[id]);
            
            
            next('/')
            useVarStore().callToast('Reply not found', 'warning-outline')
          }
        } else {
          next('/')
          useVarStore().callToast('Unsupported post type', 'warning-outline')
        }
      }
    },
    {
      path: '/socials',
      name: 'socials',
      component: AppSocials
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin
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
