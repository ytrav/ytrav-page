import { defineStore } from 'pinia'


export const useVarStore = defineStore('var', {
    state: () => ({
        scrolled: false,
    }),
    actions: {
        setScrolled(value) {
            this.scrolled = value
        },
    },
})