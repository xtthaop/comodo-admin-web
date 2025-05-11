import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to) => {
  NProgress.start()

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      return { path: '/' }
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        return true
      } else {
        try {
          await store.dispatch('user/getUserInfo')
          await store.dispatch('permission/generateRoutes')
          return to.fullPath
        } catch (error) {
          // eslint-disable-next-line
          console.error(error || 'error')
          await store.dispatch('user/resetToken')
          return `/login?redirect=${to.path}&${location.search.substring(1)}`
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      return true
    } else {
      return `/login?redirect=${to.path}&${location.search.substring(1)}`
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
