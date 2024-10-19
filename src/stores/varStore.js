import { defineStore } from 'pinia'

export const useVarStore = defineStore('var', {
  state: () => ({
    scrolled: false,
    toast: {
      show: true,
      message: 'This is a toast message',
      type: 'info',
      icon: 'information'
    }
  }),
  actions: {
    setScrolled(value) {
      this.scrolled = value
    },
    hideToast() {
      this.toast.show = false
    },
    callToast(msg, icon) {
      this.toast.message = msg
      this.toast.icon = icon
      this.toast.show = true
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout)
      }
      this.toastTimeout = setTimeout(() => {
        this.toast.show = false
      }, 5000)
    }
  }
})
