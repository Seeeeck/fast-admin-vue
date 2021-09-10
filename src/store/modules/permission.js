import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { _import } from '@/router/_import_development'
import { Message } from 'element-ui'

export function filterAsyncRoutes(asyncRouterMap) {
  const asyncRouters = asyncRouterMap.filter(route => {
    if (route.type === 0 && route.children.length > 0) {
      route.redirect = 'noRedirect'
    }
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        try {
          route.component = _import(route.component)
        } catch (error) {
          console.log(error)
          Message.error('Please contact the administrator to modify or delete the non-existent component path.')
        }
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
    }
    return true
  })
  return asyncRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, asyncRouterMap) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRouterMap)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
