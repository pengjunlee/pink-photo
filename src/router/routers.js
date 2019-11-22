
/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['administrator','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: '操作向导', icon: 'guide', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/weapon',
    component: Layout,
    redirect: '/weapon/icon',
    alwaysShow: true, // will always show the root menu
    name: 'Weapon',
    meta: {
      title: '开发辅助',
      icon: 'education',
      roles: ['administrator'] // you can set roles in root nav
    },
    children: [
      {
        path: 'icon',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: '图标', icon: 'icon', noCache: true }
      },
      {
        path: 'clipboard',
        component: () => import('@/views/clipboard/index'),
        name: 'Clipboard',
        meta: { title: '剪切板', icon: 'clipboard' }
      }
    ]
  }, {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    alwaysShow: true, // will always show the root menu
    name: 'Device',
    meta: {
      title: '设备管理',
      icon: 'device_mgt',
      roles: ['administrator'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/device'),
        name: 'DeviceList',
        meta: { title: '设备列表', icon: 'device', noCache: true }
      },
      {
        path: 'detail/:deviceId(\\d+)',
        component: () => import('@/views/device/detail'),
        name: 'DeviceDetail',
        meta: { title: '设备详情', noCache: true, activeMenu: '/device/list' },
        hidden: true
      },
      {
        path: 'pose/list',
        component: () => import('@/views/device/pose'),
        name: 'PoseList',
        meta: { title: '姿势素材库', icon: 'pose', noCache: true }
      },
      {
        path: 'theme/list',
        component: () => import('@/views/device/theme'),
        name: 'ThemeList',
        meta: { title: '主题素材库', icon: 'theme', noCache: true }
      }
    ]
  }, {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/list',
    alwaysShow: true, // will always show the root menu
    name: 'Merchant',
    meta: {
      title: '合作商管理',
      icon: 'peoples',
      roles: ['administrator'] // you can set roles in root nav
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/merchant'),
        name: 'MerchantList',
        meta: { title: '合作商列表', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: 'https://purcotton.tmall.com/shop/view_shop.htm',
    meta: { title: '全棉天猫旗舰店', icon: 'link' }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/error/404', hidden: true }
]
