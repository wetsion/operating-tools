<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <span class="title">欢迎使用刘颖的运营工具</span>
        <system-information></system-information>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import { message } from "@/api/login";
import { ipcRenderer } from "electron";
export default {
  name: "landing-page",
  components: { SystemInformation },
  data: () => ({
    text: "等待数据读取",
    newdata: {
      name: "yyy",
      age: "12",
    },
    logo: require("@/assets/logo.png"),
    textarray: [],
    percentage: 0,
    colors: [
      { color: "#f56c6c", percentage: 20 },
      { color: "#e6a23c", percentage: 40 },
      { color: "#6f7ad3", percentage: 60 },
      { color: "#1989fa", percentage: 80 },
      { color: "#5cb87a", percentage: 100 },
    ],
    dialogVisible: false,
    progressStaus: null,
    filePath: "",
  }),
  created() {
    console.log("环境打印示例")
    console.log(__lib);
    console.log(process.env.TERGET_ENV)
    console.log(process.env)
  },
  methods: {

  },
  destroyed() {
    console.log("销毁了哦");
    this.$ipcApi.remove("confirm-message");
    this.$ipcApi.remove("download-done");
    this.$ipcApi.remove("download-paused");
    this.$ipcApi.remove("confirm-stop");
    this.$ipcApi.remove("confirm-start");
    this.$ipcApi.remove("confirm-download");
    this.$ipcApi.remove("download-progress");
    this.$ipcApi.remove("download-error");
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  padding: 60px 80px;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}
.doc {
  margin-bottom: 10px;
}
.doc p {
  color: black;
  margin-bottom: 10px;
}
.doc .el-button {
  margin-top: 10px;
  margin-right: 10px;
}
.doc .el-button + .el-button {
  margin-left: 0;
}
.conten {
  text-align: center;
}
</style>