<template>
    <div class="app_container" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111559-604952.jpg)` }">
        <div class="module">
            <div class="list">
                <div class="left">头像</div>
                <div class="right">
                    <button hover-class="none" class="avatar-wrapper" open-type="chooseAvatar"
                        @chooseavatar="onChooseAvatar">
                        <image class="avatar" :src="info?.avatar_url || '/static/images/3.png'"></image>
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
                <div class="left">累积滑行距离</div>
                <div class="right">
                    <input type="number" v-model="info.skate_mileage" placeholder="请设置" />
                </div>
            </div>
            
            <div class="list">
                <div class="left">城市</div>
                <div class="right">
                    <input type="text" v-model="info.region" placeholder="请设置" />
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
        <div class="module">
            <div class="gear_setup_row">
                <div class="tit">荣誉墙</div>
                <div class="imgs">
                    <div class="img" v-for="item in info.honur_list" :key="item">
                        <uniIcons class="icons" @click="deleteImg(item)" type="clear" size="30" />
                        <image mode="aspectFill" :src="item" @click="prevImg(item)" />
                    </div>
                    <goUpload v-if="info.honur_list?.length < 9" :count="9 - info.honur_list?.length || 0"
                        @success="changeImgs" />

                </div>
            </div>
        </div>
        <button class="edit_btn" :disabled="saveDisabled" type="primary" size="large" @click="toSave">保存信息</button>
    </div>
</template>

<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { getUserInfoApi, updateUserInfoApi } from '@/services'
import uniFilePicker from '@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue'
import { uploadFile } from '@/utils/http'
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { useUserStore } from '../../stores';
const userStore = useUserStore()
const saveDisabled = ref(false)
const info = ref({
    honur_list: [],
    nickname: '',
    region: '',
    bio: '',
    skate_mileage:'',
    gear_setup: '',
    avatar_url: ''

})
const getUserInfo = async () => {
    const res = await getUserInfoApi({ openid:userStore.profile.openid })
    info.value = res.data
    info.value.honur_list = res.data.honur_list || []
}

const changeImgs = (urls) => {
    info.value.honur_list = [...info.value.honur_list, ...urls]
}
const toSave = async () => {
    if(!info.value.nickname) return uni.showToast({
        title: '请填写昵称',
        icon: 'none',
        duration: 1500
    })

    saveDisabled.value = true
    await updateUserInfoApi({ ...info.value, userId: info.value.id })
    saveDisabled.value = false
    uni.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 1500
    })
    await new Promise(resolve => setTimeout(resolve, 1500))
    uni.navigateBack()

}
const prevImg = (url) => {
    uni.previewImage({
        urls: info.value.honur_list,
        current: url
    })
}
const deleteImg = (url) => {
    info.value.honur_list = info.value.honur_list.filter(item => item !== url)
}
onLoad((opt) => {
    getUserInfo()
})

const onChooseAvatar = async (e) => {
    let avatarUrl = e.detail.avatarUrl;
    const { url } = await uploadFile(avatarUrl)
    info.value.avatar_url = url
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

        .img {
            position: relative;
        }

        .icons {
            position: absolute;
            right: -30rpx;
            top: -30rpx;
            z-index: 1;

        }

        image {
            width: 100%;
            // height: auto;
            border-radius: 14rpx;
            height: 180rpx;

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