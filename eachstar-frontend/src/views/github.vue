<template>
  <div class="github" v-loading="loading">
    <div class="card-view">
      <!-- 卡片列表 -->
      <el-card v-for="item of currentPageData" :key="item" class="card-list">
        <div class="card-block">
          <div class="card-titleblock">
            <a class="card-title" :href="item.title" target="_blank">{{
              item.title.replace("https://github.com/", "")
            }}</a>
            <span class="card-time">{{ item.updatedAt }}</span>
          </div>
          <div class="card-discription">
            {{ item.context }}
          </div>
          <div class="card-valueblock">
            <span class="card-rank">
              <span>
                <svg class="priceIcon" aria-hidden="true">
                  <use xlink:href="#icon-bonus-line"></use></svg
                >可获得积分: {{ item.starPrice }}</span
              >
              <el-divider direction="vertical" />
              <span style="color: #409eff">👤悬赏次数: {{ item.starNum }}</span>
            </span>
            <el-button
              v-show="!item.starred"
              id="card-button"
              @click="starButton(item)"
              plain
              >⭐ 一键Star</el-button
            >
            <el-button v-show="item.starred" id="card-button" type="info" plain
              >🌟 Starred</el-button
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

    <el-backtop
      style="
        height: 60px;
        width: 60px;
        box-shadow: var(--el-box-shadow-dark)
        border-radius: 50%"
      :right="80"
      :bottom="80"
      :visibility-height="0"
    />

    <div class="aside-menu">
      <el-button @click="publicButton()" type="success" id="public-button">
        📝发布卡片</el-button
      >
    </div>
  </div>
  <Public @publicCard="publicCard" ref="Public" />
</template>

<script>
import axios from "axios";
import bus from "../utils/emitter";
import { getCurrentInstance, onMounted } from "vue-demi";
import { ElMessage } from "element-plus";
import Public from "../components/public.vue";
import BottomLine from "../components/bottomLine.vue";
import "../iconfont/iconfont";

export default {
  name: "github",
  components: {
    Public,
    BottomLine,
  },
  mounted() {
    let that = this;
    that.pageChange(1);
  },
  data() {
    return {
      loading: true,

      pageSize: 10,
      totalPage: 0,
      totalCard: 35,
      currentPage: 0,
      currentPageData: [],
    };
  },
  methods: {
    // ---------- public相关 ----------
    publicButton() {
      // 发布按钮->点击打开Public.vue
      this.$.refs.Public.openPage();
    },
    publicCard: function (title, context, starPrice, starNum, time) {
      // Post->向服务器请求发布data卡片
      ElMessage("正在尝试发布, 请稍等");
      var that = this;
      let param = new URLSearchParams();
      param.append("title", title);
      param.append("context", context);
      param.append("starPrice", starPrice);
      param.append("starNum", starNum);
      param.append("expireTime", time);
      var config = {
        method: "post",
        url: "server/api/card",
        data: param,
      };

      axios(config)
        .then(function (response) {
          ElMessage({
            message: "发布成功! 为您重定向至第一页...",
            type: "success",
          });
          that.getPageData(0);
          bus.emit("refreshUserInfo");
        })
        .catch(function (error) {
          console.log(error);
        });
    },

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

        card.starred = true;
        axios(config)
          .then(function (response) {
            ElMessage({
              message: "一键star成功! 获得积分:" + card.starPrice,
              type: "success",
            });
            card.starNum -= 1;
            bus.emit("refreshUserInfo");
            if (card.starNum == 0) {
              // 如果悬赏次数为0->刷新页面
              that.getPageData(that.currentPage);
            }
          })
          .catch(function (error) {
            console.log(error.status);
            card.starred = false;
          });
      } else {
        ElMessage({
          message: "请先进行 注册/登录!",
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

      this.getPageData(this.currentPage);
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
              nowData.updatedAt = that.parseTimeString(nowData.updatedAt);

              list.push(nowData);
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
};
</script>

<style lang="scss" scoped>
.priceIcon {
  width: 25px;
  height: 25px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.github {
  background-color: none;

  height: auto;
  min-height: 900px;
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
  .el-button {
    background-color: #24d64b;
  }
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
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;

  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}

.card-block {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.card-titleblock {
  margin-bottom: 2%;
  width: 100%;
  display: flex;
}
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
.card-valueblock {
  background-color: none;

  width: 100%;
  display: flex;
}
.card-rank {
  display: flex;
  align-items: center;
  color: #b88230;
  background-color: none;

  width: 80%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: auto;
  margin-bottom: auto;
  text-align: left;
  font-size: medium;
}
#card-button {
  font-size: large;

  width: 30%;
  display: flex;
}
#pagination {
  margin-top: 3%;
  margin-bottom: 3%;
  justify-content: center;
}
</style>
