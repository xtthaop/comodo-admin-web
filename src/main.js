import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import { toHorizontalLine } from '@/utils/index'
import { parseTime, resetForm, selectDictLabel, md5Password } from '@/utils/costum'

const app = createApp(App)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
  const iconName = 'el-icon-' + toHorizontalLine(key)
  app.component(iconName, component)
}

app.use(router)
app.use(store)

app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.md5Password = md5Password

app.mount('#app')
