<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqRemoveRole,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
} from '@/api/acl/role/index'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import { useSettingStore } from '@/store'
import type ElMessage from 'element-plus'
const store = useSettingStore()
const currentPage = ref<number>(0)
const limit = ref<number>(5)
const total = ref<number>(0)
const keyWord = ref<string>('')

const roleData = ref<Records>([])
const getHasRole = async (page: number = 1) => {
  currentPage.value = page
  const res: RoleResponseData = await reqAllRoleList(
    currentPage.value,
    limit.value,
    keyWord.value,
  )
  roleData.value = res.data.records
  total.value = res.data.total
}
onMounted(() => {
  getHasRole()
})

const searchRole = () => {
  getHasRole()
  keyWord.value = ''
}
const refresh = () => {
  store.refresh = !store.refresh
}

const title = ref<string>('')
const dialogTableVisible = ref<boolean>(false)

const addRole = () => {
  title.value = '添加角色'
  dialogTableVisible.value = true
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const form = ref<any>()
const roleParams = reactive<RoleData>({
  roleName: '',
})
//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
const save = async () => {
  //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
  await form.value.validate()
  const res = await reqAddOrUpdateRole(roleParams)
  if (res.code == 200) {
    //@ts-ignore
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
  }
  getHasRole()
  console.log(res)
  dialogTableVisible.value = false
  Object.assign(roleParams, {
    roleName: '',
    id: 0,
  })
}
const cancle = () => {
  dialogTableVisible.value = false
  Object.assign(roleParams, {
    roleName: '',
  })
}
const editRole = (row: RoleData) => {
  dialogTableVisible.value = true
  title.value = '编辑职位'
  roleParams.id = row.id
  roleParams.roleName = row.roleName
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const drawer = ref<boolean>(false)
const setPermission = async (row: RoleData) => {
  Object.assign(roleParams, row)
  drawer.value = true
  const res: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  console.log(res)

  if (res.code == 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 1) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
const selectArr = ref<MenuList>([])
const tree = ref<any>()
const menuArr = ref<MenuList>([])
const defaultProps = {
  children: 'children',
  label: 'name',
}

const handler = async () => {
  //职位的ID
  const roleId = roleParams.id as number
  //选中节点的ID
  const arr = tree.value.getCheckedKeys()
  //半选的ID
  const arr1 = tree.value.getHalfCheckedKeys()
  const permissionId = [...arr, ...arr1]
  //下发权限
  const res: any = await reqSetPermisstion(roleId, permissionId)
  console.log(res)

  if (res.code == 200) {
    //抽屉关闭
    drawer.value = false
    //提示信息
    //@ts-ignore
    await ElMessage({ type: 'success', message: '分配权限成功' })
    //页面刷新
    window.location.reload()
  }
}

const removeRole = async (id: number) => {
  const res = await reqRemoveRole(id)
  if (res.code == 200) {
    //@ts-ignore
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole()
  }
}
</script>

<template>
  <div>
    <el-card>
      <el-form
        :inline="true"
        style="display: flex; justify-content: space-between"
      >
        <el-form-item label="角色名称">
          <el-input placeholder="角色名称" v-model="keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="keyWord ? false : true"
            @click="searchRole"
          >
            搜索
          </el-button>
          <el-button @click="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="Plus" @click="addRole">
        添加角色
      </el-button>
      <el-table border style="margin: 10px 0" :data="roleData">
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="id" align="center" prop="id"></el-table-column>
        <el-table-column
          label="角色名称"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="280px">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setPermission(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="editRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}?`"
              width="260px"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasRole"
        @size-change="getHasRole"
      />
    </el-card>
    <el-dialog :title="title" v-model="dialogTableVisible">
      <el-form :model="roleParams" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="角色名称"
            v-model="roleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="cancle">取消</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
          ref="tree"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped></style>
