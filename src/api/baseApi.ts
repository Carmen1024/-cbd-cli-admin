import request from '@/utils/system/request'

export function baseRequest(url:string,data:object) {
    return request({
      url:'/g'+url,
      method: 'post',
      data
    })
  }