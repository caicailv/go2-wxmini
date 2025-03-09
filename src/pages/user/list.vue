<template>
  <div class="page" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111647-548896.jpg)` }">
    <div class="g2">
      <div class="con">
        <div class="li" @click="toUser(item)" v-for="item in userList" :key="item.nickname">
          <image v-if="item.avatar_url" :src="item.avatar_url" />
          {{ item.nickname }}
        </div>
      </div>


      <div class="button-group" v-if="showBtn">
        <button type="primary" size="large" @click="toManageAddUser">录入用户</button>
      </div>
    </div>
  </div>
  <!-- -->

</template>
<script setup>
import { ref,computed } from 'vue'
import { getUsersApi } from '@/services'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores';
import { shareCofig } from '@/utils/share'
import { checkManage } from '../../utils'
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
onShareAppMessage(() => shareCofig)
onShareTimeline(() => shareCofig)
const userStore = useUserStore()

const showBtn = computed(()=>{
  let openid = userStore?.profile?.openid
  if(!openid) return false
  return checkManage(openid)
})
const userList = ref([])
const getUserList = async () => {
  const res = await getUsersApi()
  userList.value = res.data.filter(el=>el.nickname)


}
const toUser = (item) => {
  uni.navigateTo({
    url: `/pages/user/user?openid=${item.openid||""}&id=${item.id}`
  })
}
const toManageAddUser = () => {
  uni.navigateTo({
    url: `/pages/user/edit?type=manageCreare`
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

.button-group {
  position: relative;
  z-index: 3;

  button:active {
    background-color: #1677ff;
  }
}
</style>