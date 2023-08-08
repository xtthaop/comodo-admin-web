import { getDynamicRoutes } from '@/api/permission'
import { constantRoutes } from '@/router'
import Layout from '@/layout/index.vue'

const _import = (component) => {
  return () => import('@/views' + component)
}

function generateDynamicRoutes(routes, routerConfig, data) {
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
      routerConfig.push(route)
    }

    if (item.children.length) {
      route.children = []
      generateDynamicRoutes(route.children, routerConfig, item.children)
    }

    routes.push(route)
  })
}

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getDynamicRoutes()
        .then((res) => {
          const { data } = res
          const routes = []
          const routerConfig = []
          generateDynamicRoutes(routes, routerConfig, data)
          routerConfig.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', routes)
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
