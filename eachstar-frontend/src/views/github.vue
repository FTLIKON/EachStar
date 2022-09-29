<template>
  <div class="github">
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card v-for="item of currentPageData" :key="item" class="card-list">
        <div class="card-block">
          <div class="card-title">{{item.title}}</div>
          <div class="card-discription">{{item.context}} {{item.updatedAt}}</div>
          <div class="card-valueblock">
            <span class="card-rank">
              <span>可获得积分{{item.starPrice}}</span> 
              <el-divider direction="vertical" />
              <span style="color: #409EFF">悬赏次数{{item.starNum}}</span> 
            </span>
            <el-button 
              v-show="!item.starred"
              id="card-button"
              @click="starButton(item)"
              plain>💫 Star</el-button>
            <el-button
              v-show="item.starred"
              id="card-button"
              type="info"
              plain>⭐ Starred</el-button>
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
      <el-button @click="publicButton()" type="success" id="public-button">
        发布卡片</el-button>
    </div>
  </div>
  <Public @publicCard="publicCard" ref="Public"/>
</template>

<script>
import axios from "axios";
import bus from '../utils/emitter';
import { getCurrentInstance, onMounted } from 'vue-demi';
import { ElMessage } from "element-plus";
import Public from "../components/public.vue";
export default {
    name: "github",
    components: {
      Public
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
      // ---------- public相关 ---------- 
      publicButton() { // 发布按钮->点击打开Public.vue
        this.$.refs.Public.openPage();
      },
      publicCard: function(title, context, starPrice, starNum, time){ // Post->向服务器请求发布data卡片
        ElMessage('正在尝试发布, 请稍等');
        var that = this;
        let param = new URLSearchParams();
        param.append("title", title);
        param.append("context", context);
        param.append("starPrice", starPrice);
        param.append("starNum", starNum);
        param.append("expireTime", time);
        var config = {
          method: 'post',
          url: 'server/api/card',
          data : param
        };
        
        axios(config)
        .then(function (response) {
          ElMessage({
            message: '发布成功, 正在重定向至第一页!',
            type: 'success',
          })
          that.getPageData(0);
          bus.emit('refreshUserInfo');
        })
        .catch(function (error) {
          console.log(error);
        });
      },

      // ---------- star-card相关 ----------
      // Star按钮
      starButton: function(card){
        var that = this;
        let param = new URLSearchParams();
        param.append("cardId", card.id);
        var config = {
          method: 'post',
          url: 'server/api/card/quickstar',
          data : param
        };
        
        card.starred = true;
        axios(config)
        .then(function (response) {
          ElMessage({
            message: '已成功star, 获得积分!',
            type: 'success',
          })
          card.starNum -= 1;
          bus.emit('refreshUserInfo');
          if(card.starNum == 0){ // 如果悬赏次数为0->刷新页面
            that.getPageData(that.currentPage);
          }
        })
        .catch(function (error) {
          console.log(error);
          card.starred = false;
        });
      },

      getUserId() { // 获取用户id->判断是否可以star
        var that = this;
        var config = {
          method: 'get',
          url: 'server/api/user/@me'
        };
        axios(config)
        .then(function (response) {
          that.userId = response.data.id;
        })
        .catch(function (error) {
          console.log(error);
        });
      },

      // ========== github.vue 页面控制 ==========
      // 执行换页
      pageChange: function(page){
        this.currentPage = page-1;

        this.getPageData(this.currentPage);
      },
      // 获取page页面数据->currentPageData
      getPageData: function(page){
        var that = this;
        var config = {
          method: 'get',
          url: '/server/api/card?start='+page*that.pageSize,
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
            if(response.data.data[index]!=undefined){
              list.push(response.data.data[index]);
            }
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

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;    
  letter-spacing: 0;
  text-overflow: ellipsis;


  width: 90%;
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
  margin-right: 3%;
  margin-top: auto;
  margin-bottom: auto;
  text-align: left;
  font-size: small;
}
#card-button {
  font-size: large;

  width: 30%;
  display: flex;
}
#pagination {
  margin-top: 3%;
  justify-content: center;
}
</style>
