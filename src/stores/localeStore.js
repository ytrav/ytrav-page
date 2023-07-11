import { defineStore } from 'pinia'

import LocaleEnglish from '../locale/LocaleEnglish.json'

export const useLocaleStore = defineStore('locale', {
    state: () => ({
        english: LocaleEnglish,
        activeLocale: LocaleEnglish,
    })
})