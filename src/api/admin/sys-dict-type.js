import request from '@/utils/request'

// 查询字典类型列表
export function getDictTypeList(query) {
  return request({
    url: '/api/dict_type',
    method: 'get',
    params: query,
  })
}

// 添加字典类型
export function addDictType(data) {
  return request({
    url: '/api/dict_type',
    method: 'post',
    data: data,
  })
}

// 修改字典类型
export function updateDictType(data) {
  return request({
    url: '/api/dict_type',
    method: 'put',
    data: data,
  })
}

// 删除字典类型
export function deleteDictType(data) {
  return request({
    url: '/api/dict_type',
    method: 'delete',
    data: data,
  })
}
