import axios , { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { getConfigData } from '../transform/httpConfig';
import { useRouter, useRoute } from 'vue-router'

const baseURL: any = import.meta.env.VITE_UOLOAD_URL_LAN
const router = useRouter()

const service: AxiosInstance = axios.create({
  baseURL: baseURL,
})
// 请求前的统一处理
// 请求前的统一处理
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // JWT鉴权处理
    // if (store.getters['user/token']) {
    //   config.headers['token'] = store.state.user.token
    // }
    config.data = getConfigData(config)
    // console.log(config);
    
    return config
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// 请求结果统一处理
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (['0000',200].includes(res.code)) {
      return res
    }else {
      showError(res)
      return res
    }
  },
  (error: AxiosError)=> {
    console.log(error) // for debug
    const badMessage: any = error.message || error
    const code = parseInt(badMessage.toString().replace('Error: Request failed with status code ', ''))
    showError({ code, message: badMessage })
    return Promise.reject(error)
  }
)

// 错误处理
function showError(error: any) {
  // token过期，清除本地数据，并跳转至登录页面
  if (['0052'].includes(error.code)) {
    // to re-login
    ElMessage({
      message: 'token已失效，正在跳转到登录页面',
      type: 'error',
      duration: 3 * 1000
    })
    setTimeout(() => {
      store.dispatch('user/loginOut')
    }, 2000)
  } else {
    ElMessage({
      message: error.desc || error.message || '服务异常',
      type: 'error',
      duration: 3 * 1000
    })
  }
  
}

export default service