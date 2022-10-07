<template>
  <div class="mygithub" v-loading="loading">
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
        style="box-shadow: 0px 0px 5px 5px #cdd0d6"
        class="card-list"
      >
        <div class="card-block">
          <div class="card-titleblock">
            <a class="card-title" :href="item.title" target="_blank">{{
              item.title
            }}</a>
            <span class="card-time">{{ item.createdAt }}</span>
          </div>
          <div class="card-discription">
            {{ item.context }}
          </div>
          <div class="card-valueblock">
            <span class="card-rank">
              <span
                ><svg class="fronticon" aria-hidden="true">
                  <use xlink:href="#icon-bonus-line"></use></svg
                >星币价值: {{ item.starPrice }}</span
              >
              <el-divider direction="vertical" />
              <span style="color: #409eff"
                ><svg
                  class="fronticon"
                  style="width: 23px; height: 23px; vertical-align: -0.42em"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-cishu"></use></svg
                >剩余悬赏次数: {{ item.starNum }}</span
              >
            </span>
            <el-button
              id="card-button"
              @click="deleteButton(item)"
              type="danger"
              plain
              ><svg class="fronticon" aria-hidden="true">
                <use xlink:href="#icon-lajitong"></use>
              </svg>
              删除</el-button
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
  <Delete ref="Delete" />
</template>

<script>
import axios from "axios";
import bus from "../utils/emitter";
import { ElMessage } from "element-plus";
import Delete from "../components/dialog/delete.vue";
import BottomLine from "../components/bottomLine.vue";
import AsideMenu from "../components/asideMenu.vue";
import "../iconfont/iconfont";

export default {
  name: "mygithub",
  mounted() {
    this.pageChange(1);
    bus.on("refreshPageData", this.refreshPageData);
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
    // ---------- 删除相关 ----------
    deleteButton(card) {
      // 删除按钮->点击打开delete.vue
      this.$.refs.Delete.openPage(card);
    },

    // ---------- page内容显示 ----------
    pageChange: function (page) {
      this.currentPage = page - 1;
      this.getMyPageData(this.currentPage);
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
    getMyPageData: function (page) {
      var that = this;
      var config = {
        method: "get",
        url: "/server/api/card/@me?start=" + page * that.pageSize,
      };
      axios(config)
        .then(function (response) {
          that.totalCard = parseInt(response.data.count);
          that.totalPage = Math.ceil(that.totalCard / 10);

          var list = [];
          var index = 0;
          var start = page * that.pageSize;
          while (index < that.pageSize && start < that.totalCard) {
            let nowData = response.data.data[index];
            nowData.createdAt = that.parseTimeString(nowData.createdAt);
            list.push(nowData);
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
    Delete,
    AsideMenu,
    BottomLine
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

.mygithub {
  display: flex;
}

.card-view {
  display: flex;
  flex-direction: column;
  width: 80%;
  min-width: 760px;
  .card-list {
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
