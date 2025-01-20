<template>
  <div class="page" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111647-548896.jpg)` }">
    <div class="g2">
      <div class="con">
        <div class="li" @click="toUser(item)" v-for="item in userList" :key="item.nickname">
          <image v-if="item.avatar_url" :src="item.avatar_url" />
          {{ item.nickname }}
        </div>

      </div>

    </div>

  </div>
  <!-- -->

</template>
<script setup>
import { ref } from 'vue'
import { getUsersApi } from '@/services'
import { onLoad } from '@dcloudio/uni-app'
import {shareCofig} from '@/utils/share'
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
onShareAppMessage(()=>shareCofig)
onShareTimeline(()=>shareCofig)

const userList = ref([])
const getUserList = async () => {
  const res = await getUsersApi()
  // userList.value = res.data
  userList.value = res.data.filter(item => item.openid)
  // const res = await fetch('https://jsonplaceholder.typicode.com/users')
  // const data = await res.json()
  // userList.value = data
}
const toUser = (item) => {
  uni.navigateTo({
    url: `/pages/user/user?openid=${item.openid}`
  })
}
onLoad(() => {
  getUserList()
})
</script>


<style lang="scss" scoped>
.page {
  background-position: center;
  background-size: 100% 100%;
  height: 100vh;
  padding-top: 20rpx;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // background-color: rgba($color: #fff, $alpha: .5);
  }
}

.g2 {
  width: calc(100vw - 40rpx);
  background-color: rgba($color: #fff, $alpha: .9);
  border-radius: 20rpx;
  margin: 0 auto;
  margin-top: 20rpx;
  padding: 15rpx 25rpx;
  height: calc(100vh - 100rpx);

}

.con {
  position: relative;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  padding-left: 20rpx;
  padding-top: 20rpx;

}

.li {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  padding: 10rpx 15rpx;
  border-radius: 40rpx;
  flex-shrink: 1;
  border: 1px solid #ccc;
  margin-right: 30rpx;
  margin-bottom: 20rpx;
  height: auto;

  image {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-right: 10rpx;
  }

  // 实现userlist 视图
}
</style>