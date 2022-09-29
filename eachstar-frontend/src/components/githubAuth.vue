<template>
  <el-dialog class="main-block" v-model="dialogVisible" title="">
    <img src="githubLogo.webp" alt="未找到图片">
    <el-button
      type="primary"
      class="link-button"
      @click="goPage('http://119.91.192.183:3050/oauth/github/login?path=http://119.91.192.183:80/')">
      使用github快捷登录</el-button>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    openPage() {
      this.dialogVisible = true;
    },
    goPage(url) {
      window.location.href = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
