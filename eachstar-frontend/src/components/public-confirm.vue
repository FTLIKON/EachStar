<template>
  <el-dialog v-model="dialogVisible" title="🗑️删除卡片">
    <div class="delete-block">
      <div class="title"> 确认要删除卡片吗? </div>
      <div class="user-rank-calc">
        将会返还积分: {{ starPrice*starNum }}
      </div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteStar" v-show="!cardRemoving">删除</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import bus from '../utils/emitter';
import { register } from "../api/auth";
import { ElMessage } from "element-plus";
import axios from "axios";

export default {
  data() {
    return {
      dialogVisible: false,
      cardId: 0,
      cardTitle: "",
      cardDiscription: "",
      cardRemoving: false,
      starPrice: 1,
      starNum: 1,

      userPrice: "查询中...",
    };
  },
  methods: {  
    deleteStar: function(){
      var that = this;
      that.cardRemoving = true;
      var config = {
        method: "delete",
        url: "server/api/card?cardId=" + that.cardId,
      };
      axios(config)
      .then(function (response) {
        ElMessage({
          message: "已成功删除：" + that.cardTitle,
          type: "success",
        });
        bus.emit("refreshUserInfo");
        that.$parent.getMyPageData(that.$parent.currentPage);
        that.dialogVisible = false;
        that.cardRemoving = false;
      })
      .catch(function (error) {
        console.log(error);
        that.cardRemoving = false;
      });
    },

    openPage(card) { // 打开该卡片的发布页面
      this.dialogVisible = true;
      this.cardId = card.id;
      this.cardTitle = card.title;
      this.cardDiscription = card.context;
      this.starPrice = card.starPrice;
      this.starNum = card.starNum;
      var that = this;
      var config = {
        method: 'get',
        url: 'server/api/user/@me'
      };
      axios(config)
      .then(function (response) {
        console.log(response.data.price);
        that.userPrice = parseInt(response.data.price);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
  },
}
</script>
  
<style lang="scss" scoped>
.delete-block {
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