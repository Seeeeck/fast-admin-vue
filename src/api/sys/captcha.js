import request from '@/utils/request'


export function captcha() {
    return request({
      url: '/sys/captcha',
      method: 'post',
      params: {t: new Date()}
    })
  }