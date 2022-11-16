import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import VueCookies from 'vue-cookies'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import axios from 'axios'

axios.defaults.withCredentials = true

const app = createApp(App)
app.use(VueCookies)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
