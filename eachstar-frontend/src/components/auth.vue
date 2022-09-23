<template>
  <el-dialog v-model="dialogVisible" title="注册/登录">
    <el-input
      v-model="userEmail"
      placeholder="请输入邮箱"
      style="width: 70%"
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
        placeholder="再次输入密码"
        show-password
      />
    </span>
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
      >获取邮件验证码</el-button
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
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { register } from "../api/auth";
import { validateEmail, validatePass, validateVCode } from "../utils/validate";
import { ElMessage } from "element-plus";
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
      if (this.userPassword != this.userPasswordTwice) {
        ElMessage({
          message: "两次输入密码不一致",
          type: "warning",
        });
      } else if (validatePass(this.userPassword)) {
        ElMessage({
          message: "密码格式错误, 必须为6至20位的字母+数字",
          type: "warning",
        });
      } else if (validateEmail(this.userEmail)) {
        ElMessage({
          message: "邮箱格式错误",
          type: "warning",
        });
      } else {
        // 发送验证码请求
        let param = new URLSearchParams();
        param.append("email", this.userEmail);
        param.append("password", this.userPassword);

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
      }
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
