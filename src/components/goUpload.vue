<template>
    <div @click="uploadImage">
        <div class="default">
            <uniIcons type="images" size="40" />
        </div>

    </div>
</template>
<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { uploadFile } from '@/utils/http'
const props = defineProps(['count'])
const emit = defineEmits(['success'])
const uploadImage = async () => {
    const res = await wx.chooseImage({
        count: props.count || 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
    })
    const uploadPromises = res.tempFilePaths.map(path => uploadFile(path));
    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults.map(result => result.url);
    emit('success', urls);    
}
</script>
<style lang="scss" scoped>
.default{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
    min-height: 180rpx;
    border-radius: 14rpx;
}
</style>
