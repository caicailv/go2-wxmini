<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { wechatLoginApi } from './services'
import { useUserStore } from './stores'
import { getUserInfoApi } from '@/services'

const userStore = useUserStore()
const updateApp = () => {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            },
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
          })
        })
      }
    })
  }

}
const wxLoginFn = async () => {
  const res = await wx.login()
  const res2 = await wechatLoginApi({ code: res.code })
  userStore.setProfile(res2.data)
  initUserInfo(res2.data.openid)
}
const initUserInfo = async (openid)=>{
  const res = await getUserInfoApi({openid})
  userStore.setProfile(res.data)
}

onLaunch(async () => {
  updateApp()
  wxLoginFn()
})


</script>

<style lang="scss">
@import "@/uni_modules/vk-uview-ui/index.scss";

@import '@/styles/fonts.scss';
@import '@/styles/main.scss';

view,
navigator,
input,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 两行省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>


<style></style>