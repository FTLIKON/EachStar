<template>
  <div class="github" v-loading="loading">
    <!-- 侧栏视图 -->
    <el-affix class="aside-menu" :offset="100">
      <aside-menu />
    </el-affix>

    <!-- 卡片视图 -->
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card v-for="item of currentPageData" :key="item" class="card-list">
        <div class="card-block">
          <div class="card-titleblock">
            <a class="card-title" :href="item.title" target="_blank">
              {{ item.title.replace("https://github.com/", "") }}</a
            >
            <span class="card-time">{{ item.createdAt }}</span>
          </div>
          <div class="card-discription">
            {{ item.context }}
          </div>
          <div class="card-valueblock">
            <span class="card-rank">
              <span>
                <svg class="fronticon" aria-hidden="true">
                  <use xlink:href="#icon-bonus-line"></use>
                </svg>
                可获得星币: {{ item.starPrice }}
              </span>
              <el-divider direction="vertical" />
              <span style="color: #409eff">
                <svg
                  class="fronticon"
                  style="width: 23px; height: 23px; vertical-align: -0.42em"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-cishu"></use>
                </svg>
                悬赏次数: {{ item.starNum }}</span
              >
            </span>
            <el-button
              v-show="!item.starred && !item.starring && !buttonLoading"
              id="card-button"
              @click="starCardButton(item)"
              plain
            >
              <svg class="fronticon" style="color: #b88230" aria-hidden="true">
                <use xlink:href="#icon-xingxing"></use>
              </svg>
              一键Star</el-button
            >
            <el-button
              v-show="!item.starred && item.starring"
              id="card-button"
              loading
              plain
            >
              Star请求中...</el-button
            >
            <el-button
              v-show="!item.starred && !item.starring && buttonLoading"
              id="card-button"
              loading
              plain
            >
              等待中...</el-button
            >
            <el-button v-show="item.starred" id="card-button" type="info" plain>
              <svg class="fronticon" aria-hidden="true">
                <use xlink:href="#icon-xingxing1"></use>
              </svg>
              Starred</el-button
            >
          </div>
        </div>
      </el-card>

      <!-- 卡片换页 -->
      <el-pagination
        id="pagination"
        layout="prev, pager, next"
        @current-change="pageChange"
        :total="totalPage * 10"
      />

      <bottom-line />
    </div>
  </div>
</template>

<script>
import bus from "../utils/emitter";
import { ElMessage } from "element-plus";
import BottomLine from "../components/bottomLine.vue";
import "../iconfont/iconfont";
import AsideMenu from "../components/asideMenu.vue";
import { getPageData } from "../api/getPageData.js";
import { getUserName } from "../api/getUserName.js";
import { starCard } from "../api/starCard.js";

export default {
  name: "github",
  data() {
    return {
      loading: true,
      buttonLoading: false,

      totalPage: 0,
      currentPage: 1,
      currentPageData: [],
    };
  },
  mounted() {
    this.refreshPageData();
    bus.on("refreshPageData", this.refreshPageData);
  },
  methods: {
    /**
     * star按钮
     */ 
    starCardButton(card) {
      if (!getUserName("GitHub")) {
        ElMessage({
          message: "请先进行 登录/注册!",
          type: "warning",
        })
      } 
      
      // star按钮触发动画
      this.buttonLoading = true;
      setTimeout(()=>{this.buttonLoading=false}, 2000);
      card.starring = true;

      if(starCard(card, "GitHub")){
        setTimeout(()=>{
          ElMessage({
            message: "一键star成功! 获得星币:" + card.starPrice,
            type: "success",
          });
          card.starNum -= 1;
          card.starred = true;
          bus.emit("refreshUserInfo");
          if (card.starNum == 0) { // 退化情况
            this.refreshPageData();
          }
        }, 1000)
      } else {
        ElMessage({
            message: "一键star失败, 请稍后再试试~",
            type: "warning",
        });
        card.starred = false;
      }
    },

    /**
     * 切换页面
     */ 
    async pageChange(page) {
      this.currentPage = page;
      this.loading = true;

      var src = await getPageData("GitHub", this.currentPage);
      this.currentPageData = src.data;
      this.totalPage = Math.ceil(src.count / 10);
      this.loading = false;
    },
    
    /**
     * 刷新页面(到第一页)
     */ 
    refreshPageData: function () {
      this.pageChange(1);
    },
  },
  components: {
    BottomLine,
    AsideMenu,
  },
};
</script>

<style lang="scss" scoped>
.aside-menu {
  width: 20% !important;
}

.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}

.github {
  display: flex;
  flex: 1;
}

.card-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 960px;
  .card-list {
    box-shadow: 0px 0px 3px 3px #cdd0d6;
    border-radius: 15px;
    width: 60%;
    margin-left: 20%;
    margin-right: 20%;
    margin-bottom: 2%;
  }
  #pagination {
    margin: 3% 40% 3% 0%;
    justify-content: center;
  }
}

.card-block {
  .card-titleblock {
    margin-bottom: 2%;
    width: 100%;
    display: flex;

    .card-title {
      color: #303133;
      width: 70%;
      text-align: left;
      font-size: large;
      font-weight: bold;
      text-decoration: none;
    }

    .card-time {
      color: #606266;
      width: 30%;
      text-align: right;
    }
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
    margin: 0% 3% 3% 3%;
  }

  .card-valueblock {
    width: 100%;
    display: flex;

    .card-rank {
      color: #b88230;
      background-color: none;

      width: 80%;
      margin: auto 3% auto 3%;
      text-align: left;
    }

    #card-button {
      color: #303133;
      font-size: large;
      width: 30%;
    }
  }
}
</style>
