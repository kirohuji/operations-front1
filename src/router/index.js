import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    name: 'home',
    path: '/',
    redirect: '/portrait/portraitmanage'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/portrait',
    component: Layout,
    name: 'portrait',
    alwaysShow: true,
    meta: {
      title: '画像中心',
      icon: 'iconfont icon icon-qiantaidaping',
      code: 'portrait',
      redirect: '/portrait/portraitmanage'
    },
    children: [
      {
        path: '/',
        redirect: 'portraitmanage'
      },
      {
        path: 'portraitmanage',
        component: () => import('@/views/portraitmanage/index'),
        name: 'portraitmanage',
        meta: { title: '画像管理', affix: true, code: 'portraitmanage' }
      }
    ]
  },
  {
    path: '/organmanage',
    component: Layout,
    name: 'dictionaries',
    meta: {
      title: '机构维护',
      icon: 'iconfont icon-jigouweihu-01',
      code: 'organization'
    },
    children: [
      {
        path: '/organmanage',
        component: () => import('@/views/organmanage/index'),
        name: 'organmanage',
        meta: { title: '机构维护', affix: false }
      }
    ]
  },
  {
    path: '/dictionaries',
    component: Layout,
    name: 'dictionaries',
    meta: {
      title: '字典管理',
      icon: 'iconfont icon-zidianguanli-01',
      code: 'dictionaries'
    },
    children: [
      {
        path: '/dictionaries',
        component: () => import('@/views/dicmanage/index'),
        name: 'dicmanage',
        meta: { title: '字典管理', affix: false }
      }
    ]
  },
  {
    path: '/information',
    component: Layout,
    name: 'information',
    meta: {
      title: '资讯中心',
      icon: 'iconfont icon icon-zixunzhongxin-01',
      code: 'infomanage'
      //   code: 'user'
    },
    children: [
      {
        path: '/',
        redirect: 'infomanage'
      },
      /** 咨询管理 */
      {
        path: 'infomanage',
        component: () => import('@/views/infomanage/index'),
        name: 'infomanage',
        meta: {
          title: '资讯管理',
          affix: false,
          code: 'infomanage'
        }
      },
      {
        path: 'infomanage/create/:id(\\d+)',
        component: () => import('@/views/infomanage/form'),
        name: 'infomanage_create',
        meta: {
          title: '新建资讯',
          noCache: true,
          activeMenu: '/information/default'
        },
        hidden: true
      },
      {
        path: 'infomanage/edit/:id(\\d+)',
        component: () => import('@/views/infomanage/form'),
        name: 'infomanage_create',
        meta: {
          title: '编辑资讯',
          noCache: true,
          activeMenu: '/information/default'
        },
        hidden: true
      },
      {
        path: 'infomanage/check/:id(\\d+)',
        component: () => import('@/views/infomanage/check/index.vue'),
        name: 'infomanage_create',
        meta: {
          title: '查看资讯',
          noCache: true,
          activeMenu: '/information/default'
        },
        hidden: true
      },
      /** 宣教管理 */
      {
        path: 'prpgd_edu',
        component: () => import('@/views/prpgd_edu/index'),
        name: 'prpgd_edu',
        meta: { title: '宣教管理', affix: false, code: 'prpgd_edu' }
      },
      {
        path: 'prpgd_edu/create/:id(\\d+)',
        component: () => import('@/views/prpgd_edu/form'),
        name: 'prpgd_edu_create',
        meta: {
          title: '新建宣教',
          noCache: true,
          activeMenu: '/prpgd_edu/default'
        },
        hidden: true
      },
      {
        path: 'prpgd_edu/edit/:id(\\d+)',
        component: () => import('@/views/prpgd_edu/form'),
        name: 'prpgd_edu_create',
        meta: {
          title: '编辑宣教',
          noCache: true,
          activeMenu: '/prpgd_edu/default'
        },
        hidden: true
      },
      {
        path: 'prpgd_edu/check/:id(\\d+)',
        component: () => import('@/views/prpgd_edu/check'),
        name: 'prpgd_edu_create',
        meta: {
          title: '查看宣教',
          noCache: true,
          activeMenu: '/prpgd_edu/default'
        },
        hidden: true
      },
      /**
       *  活动管理
       */
      {
        path: 'active',
        component: () => import('@/views/active/index'),
        name: 'active',
        meta: { title: '活动管理', affix: false, code: 'active' }
      },
      {
        path: 'active/create/:id(\\d+)',
        component: () => import('@/views/active/form'),
        name: 'active_create',
        meta: {
          title: '新建活动',
          noCache: true,
          activeMenu: '/active/default'
        },
        hidden: true
      },
      {
        path: 'active/edit/:id(\\d+)',
        component: () => import('@/views/active/form'),
        name: 'active_create',
        meta: {
          title: '编辑活动',
          noCache: true,
          activeMenu: '/active/default'
        },
        hidden: true
      },
      {
        path: 'active/check/:id(\\d+)',
        component: () => import('@/views/active/check'),
        name: 'active_create',
        meta: {
          title: '查看活动',
          noCache: true,
          activeMenu: '/active/default'
        },
        hidden: true
      },
      /**
       *  消息管理
       */
      {
        path: 'news',
        component: () => import('@/views/news/index'),
        name: 'news',
        meta: { title: '消息管理', affix: false, code: 'news' }
      },
      {
        path: 'news/edit/:id(\\d+)',
        component: () => import('@/views/news/form'),
        name: 'news_create',
        meta: { title: '编辑消息', noCache: true, activeMenu: '/news/default' },
        hidden: true
      },
      {
        path: 'news/create/:id(\\d+)',
        component: () => import('@/views/news/form'),
        name: 'news_create',
        meta: { title: '新建消息', noCache: true, activeMenu: '/news/default' },
        hidden: true
      },
      {
        path: 'news/check/:id(\\d+)',
        component: () => import('@/views/news/check'),
        name: 'active_create',
        meta: { title: '查看消息', noCache: true, activeMenu: '/news/default' },
        hidden: true
      }
    ]
  },
  {
    path: '/person',
    component: Layout,
    name: 'person',
    meta: {
      title: '用户中心',
      icon: 'iconfont icon-yonghuguanli-01',
      code: 'user'
    },
    children: [
      {
        path: 'default',
        redirect: 'roles'
      },
      {
        path: 'users',
        component: () => import('@/views/users/index.vue'),
        name: 'users',
        meta: { title: '用户管理', affix: false, code: 'usermanage' }
      },
      {
        path: 'roles',
        component: () => import('@/views/roles/index'),
        name: 'roles',
        meta: { title: '角色管理', affix: false, code: 'rolemanage' }
      }
    ]
  }
]
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = addRoute =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: addRoute ? constantRoutes.concat([addRoute]) : constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(addRoute) {
  // const newRouter = createRouter(addRoute)
  // router.matcher = newRouter.matcher // reset router
  router.addRoutes([addRoute])
}
window.resetRouter = resetRouter
export default router
