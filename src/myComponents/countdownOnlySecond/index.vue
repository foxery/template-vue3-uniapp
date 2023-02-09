<template>
    {{ second }}s
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
const emits = defineEmits(['finish']);

const second = ref(60);

// 倒计时
const countdown = () => {
    setTimeout(() => {
        if (second.value <= 0) {
            console.log('finish')
            emits('finish');
        } else {
            second.value--;
            countdown();
        }
    }, 1000);
}

// 开始倒计时
const start = () => {
    console.log('start')
    second.value = 60;
    countdown();
}

defineExpose({
    start
});

</script>
<style lang="scss" scoped>

</style>