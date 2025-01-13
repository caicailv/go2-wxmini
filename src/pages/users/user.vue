<template>
    <div class="row p-10">
      <div class="head flex items-center">
        <div v-if="isMe" class="headpic">
          <!-- <UploadImgs
            :count="1"
            path="avatar"
            :onUploadSuccess="updateHeadPic"
          >
            <template v-if="info.avatar_url">
              <img
                class="w-60 h-60 overflow-hidden rounded-full"
                :src="info.avatar_url"
                alt=""
              />
            </template>
            <template v-else>
              <SmileFill class="w-60 h-60 overflow-hidden rounded-full" />
            </template>
          </UploadImgs> -->
        </div>
        <div v-else>
          <img
            v-if="info.avatar_url"
            class="w-60 h-60 overflow-hidden rounded-full"
            :src="info.avatar_url"
            alt=""
          />
          <!-- <SmileFill v-else class="w-60 h-60 overflow-hidden rounded-full" /> -->
        </div>
  
        <div class="nickname ml-20 text-20 flex items-center">
          {{ info.nickname }}
          <!-- <LabelTitle :info="info" /> -->
        </div>
      </div>
  
      <div class="title text-20 mt-20">基础信息</div>
  
      <div class="mt-10 ml-10">
        <BaseInfo :detail="info" />
      </div>
  
      <div v-if="isMe" class="mt-10 ml-10">
        <!-- <EditBaseInfo :onUpdate="() => getInfo(userId)" :detail="info" :userId="userId" /> -->
      </div>
  
      <!-- <Bio :info="info" :userId="userId" :isMe="isMe" :update="() => getInfo(userId)" /> -->
  
      <!-- <GearSetup
        :info="info"
        :userId="userId"
        :isMe="isMe"
        :update="() => getInfo(userId)"
      />
   -->
      <div v-if="info.mapScores?.length">
        <div class="title text-20 mt-20">个人成绩</div>
        <div class="ml-10">
          <!-- <Record :recordList="info.mapScores" /> -->
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  // import { Toast } from 'antd-mobile';
  // import { SmileFill } from 'antd-mobile-icons';
  // import UploadImgs from '@/components/uploadImgs.vue';
  // import Record from './components/record.vue';
  // import BaseInfo from './components/baseInfo.vue';
  // import EditBaseInfo from './components/editBaseInfo.vue';
  // import GearSetup from './components/gearSetup.vue';
  // import Bio from './components/bio.vue';
  // import LabelTitle from './components/labelTitle.vue';
  // import { openLoading, closeLoading, queryURLParams } from '@/utils';
  // import { findInfo, updateInfo } from '../api/api';
  
  const userId = ref('');
  const info = ref({});
  const bio = ref('');
  const gearSetup = ref('');
  const isMe = ref(false);
  
  const getInfo = async (id) => {
    // openLoading();
    // const { data } = await findInfo({ userId: id });
    // info.value = data;
    // closeLoading();
  };
  
  // const updateHeadPic = async (url) => {
  //   openLoading();
  //   await updateInfo({ avatar_url: url, userId: userId.value });
  //   closeLoading();
  //   getInfo(userId.value);
  // };
  
  const submitBio = async () => {
    if (!bio.value) {
      // Toast.show('请输入');
      return;
    }
    // openLoading();
    await updateInfo({ bio: bio.value, userId: userId.value });
    // closeLoading();
    getInfo(userId.value);
    bio.value = '';
  };
  
  const submitGearSetup = async () => {
    if (!gearSetup.value) {
      // Toast.show('请输入');
      return;
    }
    openLoading();
    await updateInfo({ gear_setup: gearSetup.value, userId: userId.value });
    closeLoading();
    getInfo(userId.value);
    gearSetup.value = '';
  };
  
  onMounted(() => {
    // const params = queryURLParams();
    // const uid = params.userId || localStorage.getItem('userId');
    // if (!params.userId) {
    //   isMe.value = true;
    // }
    // userId.value = uid;
    // getInfo(uid);
  });
  </script>
  
  <style lang="scss" scoped>
  .headpic {
    overflow: hidden;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .list_row {
    border: 1px solid #f0f0f0;
    .list_item {
      display: flex;
      height: 45px;
      font-size: 16px;
      align-items: center;
      padding: 0 10px;
      justify-content: space-between;
      padding-left: 20px;
      .list_item_left {
        & + .list_item_left {
          border-left: 1px solid #f0f0f0;
        }
      }
      & + .list_item {
        border-top: 1px solid #f0f0f0;
      }
    }
  }
  
  .edit_base_info {
    .li {
      display: flex;
      border: 1px solid #f0f0f0;
      margin-top: 10px;
      padding: 10px;
      .label {
        margin-right: 10px;
      }
    }
  }
  </style>
  