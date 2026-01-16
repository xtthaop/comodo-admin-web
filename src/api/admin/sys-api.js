import request from '@/utils/request'

// 分页查询接口列表
export function getApiList(query) {
  return request({
    url: '/api/sys_api/page',
    method: 'get',
    params: query,
  })
}

// 查询所有接口列表
export function getAllApiList() {
  return request({
    url: '/api/sys_api/list',
    method: 'get',
  })
}

// 添加接口
export function addApi(data) {
  return request({
    url: '/api/sys_api',
    method: 'post',
    data: data,
  })
}

// 编辑接口
export function updateApi(data) {
  return request({
    url: '/api/sys_api',
    method: 'put',
    data: data,
  })
}

// 删除接口
export function deleteApi(data) {
  return request({
    url: '/api/sys_api',
    method: 'delete',
    data: data,
  })
}
