import request from '@/utils/request'

// 查询登录日志列表
export function getLoginLogList(query) {
  return request({
    url: '/api/sys_log/get_login_log',
    method: 'get',
    params: query,
  })
}

// 删除登录日志接口
export function deleteLoginlog(data) {
  return request({
    url: '/api/sys_log/delete_login_log',
    method: 'delete',
    data: data,
  })
}

// 查询操作日志列表
export function getOperationLogList(query) {
  return request({
    url: '/api/sys_log/get_operation_log',
    method: 'get',
    params: query,
  })
}

// 删除操作日志接口
export function deleteOperationlog(data) {
  return request({
    url: '/api/sys_log/delete_operation_log',
    method: 'delete',
    data: data,
  })
}
