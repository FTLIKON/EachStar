<template>
  <el-dialog style="width: 30%; margin-top: 300px" v-model="dialogVisible" title="删除卡片">
    <div class="delete-block">
      <div class="title"> 确认要删除卡片吗? </div>
      <div class="user-rank-calc">
        将会返还云币: {{ starPrice*starNum }}
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
import { getUserPrice } from '../../api/getUserPrice';
import { deleteCard } from "../../api/deleteCard";
import { UserIsLogin } from '../../api/UserIsLogin';

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
    /**
     * 删除卡片
     */ 
    async deleteButton(){
      if (await deleteCard("Gitee", this.cardId)){
        ElMessage({
            message: "已成功删除：" + this.cardTitle,
            type: "success",
        });
        bus.emit("refreshUserInfo", "Gitee");
        this.dialogVisible = false;
        await this.$parent.pageChange(this.$parent.currentPage);
      } else {
        ElMessage({
            message: "删除失败, 请稍后再试试~",
            type: "error",
        });
        this.cardRemoving = false;
      }
    },

    /**
     * 打开页面
     */ 
    async openPage(card) {
      if (this.$cookies.get("giteeName")) {
        this.dialogVisible = true;
        this.cardId = card.id;
        this.cardTitle = card.title;
        this.cardDiscription = card.context;
        this.starPrice = card.starPrice;
        this.starNum = card.starNum;
        this.userPrice = await getUserPrice("Gitee");
      }
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