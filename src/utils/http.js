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
    const userStore = useUserStore();
    options.header = {
      ...options.header,
      Authorization: userStore?.profile?.openid || "",
    };
    options.timeout = 60000;
  },
};
uni.addInterceptor("request", httpInterceptor);
uni.addInterceptor("uploadFile", httpInterceptor);

export const http = (options) => {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
    uni.request({
      ...options,
      success(re) {
        const res = re.data;
        if (res.status === 500) {
          reject(res);
          return uni.showModal({
            icon: "none",
            title: `恭喜你发现彩蛋,请联系菜菜驴: ${res.msg || "请求错误"}`,
            showCancel: false,
          });
        }
        resolve(res);
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: "none",
          title: "网络错误，换个网络试试",
        });
        reject(err);
      },
      complete() {
        uni.hideLoading();
      },
    });
  });
};

export const uploadFile = (tempFilePath, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_URL + "/upload", // 后台上传接口
      filePath: tempFilePath,
      name: "file", // 后台接收的字段名
      formData: options,
      success(res) {
        const data = JSON.parse(res.data);
        resolve(data.data.data);
      },
      fail: reject,
    });
  });
};
