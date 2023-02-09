import {
	Json2Form
} from "./common";
import { ref } from 'vue';
import { onLoad } from "@dcloudio/uni-app";

export const CommonMixins = () => {
	const GLOBAL_UrlParams = ref();

	onLoad((option) => {
		GLOBAL_UrlParams.value = option;
	})


	/**
	 * RouterPush 路由前进
	 * @param  url 绝对路径
	 * @param data 路由参数
	 */
	const RouterPush = (url: string, data?: object) => {
		let params = data ? `?${Json2Form(data)}` : ``;
		uni.navigateTo({
			url: `${url}${params}`
		});
	}

	/**
	 * RouterBack 路由后退
	 * @param  delta 后退几页
	 * 如果大于 pages 页数，则返回首页
	 */
	const RouterBack = (delta = 1) => {
		if (delta <= 0) {
			// 返回首页
			delta = 999
		}
		uni.navigateBack({
			delta: delta
		});
	}

	/**
	 * 关闭当前页面，跳转到应用内的某个页面。
	 * @param  url 绝对路径
	 * @param  data 路由参数
	 */
	const RouterRedirectTo = (url: string, data?: object) => {
		let params = data ? `?${Json2Form(data)}` : ``;
		uni.redirectTo({
			url: `${url}${params}`,
		});
	}

	/**
	 * 获取当前路由
	 */
	const GetCurrentRoute = () => {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let curRoute = routes[routes.length - 1].$page.fullPath // 获取当前页面路由，也就是最后一个打开的页面路由
		return curRoute;
	}

	return {
		GLOBAL_UrlParams, RouterPush, RouterBack, RouterRedirectTo
	}
}
