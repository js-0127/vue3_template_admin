<script setup lang="ts">
import { useSettingStore } from '../../../store'
import { useRoute } from 'vue-router'
const store = useSettingStore()
const changeFold = () => {
    store.fold = !store.fold
}
const route = useRoute()
</script>

<template>
    <div class="tabbar-page-left">
        <div class="icon" @click="changeFold">
            <el-icon>
                <component :is="store.fold ? 'Fold' : 'Expand'" />
            </el-icon>
        </div>
        <div class="bread">
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="item.path" v-for="(item, index) in route.matched" :key="index"
                    v-show="item.meta.icon">
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span style="margin: 0 3px;">
                        {{ item.meta.title }}
                    </span></el-breadcrumb-item>

            </el-breadcrumb>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tabbar-page-left {
    display: flex;
    align-items: center;

    .icon {
        margin-left: 20px;
        margin-right: 10px;
    }
}
</style>
