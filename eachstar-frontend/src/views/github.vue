<template>
  <div class="github">
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
              v-show="!i.starred"
              id="card-button"
              @click="starButton(i)"
              plain>💫 Star</el-button>
            <el-button
              v-show="i.starred"
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
  <a href="https://your-url" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#64CEAA; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1);" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
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
        
        axios(config)
        .then(function (response) {
          ElMessage({
            message: '已成功star, 获得积分!',
            type: 'success',
          })
          card.starNum -= 1;
          card.starred = true;
          bus.emit('refreshUserInfo');
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
