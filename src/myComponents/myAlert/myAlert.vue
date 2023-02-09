<template>
    <uni-popup ref="popup" type="center" :mask-click="maskClose" @maskClick="emits('cancel')">
        <div class="my-popup-content">
            <div class="title">{{ title }}</div>
            <div class="desc" v-if="contentHtml" v-html="contentHtml"></div>
            <div class="desc" v-else>{{ content }}</div>
            <uni-row :gutter="8">
                <uni-col :span="12" v-if="type == 'confirm'">
                    <button class="btn-size_default btn-style_plain btn-block"
                        @click="onCancel">{{ cancelText }}</button>
                </uni-col>
                <uni-col :span="type == 'confirm' ? 12 : 24">
                    <button class="btn-size_default btn-style_primay btn-block"
                        @click="onConfirm">{{ confirmText }}</button>
                </uni-col>
            </uni-row>
        </div>
    </uni-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'alert',//alert confirm
    },
    title: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    contentHtml: {
        type: String,
        default: '',
    },
    confirmText: {
        type: String,
        default: '我知道了',
    },
    cancelText: {
        type: String,
        default: '取消',
    },
    maskClose: {
        type: Boolean,
        default: true
    }
});

const emits = defineEmits(['confirm', 'cancel']);

const popup = ref();

const onConfirm = () => {
    popup.value.close();
    emits('confirm');
}

const onCancel = () => {
    popup.value.close();
    emits('cancel');
}

const show = () => {
    popup.value.open();
}

defineExpose({
    show
});

</script>

<style lang="scss" scoped>
.my-popup-content {
    background-color: #FFFFFF;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    width: 300px;
    box-sizing: border-box;

    .title {
        color: #222222;
        font-size: 18px;
        font-weight: $uni-text-bold;
        margin-top: 24px;
    }

    .desc {
        color: #666666;
        font-size: 14px;
        margin-top: 8px;
        margin-bottom: 24px;
    }
}
</style>
