import request from '@/utils/request'

export function pageLogs(params) {
  return request({
    url: '/sys/log/page',
    method: 'get',
    params
  })
}

export function deleteLogs(ids) {
  return request({
    url: '/sys/log/batch',
    method: 'delete',
    params: {
      ids
    }
  })
}
