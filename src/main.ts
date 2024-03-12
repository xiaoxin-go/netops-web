import {createApp} from 'vue'
import App from './App.vue'
import router from "./router"
import Antd from 'ant-design-vue'
import Notifications from '@kyvg/vue3-notification'
import 'ant-design-vue/dist/reset.css'
import VAR from "../modules/index"

const app = createApp(App)
app.use(router)
app.use(Antd)
app.use(VAR)
app.use(Notifications)
app.mount('#app')
