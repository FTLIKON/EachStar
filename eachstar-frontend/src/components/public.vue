<template>
  <el-dialog v-model="dialogVisible" title="发布卡片">
    <div class="input-block">
      <el-input class="title-input"
        v-model="cardTitle"
        placeholder="请输入卡片链接"
        clearable/>
      <el-input class="discription-input"
        v-model="cardDiscription"
        placeholder="请输入卡片描述"
        maxlength="150"
        show-word-limit
        :autosize="{ minRows: 4, maxRows: 8 }"
        type="textarea"
        clearable/>
      <div class="rank-setting-block">
        积分价值: {{ cardRank }}<el-slider
        v-model="cardRank"
        class="slider"
        :step="1"
        :min="1"
        :max="5"></el-slider>
        悬赏次数: {{ cardRankNum }}<el-slider
        v-model="cardRankNum"
        class="slider"
        :step="1"
        :min="1"
        :max="50"></el-slider>
      </div>
      <div class="user-rank-calc">
        消耗积分: {{ cardRank*cardRankNum }} <el-divider direction="vertical" /> 剩余积分: {{ userPrice }}
      </div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="publicCard()">发布</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { register } from "../api/auth";
import { ElMessage } from "element-plus";
import axios from "axios";

export default {
  data() {
    return {
      dialogVisible: false,
      cardTitle: "",
      cardDiscription: "",
      cardRank: 1,
      cardRankNum: 1,

      userPrice: "查询中...",
    };
  },
  methods: {  
    publicCard: function(){
      if (this.cardTitle == "") {

        // 验证填写title和描述的合法性

        ElMessage({
          message: "两次输入密码不一致",
          type: "warning",
        });
      } else {
        // publicCard Arguments -> title, context, starPrice, starNum, time
        this.dialogVisible = false;
        this.$emit("publicCard", 
          this.cardTitle,
          this.cardDiscription,
          toString(this.cardRank),
          toString(this.cardRankNum),
          this.getExpireTime()
        );
      }

    },

    openPage() { // 打开发布页面->需要登录
      let userName = this.$cookies.get("userName");
      if(userName){
        this.dialogVisible = true;

        var that = this;
        var config = {
          method: 'get',
          url: 'server/api/user/@me'
        };
        axios(config)
        .then(function (response) {
          console.log(response.data.price);
          that.userPrice = response.data.price;
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        ElMessage({
          message: "请先进行登录!",
          type: "warning",
        });
      }
    },

    getExpireTime() {
      let now = new Date();
      now = now.setDate(now.getDate()+10);
      now = new Date(now);
      let year = now.getFullYear();
      let month = now.getMonth()+1;    
      let date = now.getDate();    
      let hour = now.getHours();    
      let minute = now.getMinutes();    
      let second = now.getSeconds();
      if(month<10)month="0"+month;
      if(date<10)date="0"+date;
      if(hour<10)hour="0"+hour;
      if(minute<10)minute="0"+minute;
      if(second<10)second="0"+second;
      return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    },
  },
}
</script>
  
<style lang="scss" scoped>
.input-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.discription-input, .title-input{
  width: 70%;
  margin-bottom: 10px;
}
.rank-setting-block {
  width: 70%;
}
.slider {
  margin-top: 3%;
}
.dialog-footer {
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>