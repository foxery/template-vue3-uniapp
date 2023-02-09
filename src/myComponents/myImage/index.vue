<template>
    <image mode="aspectFill" :src="src" @error="onErr" :style="{ width: size.w + 'px', height: size.h + 'px' }"
        :class="{ circle: circle }"></image>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue';

const props = defineProps({
    url: {
        type: String,
        default: '',
    },
    errUrl: {
        type: String,
        default: '',
    },
    size: {
        type: Object,
        default: {
            w: 60, h: 60
        }
    },
    circle: {
        Boolean,
        default: false
    }
});

const src = ref('');

watch(
    () => props.url,
    (active, prevActive) => {
        console.log('url', active)
        src.value = active;
    }
);

onMounted(() => {
    console.log('url2', props.url);
    src.value = props.url;
})

const onErr = (e) => {
    console.log('iii', e.detail);
    src.value = props.errUrl;
}

</script>
<style lang="scss" scoped>
.circle {
    border-radius: 50%;
    overflow: hidden;
}
</style>