//layout相关配置
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useSettingStore = defineStore('setting', () => {
  //菜单折叠
  const fold = ref(false)
  //刷新
  const refresh = ref(true)
  return { fold, refresh }
})
