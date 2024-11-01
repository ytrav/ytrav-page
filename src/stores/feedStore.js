import { defineStore } from 'pinia'

export const useFeedStore = defineStore('feed', {
  state: () => ({
    posts: [
      {
        post: {
          author: {},
          record: {}
        },
        reply: {
          root: {
            author: {},
            record: {}
          },
          parent: {
            author: {},
            record: {}
          }
        }
      }
    ]
  }),
  actions: {
    setPosts(posts) {
      this.posts = posts
    }
  }
})
