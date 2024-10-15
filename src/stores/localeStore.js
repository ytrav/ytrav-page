import { defineStore } from 'pinia'

import LocaleEnglish from '../locale/localeEnglish.json'

export const useLocaleStore = defineStore('locale', {
    state: () => ({
        english: LocaleEnglish,
        activeLocale: LocaleEnglish,
    })
})