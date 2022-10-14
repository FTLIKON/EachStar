<template>
  <el-affix :offset="0">
    <!-- 主栏 -->
    <el-menu id="menu" mode="horizontal" default-active="1" :ellipsis="false">
      <!-- GitHub LOGO -->
      <div class="left-block" v-show="this.type == 'GitHub'">
        <div class="logo">
          <img class="logo-pic" src="icon.png" @click="goEachStar" />
          <span @click="goEachStar">EachStar</span>
          <el-button @click="toggleType()" style="margin-left: 5%" v-loading="toggleCooldown"
            >切换到码云版</el-button
          >
        </div>
      </div>

      <!-- Gitee LOGO -->
      <div class="left-block" v-show="this.type == 'Gitee'">
        <div class="logo">
          <img class="logo-pic" src="icon.png" @click="goEachStar" />
          <span @click="goEachStar">EachStar</span>
          <el-button @click="toggleType()" style="margin-left: 5%" v-loading="toggleCooldown"
            >切换到GitHub版</el-button
          >
        </div>
      </div>

      <!-- Github菜单栏 -->
      <div class="mid-block" v-show="this.type == 'GitHub'">
        <el-menu-item index="1">
          <router-link to="/github" class="githublink">
            <svg class="fronticon" style="margin-top: 10%" aria-hidden="true">
              <use xlink:href="#icon-fangdajing"></use>
            </svg>
            发现仓库
          </router-link>
        </el-menu-item>
        <el-divider class="divider" direction="vertical" />
        <el-menu-item index="2">
          <router-link to="/mygithub" class="githublink" v-show="isLogin">
            <svg class="fronticon" aria-hidden="true">
              <use xlink:href="#icon-geren"></use>
            </svg>
            我的仓库</router-link
          >
          <router-link
            to="/github"
            @click="noLoginError()"
            class="githublink"
            v-show="!isLogin"
          >
            <svg class="fronticon" aria-hidden="true">
              <use xlink:href="#icon-geren"></use>
            </svg>
            我的仓库</router-link
          >
        </el-menu-item>
      </div>

      <!-- Gitee菜单栏 -->
      <div class="mid-block" v-show="this.type == 'Gitee'">
        <el-menu-item index="1">
          <router-link to="/gitee" class="giteelink">
            <svg class="fronticon" style="margin-top: 10%" aria-hidden="true">
              <use xlink:href="#icon-fangdajing"></use>
            </svg>
            发现仓库
          </router-link>
        </el-menu-item>
        <el-divider class="divider" direction="vertical" />
        <el-menu-item index="2">
          <router-link to="/mygitee" class="giteelink" v-show="isLogin">
            <svg class="fronticon" aria-hidden="true">
              <use xlink:href="#icon-geren"></use>
            </svg>
            我的仓库</router-link
          >
          <router-link
            to="/gitee"
            @click="noLoginError()"
            class="giteelink"
            v-show="!isLogin"
          >
            <svg class="fronticon" aria-hidden="true">
              <use xlink:href="#icon-geren"></use>
            </svg>
            我的仓库</router-link
          >
        </el-menu-item>
      </div>

      <!-- 用户信息栏 -->
      <div class="right-block">
        <el-button v-show="!isLogin" @click="authButton()" id="auth-button"
          >登录 / 注册</el-button
        >
        <span v-show="isLogin && type == 'GitHub'" class="user-rank">
          <svg
            class="fronticon"
            style="color: #b88230; margin-top: 12%"
            aria-hidden="true"
          >
            <use xlink:href="#icon-bonus-line"></use>
          </svg>
          星币: {{ userPrice }}
        </span>
        <span v-show="isLogin && type == 'Gitee'" class="user-rank">
          <svg
            class="fronticon"
            style="color: #b88230; margin-top: 12%"
            aria-hidden="true"
          >
            <use xlink:href="#icon-bonus-line"></use>
          </svg>
          云币: {{ userPrice }}
        </span>
        <span v-show="isLogin" class="user-hello">您好, {{ userName }}</span>

        <el-popover
          v-show="isLogin"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
        >
          <template #reference>
            <el-avatar
              v-show="isLogin"
              :src="userIconURL"
              src="https://avatars.githubusercontent.com/u/72015883?v=4"
            />
          </template>
          <template #default>
            <el-button
              @click="logoutButton()"
              id="card-button"
              type="danger"
              plain
            >
              退出登录
            </el-button>
          </template>
        </el-popover>
      </div>
    </el-menu>
  </el-affix>
  <GithubAuth ref="GithubAuth" />
  <GiteeAuth ref="GiteeAuth" />
  <GithubLogout ref="GithubLogout" />
  <GiteeLogout ref="GiteeLogout" />
