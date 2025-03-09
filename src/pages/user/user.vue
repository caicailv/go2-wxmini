<template>
    <div class="app_container" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111559-604952.jpg)` }">
        <div class="module">
            <div class="head">
                <image :src="info?.avatar_url || '/static/images/3.png'"></image>
                <div class="row">
                    <div class="nickname">{{ info.nickname }}
                        <labelTitle v-if="info.skate_mileage" :skateMileage="Number(info.skate_mileage) || 0" />
                    </div>
                    <div class="city">{{info.region||''}}</div>
                </div>
            </div>
            <div class="bio" v-if="info.skate_year">
                <div class="tit">滑龄: &nbsp; {{ info.skate_year }}年</div>
            </div>
            <div class="bio" v-if="info.bio">
                <div class="tit">个性签名: &nbsp; {{ info.bio }}</div>
            </div>
        </div>

        <div class="module" v-if="info.gear_setup">
            <div class="gear_setup_row">
                <div class="tit">滑手经历</div>
                <div class="con">{{ info.gear_setup }}</div>
            </div>
        </div>
        <div class="module" v-if="info.honur_list?.length">
            <div class="gear_setup_row">
                <div class="tit">滑手图片</div>
                <div class="imgs">
                    <image v-for="item in info.honur_list" :key="item" mode="widthFix" :src="item" @click="prevImg(item)" />
                </div>
            </div>
        </div>
        <button v-if="isEditBtn" class="edit_btn" type="primary" size="large" @click="toUserEdit">编辑信息</button>
    </div>
</template>

<script setup>
import { getUserInfoApi } from '@/services'
import { onLoad, onShow } from '@dcloudio/uni-app';
import labelTitle from './components/labelTitle.vue'
import { ref } from 'vue';
import { computed } from 'vue';
import { useUserStore } from '@/stores';
import {shareCofig} from '@/utils/share'
import {checkManage } from '@/utils'

import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
onShareAppMessage(()=>shareCofig)
onShareTimeline(()=>shareCofig)

const userStore = useUserStore()
const info = ref({})
const openid = ref('')
const id = ref('')
const isEditBtn = computed(()=>{
    if(userStore.profile.openid === openid.value ) return true 
    return checkManage(userStore.profile.openid)
})
const getUserInfo = async (openid,id) => {
    const res = await getUserInfoApi({ openid,id })
    info.value = res.data
}
const toUserEdit = () => {
    let url = `/pages/user/edit?openid=${openid.value}&id=${id.value}`
    if(checkManage(userStore.profile.openid)){
        url += `&type=manageEdit`

    }
    
    uni.navigateTo({ url  })
}

const prevImg = (url) => {
    uni.previewImage({
        urls: info.value.honur_list,
        current: url
    })
}
onLoad((opt) => {
    openid.value = opt.openid
    id.value = opt.id
})
onShow(() => {
    getUserInfo(openid.value,id.value)
})
// 这里可以添加你的逻辑代码，比如从后端获取数据，或者添加响应式状态
</script>

<style lang="scss" scoped>
.app_container {
    background-position: center;
    background-size: 100% 100%;
    height: 100vh;
    overflow: hidden;

    .module {
        width: calc(100vw - 40rpx);
        background-color: rgba($color: #fff, $alpha: .9);
        border-radius: 20rpx;
        margin: 0 auto;
        margin-top: 20rpx;
        padding: 15rpx 25rpx;

    }
}

.head {
    display: flex;
    align-items: center;

    image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
    }

    .row {
        .nickname {
            font-size: 36rpx;
            color: #333;
            display: flex;
            align-items: center;
        }

        .city {
            color: #666;
        }

    }
}

.bio {
    margin-top: 15rpx;

    .tit {
        font-size: 24rpx;
    }
}

.gear_setup_row {
    .tit {
        font-size: 28rpx;
    }

    .con {
        font-size: 26rpx;
        margin-top: 10rpx;
        white-space: break-spaces;
    }

    .imgs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15rpx;
        margin-top: 10rpx;
        image {
            width: 100%;
            height: 180rpx;
            height: 1;
            border-radius: 8rpx;
        }
    }

}

.edit_btn {
    margin: 20rpx auto 0;
    width: 80%;
    background-color: #1677ff;
    border-radius: 50rpx;

}
</style>