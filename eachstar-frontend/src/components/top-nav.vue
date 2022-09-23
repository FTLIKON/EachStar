<template>
  <el-menu
    class="top-menu"
    mode="horizontal"
    @select="menuSelect"
  >
    <el-menu-item index="1">
      <router-link to="/github" class="link">欢迎加入</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link to="/github" class="link">发现仓库</router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link to="/test" class="link">你的仓库</router-link>
    </el-menu-item>

    <el-button @click="authButton()" id="auth-button">注册 / 登录</el-button>
    <div id="logo">EachStar</div>
  </el-menu>
  <authPage ref="authPage" />
</template>

<script>
import { ArrowLeft } from "@element-plus/icons-vue";
import authPage from "./auth.vue";

export default {
  components: { authPage },
  methods: {
    authButton() {
      this.$.refs.authPage.openPage();
    },
  },
};
</script>

<style>
.link {
  font-weight: bold;
  color: white;
  text-decoration: none;
}

#auth-button {
  font-weight: bold;
  color: white;
  background-color: #337ecc;
  
  margin: auto 1%;
  margin-left: auto;

  border: none;
  border-radius: 6px;
  text-shadow: 0px 0px 1px #303133; 
}

#logo {
  font-weight: bold;
  font-size: x-large;
  color: white;
  
  margin-right: 1%;
  margin-left: 1%;
  margin-top: auto;
  margin-bottom: auto;

  text-shadow: 1px 1px 2px #303133, 0px 0px 1px #303133; 
}
</style>
