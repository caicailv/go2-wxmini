<template>
    <div class="con" v-if="paths.length">
        <map id="myMap" class="map" :latitude="centerLatitude" :longitude="centerLongitude" :markers="markers"
            :polyline="polylines" :controls="controls" @controltap="controlTap" :scale="16">
        </map>
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
        <div class="li" v-if="mileage">
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
const controls = ref([{
    id: 1,
    position: {
        left: 10, // 初始值，将在onReady中更新
        top: 10, // 500-40-30(考虑地图高度500rpx减去控件高度和边距)
        width: 40,
        height: 40
    },
    clickable: true,
    iconPath: '/static/images/10.png'
}]);



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
    getMyLocation()
};


const getMyLocation = () => {
    wx.getLocation({
        type: 'gcj02',
        success: (res) => {
            console.log('res', res);
            // centerLatitude.value = res.latitude;
            // centerLongitude.value = res.longitude;
            markers.value.push({
                id: 3,
                latitude: res.latitude,
                longitude: res.longitude,
                iconPath: '/static/images/11.png', // 当前位置图标
                width: 20,
                height: 20
            })

            console.log('markers.value', markers.value);
        },
        fail: (err) => {
            console.error('获取位置失败:', err);
        }
    });
};

const controlTap = () => {
    console.log('controlTap');
    wx.getLocation({
        type: 'gcj02',
        success: (res) => {
            centerLatitude.value = res.latitude;
            centerLongitude.value = res.longitude;

            // 更新地图视野
            const mpInstance = instance.proxy.$scope
            const mapContext = wx.createMapContext('myMap', mpInstance);
            mapContext.moveToLocation({
                latitude: res.latitude,
                longitude: res.longitude
            });
        },
        fail: (err) => {
            console.error('获取位置失败:', err);
        }
    });
};


const initKmlContent = (kmlContent) => {
    const result = parseKML(kmlContent);
    resultData.value = result.document;

    console.log('resultData.value', resultData.value);
    console.log(JSON.stringify(resultData.value, null, 2));
    // console.log('kmlContent', kmlContent);
    paths.value = [];
    polylines.value = [];
    if (!result.document.folders) return wx.showToast({ title: '未采集到paths', icon: 'none' })
    const folders = result.document.folders;
    const placemarks = folders.filter(folder => folder.id === 'TbuluLineStringFolder' || folder.id === "TbuluTrackFolder")?.[0]?.placemarks;
    if (!placemarks || placemarks.length === 0) return wx.showToast({ title: '未采集到paths1', icon: 'none' })
    console.log('placemarks', placemarks);
    placemarks.forEach((placemark, index) => {
        if (placemark.geometry && placemark.geometry.coordinates &&
            Array.isArray(placemark.geometry.coordinates)) {
            // 保留更多精度的坐标点
            const preciseCoordinates = placemark.geometry.coordinates.map(coord => ({
                latitude: coord.latitude,
                longitude: coord.longitude
            }));

            paths.value = [...paths.value, ...preciseCoordinates];

            // 为每条轨迹添加更多配置
            polylines.value.push({
                points: preciseCoordinates,
                color: '#FF0000',
                width: 2,
            });
        }
    });
    if (paths.value.length > 0) drawPolyline(paths.value);
    return
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