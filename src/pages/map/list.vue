<template>
    <div class="page" :style="{ backgroundImage: `url(https://ccl-resource.kaisir.cn/ccl-20250120111647-548896.jpg)` }">
        <div class="map-list">
            <div v-for="item, index in list" :key="index" class="item">
                <MapItem :dataSource="item" />
            </div>
        </div>
        <button class="edit_btn" :disabled="saveDisabled" type="primary" size="large" @click="toEditMap">新增地图</button>

    </div>


</template>
<script setup>
import MapItem from './mapItem.vue';
import { ref } from 'vue';
import { checkLogin } from '@/common/hooks'
import { getMapListApi } from '@/services';
import { onShow } from '@dcloudio/uni-app';
import {shareCofig} from '@/utils/share'
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
onShareAppMessage(()=>shareCofig)
onShareTimeline(()=>shareCofig)

const getMapList = async () => {
    const res = await getMapListApi()
    list.value = res.data
}
const list = ref([])
const toEditMap = async () => {
    if (!await checkLogin()) return
    uni.navigateTo({
        url: '/pages/map/edit'
    })
}
onShow(() => {
    getMapList()
})
</script>

<style lang="scss" scoped>
.page {
    background-position: center;
    background-size: 100% 100%;
    height: 100vh;
    padding-top: 20rpx;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba($color: #fff, $alpha: .5);

    }
}

.map-list {
    padding: relative;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20rpx;
    $item-colors: #FFB6C1, #FFD700, #90EE90, #ADD8E6, #FF6347, #9370DB, #FFC0CB, #FFA500;

    .item {
        width: calc((100% - 10px)/ 2);
        box-shadow: 0 3px 27px 0 rgba(0, 0, 0, 0.05);
        border-radius: 20rpx;
        padding: 10rpx;
        margin-bottom: 25rpx;
        position: relative;
        z-index: 3;

        @for $i from 1 through length($item-colors) {
            &:nth-child(#{$i}n) {
                background-color: nth($item-colors, $i);
            }
        }
    }

}

.edit_btn {
    margin: 20rpx auto 0;
    width: 80%;
    background-color: #1677ff;
    border-radius: 50rpx;
    position: relative;
    z-index: 2;
}
</style>