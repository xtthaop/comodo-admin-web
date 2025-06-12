import md5 from 'js-md5'
import { h, render } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  if (time.indexOf('01-01-01') > -1) {
    return '-'
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params
  search.beginTime = ''
  search.endTime = ''
  if (dateRange != null && dateRange !== '') {
    search.beginTime = this.dateRange[0]
    search.endTime = this.dateRange[1]
  }
  return search
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dict_value === '' + value) {
      actions.push(datas[key].dict_label)
      return false
    }
  })
  return actions.join('')
}

// 转空字符串
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

// md5密码
export function md5Password(password, salt = 'comodo-admin') {
  return md5(password + salt)
}

// 自定义确认弹窗
export function baseConfirm(text, type) {
  return new Promise((resolve, reject) => {
    const closeDialog = () => {
      render(null, document.body)
    }

    const vnode = h(ConfirmDialog, {
      title: '提示',
      text,
      type,
      visible: true,
      onConfirm: () => {
        resolve(closeDialog)
      },
      onCancel: () => {
        reject('cancel')
        closeDialog()
      },
      onClose: () => {
        reject('close')
        closeDialog()
      },
    })

    render(vnode, document.body)
  })
}
