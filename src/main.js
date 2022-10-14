import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'


import App from './App.vue'
import router from './router'

import './assets/main.css'
import './assets/Sstyle.css'
import { UserStore } from './stores/user'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vue3GoogleLogin, {
    clientId: '808652628826-hpnsj14mhr2iiaj1rs8q9p4h3b4p6dcq.apps.googleusercontent.com'
})
app.mount('#app')