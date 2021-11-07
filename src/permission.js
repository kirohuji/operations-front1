import router from './router'
// import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { serviceContainer } from '@/composables/context-provider'

export const service = serviceContainer.authService
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  const code = to.query.code || localStorage.getItem('code')
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = localStorage.getItem('token')

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else if (code) {
    service
      .login({
        code
      })
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('token', 'Bearer ' + data.api_token)
        next({ path: '/' })
        NProgress.done()
      })
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
