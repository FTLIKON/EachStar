<template>
  <el-dialog v-model="dialogVisible" title="退出登录">
    <div class="delete-block">
      <div class="title"> 确认要退出登录吗?QwQ </div>
      </div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="userLogout()" >确认</el-button>
      </span>
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
    userLogout(){
      var config = {
        method: "get",
        url: "server/oauth/logout",
      };
      await axios(config);
      this.$router.go(0);
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
  width: 45%;
  height: 30%;
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
