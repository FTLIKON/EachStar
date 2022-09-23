<template>
  <el-dialog v-model="dialogVisible" title="注册/登录" width="30%">
    <el-input
      v-model="userEmail"
      placeholder="请输入邮箱"
      style="width: 70%"
      clearable
    />
    <el-button
      slot="append"
      style="
        color: white;
        background-color: #3c8dbc;
        width: 30%;
        margin-top: 10px;
        margin-right: 1%;
      "
      v-show="showTime"
      @click="sendEmail()"
      >获取验证码</el-button
    >
    <el-button
      slot="append"
      style="
        color: white;
        background-color: #3c8dbc;
        width: 30%;
        margin-top: 10px;
        margin-right: 1%;
      "
      v-show="!showTime"
      >{{ sendTime }}秒</el-button
    >
    <el-input
      v-model="emailCode"
      style="width: 39%; margin-top: 10px"
      placeholder="6位邮件验证码"
      clearable
    />
    <span class="password-inputs">
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
import { register } from "../api/auth";
import axios from "axios";

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
    openPage() {
      this.dialogVisible = true;
    },
    sendEmail() {
      // 获取验证码
      let requestData = {
        email: this.userEmail,
        password: this.userPassword,
      };

      let param = new URLSearchParams();
      param.append("email", "3147983767@qq.com");
      param.append("password", "123456sda");

      axios.post(`http://localhost:3050/auth/register`, param).then((res) => {
        console.log("res=>", res);
      });

      const TIME_COUNT = 60; //更改倒计时时间
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

      //todo：发送邮件的api逻辑
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
