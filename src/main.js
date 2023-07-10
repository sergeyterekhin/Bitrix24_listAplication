import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'

const app = createApp(App)

BX24.init(function(){
    app.mount('#app')
})