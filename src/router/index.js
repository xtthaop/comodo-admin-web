import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/index.vue'
import Dashboard from '@/views/dashboard'
import Page404 from '@/views/error-page/404.vue'
import Page401 from '@/views/error-page/401.vue'
import Redirect from '@/views/redirect/index'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location){
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/redirect/:path*',
    hidden: true,
    component: Redirect,
    meta: { layout: true }
  },
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '首页', affix: true, layout: true, icon: 'dashboard' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true,
    meta: { layout: false }
  },
  {
    path: '/404',
    name: 'Page404',
    component: Page404,
    hidden: true,
    meta: { layout: false }
  },
  {
    path: '/401',
    name: 'Page401',
    component: Page401,
    hidden: true,
    meta: { layout: false }
  },
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
