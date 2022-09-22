<template>
  <el-button
    text
    @click="dialogVisible = true"
    style="color: white; background-color: #3c8dbc; margin-left: -20px"
    >打开注册登录小弹窗</el-button
  >

  <el-dialog v-model="dialogVisible" title="注册/登录" width="30%">
    <span class="auth-inputs">
    <el-input
      v-model="userEmail"
      placeholder="请输入邮箱"
      width="40%"
      clearable
    />
    <el-button
      slot="append"
      style="color: white; background-color: #3c8dbc"
      v-show="showTime"
      @click="sendEmail()"
      >发送验证码</el-button
    >
    <el-button
      slot="append"
      style="color: white; background-color: #3c8dbc"
      v-show="!showTime"
      >{{ sendTime }}秒</el-button
    >
    <el-input v-model="emailCode" placeholder="请输入邮件验证码" clearable />
    <el-input
      v-model="userPassword"
      type="password"
      placeholder="请输入密码"
      show-password
    />
    <el-input
      v-model="userPasswordTwice"
      type="password"
      placeholder="请再次输入密码"
      show-password
    />
    </span>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      userEmail: "",
      emailCode: "",
      userPassword: "",
      userPasswordTwice: "",
      showTime: true,
      sendTime: "",
      timer: null,
    };
  },
  methods: {
    sendEmail() {
      const TIME_COUNT = 60; //  更改倒计时时间
      if (!this.timer) {
        this.sendTime = TIME_COUNT;
        this.showTime = false;
        this.timer = setInterval(() => {
          if (this.sendTime > 0 && this.sendTime <= TIME_COUNT) {
            this.sendTime--;
          } else {
            this.showTime = true;
            clearInterval(this.timer); // 清除定时器
            this.timer = null;
          }
        }, 1000);
      }

      //todo：发送邮件的逻辑
    },
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

.auth-inputs {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
  width: 70%;
  margin-bottom: 100px;
}
</style>
