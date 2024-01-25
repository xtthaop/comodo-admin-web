import { createRouter, createWebHistory } from 'vue-router'

import store from '@/store'
import Login from '@/views/login/index.vue'
import Dashboard from '@/views/dashboard/index.vue'
import Page404 from '@/views/error-page/404.vue'
import Page401 from '@/views/error-page/401.vue'
import BaseRedirect from '@/views/redirect/index.vue'

export const constantRoutes = [
  {
    path: '/redirect/:path(.*)',
    hidden: true,
    component: BaseRedirect,
    meta: { layout: true, noTagView: true },
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: Login,
    hidden: true,
    meta: { layout: false },
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
    meta: { title: '首页', affix: true, layout: true, icon: 'dashboard' },
  },
  {
    path: '/401',
    name: 'Page401',
    component: Page401,
    hidden: true,
    meta: { layout: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Page404',
    component: Page404,
    hidden: true,
    meta: { layout: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

export function resetRouter() {
  store.state.permission.routerConfig.forEach((removeRouter) => {
    removeRouter()
  })
}

export default router
