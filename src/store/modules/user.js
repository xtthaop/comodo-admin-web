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

          const { username, roles, action_permission } = data
          commit('SET_USERNAME', username)
          commit('SET_ROLES', roles)
          commit('SET_ACTION_PERMISSION', action_permission)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ token: state.token })
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          resolve()
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
