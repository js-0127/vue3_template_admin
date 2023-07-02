<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermisstion,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import type {
  MenuParams,
  PermisstionResponseData,
  PermisstionList,
  Permisstion,
} from '@/api/acl/menu/type'
import type ElMessage from 'element-plus'
const PermisstionArr = ref<PermisstionList>([])

//携带的参数
const menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
//组件挂载完毕
onMounted(() => {
  getHasPermisstion()
})

//获取菜单数据的方法
const getHasPermisstion = async () => {
  let result: PermisstionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    PermisstionArr.value = result.data
  }
}
const dialogVisible = ref<boolean>(false)

const title = ref<string>('添加')
const savePermission = async () => {
  dialogVisible.value = false
  const res = await reqAddOrUpdateMenu(menuData)
  if (res.code == 200) {
    //@ts-ignore
    ElMessage({
      type: 'success',
      message: `${title.value}成功`,
    })
  }
  getHasPermisstion()
}
const addPermisstion = (row: Permisstion) => {
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  title.value = '添加'
  //收集新增的菜单的level数值
  menuData.level = row.level + 1
  //给谁新增子菜单
  menuData.pid = row.id as number
}

//编辑已有的菜单
const updatePermisstion = (row: Permisstion) => {
  dialogVisible.value = true
  title.value = '编辑'
  //点击修改按钮:收集已有的菜单的数据进行更新
  Object.assign(menuData, row)
}
const removeMenu = async (id: number) => {
  const res = await reqRemoveMenu(id)
  console.log(res)
  if (res.code == 200) {
    //@ts-ignore
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  }
  getHasPermisstion()
}
</script>

<template>
  <el-table
    border
    :data="PermisstionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
  >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          @click="addPermisstion(row)"
          :disabled="row.level == 4 ? true : false"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="updatePermisstion(row)"
          :disabled="row.level == 1 ? true : false"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              :disabled="row.level == 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" :title="`${title}菜单`" width="30%">
    <el-form width="300px">
      <el-form-item label="名称" label-width="60px">
        <el-input placeholder="请填写名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限" label-width="60px">
        <el-input placeholder="请填写权限值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
