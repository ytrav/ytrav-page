import './style/variables.scss';
import './style/style.scss';
import './style/fonts.scss';
import './style/header.scss';
import './style/landing.scss';
import './style/viewports.scss';


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
