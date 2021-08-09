import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          await store.dispatch('user/getUserInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch(error) {
          await store.dispatch('user/resetToken')
          console.log(error || 'Has Error')
          const otherQuery = window.location.search.substr(1)
          next(`/login?redirect=${to.path}&${otherQuery}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1){
      next()
    } else {
      const otherQuery = window.location.search.substr(1)
      next(`/login?redirect=${to.path}&${otherQuery}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
