import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login/index.vue'
import Dashboard from '@/views/dashboard/index.vue'
import Page404 from '@/views/error-page/404.vue'

export const constantRoutes = [
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
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
