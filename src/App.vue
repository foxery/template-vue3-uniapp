<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { UpdateApp } from './util/common';

onLaunch(() => {
  console.log("App Launch");
  UpdateApp();
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "@/styles/uni-ui_rewrite.scss";
@import "@/styles/common.scss";
</style>
