import { request, PostWS } from './http';
import { useUserStateStore, useRouteStateStore } from '../store/modules/userState';

/**
 * 用户登录
 * @param code 微信授权凭证
 * @param encryptedData 微信加密字符串
 * @param iv 微信解密字符串
 * @returns 
 */
export function Login(code: string, encryptedData: string, iv: string) {
    return request('/wxxcx/xcx_userinfo', {
        code,
        encryptedData,
        iv,
        type: 2//1-医生身份 2-患者身份
    });
}

/**
 * 绑定手机号到当前微信账号
 * @param phone 手机号
 * @param authcode 验证码
 * @returns 
 */
export function BindPhone(phone: string, authcode: string) {
    const userStore = useUserStateStore();
    return request('/authcode/send', {
        openid: userStore.userInfo.openid,
        unionid: userStore.userInfo.unionid,
        phone, authcode
    }, true);
}

/**
 * 获取省市区数据
 */
export function GetAreaInfo() {
    return PostWS('AREA_3LEVEL_ALL', {
        rebuild_cache: 0
    }, 'igc_base.area_pub');
}