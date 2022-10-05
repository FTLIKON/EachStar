<template>
  <el-affix :offset="0">
    <el-menu
      id="menu"
      mode="horizontal"
      default-active="1"
      @select="menuSelect"
      :ellipsis="false"
    >
      <div class="left-block">
        <div class="logo">
          <img class="logo-pic" src="icon.png" @click="goEachStar()" />
          <span @click="goEachStar()">EachStar</span>
        </div>
      </div>

      <div class="mid-block">
        <el-menu-item index="1">
          <router-link to="/github" class="link">
            <svg class="fronticon" style="margin-top: 10%" aria-hidden="true">
              <use xlink:href="#icon-fangdajing"></use>
            </svg>
            发现仓库</router-link
          >
        </el-menu-item>
        <el-divider direction="vertical" />
        <el-menu-item index="2">
          <router-link to="/mygithub" class="link" v-show="isLogin">
            <svg class="fronticon" aria-hidden="true">
              <use xlink:href="#icon-geren"></use>
            </svg>
            我的仓库</router-link
          >
          <router-link
            to="/github"
            @click="noLoginError()"
            class="link"
            v-show="!isLogin"
          >
            <svg class="fronticon" aria-hidden="true">
              <use xlink:href="#icon-geren"></use>
            </svg>
            我的仓库</router-link
          >
        </el-menu-item>
      </div>

      <div class="right-block">
        <el-button v-show="!isLogin" @click="authButton()" id="auth-button"
          >登录 / 注册</el-button
        >
        <span v-show="isLogin" class="user-rank"
          ><svg
            class="fronticon"
            style="color: #b88230; margin-top: 12%"
            aria-hidden="true"
          >
            <use xlink:href="#icon-bonus-line"></use></svg
          >可用星币: {{ userPrice }}</span
        >
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
  <Logout ref="Logout" />
</template>

<script>
import bus from "../utils/emitter";
import { buildSlots } from "@vue/compiler-core";
import axios from "axios";
import GithubAuth from "./githubAuth.vue";
import Logout from "./logout.vue";
import { ElMessage } from "element-plus";
import "../iconfont/iconfont";

export default {
  components: {
    GithubAuth,
    Logout,
  },
  data() {
    return {
      userName: "",
      userPrice: null,
      userIconURL: null,
      isLogin: false,
    };
  },
  mounted() {
    this.getUserInfo();
    bus.on("refreshUserInfo", this.getUserInfo);
  },
  methods: {
    // 注册按钮
    authButton() {
      this.$.refs.GithubAuth.openPage();
    },
    // 登出按钮
    logoutButton() {
      this.$.refs.Logout.openPage();
    },
    // 未登录禁止打开我的仓库
    noLoginError() {
      ElMessage({
        message: "请先进行 注册/登录!",
        type: "warning",
      });
    },

    goEachStar() {
      // 切换到EachStar
      window.location.href = "https://github.com/FTLIKON/EachStar";
    },

    getUserInfo() {
      // 刷新用户信息->data
      var that = this;
      var config = {
        method: "get",
        url: "server/api/user/@me",
      };
      axios(config)
        .then(function (response) {
          that.userName = response.data.githubName;
          that.userPrice = response.data.price;
          that.userIconURL = response.data.icon;
          that.isLogin = true;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    
    menuSelect(key, keyPath) {
      // 菜单选择
      // console.log('[DEBUGGER] '+key);
    },
  },
};
</script>

<style scoped>
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}

#menu {
  background-color: none;

  display: flex;
}

.left-block {
  background-color: none;

  width: 30%;
  display: flex;
  justify-content: start;
  align-items: center;
}
.mid-block {
  background-color: none;

  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-block {
  background-color: none;

  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

.link {
  text-decoration: none;
  color: #303133;
  font-size: large;
}
.link-noLogin {
  text-decoration: none;
  color: #303133;
  background-color: none;
  font-size: large;
  font-style: normal;

  border: none;
}

.divider {
  margin-top: 2%;
}
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
  font-family: "微软雅黑";
  margin-left: 10%;
  margin-right: 10%;
  width: 25%;
  height: 80%;
}
.user-hello {
  width: 45%;
}
.user-icon {
  width: 10%;
  margin-right: 4%;
  margin-top: auto;
  margin-bottom: auto;

  border-radius: 50%;
  border: 2px solid var(--el-border-color);
}
</style>
