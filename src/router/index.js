import Vue from 'vue'
import Router from 'vue-router'
import { constantRoutes } from './routers'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

Vue.use(Router)

const routerConfig = {
  mode: 'history',
  // base: '/digitalx',
  // linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
}

const createRouter = () => new Router(routerConfig)

const router = createRouter()

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  if (to.path === '/login' || whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    // determine whether the user has logged in
    const hasToken = getToken()
    if (hasToken) {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '出意外了!^_^!')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
