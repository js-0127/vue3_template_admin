import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'
//创建axios实例
const request = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  baseURL: import.meta.env.VITE_SERVE,
  timeout: 10000,
})
//请求拦截器
request.interceptors.request.use((config) => {
  const store = useUserStore()
  if (store.token) {
    config.headers.token = store.token
  }
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }

    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
