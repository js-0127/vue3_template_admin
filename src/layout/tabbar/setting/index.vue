<script setup lang="ts">
import { useSettingStore, useUserStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
const settingStore = useSettingStore()
const userStore = useUserStore()
import { ref } from 'vue'

const refresh = () => {
  settingStore.refresh = !settingStore.refresh
}

const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
const router = useRouter()
const route = useRoute()
const exit = () => {
  userStore.delUser()
  router.push({ path: '/login', query: { redirect: route.path } })
}

const dark = ref<boolean>(false)
//颜色组件组件的数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}
//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<template>
  <div class="tabbar-page-right">
    <el-button icon="Refresh" size="default" circle @click="refresh" />
    <el-button icon="FullScreen" size="default" circle @click="fullScreen" />
    <el-popover
      placement="bottom"
      title="主题设置"
      :width="300"
      trigger="hover"
    >
      <!-- 表单元素 -->
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker
            @change="setColor"
            v-model="color"
            size="small"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            @change="changeDark"
            v-model="dark"
            class="mt-2"
            style="margin-left: 24px"
            inline-prompt
            active-icon="MoonNight"
            inactive-icon="Sunny"
          />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button size="default" icon="Setting" circle></el-button>
      </template>
    </el-popover>
    <el-avatar :size="32" :src="userStore.avtar" style="margin-left: 10px" />
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.tabbar-page-right {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
