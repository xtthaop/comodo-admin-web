import { getDynamicRoutes } from '@/api/permission'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'
import router from '@/router'
import { pathToRegexp } from 'path-to-regexp'

const modules = import.meta.glob('@/views/**/*.vue')
const _import = (component) => {
  if (!component) return
  return modules['/src/views' + component]
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
        menuType: item.menu_type,
        activeMenu: item.active_menu,
      },
    }

    if (item.menu_type === 'P' && !item.is_link) {
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
  routerConfig: [],
  allPath: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROUTER_CONFIG: (state, routerConfig) => {
    routerConfig.forEach((item) => {
      state.routerConfig.push(router.addRoute(item))
    })
  },
  SET_ALL_PATH: (state, allPath) => {
    state.allPath = allPath.map((path) => pathToRegexp(path))
  },
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getDynamicRoutes()
        .then((res) => {
          const { dynamic_routes, all_path } = res.data
          const { routes, routerConfig } = generateDynamicRoutes(dynamic_routes)
          commit('SET_ROUTES', routes)
          commit('SET_ROUTER_CONFIG', routerConfig)
          commit('SET_ALL_PATH', all_path)
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
