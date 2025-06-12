import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import './permission'

import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router/index'
import store from './store/index'

import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

import { toHorizontalLine } from '@/utils/index'
import { parseTime, resetForm, selectDictLabel, md5Password, baseConfirm } from '@/utils/costum'
import { getDicts } from '@/api/admin/sys-dict-data'
import permission from './directive/permission'

import BasePagination from '@/components/Pagination/index.vue'

const app = createApp(App)

app.use(permission)

app.use(ElementPlus, {
  locale: zhCn,
  size: Cookies.get('size') || 'default',
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
  const iconName = 'el-icon-' + toHorizontalLine(key)
  app.component(iconName, component)
}

app.component('SvgIcon', SvgIcon)
app.component('BasePagination', BasePagination)

app.use(router)
app.use(store)

app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.md5Password = md5Password
app.config.globalProperties.baseConfirm = baseConfirm

app.mount('#app')
