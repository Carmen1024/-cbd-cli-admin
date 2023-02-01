import request from '@/utils/system/request'

// 登录api
export function loginApi(data: object) {
  return request({
    url: '/g/login/login_with_admin',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}

export function loginByCodeApi(data: object) {
  return request({
    url: '/g/login/login_with_admin_code',
    method: 'post',
    data
  })
}

// 获取用户信息Api
export function getInfoApi(data: object) {
  return request({
    url: '/g/login/fetch_current_user',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}

// 退出登录Api
export function loginOutApi() {
  return request({
    url: '/g/login/logout',
    method: 'post',
    // baseURL: '/mock'
  })
}

// 获取验证码
export function sendPhoneCode(data: object) {
  return request({
    url: '/g/login/test_reset_phone_code',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}

// 获取用户信息Api
export function passwordChange(data: object) {
  return request({
    url: '/g/login/pass_reset',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}

export function resetMail(data: object) {
  return request({
    url: '/g/login/reset_mail',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}
