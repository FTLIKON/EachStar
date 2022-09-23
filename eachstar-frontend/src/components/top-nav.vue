<template>
  <el-page-header :icon="ArrowLeft">
    <template #content>
      <router-link
        to="/github"
        style="color: white; background-color: #3c8dbc; margin-left: 20px"
      >
        发现仓库
      </router-link>
      <router-link
        to="/test"
        style="color: white; background-color: #3c8dbc; margin-left: 20px"
      >
        你的仓库
      </router-link>
    </template>
    <template #extra>
      <el-button
        text
        @click="parent()"
        style="color: white; background-color: #3c8dbc; margin-left: 800px"
        >注册 / 登录</el-button
      >
    </template>
  </el-page-header>
  <authPage ref="authPage" />
</template>

<script>
import { ArrowLeft } from "@element-plus/icons-vue";
import authPage from "./auth.vue";

export default {
  components: { authPage },
  methods: {
    parent() {
      this.$.refs.authPage.openPage();
    },
  },
};
</script>

<style>
.flex-grow {
  flex-grow: 3;
}
</style>
