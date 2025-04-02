<template>
    <div class="app_container"
        :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111559-604952.jpg)` }">
        <div class="module">
            <div class="list">
                <div class="left">路线名称*</div>
                <div class="right">
                    <input type="text" v-model="info.name" placeholder="请设置" />
                </div>
            </div>
            <div class="list">
                <div class="left">路线里程(km)*</div>
                <div class="right">
                    <input type="number" v-model="info.route_length" placeholder="请设置" />
                </div>
            </div>
            <div class="list">
                <div class="left">所属地区*</div>
                <div class="right">
                    <picker @change="onRegionChange" mode="region" level="city" class="picker" :value="info.region">
                        <view>{{ info.region || '请设置' }}</view>
                    </picker>
                </div>
            </div>
            <div class="list">
                <div class="left">丝滑程度*</div>
                <div class="right">
                    <uni-rate v-model="info.smooth" size="18" />

                </div>
            </div>
            <div class="list">
                <div class="left">便利程度*</div>
                <div class="right">
                    <uni-rate v-model="info.convenience" size="18" />
                </div>
            </div>
            <div class="list">
                <div class="left">综合评分*</div>
                <div class="right">
                    <uni-rate v-model="info.star" size="18" />
                </div>
            </div>

        </div>

        <div class="module">
            <div class="gear_setup_row">
                <div class="tit">上传路书</div>
                <div class="con">
                    <button v-if="info.road_file == ''" type="primary" @click="upFile" size="mini">上传</button>
                    <div v-else class="txt">
                        <span>路书已上传</span>
                        <button type="primary" @click="upFile" size="mini">修改</button>
                        <button type="primary" @click="deleteFile" size="mini">删除</button>
                    </div>
                </div>
                <parseMap :kmlContent="kmlContent" />
            </div>
        </div>



        <div class="module">
            <div class="gear_setup_row">
                <div class="tit">路线描述</div>
                <div class="con">
                    <textarea v-model="info.description" maxlength="1000" placeholder="这条路线怎么样?"></textarea>
                </div>
            </div>
        </div>
        <div class="module">
            <div class="gear_setup_row">
                <div class="tit">沿途风景</div>
                <div class="imgs">
                    <div class="img" v-for="item in info.description_imgs" :key="item">
                        <uniIcons class="icons" @click="deleteImg(item)" type="clear" size="30" />
                        <image mode="aspectFill" :src="item" @click="prevImg(item)" />
                    </div>
                    <goUpload v-if="info.description_imgs?.length < 9" :count="9 - info.description_imgs?.length || 0"
                        @success="changeImgs" />
                </div>
            </div>
        </div>
        <button class="edit_btn" :disabled="saveDisabled" type="primary" size="large" @click="toSave">保存地图</button>
    </div>
</template>

<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { clearRegion } from '@/utils'
import { editMapApi } from '@/services'
import { uploadFile } from '@/utils/http'
import { onLoad } from '@dcloudio/uni-app';
import { ref, reactive } from 'vue';
import { checkLogin } from '@/common/hooks'
import { useUserStore } from '../../stores';
import parseMap from './components/parseMap.vue';
const userStore = useUserStore()
const saveDisabled = ref(false)
const kmlContent = ref('')
const info = reactive({
    id: '',
    name: '',
    region: '',
    smooth: 0,
    route_length: '',
    convenience: 0,
    star: 0,
    road_file: '',
    description: '',
    description_imgs: [],
})

const onRegionChange = (ev) => {
    info.region = clearRegion(ev.detail.value)
}
const readFileContent = (tempFilePath) => {
    const fs = wx.getFileSystemManager()
    fs.readFile({
        filePath: tempFilePath,
        encoding: 'utf-8',
        success: res => kmlContent.value = res.data,
        fail: err => {
            console.error('文件读取失败：', err)
            uni.showToast({
                title: '文件读取失败',
                icon: 'none'
            })
        }
    })
}

const upFile = async () => {
    const res = await wx.chooseMessageFile({ count: 10, type: 'file' })
    const file = res.tempFiles[0]
    readFileContent(file.path)
    const { url } = await uploadFile(file.path)
    info.road_file = url
}
const deleteFile = () => {
    info.road_file = ''
    kmlContent.value = ''
}
const changeImgs = (urls) => {
    info.description_imgs = [...info.description_imgs, ...urls]
}
const toSave = async () => {
    if (!await checkLogin()) return
    if (!info.name) return uni.showToast({
        title: '请填写路线名称',
        icon: 'none',
        duration: 1500
    })

    if (!info.route_length) return uni.showToast({
        title: '请填写路线里程',
        icon: 'none',
        duration: 1500
    })
    if (!info.region) return uni.showToast({
        title: '请填写所属地区',
        icon: 'none',
        duration: 1500
    })
    if (!info.smooth) return uni.showToast({
        title: '请填写丝滑程度',
        icon: 'none',
        duration: 1500
    })

    if (!info.convenience) return uni.showToast({
        title: '请填写便利程度',
        icon: 'none',
        duration: 1500
    })

    if (!info.star) return uni.showToast({
        title: '请填写综合评分',
        icon: 'none',
        duration: 1500
    })

    saveDisabled.value = true
    await editMapApi(info)
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
        urls: info.description_imgs,
        current: url
    })
}
const deleteImg = (url) => {
    info.description_imgs = info.description_imgs.filter(item => item !== url)
}
onLoad((opt) => {
    info.id = opt.id
})
</script>

<style lang="scss" scoped>
.app_container {
    background-position: center;
    background-size: 100% 100%;
    min-height: 100vh;
    background-repeat: repeat;
    padding-top: 1rpx;

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
        // width: 180rpx;
    }

    .right {
        margin-left: 30rpx;

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

    button {
        background-color: #1677ff;
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

        .txt {
            display: flex;
            align-items: center;
            font-size: 28rpx;

            button {
                margin-left: 10rpx;
                margin-right: 10rpx;

            }

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