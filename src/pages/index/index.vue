<template>
  <div class="app_container" :style="{backgroundImage: `url(/static/images/1.jpg)`}">
    <div class="app_row" style="padding: 20px;">
      <div class="title_row">
        <div class="title">
        GO2SKATE ldp排位系统
      </div>

      </div>


      <!-- 显示昵称 -->
      <div v-if="nickname" class="welcome">
        欢迎你:
        <span @click="goToPage('/me')" class="nickname">
          {{ nickname }}
        </span>
      </div>

      <!-- 地图排行 -->
      <div class="button-group">
        <button type="primary" size="large" @click="goToPage('/pages/mapList/index')">地图列表</button>
      </div>

      <!-- 滑手列表 -->
      <div class="button-group">
        <button type="primary" size="large" @click="goToPage('/users')">滑手列表</button>
      </div>

      <!-- 登录和注册 v-if="!nickname" -->
      <template >
        <div class="button-group">
          <button type="primary" size="large" @click="goToPage('/login')">登录</button>
        </div>
        <div class="button-group">
          <button type="primary" size="large" @click="goToPage('/register')">注册</button>
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
import { ref, onMounted } from 'vue'
// import { ElMessageBox, ElMessage } from 'element-plus'
// import { useRouter } from 'vue-router'

// const router = useRouter()
const nickname = ref('')

// 跳转页面方法
const goToPage = (path) => {
  uni.navigateTo({url: path})
}

// 退出逻辑
const logout = () => {
  localStorage.removeItem('nickname')
  localStorage.removeItem('userId')
  nickname.value = ''
  // ElMessage.success('退出成功')
}

const logoutOpen = () => {

  // ElMessageBox.confirm('确定退出吗?', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  // }).then(() => {
  //   logout()
  // })
}

// 获取昵称
onMounted(() => {
  // const savedNickname = localStorage.getItem('nickname')
  // if (savedNickname) {
  //   nickname.value = savedNickname
  // }
})
</script>

<style lang="scss" scoped>
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
  .app_row {
    height: 50vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    .title_row{
      display: flex;
      align-items: center;
      justify-content: center;
      
    }
    .title {
      // height: 30px;
      color: #000;
      text-align: center;
      font-size: 18px;
      margin: -50px 0 50px;
      background-color: #fff;
      border-radius: 10rpx;
      display: inline-block;
      text-align: center;
      padding: 10rpx 20rpx;
    }

    .welcome {
      height: 30px;
      color: #000;
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
