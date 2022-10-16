<template>
  <el-dialog
    v-model="dialogVisible"
    style="width: 20%; min-width: 300px; margin-top: 200px"
    id="giteeAuth"
    title=""
  >
    <div class="main-block">
      <img
        class="gitee-logo"
        src="../assets/images/giteeLogo.png"
        alt="未找到图片"
      />

      <el-button
        type="primary"
        class="link-button"
        @click="
          goPage(
            'https://each-star.com:3050/oauth/gitee/login?path=http://each-star.com:80/'
          )
        "
      >
        使用Gitee快捷登录</el-button
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

.gitee-logo {
  width: 45%;
  height: 30%;
  max-width: 120px;
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
#giteeAuth {
  width: 500px;
  height: 30%;
}
</style>
