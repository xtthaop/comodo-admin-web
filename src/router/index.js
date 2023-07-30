import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login/index.vue'

export const constantRoutes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: Login,
    hidden: true,
    meta: { layout: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

export default router
