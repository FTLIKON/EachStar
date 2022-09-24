<template>
  <el-dialog v-model="dialogVisible" title="发布卡片">
    <el-input class="long-input" v-model="userEmail" placeholder="请输入邮箱" clearable/>
    
    <el-button slot="append" class="send-button" v-show="showTime" @click="sendEmail()">获取验证码</el-button>
    <el-button slot="append" class="send-button" v-show="!showTime">{{ sendTime }}-秒</el-button>
    <el-input class="emailcode-input" v-model="emailCode" placeholder="6位邮件验证码" clearable/>
    <span class="password-inputs">
      <el-input v-model="userPassword" type="password" placeholder="请输入密码" show-password/>
      <el-input v-model="userPasswordTwice" type="password" placeholder="请再次输入密码" show-password/>
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
    // todo：发送邮件的api逻辑
    },
  },
};
</script>
  
<style lang="scss" scoped>
</style>
