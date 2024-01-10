import { showSettings, tagsView, fixedHeader, sidebarLogo, pageStyle } from '@/settings'
import Cookies from 'js-cookie'

const state = {
  showSettings: showSettings,
  tagsView: Cookies.get('tagsView') ? !!+Cookies.get('tagsView') : tagsView,
  fixedHeader: Cookies.get('fixedHeader') ? !!+Cookies.get('fixedHeader') : fixedHeader,
  sidebarLogo: Cookies.get('sidebarLogo') ? !!+Cookies.get('sidebarLogo') : sidebarLogo,
  pageStyle: Cookies.get('pageStyle') || pageStyle,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      if (key === 'pageStyle') {
        Cookies.set(key, value)
      } else {
        Cookies.set(key, +value)
      }
    }
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
