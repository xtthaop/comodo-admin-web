import request from '@/utils/request'

// 查询菜单列表
export function getMenuList(query) {
  return request({
    url: '/api/sys_menu/get_menu_list',
    method: 'get',
    params: query,
  })
}

// 查询菜单列表树
export function getMenuTree() {
  return request({
    url: '/api/sys_menu/get_menu_tree',
    method: 'get',
  })
}

// 添加菜单
export function addMenu(data) {
  return request({
    url: '/api/sys_menu',
    method: 'post',
    data: data,
  })
}

// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/api/sys_menu',
    method: 'put',
    data: data,
  })
}

// 删除菜单
export function deleteMenu(data) {
  return request({
    url: '/api/sys_menu',
    method: 'delete',
    data: data,
  })
}
