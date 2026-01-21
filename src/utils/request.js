import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { ElMessageBox, ElMessage } from 'element-plus'

let messageBoxFlag = 0

const service = axios.create({
  baseURL: '',
  // timeout: 5000,
  // `validateStatus` 定义了对于给定的 HTTP 状态码是 resolve 还是 reject promise，
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则 promise 将会 resolved，否则是 rejected。
  // validateStatus: function (status) {
  //   return status >= 200 && status < 300; // 默认值
  // },
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['X-Token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res?.code === 0) {
      return res
    } else {
      if (res?.code === 4024) {
        if (messageBoxFlag === 0) {
          messageBoxFlag = 1
          ElMessageBox.confirm('您的账号已被禁用，请联系管理员', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
          })
            .then(async () => {
              messageBoxFlag = 0
              await store.dispatch('user/reset')
              location.href = '/login'
            })
            .catch(() => {
              messageBoxFlag = 0
            })
        }
      } else {
        ElMessage({
          message: res?.message || 'Error',
          type: 'error',
          duration: 5 * 1000,
          showClose: true,
        })
      }

      return Promise.reject(res || 'Error')
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      if (messageBoxFlag === 0) {
        messageBoxFlag = 1
        ElMessageBox.confirm('您的登录状态已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            messageBoxFlag = 0
            await store.dispatch('user/reset')
            location.reload()
          })
          .catch(() => {
            messageBoxFlag = 0
          })
      }
    } else {
      if (error.code !== 'ERR_CANCELED') {
        ElMessage({
          message: error.response?.data?.message || error.message || 'Error',
          type: 'error',
          duration: 5 * 1000,
          showClose: true,
        })
      }
    }

    return Promise.reject(error)
  }
)

export default service
