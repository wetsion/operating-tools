<template>
  <div>
    <div class="title">关于本工具</div>
    <div class="items">
      <div class="item" v-for="(item, index) in tips" :key="index">
        <div class="name" v-text="item.name" />
        <div class="value" v-text="item.value" />
      </div>
    </div>
  </div>
</template>

<script>
import { platform, release, arch } from "os";
export default {
  data() {
    return {
      tips: [
        // { name: "当前页面路径：", value: this.$route.path },
        // { name: "当前页面名称：", value: this.$route.name },
        // { name: "Vue版本：", value: require("vue/package.json").version },
        // {
        //   name: "Electron版本：",
        //   value: process.versions.electron || "浏览器环境",
        // },
        // { name: "Node版本：", value: process.versions.node || "浏览器环境" },
        { name: "主要功能：", value: "周报报表" },
        { name: "系统平台：", value: platform() },
        { name: "系统版本：", value: release() },
        { name: "系统位数：", value: arch() + "位" },
      ],
    };
  },
  mounted() {
    console.log(this.$route);
  },
};
</script>

<style scoped>
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.items {
  margin-top: 8px;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  line-height: 24px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 6px;
}

.item .value {
  color: #35495e;
  font-weight: bold;
}
</style>
