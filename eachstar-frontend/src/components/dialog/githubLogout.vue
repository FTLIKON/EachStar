<template>
  <el-dialog
    style="width: 25%; margin-top: 250px"
    v-model="dialogVisible"
    title="退出登录"
  >
    <div class="logout-block">
      <div class="title">确认要登出GitHub吗?</div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="userLogout">确认</el-button>
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
    /**
     * 登出页面打开
     */
    openPage() {
      this.dialogVisible = true;
    },

    /**
     * 前往URL
     */
    goPage(url) {
      window.location.href = url;
    },

    /**
     * 尝试登出
     */
    userLogout() {
      var config = {
        method: "get",
        url: "https://each-star.com/oauth/github/logout",
      };
      axios(config)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.$router.go(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.logout-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  width: 100%;
  font-weight: bold;
  font-size: large;
}
.discription {
  width: 100%;
  margin-top: 3%;
}
.user-rank-calc {
  margin-top: 3%;
}
.dialog-footer {
  margin-top: 10%;
  margin-bottom: 3%;
}
</style>
