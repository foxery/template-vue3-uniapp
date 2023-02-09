import Vue from 'vue';
import { useUserStateStore, useRouteStateStore } from '../store/modules/userState';
import { CommonMixins } from '../util/mixins';
import config from '../util/env';
import requestHandler from '../util/ws/requestHandler.js'; // 加密请求插件
import axios from 'axios';

const userStore = useUserStateStore();

// 加密插件参数配置
const requestHandlerConfig = {
    _AK: 6,
    _SK: '',
    _SK_dev: '',
    env: process.env.NODE_ENV,
    token: userStore.userInfo.token || '',
};
Object.assign(requestHandler, requestHandlerConfig);

/**
 * 接口请求封装
 * @param url：请求地址 含完整域名
 * @param data：请求参数
 * @param level：解除data数据的层级：0（取data)）;1（取data.data）;2（无status判断，取data）默认取1
 * @param loading：是否显示loading
 * @param errStatus 需要特殊处理的错误状态
 * @param prefix 远程请求域名
 */
export function request(url: string, data: object, loading = false, level = 1, errStatus = [], prefix = '', header = {}, method = "POST") {
    console.log('request', url, config)
    return new Promise((resolve, reject) => {
        // 遮罩，默认不显示loading
        if (loading) {
            // loading
            uni.showLoading({
                title: '加载中'
            });
        }
        const headers = _buildHeaders(header);

        uni.request({
            url: (prefix || config.VUE_APP_API_URL) + url,
            data: data,
            header: headers,
            method: method,
            success: (res) => {
                console.log('success', res)
                _analysisSuccess(res, level, errStatus, reject, resolve)
            },
            fail: (res) => {
                console.log('fail', res)
                _analysisFail(res, reject)
            },
            complete: (res) => {
                console.log('complete', res)
                if (loading) {
                    // 停止loading
                    uni.hideLoading();
                }
            }
        })
    })
}

/**
 * ws服务的post请求
 * @param url 请求接口
 * @param data 请求参数
 * @param packageName 包名
 * @param errStatus [可选]需要特殊处理的异常状态值,例：'-99'
 * @param redirectUrl [可选]跳转授权页后需要跳转回的页面，默认是当前页面
 */
export function PostWS(url: string, data: any, packageName: string, errStatus?: string, redirectUrl?: string) {
    let tempData = {
        did: 0,
        package: packageName,
        class: url,
        ...data
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: config.VUE_APP_API_WS_URL,
            data: requestHandler.getHeaderAndBody(tempData).encryptedBody,
            header: requestHandler.getHeaderAndBody(tempData).headers,
            method: "POST",
            success: (res) => {
                const decryptedRes = JSON.parse(requestHandler.decryptByAES(res.data));
                _successWS(decryptedRes, resolve, reject, errStatus, redirectUrl);
                if (process.env.NODE_ENV !== 'production') {
                    // 日志输出
                    console.groupCollapsed('请求success：' + url);
                    console.info('header：\n', requestHandler.getHeaderAndBody(tempData).headers);
                    console.info('requestbody：\n', tempData);
                    console.info('res：\n', decryptedRes);
                    console.groupEnd();
                    // 日志结束
                }
            },
            fail: (res) => {
                uni.showToast({
                    icon: 'none',
                    title: "网络不稳定，请切换网络再试试",
                    duration: 2000
                });
                reject('error', res);
            },
            complete: (res) => {
            }
        });
    });
}


/**
 * 文件上传请求封装
 * @param  url 		必传 请求地址
 * @param  data 	非必传 额外请求参数
 * @param  filePath 必传 要上传文件资源的路径 
 * @param  fileType 非必传 文件类型，image/video/audio
 * @param  fileName 非必传 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
 * @param  loading 	非必传 是否显示loading框，默认false 
 * @param  header 	非必传 请求头信息
 */
export function uploadFileForPath(url: string, data: any, filePath: string, fileType: string, fileName = 'file', loading = false, errStatus = [], header = {},
) {
    return new Promise((resolve, reject) => {
        // 遮罩，默认不显示loading
        if (loading) {
            // loading
            uni.showLoading({
                title: '加载中'
            });
        }
        const headers = _buildHeaders(header)
        uni.uploadFile({
            url: url,
            filePath: filePath,
            name: fileName,
            // #ifdef MP-ALIPAY
            fileType: fileType,
            // #endif
            formData: data,
            header: headers,
            success: (res) => {
                _analysisSuccess(res, 1, errStatus, reject, resolve)
            },
            fail: (res) => {
                _analysisFail(res, reject)
            },
            complete: (res) => {
                if (loading) {
                    // 停止loading
                    uni.hideLoading();
                }
            }
        })
    })
}

/* ------------------------构建请求数据---------------------- */
function _buildHeaders(header = {}) {
    console.log('_buildHeaders')
    const headers = header;
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    headers["version"] = ``;
    headers["token"] = userStore.userInfo.token || '';
    // #ifdef MP-WEIXIN
    headers["mp-origin"] = "";
    // #endif
    return headers;
}


/* ------------------------解析回调数据---------------------- */
function _analysisSuccess(res, level, errStatus, reject, resolve) {
    let data = null
    if (res.statusCode === 200) {
        if (typeof (res.data) == 'object') {
            data = res.data
        } else {
            data = JSON.parse(res.data)
        }
        if (level == 2) {
            resolve(data);
        } else {
            if (data.status == 1) {
                resolve(level == 0 ? data : data.data);
            } else if (data.status == -99) {
                // 需要登录
                login();
            } else {
                if (errStatus.indexOf(data.status) <= -1) {
                    uni.showToast({
                        icon: 'none',
                        title: data.msg || "出错了",
                        duration: 2000
                    });
                }
                reject(data);
            }
        }
    } else {
        uni.showToast({
            icon: 'none',
            title: "网络错误",
            duration: 2000
        });
        reject(res)
    }

}

function _analysisFail(res, reject) {
    // 区分下网络问题 和 业务问题
    reject(res)
}

function login() {
    let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
    let curRoute = routes[routes.length - 1].$page.fullPath // 获取当前页面路由，也就是最后一个打开的页面路由
    const routeStore = useRouteStateStore();
    // @ts-ignore
    routeStore.setLastRoute(curRoute);
    console.log('curRoute', curRoute);
    let { RouterPush } = CommonMixins();
    RouterPush("/pages/login/login");
}

function _successWS(res, resolve, reject, errStatus, redirectUrl) {
    if (res.status.code == "00000") {
        resolve(res.result);
    } else if (res.status.code == "800") {
        // 登录失效
        login();
    } else {
        if (errStatus != res.status.code) {
            uni.showToast({
                icon: 'none',
                title: res.status.msg || "抱歉，服务器异常",
                duration: 2000
            });
            reject(res);
        } else {
            reject(res);
        }
    }
}