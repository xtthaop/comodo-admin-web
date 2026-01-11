import request from '@/utils/request.js'

// 获取用户列表
export function getUserList(query) {
  return request({
    url: '/api/sys_user',
    method: 'get',
    params: query,
  })
}

// 查询所有角色列表
export function getAllRoleList() {
  return request({
    url: '/api/sys_role/list',
    method: 'get',
  })
}

// 添加新用户
export function addUser(data) {
  return request({
    url: '/api/sys_user',
    method: 'post',
    data,
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/api/sys_user',
    method: 'delete',
    data,
  })
}

// 编辑用户
export function updateUser(data) {
  return request({
    url: '/api/sys_user/update_user',
    method: 'put',
    data,
  })
}

// 重置用户密码
export function resetPassword(data) {
  return request({
    url: '/api/sys_user/reset_password',
    method: 'put',
    data,
  })
}
