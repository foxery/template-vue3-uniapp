<template>
    <uni-popup ref="popup" type="bottom" :mask-click="maskClose" @maskClick="emits('cancel')">
        <div class="my-popup-title">
            <span>感谢方式</span>
            <uni-icons type="closeempty" size="15" color="#999" class="icn" @click="onCancel"></uni-icons>
        </div>
        <div class="my-popup-content">
            <div class="thanks-item" @click="toWriteLetterPage">
                <uni-icons type="right" size="15" color="#999" class="icn-arrow"></uni-icons>
                <uni-row :gutter="16">
                    <uni-col :span="3">
                        <img src="/static/img/icn_letter.png" alt="" class="icn" mode="widthFix" />
                    </uni-col>
                    <uni-col :span="21">
                        <div class="title">写感谢信</div>
                        <div>写下就医经历，帮助更多病友找到该医生</div>
                    </uni-col>
                </uni-row>
            </div>
            <div class="thanks-item" @click="toSendingPennantsPage">
                <uni-icons type="right" size="15" color="#999" class="icn-arrow"></uni-icons>
                <uni-row :gutter="16">
                    <uni-col :span="3">
                        <img src="/static/img/icn_flag.png" alt="" class="icn" mode="widthFix" />
                    </uni-col>
                    <uni-col :span="21">
                        <div class="title">送锦旗</div>
                        <div>以旗传恩，支持实物锦旗/电子锦旗</div>
                    </uni-col>
                </uni-row>
            </div>
        </div>
    </uni-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
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

// 前往写感谢信页面
const toWriteLetterPage = () => {
    // todo
}

// 前往送锦旗页面
const toSendingPennantsPage = () => {
    // todo
}

defineExpose({
    show
});

</script>

<style lang="scss" scoped>
.my-popup-title {
    background-color: #FFFFFF;
    padding: 16px;
    text-align: center;
    color: #7b7b7b;
    font-size: 14px;
    border-bottom: 1px solid $uni-border-color;
    position: relative;

    .icn {
        position: absolute;
        right: 16px;
        top: 16px;
    }
}

.my-popup-content {
    background-color: #FFFFFF;
    box-sizing: border-box;

    .icn {
        width: 30px;
        margin-top: 6px;
    }

    .thanks-item {
        padding: 16px;
        font-size: 14px;
        color: #7b7b7b;
        position: relative;

        .title {
            color: $uni-text-color;
            font-weight: $uni-text-bold;
            font-size: 16px;
            margin-bottom: 6px;
        }

        .icn-arrow {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
        }

        +.thanks-item {
            border-top: 1px solid $uni-border-color;
        }
    }
}
</style>
