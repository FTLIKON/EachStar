<template>
  <el-menu
    class="top-menu"
    mode="horizontal"
    @select="menuSelect"
  >
    <el-menu-item index="1">
      <router-link to="/github" class="link">发现仓库</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link to="/test" class="link">你的仓库</router-link>
    </el-menu-item>

    <el-button @click="authButton()" id="auth-button">注册 / 登录</el-button>
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
.flex-grow {
  flex-grow: 3;
}

.link {
  color: white;
  text-decoration: none;
}

#auth-button {
  color: white;
  background-color: #3c8dbc;
  
  height: auto;
  margin-right: 1%;
  margin-left: auto;
}
</style>
