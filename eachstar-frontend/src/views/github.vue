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
        发布卡片
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
    name: "github",
    components: { 
    },
    data() {
      return{
        currentPageData: [
          {
            title: "qwq",
            discription: "this is true",
            cardRank: 2,
          },
          {
            title: "another",
            discription: "this is false",
            cardRank: 3,
          },
        ]
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
  margin-bottom: 4%;
  font-size: medium;
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

  margin-bottom: 2%;
  margin-left: 3%;
}
.card-valueblock{
  background-color: sandybrown;

  width: 100%;
  display: flex;
}
.card-rank {
  background-color: seashell;
  
  width: 80%;
}
#card-button {
  font-size: large;
  font-weight: bold;

  width: 18%;
}
/* 

#public-button {
  width: 16%;
  margin-left: 2%;
  margin-right: 2%;
  
  font-weight: bolder;
  font-size: large;
  text-shadow: 0px 0px 2px #303133; 

  border-radius: 15px;
}

#pagination {
  margin-top: 2%;
  justify-content: center;
}
*/
</style>
