<template>
  <el-dialog v-model="dialogVisible" title="发布卡片">
    <div class="input-block">
      <el-input class="title-input"
        v-model="cardTitle"
        placeholder="请输入卡片标题"
        clearable/>
      <el-input class="discription-input"
        v-model="cardDiscription"
        placeholder="请输入卡片描述"
        maxlength="50"
        autosize
        clearable/>
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
    };
  },
  methods: {  
    publicCard: function(){
      if (this.cardTitle == "") {
        ElMessage({
          message: "两次输入密码不一致",
          type: "warning",
        });
      } else {
        this.dialogVisible = false;
        this.$emit("publicCard",
          {"title":this.cardTitle,
          "context":this.cardDiscription}
        );
      }

    },

    openPage() {
      this.dialogVisible = true;
    }
  },
}
</script>
  
<style lang="scss" scoped>
.input-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.discription-input,
.title-input{
  width: 70%;
  margin-bottom: 10px;
}
</style>