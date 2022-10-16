<template>
  <div id="menu" :style="{ width: 0.25 * this.windowWidth + 'px' }">
    <el-button class="public-button" @click="openPublicDialog()" type="primary">
      <svg
        class="fronticon"
        style="width: 23px; height: 23px"
        aria-hidden="true"
      >
        <use xlink:href="#icon-fabu"></use>
      </svg>
      发布卡片
    </el-button>
    <div v-show="userPrice && type == 'GitHub'" class="user-price">
      <svg
        class="fronticon"
        style="color: #b88230; width: 23px; height: 23px; margin-top: 0.5%"
        aria-hidden="true"
      >
        <use xlink:href="#icon-bonus-line"></use></svg
      >可用星币: {{ userPrice }}
    </div>
    <div v-show="userPrice && type == 'Gitee'" class="user-price">
      <svg
        class="fronticon"
        style="
          width: 18px;
          height: 18px;
          color: #c45656;
          margin-top: 1%;
          margin-right: 1%;
        "
        aria-hidden="true"
      >
        <use xlink:href="#icon-yunpan"></use>
      </svg>
      可用云币: {{ userPrice }}
    </div>
    <giteePublic ref="giteePublic" />
    <githubPublic ref="githubPublic" />
  </div>
</template>

<script>
import bus from "../utils/emitter";
import giteePublic from "./dialog/giteePublic.vue";
import githubPublic from "./dialog/githubPublic.vue";
import { getUserPrice } from "../api/getUserPrice.js";
import { UserIsLogin } from "../api/UserIsLogin";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      type: "GitHub",
      userPrice: null,
      windowWidth: 1000,
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.userPrice == null) {
        this.updateUserPrice(this.type);
      }
    }, 2000);
    bus.on("refreshUserInfo", this.updateUserPrice);
    bus.on("typeChange", this.typeChange);

    var that = this;
    this.windowWidth = document.documentElement.clientWidth;
    window.onresize = () => {
      return (() => {
        that.windowWidth = document.documentElement.clientWidth;
      })();
    };
  },
  methods: {
    /**
     * 打开子发布页面
     */
    openPublicDialog() {
      if (UserIsLogin(this.type)) {
        if (this.type == "Gitee") {
          if (this.userPrice <= 0) {
            ElMessage({
              message: "您当前云币不足~ 快去star别人的卡片吧!",
              type: "warning",
            });
          } else {
            this.$.refs.giteePublic.openPage();
          }
        } else if (this.type == "GitHub") {
          if (this.userPrice <= 0) {
            ElMessage({
              message: "您当前星币不足~ 快去star别人的卡片吧!",
              type: "warning",
            });
          } else {
            this.$.refs.githubPublic.openPage();
          }
        }
      } else {
        ElMessage({
          message: "请先进行 登录/注册!",
          type: "warning",
        });
      }
    },

    /**
     * api更新用户积分和type
     */
    async updateUserPrice(type) {
      this.type = type;
      var isLogin = false;
      if (type == "GitHub") {
        if (this.$cookies.get("githubName")) {
          isLogin = true;
        }
      } else if (type == "Gitee") {
        if (this.$cookies.get("giteeName")) {
          isLogin = true;
        }
      }

      if (isLogin) {
        console.log(type);
        this.userPrice = await getUserPrice(type);
      }
    },

    /**
     * 切换页面注销钩子
     */
    async typeChange() {
      bus.off("refreshUserInfo", this.updateUserPrice);
      bus.off("typeChange", this.typeChange);
    },
  },
  components: {
    giteePublic,
    githubPublic,
  },
};
</script>

<style scoped>
#menu {
  min-width: 200px;
}

.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
.public-button {
  width: 50%;
  height: 50px;
  min-width: 150px;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}

.user-price {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "微软雅黑";
  margin-top: 2%;
}
</style>
