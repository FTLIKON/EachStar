<template>
  <div class="github">
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card v-for="i in currentPageData" :key="i" class="card-list">
        <div class="card-block">
          <div class="card-title">{{i.title}}</div>
          <div class="card-discription">{{i.context}} {{i.updatedAt}}</div>
          <div class="card-valueblock">
            <span class="card-rank">积分价值{{i.starPrice}}</span>
            <el-button id="card-button" type="success" plain>Star</el-button>
          </div>
        </div>
      </el-card>

      <!-- 卡片换页 -->
      <el-pagination
      id="pagination"
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="totalPage*10"/>
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
import { getCurrentInstance, onMounted } from 'vue-demi';
export default {
    name: "github",
    components: { 
    },
    mounted() {
      let that = this;
      that.pageChange(1);
    },
    data() {
      return {
        pageSize: 10,
        totalPage: 0,
        totalCard: 35,
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
        ],
      }
    },
    methods: {
      getPageData: function(page){
        // get 数据
        var that = this;
        var config = {
          method: 'get',
          url: '/server/api/card?start='+page*that.pageSize,
        };
        axios(config)
        .then(function (response) {
          // 处理count
          that.totalCard = parseInt(response.data.count);
          that.totalPage = Math.ceil(that.totalCard/10);

          var list = [];
          var index = 0; // 限制页面最大上限
          var start = page*that.pageSize; // 防止页面请求溢出
          while(index < that.pageSize && start < that.totalCard){
            list.push(response.data.data[index]);
            console.log(response.data.data[index]);
            index++; start++;
          }
          that.currentPageData = list;
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      pageChange: function(page){
        this.currentPage = page-1;

        this.getPageData(this.currentPage);
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
