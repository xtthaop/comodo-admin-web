import request from '@/utils/request'

// 分页查询角色列表
export function getRoleList(query) {
  return request({
    url: '/api/sys_role/page',
    method: 'get',
    params: query,
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/api/sys_role',
    method: 'post',
    data: data,
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/api/sys_role',
    method: 'put',
    data: data,
  })
}

// 删除接口
export function deleteRole(data) {
  return request({
    url: '/api/sys_role',
    method: 'delete',
    data: data,
  })
}
