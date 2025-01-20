import { createSSRApp } from 'vue'
import App from './App.vue'
import uView from "@/uni_modules/vk-uview-ui";
import config from '@/global/global.json'
import pinia from './stores'
export function createApp() {
  const app = createSSRApp(App)
 app.config.globalProperties.$imgurl = config.IMG_URL
  app.use(pinia)
  app.use(uView);

  return {
    app,
  }
}
