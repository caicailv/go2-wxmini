<template>
    <div class="label" :style="{ backgroundColor: label.color }"> 
        
        <!-- {{ label?.label }} -->
          {{ props.skateMileage }}km
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
    { num: 20, label: '买了块板', color: 'gray' },
    { num: 100, label: '刷街新星', color: 'blue' },
    { num: 500, label: '炮灰', color: 'green' },
    { num: 1000, label: '卷王', color: 'gold' },
]
const label = computed(() => {
    return labelList.find(item => props.skateMileage >= item.num)
})


</script>

<style lang="scss" scoped>
/* 
backgroundColor: labelInfo.color,padding: '0.1rem 0.2rem', borderRadius: '0.2rem', fontSize: '12px',display:'flex',
            justifyContent: 'center',alignItems: 'center'
*/
.label {
    background-color: #1677ff;
    padding: 2rpx 8rpx;
    border-radius: 5rpx;
    font-size: 18rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-left:  10rpx;

}
</style>