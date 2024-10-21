import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.css'
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

const vuetify = createVuetify({
  components,
  directives
})

const app = createApp(App)
app.use(createPinia())

const authStore = useAuthStore()
authStore.initializeAuth()

app.use(router)
app.use(vuetify)
app.mount('#app')
