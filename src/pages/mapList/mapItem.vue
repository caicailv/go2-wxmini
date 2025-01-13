<template>
    <div class="item">
        <div class="name">{{ dataSource.name }}
            <span class="distance">({{ dataSource.distance }}km)</span>
        </div>
        <div class="city">{{ dataSource.city }}</div>

        <uni-rate v-model="dataSource.star" size="12" readonly  />

    </div>

</template>

<script setup>
// const props = defineProps<{
//     dataSource: {
//         name: string;
//         distance: string;
//         city: string;
//         star: number;
//     };
// }>();
const props = defineProps({ dataSource: {} });
const rateChange = (value) => {
    console.log(value);
    props.dataSource.star = props.dataSource.star;
};
</script>
<style lang="scss" scoped>
.name {
    font-size: 26rpx;
    margin-bottom: 10rpx;
    .distance{
        font-size: 22rpx;
        padding-left: 5rpx;
    }
}
.city {
    font-size: 24rpx;
    margin-bottom: 10rpx;

}

</style>