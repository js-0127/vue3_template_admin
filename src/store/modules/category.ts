import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryObj, CategoryResponseData } from '@/api/product/attr/type'
import { ref } from 'vue'
const useCategoryStore = defineStore('Category', () => {
  //存储一级分类的数据
  const c1Arr = ref([])
  //存储一级分类的ID
  const c1Id = ref('')
  //存储对应一级分类下二级分类的数据
  const c2Arr = ref([])
  //收集二级分类的ID
  const c2Id = ref('')
  //存储三级分类的数据
  const c3Arr = ref([])
  //存储三级分类的ID
  const c3Id = ref('')
  //获取一级分类的方法
  const getC1Data = async () => {
    //发请求获取一级分类的数据
    const result = await reqC1()
    if (result.code == 200) {
      ;(c1Arr.value as Array<CategoryObj>) = result.data
    }
  }
  //获取二级分类的数据
  const getC2Data = async () => {
    //获取对应一级分类的下二级分类的数据
    const result = await reqC2(c1Id.value)
    if (result.code == 200) {
      ;(c2Arr.value as Array<CategoryObj>) = result.data
    }
  }
  //获取三级分类的数据
  const getC3Data = async () => {
    const result: CategoryResponseData = await reqC3(c2Id.value)
    if (result.code == 200) {
      ;(c3Arr.value as Array<CategoryObj>) = result.data
    }
  }
  const reset = () => {
    c1Arr.value = []
    c1Id.value = ''
    c2Arr.value = []
    c2Id.value = ''
    c3Arr.value = []
    c3Id.value = ''
  }
  return {
    c1Arr,
    c1Id,
    c2Arr,
    c2Id,
    c3Arr,
    c3Id,
    getC1Data,
    getC2Data,
    getC3Data,
    reset,
  }
})

export default useCategoryStore
