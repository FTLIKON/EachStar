<template>
  <div class="github">
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card v-for="i in currentPageData" :key="i" class="card-list">
        <div class="card-block">
          <div class="card-title">{{i.title}}</div>
          <div class="card-discription">{{i.discription}}</div>
          <div class="card-valueblock">
            <span class="card-rank">积分价值{{i.cardRank}}</span>
            <el-button id="card-button" type="success" plain>Star</el-button>
          </div>
        </div>
      </el-card>

      <!-- 卡片换页 -->
      <el-pagination
      id="pagination"
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total_page*10"/>
    </div>

    <div class="aside-menu">
      <el-button type="success" id="public-button">
        发布卡片</el-button>

      <el-button type="primary" id="public-button">
        我的积分</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
    name: "github",
    components: { 
    },
    data() {
      return{
        total_page: 10,
        currentPage: 0,
        currentPageData: [
          {
            title: "这是一个标题",
            discription: "Java Hotspot Debuger(Java Hotspot调试器), 是一款基于服务性代理实现的进程外调试工具",
            cardRank: 2,
          },
          {
            title: "我是火车王",
            discription: "让学习变得更简单",
            cardRank: 3,
          },
        ]
      }
    },
    methods: {
      getPageData: function(){
        var config = {
          method: 'get',
          url: 'http://127.0.0.1:3050/api/card?start=0',
        };
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      pageChange: function(page){
        this.currentPage = page-1;
        console.log(this.currentPage);
        this.getPageData();
      }
    },
};
</script>

<style scoped>
.github {
  background-color: none;

  height: 600px;
  margin-top: 1%;
  display: flex;
  justify-content: start;
}

.card-view {
  background-color: none;

  margin-left: 20%;
  width: 60%;
}
.aside-menu {
  background-color: none;

  margin-top: 1%;
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-list {
  margin-top: 2%;
}
#public-button {
  width: 70%;
  height: 50px;
  margin-left: 15%;
  margin-right: 15%;
  margin-bottom: 5%;
  font-size: medium;
  font-weight: bolder;
  text-shadow: 0px 0px 2px #303133; 

  border-radius: 15px;
}

.card-block {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.card-title {
  color: #303133;
  font-size: large;
  font-weight: bold;

  margin-bottom: 2%;
  text-align: left;
}
.card-discription {
  color: #606266;
  text-align: left;

  margin-bottom: 3%;
  margin-left: 3%;
  margin-right: 3%;
}
.card-valueblock{
  background-color: none;

  width: 100%;
  display: flex;
}
.card-rank {
  color: #b88230;
  background-color: none;
  
  width: 80%;
  margin-left: 3%;
  margin-top: auto;
  margin-bottom: auto;
  text-align: left;
  font-size: small;
}
#card-button {
  font-size: large;
  font-weight: bold;

  width: 20%;
}

#pagination {
  margin-top: 3%;
  justify-content: center;
}
</style>
