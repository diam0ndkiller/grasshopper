import './assets/main.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// Components
import App from './App.vue'

const diaDark = {
  dark: true,
  colors: {
    background: '#323232',
    surface: '#222222',
    primary: '#007f7f',
    'primary-light': '#3fafaf',
    error: '#c00',
    info: '#00c',
    success: '#0c0',
    warning: '#cc0',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'diaDark',
    themes: {
      diaDark
    }
  }
})

createApp(App).use(vuetify).mount('#app')
