import request from '@/utils/system/request'
// 获取数据api
export function dictQuery(data: object) {
  return request({
    url: '/g/dict/query',
    method: 'post',
    data
  })
}

export function dictFetch(data: object) {
    return request({
      url: '/g/dict/fetch',
      method: 'post',
      data
    })
  }

  export function dictValid(data: object) {
    return request({
      url: '/g/dict/valid',
      method: 'post',
      data
    })
  }

  export function dictUpdate(data: object) {
    return request({
      url: '/g/dict/update',
      method: 'post',
      data
    })
  }

  export function dictDelete(data: object) {
    return request({
      url: '/g/dict/del',
      method: 'post',
      data
    })
  }

  export function dictInsert(data: object) {
    return request({
      url: '/g/dict/insert',
      method: 'post',
      data
    })
  }