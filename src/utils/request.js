import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'

let messageBoxFlag = 0

const service = axios.create({
  baseURL: '',
  timeout: 5000,
})

service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['X-Token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(res || 'Error')
    } else {
      return res
    }
  },
  error => {
    if (error.response.status === 401) {
      if (messageBoxFlag === 0) {
        messageBoxFlag = 1
        MessageBox.confirm('您的登录状态已失效，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          messageBoxFlag = 0
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }).catch(() => {
          messageBoxFlag = 0
        })
      }
    } else {
      Message({ 
        message: (error.response.data && error.response.data.message) || error.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })
    }
    return Promise.reject(error)
  }
)

export default service