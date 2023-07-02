<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import { useRoute } from 'vue-router'
import { useUserStore, useSettingStore } from '@/store'
const userStore = useUserStore()

const settingStore = useSettingStore()
const route = useRoute()
let routeList = ref(userStore.menuRoutes)
onMounted(async () => {
  routeList.value = await userStore.getUser()
  console.log(routeList)
})
</script>

<template>
  <div class="layout-page">
    <div class="layout-sideBar">
      <logo></logo>
      <el-scrollbar class="scroll">
        <el-menu
          :collapse="settingStore.fold"
          :default-active="route.path"
          text-color="white"
          background-color="#001529"
          active-text-color="pink"
        >
          <Menu :menuList="routeList"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout-tabBar" :class="settingStore.fold ? 'fold' : ''">
      <Tabbar></Tabbar>
    </div>
    <div class="layout-main" :class="settingStore.fold ? 'fold' : ''">
      <Main></Main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  width: 100%;
  height: 100vh;

  .layout-sideBar {
    width: $sideBar-width;
    height: 100vh;
    background-color: $sideBar-bg-color;
    transition: all 0.4s;

    .scroll {
      width: 100%;
      height: $sideBar-scroll-height;

      .el-menu {
        border-right: none;
      }
    }

    .fold {
      width: $sideBar-fold-width;
    }

    &.foldside {
      width: $sideBar-fold-width;
    }
  }

  .layout-tabBar {
    background-color: #fff;

    position: fixed;
    top: 0;
    left: $sideBar-width;
    width: calc(100% - $sideBar-width);
    height: $tabBar-height;
    transition: all 0.4s;

    &.fold {
      width: calc(100vw - $sideBar-fold-width);
      left: $sideBar-fold-width;
    }
  }

  .layout-main {
    background-color: white;
    position: absolute;
    top: $tabBar-height;
    left: $sideBar-width;
    padding: 20px;
    width: calc(100% - $sideBar-width);
    height: calc(100vh - $tabBar-height);
    overflow: auto;
    transition: all 0.4s;

    &.fold {
      width: calc(100vw - $sideBar-fold-width);
      left: $sideBar-fold-width;
    }
  }
}
</style>
