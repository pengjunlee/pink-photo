import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { authToken } from '@/settings'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果token存在，请求时带上token
    if (store.getters.token) {
      config.headers[authToken] = getToken()
    }

    // 开发环境下，如果是 post、put、patch 请求,则打印请求体，方便调试
    if (process.env.NODE_ENV === 'development') {
      const { method } = config
      if (method === 'post' || method === 'put' || method === 'patch') {
        console.log(config.data)
      }
    }
    return config
  },
  error => {
    // 请求异常时打印出异常信息
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 如果需要获取响应的Http状态码或者header信息，请直接返回response
    const res = response.data
    /**
     * 自定义状态码：
     * 0 表示成功获取到响应；
     * -1 表示通用获取响应失败；
     * -2 表示由于鉴权引起的响应失败；
     */
    if (res.code === 0) {
      store.dispatch('user/setToken', response.headers[authToken]).then(() => {
        // console.log('setToken: ' + response.headers[authToken])
      })
      return res
    } else {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === -2) {
        // 由于鉴权引起的响应失败，需重新登录
        MessageBox.confirm('用户登录信息已失效，请重新登录', '重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.message || '服务器繁忙，请稍后重试！',
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(new Error(res.message || '服务器繁忙，请稍后重试！'))
    }
  },
  error => {
    // 请求异常时打印出异常信息
    console.log(error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
