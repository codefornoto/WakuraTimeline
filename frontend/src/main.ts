import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
        mdi,
    },
},
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
