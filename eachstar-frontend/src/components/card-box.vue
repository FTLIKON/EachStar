<template>
  <el-space class="card-space" fill direction="vertical">
    <!-- 卡片列表 -->
    <el-card v-for="i in total_data.card_num" :key="i" class="box-card">
      <!-- card data -->
      <div class="card-header">
        <span class="card-title">这是标题</span>
        <el-button class="button">点击 Star</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'item ' + o }}
      </div>
    </el-card>
  </el-space>
  <!-- 发布卡片按钮 -->
  <el-button
    type="success"
    size="large"
    id="issue-button"
  >发布卡片</el-button>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
  const total_data = reactive({
    card_num: 3 //卡片总数
  })
</script>

<style>

.card-space {
  width: 60%;
  margin-left: 17%;
}
#issue-button {
  width: 15%;
  margin-left: 4%;
  
  font-weight: bolder;
  font-size: large;
  text-shadow: 0px 0px 2px #303133; 
}



</style>