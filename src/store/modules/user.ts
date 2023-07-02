import { loginFormData, loginResponseData } from '@/api/user/type'
import { reqLogin, reqUserInfo } from '@/api/user/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { constantRoute, asyncRoute, anyRoute } from '@/router/route'
import router from '@/router'
//引入深拷贝方法

import cloneDeep from 'lodash/cloneDeep'

//过滤路由
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
export const useUserStore = defineStore('cp-user', () => {
  //设置token
  const token = ref(localStorage.getItem('TOKEN'))
  const username = ref('')
  const avtar = ref('')
  let menuRoutes = constantRoute
  //获取token
  const setToken = async (data: loginFormData) => {
    const res: loginResponseData = await reqLogin(data)
    if (res.code == 200) {
      token.value = res.data as string
      localStorage.setItem('TOKEN', res.data as string)
      return 'ok'
    } else {
      return Promise.reject(new Error(res.message))
    }
  }
  //获取用户信息
  const getUser = async () => {
    const res = await reqUserInfo()
    username.value = res.data.name
    avtar.value = res.data.avatar
    //计算当前用户需要展示的异步路由
    const userAsyncRoute = filterAsyncRoute(
      cloneDeep(asyncRoute),
      res.data.routes,
    )
    //菜单需要的数据整理完毕
    menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
    //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
    ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
      router.addRoute(route)
    })
    return menuRoutes
  }
  //退出登录
  const delUser = () => {
    token.value = ''
    username.value = ''
    avtar.value = ''
    localStorage.removeItem('TOKEN')
  }
  return { token, menuRoutes, username, avtar, setToken, getUser, delUser }
})
