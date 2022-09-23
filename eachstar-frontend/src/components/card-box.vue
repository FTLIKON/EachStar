<template>
  <el-space class="card-space" fill direction="vertical">
    <!-- 卡片列表 -->
    <el-card v-for="i in card_data" :key="i" class="box-card">
      <!-- card data -->
      <div class="card-header">
        <div class="card-title">{{i.title}}</div>
        <div class="card-discription">{{i.discription}}</div>
        <el-button id="card-button" type="success" size="large" plain>Star</el-button>
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
    card_num: 3, //卡片总数
  });
  const card_data = [
  {
    title: "ZLMediaKit",
    link: "github.com",
    discription: "实现RTSP/RTMP/HLS/HTTP协议的轻量级流媒体框架，支持大并发连接请求",
  },
  {
    title: "Qml_CustomControl",
    link: "github.com",
    discription: "QtQml控件展示，提供控件案例，惠州地铁动态地图案例",
  },
  {
    title: "洪学习笔记",
    link: "github.com",
    discription: "这是@hongjilin的学习笔记(小部分是各种博客及官方资料的摘录或整合),旨在方便自己或身边同学的使用与查阅.",
  }]
</script>

<style>
.card-space {
  width: 60%;
  margin-left: 17%;
}

.card-title {
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
  margin-bottom: 2%;

  color: #303133;
  font-size: large;
  font-weight: bold;
}

.card-discription {
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
  margin-bottom: 2%;
  margin-left: 3%;

  color: #606266;
}

#card-button {
  width: 18%;
  margin-left: 82%;
}

#issue-button {
  width: 15%;
  margin-left: 4%;
  
  font-weight: bolder;
  font-size: large;
  text-shadow: 0px 0px 2px #303133; 

  border-radius: 15px;
}



</style>