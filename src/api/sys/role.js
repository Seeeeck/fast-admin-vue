import request from '@/utils/request'

export function pageRoles(params) {
  return request({
    url: '/sys/role/page',
    method: 'get',
    params
  })
}


export function getRole(id) {
  return request({
    url: '/sys/role/' + id,
    method: 'get',
  })
}


export function saveRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}


export function updateRole(data) {
  return request({
    url: '/sys/role',
    method: 'put',
    data
  })
}


export function deleteRoles(ids) {
  return request({
    url: '/sys/role/batch',
    method: 'delete',
    params: {
      ids
    }
  })
}


export function listRoles() {
  return request({
    url: '/sys/role',
    method: 'get',
  })
}

export function getRoleMenuVO(id) {
  return request({
    url: '/sys/role/role_menu/'+ id,
    method: 'get',
  })
}