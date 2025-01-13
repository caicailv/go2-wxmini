import { createSSRApp } from 'vue'
import App from './App.vue'
// import base from '@/global/base.js'
import uView from "@/uni_modules/vk-uview-ui";
import config from '@/global/global.json'
// 导入 pinia 实例
import pinia from './stores'
export function createApp() {
  // 创建 vue 实例
  const app = createSSRApp(App)
 app.config.globalProperties.$imgurl = config.IMG_URL
  // 使用 pinia
  app.use(pinia)

  // app.use(base);
  app.use(uView);

  return {
    app,
  }
}
