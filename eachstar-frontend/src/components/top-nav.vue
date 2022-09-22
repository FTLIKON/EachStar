<template>
  <el-page-header :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
      <el-button
        text
        @click="parent()"
        style="color: white; background-color: #3c8dbc; margin-left: 20px"
        >注册 / 登录</el-button
      >
    </template>
  </el-page-header>
  <authPage ref="authPage" />
</template>

<script>
import { ArrowLeft } from "@element-plus/icons-vue";
import authPage from "../views/auth.vue";

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
