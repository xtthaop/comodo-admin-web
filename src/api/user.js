import request from '@/utils/request.js'

// 获取拼图验证码
export function getJigsaw() {
  return request({
    url: '/api/user/get_jigsaw',
    method: 'get',
  })
}

// 登录
export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data,
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post',
  })
}

// 获取当前登录的用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/get_user_info',
    method: 'get',
  })
}

// 用户修改密码
export function changePassword(data) {
  return request({
    url: '/api/user/change_password',
    method: 'put',
    data,
  })
}
