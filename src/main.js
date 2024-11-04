import './style/variables.scss';
import './style/style.scss';
import './style/fonts.scss';
import './style/header.scss';
import './style/navbar.scss';
import './style/toast.scss';
import './style/landing.scss';
import './style/spotify.scss';
import './style/ask.scss';
import './style/login.scss';
import './style/messages.scss';
import './style/posts.scss';
import './style/media.scss';
import './style/socials.scss';
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
