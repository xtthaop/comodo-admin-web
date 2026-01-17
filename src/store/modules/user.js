import { login, logout, getUserInfo } from '@/api/user'
import { removeToken, getToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  username: '',
  roles: [],
  actionpermission: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ACTION_PERMISSION: (state, actionpermission) => {
    state.actionpermission = actionpermission
  },
}

const actions = {
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then((res) => {
          const { data } = res

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { nickname, roles, action_permission, username } = data
          commit('SET_USERNAME', nickname || username)
          commit('SET_ROLES', roles)
          commit('SET_ACTION_PERMISSION', action_permission)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_USERNAME', '')
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ACTION_PERMISSION', [])
          removeToken()
          resetRouter()
          dispatch('tagsView/delAllViews', null, { root: true })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  reset({ commit }) {
    return new Promise((resolve) => {
      commit('SET_USERNAME', '')
      commit('SET_ROLES', [])
      commit('SET_ACTION_PERMISSION', [])
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
