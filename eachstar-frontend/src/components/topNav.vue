<template>
  <el-menu
    id="menu"
    mode="horizontal"
    default-active="1"
    @select="menuSelect"
    :ellipsis="false"
  >
    <div class="left-block">
      <div class="logo">
        <img class="logo-pic" src="logo.png">
        EachStar</div>
    </div>

    <div class="mid-block">
      <el-menu-item index="1">
        <router-link to="/github" class="link">发现仓库</router-link>
      </el-menu-item>
      <el-divider direction="vertical" />
      <el-menu-item index="2">
        <router-link to="/mygithub" class="link">你的仓库</router-link>
      </el-menu-item>
    </div>

    <div class="right-block">
      <el-button v-show="!isLogin" @click="authButton()" id="auth-button">注册 / 登录</el-button>
      <span v-show="isLogin" class="user-rank">积分: {{ userPrice }}</span>
      <span v-show="isLogin" class="user-hello">你好, {{ userName }}!</span>
    </div>
  </el-menu>
  <GithubAuth ref="GithubAuth"/>
</template>

<script>
import bus from '../utils/emitter';
import { buildSlots } from "@vue/compiler-core";
import axios from "axios";
import GithubAuth from './githubAuth.vue';
export default {
    components: { 
      GithubAuth
    },
    data() {
      return {
        userName: "",
        userPrice: null,
        isLogin: false,
      };
    },
    beforeDestroy() {
    },
    mounted() {
      this.getUserInfo();
      bus.on('refreshUserInfo', this.getUserInfo);
    },
    methods: {
      authButton() {
        this.$.refs.GithubAuth.openPage();
      },
      menuSelect(key, keyPath) {
        console.log(key);
      },

      // 刷新用户信息->data
      getUserInfo() {
        var that = this;
        var config = {
          method: 'get',
          url: 'server/api/user/@me'
        };
        axios(config)
        .then(function (response) {
          that.userName = response.data.githubName;
          that.userPrice = response.data.price;
          that.isLogin = true;
        })
        .catch(function (error) {
          console.log(error);
        });
      },
    }
};
</script>

<style scoped>
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
  font-size: x-large;
  text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133; 

  margin-left: 10%
}

.link {
  text-decoration: none;
  color: #303133;
  font-size: large;
}

.divider {
  margin-top: 2%;
}
#auth-button {
  font-weight: bold;
  color: white;
  background-color: #409EFF;
  
  margin-right: 5%;
  margin-left: 30%;

  border: none;
  border-radius: 6px;
  text-shadow: 0px 0px 1px #303133; 
}
.user-rank {
  margin-left: 10%;
  margin-right: 10%;
  width: 30%;
}
.user-hello {
  margin-right: 5%;
  width: 45%;
}

#logo {
  font-weight: bold;
  font-size: x-large;
  color: white;
  
  margin-right: 1%;
  margin-left: 1%;
  margin-top: auto;
  margin-bottom: auto;

  text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133; 
}
</style>
