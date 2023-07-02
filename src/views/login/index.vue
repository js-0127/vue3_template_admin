<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import type { loginFormData } from '@/api/user/type'
import { useUserStore } from '@/store/modules/user'
import type ElNotification from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { dateTime } from '@/utils/date'
import { FormRules } from 'element-plus/lib/components/form/src/types.js'
import { FormInstance } from 'element-plus/lib/components/form/index.js'

const router = useRouter()
const route = useRoute()
const redirect = route.query.redirect
//获取时间 
const message = dateTime()
const userStore = useUserStore()
//创建表单
const loginForm = reactive<loginFormData>({
  username: '',
  password: ''
})
//设置按钮状态
const loading = ref(false)
//登录
const handleLogin = async (data: loginFormData) => {
  loading.value = true
  try {
    const res = await userStore.setToken(data)
    if (res)

      //@ts-ignore
      ElNotification({
        type: 'success',
        title: message,
        message: '欢迎回来'
      })
    //@ts-ignore
    router.push({ path: redirect || '/' })
  }
  catch (err) {
    setTimeout(() => {
      loading.value = false
    }, 500);
    //@ts-ignore
    ElNotification({
      type: 'error',
      message: (err as Error).message
    })
  }
}
//表单验证
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<loginFormData>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 11, message: '用户名长度在5-11位', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度在6-16位', trigger: 'change' },

  ]
})
</script>

<template>
  <div class="login-page">
    <el-row>
      <el-col :span="12" xs="0"></el-col>
      <el-col :span="12" xs="24">
        <el-form ref="ruleFormRef" :rules="rules" class="login_form" :model="loginForm">
          <h1>Hello</h1>
          <h2>欢迎来到小熊甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username">用户名</el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" v-model="loginForm.password" show-password>密码</el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" style="width: 100%;" type="primary" default
              @click="handleLogin(loginForm)">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  & .login_form {
    position: relative;
    top: 30vh;
    width: 80%;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      font-size: 40px;
      color: white
    }

    h2 {
      margin: 20px 0;
      font-size: 20px;
      color: white
    }
  }
}
</style>
