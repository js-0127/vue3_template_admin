<script setup lang="ts">
import router from '@/router'
const props = defineProps(['menuList'])
console.log(props.menuList)

const goRoute = (e: any) => {
  router.push(`${e.index}`)
}
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<template>
  <!-- 没有子菜单 -->
  <template v-for="(item, index) in props.menuList" :key="index">
    <template v-if="!item.children">
      <el-menu-item
        :index="item.path"
        v-if="!item.meta.hidden"
        @click="goRoute($event)"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>
            {{ item.meta.title }}
          </span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有子菜单，但是只有一个子路由 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].hidden"
        @click="goRoute($event)"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>
            {{ item.children[0].meta.title }}
          </span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有子菜单,并且子路由不止一个 -->
    <template v-if="item.children && item.children.length > 1">
      <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>
            {{ item.meta.title }}
          </span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </template>
</template>

<style lang="scss" scoped></style>
