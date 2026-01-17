import Cookies from 'js-cookie'

const tokenKey = 'COMODO_ADMIN_TOKEN'

export function setToken(token) {
  return Cookies.set(tokenKey, token)
}

export function getToken() {
  return Cookies.get(tokenKey)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}
