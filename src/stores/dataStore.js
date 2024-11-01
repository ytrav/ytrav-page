import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    user: {
        name: 'stranger',
    }
  }),
  actions: {}
})
