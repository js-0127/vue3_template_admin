<script setup lang="ts">
import { useSettingStore } from '@/store'
import { ref, nextTick, watch } from 'vue'
const store = useSettingStore()
const flag = ref(true)
watch(
  () => store.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.fade-enter-from {
  transform: scale(0);
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  transform: scale(1);
}
</style>
