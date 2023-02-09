<template>
    <uni-row :gutter="8">
        <uni-col :span="16">
            <uni-forms ref="form" :model="formData" :rules="rules">
                <uni-forms-item label="" name="code">
                    <uni-easyinput v-model="formData.code" maxlength="6" placeholder="验证码" type="number" trim="all" />
                </uni-forms-item>
            </uni-forms>
        </uni-col>
        <uni-col :span="8">
            <button class="btn-size_sm btn-style_primay btn-block" @click="onSend(0)" :disabled="codeBtnDisable">发送验证码
                <countdownOnlySecond ref="countdownOnlySecondDom" v-show="isSended" @finish="onCountdownFinish(0)">
                </countdownOnlySecond>
            </button>
        </uni-col>
    </uni-row>
    <div class="voice-wrapper" v-if="showVoice">
        <span>验证码收不到？</span>
        <span class="btn-link" @click="onSend(1)">使用语音验证
            <countdownOnlySecond ref="countdownVoiceOnlySecondDom" v-show="isVoiceSended"
                @finish="onCountdownFinish(1)"></countdownOnlySecond>
        </span>
    </div>
</template>
<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app';
import { ref, defineProps, defineEmits, computed, nextTick, watch, onMounted } from 'vue';
import { PhoneReg } from '@/util/reg';
import { SendCode } from '@/service/commonApi';
import countdownOnlySecond from '../countdownOnlySecond/index.vue';

const props = defineProps({
    phone: {
        type: String,
        default: '',
    }
});

watch(
    () => props.phone,
    (active, prevActive) => {
        if (PhoneReg.test(active)) {
            codeBtnDisable.value = false;
        } else {
            codeBtnDisable.value = true;
        }
    }
);

onMounted(() => {
    if (PhoneReg.test(props.phone)) {
        codeBtnDisable.value = false;
    } else {
        codeBtnDisable.value = true;
    }
})

const form = ref(null);
const formData = ref({
    code: ''
});
const countdownOnlySecondDom = ref(null);
const countdownVoiceOnlySecondDom = ref(null);
const codeBtnDisable = ref(true);

const rules = ref({
    code: {
        rules: [
            {
                required: true,
                errorMessage: '请输入验证码',
            },
            {
                validateFunction: function (rule, value, data, callback) {
                    if (value.length < 6) {
                        callback('请输入正确的验证码');
                    }
                    return true
                }
            }
        ]
    }
});

const isSended = ref(false);
const isVoiceSended = ref(false);
const showVoice = ref(false);

onReady(() => {
    console.log('onReady');
});

// 发送验证码
const onSend = (type: number) => {
    console.log('onSend', countdownOnlySecondDom.value);
    SendCode(props.phone, type).then(() => {
        if (type == 1) {
            isVoiceSended.value = true;
        } else {
            isSended.value = true;
            showVoice.value = true;
        }
        nextTick(() => {
            console.log('onSend2', countdownOnlySecondDom.value)
            if (type == 1) {
                countdownVoiceOnlySecondDom.value?.start();
            } else {
                countdownOnlySecondDom.value?.start();
            }
        });
    });
}
// 倒计时结束
const onCountdownFinish = (type: number) => {
    console.log('onCountdownFinish')
    if (type == 1) {
        isVoiceSended.value = false;
    } else {
        isSended.value = false;
    }
}

// 验证码提交
const onSubmit = () => {
    return new Promise((resolve, reject) => {
        if (!form.value) {
            reject();
        } else {
            form.value.validate().then(res => {
                console.log('表单数据信息：', res);
                resolve(res);
            }).catch(err => {
                console.log('表单错误信息：', err);
                reject(err);
            });
        }
    });
}

defineExpose({
    onSubmit
});

</script>
<style lang="scss" scoped>
.voice-wrapper {
    font-size: 13px;
    text-align: right;

    .btn-link {
        color: #2abaaf;
        text-decoration: underline;

        &.disbeld {
            color: #333;
        }
    }
}
</style>