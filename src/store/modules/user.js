import { login, logout, getInfo } from '@/api/sys/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,constantRoutes } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: '',
    permissions: '',
    routes: constantRoutes,
    id: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROUTES: (state,routes) => {
    state.routes = constantRoutes.concat(routes)
  },
  SET_ID: (state, id) => {
    state.id = id
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { id,username, avatar,menus,permissions } = data
        menus.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_MENUS', menus)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_ID', id)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  setRoutes({commit},routes){
    commit('SET_ROUTES', routes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

