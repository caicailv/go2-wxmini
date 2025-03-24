<template>
    <div class="con">
        <map id="myMap" class="map" :latitude="centerLatitude" :longitude="centerLongitude" :markers="markers"
            :polyline="[{
                points: paths,
                color: '#FF0000',
                width: 4,
                arrowLine: false
            }]" include-points></map>
        <!-- scale="14" -->
        <div class="p1">解析结果:</div>
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
    </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import parseKML from './parseKML.js';
import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
const props = defineProps({
    tempFilePath: String
});
const resultData = ref({})
let paths = []
const centerLatitude = ref(0);
const centerLongitude = ref(0);
const markers = ref([]);
let mapContext = null;

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
            // iconPath: '/static/start.png', // 起点图标
            width: 30,
            height: 30
        },
        {
            id: 2,
            latitude: paths[paths.length - 1].latitude,
            longitude: paths[paths.length - 1].longitude,
            // iconPath: '/static/end.png',   // 终点图标
            width: 30,
            height: 30
        }
    ];

    console.log('aaa', 'bbb');

    console.log('this', this);
    // 4. 调整地图视野以包含所有路径点
    const mpInstance = instance.proxy.$scope
    const mapContext = wx.createMapContext('myMap', mpInstance);
    mapContext.includePoints({
        points: paths,          // 传入路径点数组
        padding: [0, 0, 0, 0],             // 边距（单位：px）
        success: () => {
            console.log('调整视野成功');
        },
        fail: (err) => {
            console.log('调整视野失败', err);
        },
        complete: () => {
            console.log('调整视野完成');
        }
    });
};
const initKmlContent = (kmlContent) => {

    const result = parseKML(kmlContent);
    // console.log('result', result);
    resultData.value = result.document;
    paths = result.document.folders[1].placemarks[0].geometry.coordinates
    // console.log('paths', JSON.stringify(paths));
    // console.log('paths', JSON.stringify(paths, null, 2));
    drawPolyline(paths);


}


watch(() => props.tempFilePath, async (newVal) => {
    if (!newVal) return
    const kmlContent = uni.getStorageSync('kmlContent');
    if (!kmlContent) return
    initKmlContent(kmlContent);


});
onReady(() => {
    const kmlContent = uni.getStorageSync('kmlContent');
    if (kmlContent) initKmlContent(kmlContent);
})
</script>

<style scoped>
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