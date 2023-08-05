import request from '@/utils/request.js'

// 获取动态路由
export function getDynamicRoutes() {
  return request({
    url: '/api/permission/get_dynamic_routes',
    method: 'get',
  })
}
