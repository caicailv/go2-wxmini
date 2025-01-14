<template>
  <div class="con">
    <div class="li" @click="toUser(item)" v-for="item in userList" :key="item.nickname">
      <image v-if="item.avatar_url" :src="item.avatar_url" />
      {{ item.nickname }}
    </div>

  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getUsersApi } from '@/services'
import { onLoad } from '@dcloudio/uni-app'
const userList = ref([])
const getUserList = async () => {
  const res = await getUsersApi()
  console.log('get users', res);
  userList.value = res.data
  // const res = await fetch('https://jsonplaceholder.typicode.com/users')
  // const data = await res.json()
  // userList.value = data
}
const toUser = (item) => {
  uni.navigateTo({
    url: `/pages/users/user?openid=${item.openid}`
  })
}
onLoad(() => {
  getUserList()
})
</script>


<style lang="scss" scoped>
.con {
  display: flex;
  flex-wrap: wrap;
  padding-left: 20rpx;
  padding-top: 20rpx;
}

.li {
  display: flex;
  align-items: center;
  padding: 10rpx 15rpx;
  border-radius: 40rpx;
  flex-shrink: 1;
  border: 1px solid #ccc;
  margin-right: 30rpx;
  margin-bottom: 20rpx;

  image {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    margin-right: 10rpx;
  }

  // 实现userlist 视图
}
</style>