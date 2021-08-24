import request from '@/utils/request'


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

export function deleteMenu(id) {
  return request({
    url: '/sys/menu/'+ id,
    method: 'delete'
  })
}

//'less' or 'all'
export function listMenusTree(params) {
  return request({
    url: '/sys/menu/tree',
    method: 'get',
    params
  })
}

export function getParentMenu(id) {
  return request({
    url: '/sys/menu/parent',
    method: 'get',
    params: { id }
  })
}
