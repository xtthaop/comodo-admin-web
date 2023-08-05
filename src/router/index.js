import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login/index.vue'
import Dashboard from '@/views/dashboard/index.vue'

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
