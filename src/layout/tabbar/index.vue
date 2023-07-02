<script setup lang="ts">
import Bread from './bread/index.vue'
import Setting from './setting/index.vue'
</script>

<template>
  <div class="tabbar-page">
    <Bread></Bread>
    <Setting></Setting>
  </div>
</template>

<style lang="scss" scoped>
.tabbar-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
