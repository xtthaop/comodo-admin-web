import 'normalize.css/normalize.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router/index'

import { toHorizontalLine } from '@/utils/index'

const app = createApp(App)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
  const iconName = 'el-icon-' + toHorizontalLine(key)
  app.component(iconName, component)
}

app.use(router)

app.mount('#app')
