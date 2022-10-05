<template>
  <el-dialog v-model="dialogVisible" title="退出登录">
    <div class="logout-block">
      <div class="title">确认要退出登录吗?QwQ</div>
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
    openPage() {
      this.dialogVisible = true;
    },
    goPage(url) {
      window.location.href = url;
    },
    userLogout: function(){
      var config = {
        method: "get",
        url: "server/oauth/logout",
      };
      axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      //this.$router.go(0);
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
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
