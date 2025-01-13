import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    const profile = ref()
    const setProfile = (val) => {
      console.log('setProfile',val);
      profile.value = val
    }
    const clearProfile = () => {
      profile.value = undefined
    }
    const isLogin = computed(() => {
      return !!profile.value
    })
    // 记得 return
    return {
      profile,
      isLogin,
      setProfile,
      clearProfile
    }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
