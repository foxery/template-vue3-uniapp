<template>
	<div>
		<div v-if="showList" class="align-middle">
			<div class="relative example-img" v-for="(item, index) in files" :key="item">
				<image mode="aspectFill" :src="item" @click="onPreview(files, index)"></image>
				<image mode="aspectFill" class="delete-icn" src="/static/img/icn_del.png" @click="deleteImg(index)">
				</image>
			</div>
		</div>
		<div class="align-middle" @click="chooseImage" v-if="files && files.length < max">
			<slot>
				<image class="upload-img" mode="aspectFill" src="/static/img/icn_photo.png"></image>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
	CompareVersion
} from '@/util/common';
import config from '@/util/env';
import { useUserStateStore } from '@/store/modules/userState';

const props = defineProps({
	max: {
		type: Number,
		default: 1,
	},
	showList: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emits = defineEmits(['uploaded', 'deleted']);

const userStore = useUserStateStore();

const files = ref([]);//完整的远程图片地址
const photoIds = ref([]);//远程图片id

// 图片预览
const onPreview = (imgs, i) => {
	uni.previewImage({
		urls: imgs,
		current: i
	});
}

// 选择图片
const chooseImage = (e) => {
	if (props.disabled) {
		return;
	}
	const version = uni.getSystemInfoSync().SDKVersion;
	let i = 0; // 多图上传时使用到的index
	let imgFilePaths = []; //图片的本地临时文件路径列表

	if (CompareVersion(version, '2.21.0') >= 0) {
		uni.chooseMedia({
			count: props.max || 1,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			camera: 'back',
			success(res) {
				res.tempFiles.forEach(val => {
					imgFilePaths.push(val.tempFilePath);
				});
				if (res.tempFiles.length + files.value.length > props.max) {
					uni.showToast({
						title: `图片最多只能选择${props.max}张`,
						icon: 'none'
					});
					return false;
				}
				upLoad(imgFilePaths, i, res.tempFiles.length);
			}
		})
	} else {
		uni.chooseImage({
			count: props.max || 1, //一次最多可以选择的图片张数
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {

				imgFilePaths = res.tempFilePaths;
				if (res.tempFiles.length + files.value.length > props.max) {
					uni.showToast({
						title: `图片最多只能选择${props.max}张`,
						icon: 'none'
					});
					return false;
				}
				/**
				 * 上传完成后把文件上传到服务器
				 */
				upLoad(imgFilePaths, i, res.tempFiles.length); //上传操作
			},
			fail: function () { },
			complete: function () { },
		});
	}
}

// 上传图片到服务器
const upLoad = (imgPath, i, upLength) => {
	let me = this;
	uni.showLoading({
		title: '上传中...',
	});
	//上传文件
	uni.uploadFile({
		url: config.VUE_APP_API_URL + '/upload/photo',
		filePath: imgPath[i],
		name: 'upload_file',
		header: {
			'Content-Type': 'multipart/form-data',
			version: `frontend,user,9.9.9`,
			token: userStore.userInfo.token,
			'Mp-Origin': 'cloud_user_wx',
		},
		success: function (res) {
			let imgData = JSON.parse(res.data);
			photoIds.value.push(imgData.data);
			files.value.push(config.VUE_APP_STATIC_URL + imgData.url);
			emits('uploaded');
		},
		fail: function (res) {
			uni.hideLoading();
			uni.showModal({
				title: '错误提示',
				content: '上传图片失败',
				showCancel: false,
				success: function (res) { },
			});
		},
		complete: function () {
			i++;
			if (i == upLength) {
				uni.hideLoading(); //上传结束，隐藏loading
			} else {
				upLoad(imgPath, i, upLength);
			}
		},
	});
}

// 删除图片
const deleteImg = (index: number) => {
	files.value.splice(index, 1);
	photoIds.value.splice(index, 1);
	emits('deleted', index);
}

const setFiles = (files, photoIds) => {
	files.value = files;
	photoIds.value = photoIds;
}

const getFiles = () => {
	return {
		files: files.value,
		photoIds: photoIds.value
	}
}

defineExpose({
	setFiles, getFiles
});

</script>

<style lang="scss" scoped>
.upload-img {
	width: 70px;
	height: 70px;
}

.example-img {
	display: inline-block;
	width: 70px;
	height: 70px;
	margin-right: 10px;

	image {
		width: 100%;
		height: 100%;
	}

	.delete-icn {
		position: absolute;
		z-index: 10;
		width: 18px;
		height: 18px;
		top: -4px;
		right: -4px;
	}
}
</style>
