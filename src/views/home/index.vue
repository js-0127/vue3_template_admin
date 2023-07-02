<script setup lang="ts">
import { useUserStore } from '@/store';
import { dateTime } from '@/utils/date'
const userStore = useUserStore()
</script>

<template>
  <div>
    <el-card>
      <div class="container">
        <img :src="userStore.avtar" alt="" class="avatar">
        <div class="bottom">
          <h3 class="title">{{ dateTime() }}呀{{ userStore.username }}</h3>
          <p class="subtitle">小熊甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms">
      <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottoms {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
