import request from '@/utils/request'

export function pageMenus(params) {
  return request({
    url: '/sys/menu/page',
    method: 'get',
    params
  })
}


export function getMenu(id) {
  return request({
    url: '/sys/menu/' + id,
    method: 'get',
  })
}


export function saveMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data
  })
}


export function updateMenu(data) {
  return request({
    url: '/sys/menu',
    method: 'put',
    data
  })
}


export function deleteMenus(ids) {
  return request({
    url: '/sys/menu/batch',
    method: 'delete',
    params: {
      ids
    }
  })
}


export function listMenusTree() {
  return request({
    url: '/sys/menu/tree',
    method: 'get',
  })
}