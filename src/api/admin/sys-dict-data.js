import request from '@/utils/request'

// 查询字典数据列表
export function getDictDataList(query) {
  return request({
    url: '/api/dict_data/get_list',
    method: 'get',
    params: query,
  })
}

// 根据字典类型查询字典数据
export function getDicts(dictType) {
  return request({
    url: '/api/dict_data/option_select',
    method: 'get',
    params: {
      dict_type: dictType
    },
  })
}

// 添加字典数据
export function addDictData(data) {
  return request({
    url: '/api/dict_data',
    method: 'post',
    data: data,
  })
}

// 编辑字典数据
export function updateDictData(data) {
  return request({
    url: '/api/dict_data',
    method: 'put',
    data: data,
  })
}

// 删除字典数据
export function deleteDictData(data) {
  return request({
    url: '/api/dict_data',
    method: 'delete',
    data: data,
  })
}
