import request from '@/utils/system/request'

// 获取数据api
export function fileUpload(data: object) {
  return request({
    url: '/g/fileManager/file/upload',
    method: 'post',
    data
  })
}