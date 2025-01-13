<template>
    <div class="map-list">
        <div v-for="item, index in list" :key="index" class="item">
            <MapItem :dataSource="item" />
        </div>
    </div>
</template>
<script setup>
import MapItem from './mapItem.vue';
import { ref } from 'vue';
const list = ref([
    {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    },
    {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    }, {
        name: '前滩南墙',
        distance: '14',
        city: '上海',
        star: 4,
    },

])

</script>

<style lang="scss" scoped>
.map-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20rpx;
    // flex-direction: column;
    /* 
const colors = [
    '#FFB6C1',
    '#FFD700',
    '#90EE90',
    '#ADD8E6',
    '#FF6347',
    '#9370DB',
    '#FFC0CB',
    '#FFA500',
  ];
*/
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
</style>