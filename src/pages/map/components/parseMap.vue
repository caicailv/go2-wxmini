<template>
    <div class="con" v-if="paths.length">
        <map id="myMap" class="map" :latitude="centerLatitude" :longitude="centerLongitude" :markers="markers"
            :polyline="polylines"></map>
        <div class="li">
            <div class="left">创建人</div>
            <div class="right">{{ resultData?.extendedData?.CreaterName }}</div>
        </div>
        <div class="li">
            <div class="left">起点</div>
            <div class="right">{{ resultData?.extendedData?.PosStartName }}</div>
        </div>
        <div class="li">
            <div class="left">终点</div>
            <div class="right">{{ resultData?.extendedData?.PosEndName }}</div>
        </div>
        <div class="li">
            <div class="left">里程</div>
            <div class="right">{{ mileage }}km</div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import parseKML from './parseKML.js';
import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
const props = defineProps({
    kmlContent: String
});
const resultData = ref({})
const paths = ref([])  // 改为响应式数组
const polylines = ref([]); // 新增polylines响应式数组
const centerLatitude = ref(0);
const centerLongitude = ref(0);
const markers = ref([]);
const calculateCenter = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return { latitude: 0, longitude: 0 };
    let totalLatitude = 0;
    let totalLongitude = 0;
    coordinates.forEach(coord => {
        totalLatitude += coord.latitude;
        totalLongitude += coord.longitude;
    });

    return {
        latitude: totalLatitude / coordinates.length,
        longitude: totalLongitude / coordinates.length
    };
};
const mileage = computed(() => {
    let m = resultData.value?.extendedData?.Mileage || 0;
    let mi = Math.floor(m / 1000);
    return mi || 0
});
const drawPolyline = (paths) => {
    if (!paths || paths.length === 0) return;
    // 1. 计算中心点
    const center = calculateCenter(paths);
    centerLatitude.value = center.latitude;
    centerLongitude.value = center.longitude;

    // 2. 设置起点和终点标记
    markers.value = [
        {
            id: 1,
            latitude: paths[0].latitude,
            longitude: paths[0].longitude,
            iconPath: '/static/images/7.png', // 起点图标
            width: 30,
            height: 30
        },
        {
            id: 2,
            latitude: paths[paths.length - 1].latitude,
            longitude: paths[paths.length - 1].longitude,
            iconPath: '/static/images/8.png', // 起点图标
            width: 30,
            height: 30
        }
    ];

    // 4. 调整地图视野以包含所有路径点
    const mpInstance = instance.proxy.$scope
    const mapContext = wx.createMapContext('myMap', mpInstance);
    mapContext.includePoints({ points: paths, padding: [20, 20, 20, 20] });
};




const initKmlContent = (kmlContent) => {
    const result = parseKML(kmlContent);
    resultData.value = result.document;

    // 初始化空路径数组
    paths.value = [];
    polylines.value = [];

    // 获取所有placemarks的坐标
    if (result.document.folders && result.document.folders.length > 1 &&
        result.document.folders[1].placemarks &&
        result.document.folders[1].placemarks.length > 0) {

        // 遍历所有placemarks，为每个创建一条轨迹
        result.document.folders[1].placemarks.forEach((placemark, index) => {
            if (placemark.geometry && placemark.geometry.coordinates &&
                Array.isArray(placemark.geometry.coordinates)) {

                // 添加到总路径数组，用于计算中心点和边界
                paths.value = [...paths.value, ...placemark.geometry.coordinates];

                // 为每个placemark创建一条轨迹
                polylines.value.push({
                    points: placemark.geometry.coordinates,
                    color: '#FF0000', // 不同轨迹使用不同颜色
                    width: 4,
                    arrowLine: false
                });
            }
        });
    }

    if (paths.value.length > 0) {
        drawPolyline(paths.value);
    }
}

// 修改watch函数
watch(() => props.kmlContent, async (newVal) => {
    if (!newVal) {
        paths.value = []
        polylines.value = []
        return
    }
    initKmlContent(newVal);
});
</script>

<style scoped>
.con {
    margin-top: 20rpx;
}

.map {
    width: 100%;
    height: 500rpx;
    margin-bottom: 20rpx;
}

.p1 {
    font-size: 28rpx;
    font-weight: 500;
    margin-bottom: 10rpx;
    color: #666;
    margin-top: 32rpx;
}

.li {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #eee;
}

.left {
    flex: 0 0 160rpx;
    color: #666;
    font-size: 28rpx;
}

.right {
    flex: 1;
    color: #333;
    font-size: 28rpx;
    padding-left: 30rpx;
}
</style>