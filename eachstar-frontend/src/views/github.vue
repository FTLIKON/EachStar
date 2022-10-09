<template>
  <div class="github" v-loading="loading">
    <!-- 侧栏视图 -->
    <el-affix class="aside-menu" :offset="100">
      <aside-menu />
    </el-affix>

    <!-- 卡片视图 -->
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card
        v-for="item of currentPageData"
        :key="item"
        class="card-list"
      >
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
              @click="starButton(item)"
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import bus from "../utils/emitter";
import { ElMessage } from "element-plus";
import BottomLine from "../components/bottomLine.vue";
import "../iconfont/iconfont";
import AsideMenu from "../components/asideMenu.vue";

export default {
  name: "github",
  mounted() {
    this.pageChange(1);
    bus.on("refreshPageData", this.refreshPageData);
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,

      pageSize: 10,
      totalPage: 0,
      totalCard: 35,
      currentPage: 0,
      currentPageData: [],
    };
  },
  methods: {
    // ---------- star-card相关 ----------
    // Star按钮
    starButton: function (card) {
      // 打开发布页面->需要登录
      let userName = this.$cookies.get("userName");
      if (userName) {
        var that = this;
        let param = new URLSearchParams();
        param.append("cardId", card.id);
        var config = {
          method: "post",
          url: "server/api/card/quickstar",
          data: param,
        };

        that.buttonLoading = true;
        setTimeout(() => {
          that.buttonLoading = false;
        }, 2000);
        card.starring = true;
        axios(config)
          .then(function (response) {
            setTimeout(() => {
              ElMessage({
                message: "一键star成功! 获得星币:" + card.starPrice,
                type: "success",
              });
              card.starNum -= 1;
              card.starred = true;
              bus.emit("refreshUserInfo");
              if (card.starNum == 0) {
                // 如果悬赏次数为0->刷新页面
                that.getPageData(that.currentPage);
              }
            }, 1000);
          })
          .catch(function (error) {
            if (error.response.status == 400) {
              ElMessage({
                message: "一键star失败, 请稍后再试试~",
                type: "warning",
              });
            }
            card.starred = false;
          });
      } else {
        ElMessage({
          message: "请先进行 登录/注册!",
          type: "warning",
        });
      }
    },

    getUserId() {
      // 获取用户id->判断是否可以star
      var that = this;
      var config = {
        method: "get",
        url: "server/api/user/@me",
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
    pageChange: function (page) {
      this.currentPage = page - 1;
      console.log("切换至页面: " + this.currentPage);

      this.getPageData(this.currentPage);
    },
    refreshPageData: function () {
      this.pageChange(1);
    },
    parseTimeString: function (timeString) {
      let resTime;
      let cardTime = new Date(timeString);
      let nowTime = new Date();
      let diffTime = nowTime.getTime() + 9000 - cardTime.getTime();
      if (diffTime < 60 * 1000) {
        resTime = Math.floor(diffTime / 1000) + "秒前";
      } else if (diffTime < 3600 * 1000) {
        resTime = Math.floor(diffTime / (60 * 1000)) + "分钟前";
      } else if (diffTime < 3600 * 24 * 1000) {
        resTime = Math.floor(diffTime / (3600 * 1000)) + "小时前";
      } else {
        resTime = Math.floor(diffTime / (3600 * 24 * 1000)) + "天前";
      }
      return resTime;
    },
    // 获取page页面数据->currentPageData
    getPageData: function (page) {
      var that = this;
      var config = {
        method: "get",
        url: "/server/api/card?start=" + page * that.pageSize,
      };
      axios(config)
        .then(function (response) {
          that.totalCard = parseInt(response.data.count);
          that.totalPage = Math.ceil(that.totalCard / 10);

          var list = [];
          var index = 0;
          var start = page * that.pageSize;
          while (index < that.pageSize && start < that.totalCard) {
            if (response.data.data[index] != undefined) {
              let nowData = response.data.data[index];
              nowData.createdAt = that.parseTimeString(nowData.createdAt);
              nowData.cardStatus = list.push(nowData);
            }
            index++;
            start++;
          }
          that.currentPageData = list;
          that.loading = false;
        })
        .catch(function (error) {
          console.log(error);
        });
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
}

.card-view {
  display: flex;
  flex-direction: column;
  width: 80%;
  min-width: 760px;
  .card-list {
    box-shadow: 0px 0px 3px 3px #cdd0d6;
    border-radius: 15px;
    width: 60%;
    margin-bottom: 2%;
    margin-left: 10%;
  }
  #pagination {
    margin: 3% 20% 3% 0%;
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
