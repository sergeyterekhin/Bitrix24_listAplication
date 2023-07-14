import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import {SetBasicProperty} from '../src/JScript/MyWebStorelist.js'

SetBasicProperty({
  'IBLOCK_TYPE_ID': 'lists',
  'IBLOCK_ID': '25'
}).then((res)=>{
const app = createApp(App)

BX24.init(function(){
    app.mount('#app')
})
});