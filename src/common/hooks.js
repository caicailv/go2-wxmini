import { useUserStore } from "@/stores";

export const checkLogin = async () => {
  const userStore = useUserStore();
  if (!userStore.isLogin) {
    uni.showToast({
      title: "请先完善资料",
      icon: "none",
      mask: true,
    });
    await new Promise((res) => setTimeout(res, 1000));
    uni.navigateTo({
      url: "/pages/user/edit",
    });

    return false;
  }
  return true;
};
