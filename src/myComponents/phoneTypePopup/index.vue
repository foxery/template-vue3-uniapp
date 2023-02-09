<template>
    <uni-popup ref="popup" type="bottom" :mask-click="true" @maskClick="emits('cancel')">
        <div class="my-popup-title">
            <span class="cancel-text" @click="onCancel">取消</span>
            <span>选择归属地</span>
            <span class="confirm-text" @click="onConfirm">确定</span>
        </div>
        <div class="select-item" v-for="item in phoneArrys"
            :class="{ active: curSelected && curSelected.id == item.id }" @click="onSelect(item)">
            {{ item.name }}
        </div>
    </uni-popup>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    selected: {
        type: Object,
    }
});

const emits = defineEmits(['confirm', 'cancel']);

const popup = ref();
const phoneArrys = ref([
    {
        id: 1,
        name: '手机（大陆）',
    },
    {
        id: 2,
        name: '手机（港澳台）',
    },
    {
        id: 3,
        name: '手机（海外）',
    },
]);
const curSelected = ref(props.selected);

const onSelect = (item: { id: number, name: string }) => {
    curSelected.value = item;
}

const onConfirm = () => {
    popup.value.close();
    emits('confirm', curSelected.value);
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
.my-popup-title {
    background-color: #FFFFFF;
    padding: 16px;
    text-align: center;
    color: #7b7b7b;
    font-size: 14px;
    border-bottom: 1px solid $uni-border-color;
    position: relative;
}

.cancel-text {
    position: absolute;
    color: #7b7b7b;
    font-size: 15px;
    left: 20px;
}

.confirm-text {
    position: absolute;
    color: #333;
    font-size: 15px;
    right: 20px;
}

.select-item {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    text-align: center;
    background-color: #fff;

    &.active {
        background-color: #f5f6fa;
    }
}
</style>