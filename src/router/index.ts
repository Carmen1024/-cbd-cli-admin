/**
 * @description 所有人可使用的参数配置列表
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
import type { Route } from './index.type'
import { reactive } from 'vue'
import { createRouter, createWebHashHistory,createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import i18n from '@/locale'
import NProgress from '@/utils/system/nprogress'
import { changeTitle } from '@/utils/system/title'

NProgress.configure({ showSpinner: false })

// 动态路由相关引入数据
import Layout from '@/layout/index.vue'
import MenuBox from '@/components/menu/index.vue'
import { createNameComponent } from './createNode'

// 引入modules
import Dashboard from './modules/dashboard'
import System from './modules/system'
import User from './modules/user';
import { dashboardMenu } from './modules/dashboard';
import { pageObjData } from '@/utils/permission/importEnum';

const baseURL: any = import.meta.env.VITE_PAGE_URL

/** 
 * @name 初始化必须要的路由
 * @description 使用reactive属性使得modules可以在路由菜单里面实时响应，搞定菜单回显的问题
 * @detail 针对modules的任何修改，均会同步至菜单级别，记住，是针对变量名为：moduels的修改
 **/
let modules = reactive([
  ...System,
  ...Dashboard,
  ...User,
])

const { t } = i18n.global

const routes: any = modules

const router = createRouter({
  history: createWebHistory(baseURL), //createWebHistory createWebHashHistory
  routes
})

// 登录后动态加入的路由 目前采用用户权限，不全部展示
let asyncRoutes: Route[] = [
  ...Dashboard,
  ...User,
]
// 动态路由的权限新增，供登录后调用
export async function addRoutes() {

  // 与后端交互的逻辑处理，处理完后异步添加至页面
  // modules = [...System]
  // resetRouter()
  // const data = store.state.user.userPermission || []

  // console.log(data)
  // const menuData = eachData(data, 0) // 匹配本地路由，产生一棵新树
  // console.log(menuData)
  // menuData.forEach(item => { // 添加到路由表里面去
  //   modules.push(item)
  //   router.addRoute(item)
  // })

  // 已验证完成，下面代码添加的可以实时同步至菜单中去,模拟异步代码的操作
  if(modules.length>0) return
  // 利用前端路由表模拟后端数据问题
  asyncRoutes.forEach(item => {
    modules.push(item)
    router.addRoute(item)
  })
}

// 重置匹配所有路由的解决方案，todo
function eachData(data: any, type: number,parentUrl:string='') {
  if(data?.length == 0){
    return [ dashboardMenu ]
  }
  const menuData = data.map(d => {
  //     meta: { title: '权限管理', icon: 'el-icon-pie-chart' },
    let menu:Route = {}
    const {menuName="",menuIcon="",menuPath="",children={}} = d
    menu.meta = {title:menuName,icon:'iconfont '+menuIcon}
    // if(menuPath == "dashboard"){
    //   //首页 做全部默认展示
    //   return dashboardMenu
    // }
    if(type === 0 && d.children?.length == 0){
      //设置单独的一级菜单
      return singleMenu(d)
    }
    menu.path = type === 0 ? `/${menuPath}` : menuPath
    menu.url = `${parentUrl}/${menuPath}`

    if (d.children && d.children.length > 0) {
      if (type === 0) {
        menu.component = Layout
      } else {
        menu.component = createNameComponent(() => (import('@/components/menu/index.vue')))
      }
      menu.alwayShow = true
      menu.children = eachData(children, type + 1,menu.url)
    } else {
      const urlObj = pageObjData.find(item => item.value == menu.url)
      const importObj = urlObj?.importObj || (type === 0 ? Layout : (() => import('@/views/system/404.vue')))
      menu.component = createNameComponent(importObj)
      /* 组件匹配暂时写死，todo项 */
      // menu.component = createNameComponent(() => import('@/views/main/basic/shop/list/index.vue'))
      // d.component = x.component
    }
    return menu
  })
  return menuData
}

// 如果你登录了，那么系统才会把路由加入到路由表里面，防止越权访问
// if (store.state.user.token && store.state.user.userPermission) {
//   console.log("userPermission:",store.state.user.userPermission)
//   addRoutes()
// }
addRoutes()

// 未授权时可访问的白名单
const whiteList = ['/login']

// 路由跳转前的监听操作
router.beforeEach((to, _from, next) => {
  NProgress.start();
  if (store.state.user.token || whiteList.indexOf(to.path) !== -1) {
    to.meta.title ? (changeTitle(to.meta.title)) : ""; // 动态title
    next()
  } else {
    next("/login"); // 全部重定向到登录页
    to.meta.title ? (changeTitle(to.meta.title)) : ""; // 动态title
  }
});

// 路由跳转后的监听操作
router.afterEach((to, _from) => {
  const keepAliveComponentsName = store.getters['keepAlive/keepAliveComponentsName'] || []
  const name = to.matched[to.matched.length - 1].components.default.name
  if (to.meta && to.meta.cache && name && !keepAliveComponentsName.includes(name)) {
    store.commit('keepAlive/addKeepAliveComponentsName', name)
  }
  NProgress.done();
});

const getFinalRoutes = ()=>{

  asyncRoutes.forEach(item => {
    modules.push(item)
    router.addRoute(item)
  })
}

function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(baseURL), //createWebHistory createWebHashHistory
    routes:[
      ...System,
    ]
  })
  router.matcher = newRouter.matcher // 新路由实例matcer，赋值给旧路由实例的matcher，（相当于replaceRouter）
  // router.options.routes = [...System]
}
//设置单独的一级菜单
function singleMenu(d:any){
  let {menuName="",menuIcon="",menuPath="",children={}} = d
  const url = `/${menuPath}`
  const urlObj = pageObjData.find(item => item.value == url)
  const importObj = urlObj?.importObj || (() => import('@/views/system/404.vue'))
  let menu:Route = {
    path: '/',
    component: Layout,
    redirect: `/${menuPath}`,
    meta: { title: menuName, icon: `iconfont ${menuIcon}` },
    children: [
      {
        path: `${menuPath}`,
        component: createNameComponent(importObj),
        meta: { title: menuName, icon: `iconfont ${menuIcon}`, hideClose: true }
      }
    ]
  }
  return menu
}

export {
  modules
}

export default router
