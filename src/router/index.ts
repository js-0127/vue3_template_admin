import { createWebHashHistory, createRouter } from 'vue-router'
//常量路由
import { constantRoute } from './route'
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})

export default router
