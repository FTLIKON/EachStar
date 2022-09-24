<template>
  <el-dialog v-model="dialogVisible" title="github快捷登录">
    <el-button
      type="primary"
      @click="
        goPage(
          'http://119.91.192.183:3050/oauth/github/login?path=http://119.91.192.183:12377/'
        )
      "
      >点我</el-button
    >
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
    }，
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
  .el-button:first-child {
    margin-right: 25px;
  }
}

.password-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .el-input {
    width: 70%;
    margin-top: 10px;
  }
}
</style>
