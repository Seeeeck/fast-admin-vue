import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

const _import = require('./router/_import_' + process.env.NODE_ENV)

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          const menus = generateRoutes(store.getters.menus)
          store.dispatch('user/setRoutes', menus)
          router.addRoutes(menus)
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function generateRoutes(asyncRouterMap) {
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
      route.children = generateRoutes(route.children)
    }
    return true
  })
  return asyncRouters
}
