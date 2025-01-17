<template>
    <div class="map-list">
        <div v-for="item, index in list" :key="index" class="item">
            <MapItem :dataSource="item" />
        </div>
    </div>
    <button class="edit_btn" :disabled="saveDisabled" type="primary" size="large" @click="toEditMap">新增地图</button>
</template>
<script setup>
import MapItem from './mapItem.vue';
import { ref } from 'vue';
import { checkLogin } from '@/common/hooks'
import { getMapListApi } from '@/services';
import { onShow } from '@dcloudio/uni-app';
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
.map-list {
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
}
</style>