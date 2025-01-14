/**
 * 添加拦截器:
 *   拦截 request 请求
 *   拦截 uploadFile 文件上传
 *
 * TODO:
 *   1. 非 http 开头需拼接地址
 *   2. 请求超时
 *   3. 添加小程序端请求头标识
 *   4. 添加 token 请求头标识
 */

import { API_URL } from "@/global/global.json";
import { useUserStore } from "@/stores";

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith("http")) {
      options.url = API_URL + options.url;
    }
    const userStore = useUserStore()
    options.header = {
      ...options.header,
      "Authorization": userStore?.profile?.openid||'',
    }
    options.timeout = 60000;
   
  },
};
uni.addInterceptor("request", httpInterceptor);
uni.addInterceptor("uploadFile", httpInterceptor);

export const http = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        console.log('request',res);
        // if (!!res.data.code && res.data.code !== 200) {
        //   if (res.data.code === 301) {
        //     uni.showToast({
        //       icon: "none",
        //       title: "请登录后查询更多信息",
        //     })
        //     // const memberStore = useMemberStore();
        //     // memberStore.clearProfile();
        //     // uni.navigateTo({ url: "/pages/login/login" });
        //     reject(res);
        //     return;
        //   }

        //   if (res.data.code == 302) {
        //     // 引导开通vip
        //     const memberStore = useMemberStore();
        //     memberStore.setGuidedVipVisible(true);
        //     return;
        //   }
        //   if (res.data.code == 303) {
        //     // 引导开通vip
        //     return;
        //   }
        //   uni.showToast({
        //     icon: "none",
        //     title: res.data.msg || "请求错误",
        //   });
        //   return reject(res);
        // }
        // if(res.data.toPage){
        //   res.data?.msg && uni.showToast({
        //     icon: "none",
        //     title: res.data.msg 
        //   });
        //   setTimeout(() => {
        //     uni.navigateTo({ url:res.data.toPage });
        //   }, 1000);
        //   return 
        // }

        resolve(res.data);
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: "none",
          title: "网络错误，换个网络试试",
        });
        reject(err);
      },
    });
  });
};

export const uploadFile = (tempFilePath,options={}) => {
  wx.uploadFile({
    url: API_URL+'/uploadImage', // 后台上传接口
    filePath: tempFilePath,
    name: "file", // 后台接收的字段名
    formData: options,
    success(res) {
      const data = JSON.parse(res.data);
      console.log('uploadFile',data);
      if (data.code === 200) {
        wx.showToast({
          title: "发送成功",
        });
      } else {
        wx.showToast({
          title: "发送失败",
          icon: "none",
        });
      }
    },
    fail(err) {
      wx.showToast({
        title: "上传失败",
        icon: "none",
      });
    },
  });
};
