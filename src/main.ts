import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
//svg配置
import 'virtual:svg-icons-register'
//注册全局组件
import gloablComponent from './components/index'
//注册全局样式
import '@/styles/index.scss'
//注册路由
import router from '@/router'
//路由鉴权
import './prermission'
//注册仓库
import pinia from './store'
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(gloablComponent)
app.use(ElementPlus, {
  //国际化配置
  locale: zhCn,
})
app.mount('#app')
