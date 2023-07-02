import { createPinia } from 'pinia'
export * from './modules/user'
export * from './modules/setting'
export * from './modules/category'
const pinia = createPinia()
export default pinia
