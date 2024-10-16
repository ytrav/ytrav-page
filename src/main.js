import './style/variables.scss';
import './style/style.scss';
import './style/fonts.scss';
import './style/header.scss';
import './style/navbar.scss';
import './style/landing.scss';
import './style/ask.scss';
import './style/viewports.scss';


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VWave from 'v-wave'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VWave, {})

app.mount('#app')
