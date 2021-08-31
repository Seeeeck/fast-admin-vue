import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'post'
  })
}

export function pageUsers(params){
  return request({
    url: '/sys/user/page',
    method: 'get',
    params
  })
}


export function getUser(id){
  return request({
    url: '/sys/user/'+id,
    method: 'get',
  })
}

export function getUserRoleVO(id){
  return request({
    url: '/sys/user/user-role/'+id,
    method: 'get',
  })
}


export function saveUser(data){
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}


export function updateUser(data){
  return request({
    url: '/sys/user',
    method: 'put',
    data
  })
}


export function deleteUsers(ids){
  return request({
    url: '/sys/user/batch',
    method: 'delete',
    params: {ids}
  })
}


