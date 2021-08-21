import Cookies from 'js-cookie'
import store from "@/store"

const TokenKey = 'fast_admin_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function isAuth(token){
  const permissions = store.getters.permissions
  return permissions.includes('ROLE_ADMIN') || permissions.includes(token);
}
