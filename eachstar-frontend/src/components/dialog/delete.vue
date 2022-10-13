<template>
  <el-dialog style="width: 30%; margin-top: 300px" v-model="dialogVisible" title="删除卡片">
    <div class="delete-block">
      <div class="title"> 确认要删除卡片吗? </div>
      <div class="user-rank-calc">
        将会返还星币: {{ starPrice*starNum }}
      </div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteButton" v-show="!cardRemoving">删除</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import bus from '../../utils/emitter';
import { ElMessage } from "element-plus";
import axios from "axios";
import { getUserPrice } from '../../api/getUserPrice';
import { deleteCard } from "../../api/deleteCard";

export default {
  data() {
    return {
      dialogVisible: false,
      cardRemoving: false,
      userPrice: "查询中...",

      cardId: 0,
      cardTitle: "",
      cardDiscription: "",
      starPrice: 1,
      starNum: 1,
    };
  },
  methods: {  
    async deleteButton(cardId){
      if (deleteCard("GitHub", cardId)){
        ElMessage({
            message: "已成功删除：" + this.cardTitle,
            type: "success",
        });
        bus.emit("refreshUserInfo");
        this.$parent.getMyPageData(this.$parent.currentPage);
        this.dialogVisible = false;
      }
      this.cardRemoving = false;
    },

    /**
     * 打开页面
     */ 
    async openPage(card) {
      this.dialogVisible = true;
      this.cardId = card.id;
      this.cardTitle = card.title;
      this.cardDiscription = card.context;
      this.starPrice = card.starPrice;
      this.starNum = card.starNum;
      this.userPrice = await getUserPrice();
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