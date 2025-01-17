<template>
    <div class="item" @click="toDetail">
        <div class="name">{{ dataSource.name }}
            <span class="distance">({{ dataSource.route_length }}km)</span>
        </div>
        <div class="city">{{ dataSource.region || '' }}</div>
        <uni-rate v-model="dataSource.star" size="12" readonly />
        <div class="flag" v-if="litMaps.includes(dataSource.id)">
            <image src="/static/images/6.png" />
        </div>

    </div>

</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../../stores';
const userStore = useUserStore()
const props = defineProps({ dataSource: {} });
const litMaps = computed(() => userStore?.profile?.lit_map || [])
const toDetail = () => {
    uni.navigateTo({
        url: `/pages/map/detail?id=${props.dataSource.id}`
    })
}
</script>
<style lang="scss" scoped>
.name {
    font-size: 26rpx;
    margin-bottom: 10rpx;

    .distance {
        font-size: 22rpx;
        padding-left: 5rpx;
    }
}

.city {
    font-size: 24rpx;
    margin-bottom: 10rpx;
    height: 30rpx;

}

.item {
    position: relative;

}

.flag {
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    top: 10rpx;
    right: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;

    image {
        display: block;

        width: 80%;
        height: 80%;

    }

}
</style>