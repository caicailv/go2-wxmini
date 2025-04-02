<template>
    <div class="row">
        <div class="label" :style="{ backgroundColor: label.color }"> {{ label?.label }} </div>
        <div class="mileage">{{ props.skateMileage }}km</div>
    </div>

</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
    skateMileage: {
        type: Number,
        default: 0,

    },
})
const labelList = [
    { num: 1, label: '斗之气', color: 'gray' },
    { num: 20, label: '斗者', color: 'gray' },
    { num: 100, label: '斗师', color: 'blue' },
    { num: 500, label: '斗王', color: 'green' },
    { num: 1000, label: '斗宗', color: 'gold' },
    { num: 3000, label: '斗尊', color: 'red' },
    { num: 6000, label: '斗圣', color: 'orange' },
    { num: 10000, label: '斗帝', color: '#315efb' },
]
const label = computed(() => {
    return labelList
        .filter(item => props.skateMileage >= item.num)  // 先过滤出符合条件的项
        .sort((a, b) => b.num - a.num)[0];  // 排序，确保取最高的 num
});

</script>

<style lang="scss" scoped>
/* 
backgroundColor: labelInfo.color,padding: '0.1rem 0.2rem', borderRadius: '0.2rem', fontSize: '12px',display:'flex',
            justifyContent: 'center',alignItems: 'center'
*/
.row {
    display: flex;
    align-items: center;
}

.mileage {
    margin-left: 10rpx;
    color: #999;
    font-size: 18rpx;

}

.label {
    background-color: #1677ff;
    padding: 2rpx 8rpx;
    border-radius: 5rpx;
    font-size: 18rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-left: 10rpx;

}
</style>