<template>
  <div class="app_container" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111451-369832.jpg)` }">
    <div class="app_row" style="padding: 20px;">
      <div class="title_row">
        <div class="title">GO2SKATE</div>
      </div>
      <!-- 显示昵称 -->
      <div v-if="userStore.isLogin" class="welcome">
        欢迎你:
        <span @click="goToPage('/pages/user/user?openid=' + userStore.profile.openid)" class="nickname">
          {{ nickname }}
        </span>
      </div>

      <!-- 地图排行 -->
      <div class="button-group">
        <button type="primary" size="large" @click="goToPage('/pages/map/list')">地图列表</button>
      </div>

      <!-- 滑手列表 -->
      <div class="button-group">
        <button type="primary" size="large" @click="goToPage('/pages/user/list')">滑手列表</button>
      </div>
      <div class="button-group">
        <button type="primary" size="large" @click="act">活动历史</button>
      </div>
      <div class="button-group">
        <button type="primary" size="large" @click="act">装备大全</button>
      </div>
      
      <template v-if="!userStore.isLogin">
        <div class="button-group">
          <button type="primary" class="login_btn" @click="toEdit">注册</button>
        </div>
      </template>
      <div class="version_view">v{{ version || '1.1.1' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores'
import { onLoad } from '@dcloudio/uni-app'
import {shareCofig} from '@/utils/share'
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
onShareAppMessage(()=>shareCofig)
onShareTimeline(()=>shareCofig)
const userStore = useUserStore()
// 跳转页面方法
const goToPage = (path) => {
  uni.navigateTo({ url: path })
}
const act = () => {
  uni.showToast({
    title: '敬请期待',
    icon: 'none',
    duration: 2000
  })
}
const toEdit = () => {
  uni.navigateTo({ url: '/pages/user/edit' })

}
const nickname = computed(() => userStore.profile?.nickname)


const version = ref('')
const getVersion = () => {
  const accountInfo = wx.getAccountInfoSync();
  version.value = accountInfo?.miniProgram?.version;
}
onLoad(() => {
  getVersion()
})
</script>

<style lang="scss" scoped>
.login_btn {
  width: 50%;
  margin: 12rpx auto;
}

button[type=primary] {
  background-color: #1677ff;
}

.app_container {
  background-position: center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000, $alpha: .5);
  }

  .app_row {
    position: relative;
    z-index: 2;
    height: 50vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    margin-top: -20vh;

    .title_row {
      display: flex;
      align-items: center;
      justify-content: center;

    }

    .title {
      // height: 30px;
      color: #000;
      text-align: center;
      font-size: 40rpx;
      margin: -50px 0 50px;
      background-color: #fff;
      border-radius: 10rpx;
      display: inline-block;
      text-align: center;
      padding: 10rpx 20rpx;
    }

    .welcome {
      height: 30px;
      color: #fff;
      font-size: 18px;
      margin-bottom: 20rpx;

      .nickname {
        color: #1677ff;
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .button-group {
      margin-top: 12px;

      .button {
        width: 100%;
      }
    }

    .logout {
      margin-top: 12px;
      text-align: center;
      color: red;
      cursor: pointer;
    }
  }
}

.version_view {
  margin-top: 12rpx;
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 26rpx;

}
</style>
