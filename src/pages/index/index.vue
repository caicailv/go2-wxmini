<template>
  <div class="app_container" :style="{ backgroundImage: `url(/static/images/1.jpg)` }">
    <div class="app_row" style="padding: 20px;">
      <div class="title_row">
        <div class="title">
          GO2SKATE ldp排位系统
        </div>

      </div>


      <!-- 显示昵称 -->
      <div v-if="nickname" class="welcome">
        欢迎你:
        <span @click="goToPage('/pages/users/user?openid='+userStore.profile.openid)" class="nickname">
          {{ nickname }}
        </span>
      </div>

      <!-- 地图排行 -->
      <div class="button-group">
        <button type="primary" size="large" @click="goToPage('/pages/mapList/index')">地图列表</button>
      </div>

      <!-- 滑手列表 -->
      <div class="button-group">
        <button type="primary" size="large" @click="goToPage('/pages/users/index')">滑手列表</button>
      </div>
      <!-- 滑手列表 -->
      <div class="button-group">
        <button type="primary" size="large" @click="act">活动周记</button>
      </div>
      <template v-if="!nickname">
        <div class="button-group">
          <button type="primary" class="login_btn" @click="toEdit">注册</button>
        </div>
      </template>

      <!-- 退出账号 -->
      <!-- <div v-else class="logout" @click="logoutOpen">
        退出账号
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores'
const userStore = useUserStore()
// import { ElMessageBox, ElMessage } from 'element-plus'
// import { useRouter } from 'vue-router'

// const router = useRouter()

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
  uni.redirectTo({ url: '/pages/users/edit' })

}
const nickname = computed(() => userStore.profile?.nickname)



// 获取昵称
onMounted(async () => {

  // const savedNickname = localStorage.getItem('nickname')
  // if (savedNickname) {
  //   nickname.value = savedNickname
  // }
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
      margin-bottom: 20px;

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
</style>
