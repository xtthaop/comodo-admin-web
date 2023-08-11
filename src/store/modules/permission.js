import { getDynamicRoutes } from '@/api/permission'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'
import router from '@/router'

const modules = import.meta.glob('@/views/**/*.vue')
const _import = (component) => {
  if (!component) return
  return modules['/src/views' + component + '.vue']
}

function generateDynamicRoutes(data) {
  const routerConfig = []
  const routes = []

  data.forEach((item) => {
    const route = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : _import(item.component),
      hidden: item.visible != 1,
      name: item.route_name,
      meta: {
        title: item.title,
        icon: item.icon,
        type: item.menu_type,
        layout: !!item.layout,
        cache: item.cache,
        id: item.menu_id,
        pid: item.parent_id,
      },
    }

    if (item.menu_type === 'C') {
      routerConfig.push({ ...route })
    }

    const { routerConfig: childrenRouterConfig, routes: childrenRoutes } = generateDynamicRoutes(
      item.children
    )

    routerConfig.push(...childrenRouterConfig)
    route.children = childrenRoutes
    routes.push(route)
  })

  return {
    routerConfig,
    routes,
  }
}

const state = {
  routes: [],
  removeRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  },
  SET_REMOVE_ROUTES: (state, routerConfig) => {
    routerConfig.forEach((item) => {
      state.removeRoutes.push(router.addRoute(item))
    })
  },
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getDynamicRoutes()
        .then((res) => {
          const { data } = res
          const { routes, routerConfig } = generateDynamicRoutes(data)
          commit('SET_ROUTES', routes)
          commit('SET_REMOVE_ROUTES', routerConfig)
          resolve(routerConfig)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
