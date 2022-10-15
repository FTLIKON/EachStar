<template>
  <el-dialog
    v-model="dialogVisible"
    style="width: 20%; min-width: 300px; margin-top: 200px"
    id="githubAuth"
    title=""
  >
    <div class="main-block">
      <img class="github-logo" src="../assets/images/githubLogo.webp" alt="未找到图片" />

      <el-button
        type="primary"
        class="link-button"
        @click="
          goPage(
            'http://119.91.192.183:3050/oauth/github/login?path=http://119.91.192.183:80/'
          )
        "
      >
        使用GitHub快捷登录</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    /**
     * 打开注册页面
     */
    openPage() {
      this.dialogVisible = true;
    },

    /**
     * 前往页面
     */
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
  width: 60%;
  height: 40%;
  max-width: 180px;
  margin-bottom: 5%;
}
.link-button {
  min-width: 200px;
  min-height: 50px;
  margin-left: 15%;
  margin-right: 15%;
  margin-bottom: 5%;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;

  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}
#githubAuth {
  width: 500px;
  height: 30%;
}
</style>
