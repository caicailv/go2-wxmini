<template>
    <div class="page" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111647-548896.jpg)` }">
        <div class="module">
            <div class="title">{{ info.name }}</div>
            <div class="region">{{ info.region }}</div>
            <div class="star_row">
                <div class="li">
                    <div class="left">丝滑程度</div>
                    <div class="right"><uni-rate v-model="info.smooth" size="18" readonly /></div>
                </div>
                <div class="li">
                    <div class="left">便利程度</div>
                    <div class="right"><uni-rate v-model="info.convenience" size="18" readonly /></div>
                </div>
                <div class="li">
                    <div class="left">综合评分</div>
                    <div class="right"><uni-rate v-model="info.star" size="18" readonly /></div>
                </div>
            </div>
            <div class="flag" v-if="litMaps.includes(info.id)" @click="setLightMap">
                <image src="/static/images/6.png" />
            </div>
            <div class="flag" @click="setLightMap" v-else>
                <image src="/static/images/5.png" />
            </div>
        </div>
        <div class="module" v-if="info.description || info.description_imgs">
            <div class="tit">路线介绍</div>
            <div class="content" v-if="info.description">{{ info.description }}</div>
            <div class="imgs" v-if="info.description_imgs.length">
                <image v-for="item, index in info.description_imgs" :key="index" :src="item" @click="prevImg(item)" />
            </div>
            <parseMap :kmlContent="kmlContent" />
        </div>
        <button type="primary" size="large" class="road_file" v-if="info.road_file"
            @click="downloadRoadFile">路书下载</button>
    </div>

</template>
<script setup>
import { getMapListApi, setLightMapApi } from '../../services';
import { onLoad } from '@dcloudio/uni-app';
import { checkLogin } from '@/common/hooks'
import { useUserStore } from '../../stores';
import parseMap from './components/parseMap.vue';
import { ref, reactive, computed } from 'vue';
import { shareCofig } from '@/utils/share'
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
onShareAppMessage(() => shareCofig)
onShareTimeline(() => shareCofig)

const userStore = useUserStore()
const litMaps = computed(() => userStore?.profile?.lit_map || [])
const info = reactive({ id: '' })
const kmlContent = ref('')
let tempFilePath = ''
const getInfo = async () => {
    const res = await getMapListApi({ id: info.id })
    Object.keys(res.data[0]).forEach(key => {
        info[key] = res.data[0][key]
    })
    info.description_imgs = res.data[0]?.description_imgs || []
    if (info.road_file) loadFile()
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

const loadFile = () => {
    wx.downloadFile({
        url: info.road_file,
        success(res) {
            tempFilePath = res.tempFilePath
            readFileContent(tempFilePath)
        },
        fail(err) {
            console.error('文件下载失败:', err);
            wx.showToast({
                title: '文件下载失败',
                icon: 'none'
            })

        }
    });

}
const downloadRoadFile = async () => {
    wx.saveFile({
        tempFilePath,
        success(saveRes) {
            uni.showModal({
                title: '提示',
                content: '文件已保存到本地,路径为' + saveRes.savedFilePath,
                showCancel: false,
            })
        },
        fail(err) {
            console.error('文件保存失败:', err);
        }
    });
}
const setLightMap = async () => {
    if (!await checkLogin()) return
    const { code } = await setLightMapApi({ id: info.id })
    if (code == 200) {
        let lit_map = userStore?.profile?.lit_map
        if (lit_map.includes(info.id)) {
            lit_map = lit_map.filter(item => item != info.id)
        } else {
            lit_map.push(info.id)
            uni.showModal({
                title: '恭喜你',
                content: '又点亮一条路线，再接再励!',
                showCancel: false
            })
        }
        userStore.setProfile({ lit_map })
    }
}
const prevImg = (url) => {
    uni.previewImage({
        urls: info.description_imgs,
        current: url
    })
}
onLoad((opt) => {
    info.id = Number(opt.id)
    getInfo()
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
    }
}


.con {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    padding-left: 20rpx;
    padding-top: 20rpx;

}

.module {
    width: calc(100vw - 40rpx);
    background-color: rgba($color: #fff, $alpha: .9);
    border-radius: 20rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    padding: 15rpx 25rpx;
    position: relative;
    z-index: 3;
}

.title {
    font-size: 36rpx;
    margin-bottom: 15rpx;
    font-weight: bold;
}

.region {
    font-size: 26rpx;
    margin-bottom: 10rpx;
    color: #666;
}

.star_row {
    .li {
        display: flex;
        height: 50rpx;
        align-items: center;

        .left {
            color: #666;
            font-size: 26rpx;
            width: 140rpx;
        }
    }

}

.road_file {
    position: relative;
    z-index: 3;
    margin: 20rpx auto 0;
    width: 80%;
    background-color: #1677ff;
    border-radius: 50rpx;
}

.tit {
    font-size: 30rpx;
    color: #666;
}

.content {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #000;
    line-height: 1.6;
}

.imgs {
    margin-top: 20rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15rpx;
    margin-top: 10rpx;

    image {
        width: 100%;
        border-radius: 14rpx;
        height: 180rpx;
    }
}

.flag {
    position: absolute;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 1px solid rgba($color: #666, $alpha: .1);
    top: 10rpx;
    right: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
        display: block;

        width: 80%;
        height: 80%;

    }

}

/* 
["https://ccl-resource.kaisir.cn/ccl-20250116152150-908554.png","https://ccl-resource.kaisir.cn/ccl-20250116152150-908554.png","https://ccl-resource.kaisir.cn/ccl-20250116152150-908554.png","https://ccl-resource.kaisir.cn/ccl-20250116152150-908554.png","https://ccl-resource.kaisir.cn/ccl-20250116152150-908554.png"]
*/
/* 
INSERT INTO `ldp_database`.`users` (`id`, `nickname`, `password`, `avatar_url`, `bio`, `created_at`, `account`, `gear_setup`, `height`, `weight`, `age`, `region`, `gear_setup_img`, `gender`, `openid`, `skate_mileage`, `honur_list`, `lit_map`) VALUES (33, '菜菜驴', NULL, 'https://ccl-resource.kaisir.cn/ccl-20250122101257-029540.jpg', NULL, '2025-01-21 13:20:35', NULL, '搜搜', NULL, NULL, NULL, '山西朔州', NULL, 0, 'orouA7ZQS-7OwNGQo8njKpYHKMiE', NULL, '[]', NULL);



*/
</style>