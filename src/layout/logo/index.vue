<script setup lang="ts"></script>

<template>
    <div class="logo-page">
        <img src="../../../public/bear.svg" alt="">
        <p>小熊甄选管理平台</p>
    </div>
</template>

<style lang="scss" scoped>
.logo-page {
    width: 100%;
    height: $sideBar-logo-height;
    display: flex;
    align-items: center;
    padding: 20px;

    img {
        width: 30px;
        height: 30px;
    }

    p {
        margin-left: 10px;
        color: white;
        font-size: 20px;
    }
}
</style>
