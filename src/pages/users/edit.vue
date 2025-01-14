<template>
    <div class="app_container" :style="{ backgroundImage: `url(/static/images/2.jpg)` }">
        <div class="module">
            <div class="list">
                <div class="left">头像</div>
                <div class="right">
                    <button hover-class="none" class="avatar-wrapper" open-type="chooseAvatar"
                        @chooseavatar="onChooseAvatar">
                        <image class="avatar" :src="avatarUrl || '/static/images/3.png'"></image>
                    </button>
                </div>
            </div>
            <div class="list">
                <div class="left">昵称</div>
                <div class="right">
                    <input type="nickname" v-model="info.nickname" placeholder="请设置" />
                </div>
            </div>
            <div class="list">
                <div class="left">个性签名</div>
                <div class="right">
                    <input type="text" v-model="info.bio" placeholder="请设置" />
                </div>
            </div>
        </div>

        <div class="module">
            <div class="gear_setup_row">
                <div class="tit">个人装备</div>
                <div class="con">
                    <!-- {{ info.gear_setup }} -->
                    <textarea v-model="info.gear_setup" maxlength="1000"></textarea>


                </div>
            </div>
        </div>
        <div class="module" v-if="info.gear_setup">
            <div class="gear_setup_row">
                <div class="tit">荣誉墙</div>
                <div class="imgs">
                    <image mode="widthFix" :src="info.avatar_url" />
                    <image mode="widthFix" :src="info.avatar_url" />
                    <image mode="widthFix" :src="info.avatar_url" />
                    <image mode="widthFix" :src="info.avatar_url" />
                    <image mode="widthFix" :src="info.avatar_url" />
                    <image mode="widthFix" :src="info.avatar_url" />
                    <image mode="widthFix" :src="info.avatar_url" />

                </div>
            </div>
        </div>
        <button class="edit_btn" type="primary" size="large" @click="toUserEdit">编辑信息</button>
    </div>
</template>

<script setup>
import { getUserInfoApi } from '@/services'
import { onLoad } from '@dcloudio/uni-app';
import labelTitle from './components/labelTitle.vue'
import { ref } from 'vue';
const info = ref({})
const editStatus = ref(false)
const getUserInfo = async (openid) => {
    const res = await getUserInfoApi({ openid })
    console.log('getUserInfo', res);
    info.value = res.data
    console.log('info', info.value);
}
const toUserEdit = () => {
    uni.navigateTo({ url: '/pages/users/edit' })
}
onLoad((opt) => {
    getUserInfo(opt.openid)
})

const onChooseAvatar = async (e) => {
    let avatarUrl = e.detail.avatarUrl;
    console.log('avatarUrl', avatarUrl);

    //   const base64Url = await toBase64(e.detail.avatarUrl)
    //   uni.setStorageSync('avatarUrl', e.detail.avatarUrl);
}

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

.avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 100%;

}

.list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 26rpx;
    min-height: 60rpx;
    padding: 10rpx 0;

    .left {
        color: #666;

    }

    .right {
        input {
            text-align: right;
            background-color: transparent;
        }

        button {
            background-color: transparent;
            width: auto;
            padding: 0;

        }
    }

    &+.list {
        border-top: 1rpx solid rgba($color: #000000, $alpha: .1);

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

        textarea {
            border: 1rpx solid rgba($color: #000000, $alpha: .1);
            padding: 15rpx;
            width: 100%;
            box-sizing: border-box;
            border-radius: 15rpx;
        }
    }

    .imgs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15rpx;
        margin-top: 10rpx;

        image {
            width: 100%;
            height: auto;
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