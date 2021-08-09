import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

import ElementUI from 'element-ui'
import './styles/element-variables.scss'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import './icons' // icon
import './permission'

import Cookies from 'js-cookie'
import permission from './directive/permission'
import { getDicts } from '@/api/admin/sys-dict-data'
import { parseTime, resetForm, selectDictLabel, md5Password } from '@/utils/costum'

import Pagination from '@/components/Pagination'

Vue.use(ElementUI, { size: Cookies.get('size') || 'medium' })
Vue.use(permission)

Vue.component('Pagination', Pagination)

Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.md5Password = md5Password

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
