import './assets/main.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure your project is capable of handling css files
import { aliases, md } from 'vuetify/iconsets/md'

import { createApp } from 'vue'
import App from './App.vue'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
})

createApp(App).use(vuetify).mount('#app')
