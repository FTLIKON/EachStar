<template>
  <div class="mygithub">
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card v-for="i in currentPageData" :key="i" class="card-list">
        <div class="card-block">
          <div class="card-title">{{i.title}}</div>
          <div class="card-discription">{{i.context}} {{i.updatedAt}}</div>
          <div class="card-valueblock">
            <span class="card-rank">
              <span>积分价值{{i.starPrice}}</span> 
              <el-divider direction="vertical" />
              <span style="color: #409EFF">悬赏次数{{i.starNum}}</span> 
            </span>
            <el-button 
              id="card-button"
              @click="deleteStar(i)"
              plain>💥 删除</el-button>
          </div>
        </div>
      </el-card>

      <el-pagination
      id="pagination"
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="totalPage*10"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "mygithub",
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
          title: "页面是我的卡片",
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
    pageChange: function(page){
        this.currentPage = page-1;

        this.getMyPageData(this.currentPage);
      },
    getMyPageData: function(page){
      var that = this;
      var config = {
        method: 'get',
        url: '/server/api/card/@me?start='+page*that.pageSize,
      };
      axios(config)
      .then(function (response) {
        that.totalCard = parseInt(response.data.count);
        that.totalPage = Math.ceil(that.totalCard/10);
        
        console.log("[DEBUGGER] 一共有"+response.data.count+"个card");

        var list = [];
        var index = 0;
        var start = page*that.pageSize;
        while(index < that.pageSize && start < that.totalCard){
          list.push(response.data.data[index]);
          index++; start++;
        }
        that.currentPageData = list;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
  },
};
</script>

<style>

</style>