</template>

<script>
import bus from "../utils/emitter";
import GithubAuth from "./githubAuth.vue";
import GithubLogout from "./dialog/githubLogout.vue";
import GiteeAuth from "./giteeAuth.vue";
import GiteeLogout from "./dialog/giteeLogout.vue";
import ToggleButton from "./toggleButton.vue";
import { ElMessage } from "element-plus";
import { getUserInfo } from "../api/getUserInfo.js";
import "../iconfont/iconfont";
import { useDark } from "@vueuse/core";
import { UserIsLogin } from "../api/UserIsLogin";
import router from "../router";
import { getUserPrice } from "../api/getUserPrice";

export default {
  data() {
    return {
      type: "GitHub",
      isDark: useDark(),
      isLogin: false,
      toggleCooldown: false,

      userName: "",
      userPrice: null,
      userIconURL: null,
    };
  },
  mounted() {
    this.isDark = false;
    bus.on("refreshUserInfo", this.updateUserInfo);

    bus.emit("refreshUserInfo", this.type);
  },
  methods: {
    /**
     * 切换Type
     */
    async toggleType() {
      var that = this;
      this.toggleCooldown = true; // 3秒冷却
      setTimeout(function(){
        that.toggleCooldown = false;
      }, 3000)

      if (this.type == "GitHub") {
        this.type = "Gitee";
        this.isDark = true;
      } else if (this.type == "Gitee") {
        this.type = "GitHub";
        this.isDark = false;
      }

      bus.emit("typeChange");
      await router.push('/'+this.type.toLowerCase())
      bus.emit("refreshUserInfo", this.type);
    },

    /**
     * 注册按钮
     */
    authButton() {
      if (this.type == "GitHub") {
        this.$.refs.GithubAuth.openPage();
      } else if ((this.type = "Gitee")) {
        this.$.refs.GiteeAuth.openPage();
      }
    },

    /**
     * 登出按钮
     */
    logoutButton() {
      if (this.type == "GitHub") {
        this.$.refs.GithubLogout.openPage();
      } else if ((this.type = "Gitee")) {
        this.$.refs.GiteeLogout.openPage();
      }
    },

    /**
     * 未登录提示
     */
    noLoginError() {
      ElMessage({
        message: "请先进行 登录/注册!",
        type: "warning",
      });
    },

    /**
     * 更新用户信息
     */
    async updateUserInfo(type) {
      this.type = type;
      this.userName = "";
      this.userPrice = null;
      this.userIconURL = null;
      this.isLogin = false;

      if ( type == "GitHub" ) {
        if(this.$cookies.get("githubName")){
          this.userName = this.$cookies.get("githubName")
          this.userIconURL = this.$cookies.get("githubAvatar")
          this.isLogin = true
        }
      } else if ( type == "Gitee" ) {
        if(this.$cookies.get("giteeName")){
          this.userName = this.$cookies.get("giteeName")
          this.userIconURL = this.$cookies.get("giteeAvatar")
          this.isLogin = true
        }
      }

      if (this.isLogin) {
        var data = await getUserInfo(type);
        this.userPrice = data.price;
      } else {
        console.log("你还没有登录" + this.type);
      }
    },

    /**
     * 前往EachStar主页
     */
    goEachStar() {
      window.location.href = "https://github.com/FTLIKON/EachStar";
    },
  },
  components: {
    GiteeAuth,
    GiteeLogout,
    GithubAuth,
    GithubLogout,
  },
};
</script>

<style lang="scss" scoped>
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}

#menu {
  .left-block {
    width: 30%;
    display: flex;
    .logo {
      color: #ffffff;
      font-weight: bold;
      font-size: 35px;
      text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133;

      display: flex;
      align-items: center;
      margin-left: 2%;
    }
    .logo-pic {
      width: 12%;
      min-width: 50px;
      margin-right: 2%;
    }
  }
  .mid-block {
    width: 40%;
    display: flex;
    justify-content: center;

    .githublink {
      text-decoration: none;
      color: #303133;
      font-size: large;
    }
    .giteelink {
      text-decoration: none;
      color: #f2f6fc;
      font-size: large;
    }
    .divider {
      margin-top: 2%;
    }
  }
  .right-block {
    width: 30%;
    display: flex;
    align-items: center;

    #auth-button {
      font-weight: bold;
      color: white;
      background-color: #409eff;

      margin-right: 5%;
      margin-left: 30%;
      font-size: medium;
      border: none;
      border-radius: 6px;
      text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
    }
    .user-rank {
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center; /*垂直居中*/
      margin-left: 10%;
      margin-right: 10%;
      width: 25%;
      height: 80%;
    }
    .user-hello {
      width: 45%;
    }
  }
}
</style>
