<template>
  <el-dialog v-model="dialogVisible" title="">
    <div class="main-block">
      <img class="github-logo" src="githubLogo.webp" alt="未找到图片">
      <el-button
        type="primary"
        class="link-button"
        @click="goPage('http://119.91.192.183:3050/oauth/github/login?path=http://119.91.192.183:80/')">
        使用github快捷登录</el-button>
    </div>
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

.github-logo {
  width: 40%;
}
</style>
