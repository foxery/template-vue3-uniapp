import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { UserInfo } from './userState.d';

// 登录数据
export const useUserStateStore = defineStore('userState', () => {
  const localUserInfoStr = uni.getStorageSync('userInfo');
  let localUserInfo = {};
  if (localUserInfoStr) {
    localUserInfo = JSON.parse(localUserInfoStr || '{}');
  }
  const userInfo = ref<UserInfo>(localUserInfo);
  function setUserInfo(val: UserInfo) {
    userInfo.value = val;
    uni.setStorageSync('userInfo', JSON.stringify(val));
  }

  return { userInfo, setUserInfo };
});

// 跳转登录前的路由
export const useRouteStateStore = defineStore('routeState', () => {
  const lastRoute = ref('');
  function setLastRoute(val: string) {
    lastRoute.value = val;
  }

  return { lastRoute, setLastRoute };
});