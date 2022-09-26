<template>
  <el-dialog v-model="dialogVisible" title="发布卡片">
    <el-input class="title-input" v-model="cardTitle" placeholder="请输入卡片标题" clearable/>
  
    <el-input class="discription-input" v-model="cardDiscription" placeholder="请输入卡片描述" clearable/>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="publicCard()">发布</el-button>
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
      cardTitle: "",
      cardDiscription: "",
    };
  },
  methods: {  
    publicCard: function(){
      this.dialogVisible = false;
      this.$emit("publicCard", {"title":this.cardTitle, "discription":this.cardDiscription});
    },
    
    openPage() {
      this.dialogVisible = true;
    }
  },
}
</script>
  
<style lang="scss" scoped>
</style>