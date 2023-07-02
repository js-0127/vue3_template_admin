<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, getTrademark, reqDeleteTrademark } from '@/api/product/trademark/index'
import type ElMessage from 'element-plus'
import type { UploadProps } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { TradeMark } from '@/api/product/trademark/types'
const currentPage = ref<number>(1)
const limit = ref<number>(3)
const tableData = ref<Array<object>>([])
const total = ref<number>(0)
const getTableData = async () => {
    const res = await reqHasTrademark(currentPage.value, limit.value)
    tableData.value = res.data.records
}
const tradeMarkData = async () => {
    const result = await getTrademark()
    total.value = result.data.length
}
onMounted(async () => {
    await tradeMarkData()
    await getTableData()
})
//分页
const handlePageChange = async () => {
    await getTableData()
}
// 每页数据数量
const handleSizeChange = async () => {
    currentPage.value = 1
    await getTableData()
}

const dialogFormVisible = ref<boolean>(false)
const form = reactive<TradeMark>({
    tmName: '',
    logoUrl: ''
})


const ruleFormRef = ref<FormInstance>()
//logo图片校验规则
const validateLogo = (rule: any, value: any, callback: any) => {
    if (value) {
        callback()
    } else {
        callback(new Error('请上传品牌LOGO'))
    }
}
//校验规则
const rules = reactive<FormRules<typeof form>>({
    tmName: [
        { required: true, message: '品牌名称不可以为空', trigger: 'blur' },
        { min: 2, message: '品牌至少是两个字段', trigger: 'change' }
    ],
    logoUrl: [
        { required: true, message: '品牌LOGO不可以为空', validator: validateLogo }
    ]
})

const title = ref<string>('')
//添加品牌
const addTrademark = async () => {
    title.value = '添加品牌'
    dialogFormVisible.value = true
    form.logoUrl = ''
    form.tmName = ''
}
//更新品牌
const handleEdit = (row: any) => {
    title.value = '更新品牌'
    dialogFormVisible.value = true
    form.id = row.id
    form.tmName = row.tmName
    form.logoUrl = row.logoUrl
}
//取消
const cancle = () => {
    dialogFormVisible.value = false
}
//确定添加或者更新
const confirm = async () => {
    await ruleFormRef.value.validate()
    const res = await reqAddOrUpdateTrademark(form)
    if (res.code == 200) {
        //@ts-ignore
        ElMessage({
            type: 'success',
            message: `${title.value}成功`
        })
        await tradeMarkData()
        await getTableData()
    } else {
        //@ts-ignore
        ElMessage({
            type: 'error',
            message: `${title.value}失败`
        })
    }
    dialogFormVisible.value = false
}

//删除
//气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
    //点击确定按钮删除已有品牌请求
    let result = await reqDeleteTrademark(id);
    if (result.code == 200) {
        //删除成功提示信息
        //@ts-ignore
        ElMessage({
            type: 'success',
            message: '删除品牌成功'
        });
        //再次获取已有的品牌数据
        await tradeMarkData()
        await getTableData()
    } else {
        //@ts-ignore
        ElMessage({
            type: 'error',
            message: '删除品牌失败'
        })
    }
}
//上传文件之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true;
        } else {
            //@ts-ignore
            ElMessage({
                type: 'error',
                message: '上传文件大小小于4M'
            })
            return false;
        }
    } else {
        //@ts-ignore
        ElMessage({
            type: 'error',
            message: "上传文件格式务必PNG|JPG|GIF"
        })
        return false;
    }
}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response:any) => {
    //response:即为当前这次上传图片post请求服务器返回的数据
    //收集上传图片的地址,添加一个新的品牌的时候带给服务器
    form.logoUrl = response.data;
    //图片上传成功,清除掉对应图片校验结果
    ruleFormRef.value.clearValidate('logoUrl');
}
</script>
<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="Shipping address">
            <template #header>
                <span>
                    {{ title }}
                </span>
            </template>
            <el-form :model="form" ref="ruleFormRef" :rules="rules">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input v-model="form.tmName" placeholder="请输入品牌名称" autocomplete="off" />
                </el-form-item>
                <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
                    <el-upload class="avatar-uploader" action="http://sph-api.atguigu.cn/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancle">取消</el-button>
                    <el-button type="primary" @click="confirm">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-card>
            <el-button type="primary" icon="Plus" @click="addTrademark">添加商品</el-button>
        </el-card>
        <el-table :data="tableData" style="margin: 10px 0" border>
            <el-table-column align="center" type="index" width="80px" label="序号"></el-table-column>
            <el-table-column label="商品名称">
                <template #="{ row }">
                    <span>{{ row.tmName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品LOGO">
                <template #="{ row }">
                    <img :src="row.logoUrl" alt="图片丢失了" style="width: 100px">
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品操作">

                <template #="{ row }">
                    <el-button size="small" @click="handleEdit(row)" icon="Edit"></el-button>
                    <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="250px" icon="Delete"
                        @confirm='removeTradeMark(row.id)'>
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
            background=true layout="t, prev, pager, next, jumper, ->,sizes,total" :total="total"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
