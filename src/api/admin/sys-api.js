import request from '@/utils/request'

// 查询接口列表
export function getApiList(query) {
  return request({
    url: '/api/sys_api',
    method: 'get',
    params: query,
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
