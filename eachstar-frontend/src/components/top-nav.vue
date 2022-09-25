<template>
  <el-menu
    id="menu"
    mode="horizontal"
    default-active="1"
    :ellipsis="false"
    @select="menuSelect"
  >
    <div class="left-block">
      <div class="logo">EachStar</div>
    </div>

    <div class="mid-block">
      <el-menu-item index="1">
        <router-link to="/github" class="link">发现仓库</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/test" class="link">你的仓库</router-link>
      </el-menu-item>
    </div>

    <div class="right-block">
      <span id="rank">积分 0/100</span>
      <el-button @click="authButton()" id="auth-button">注册 / 登录</el-button>
    </div>
  </el-menu>
  <authPage ref="authPage" />
</template>

<script>
import authPage from "./auth.vue";

export default {
  components: { authPage },
  methods: {
    authButton() {
      this.$.refs.authPage.openPage();
    },
    menuSelect(key, keyPath) {
      console.log(key);
    },
  },
};
</script>

<style>
#menu {
  background-color: slategray;

  display: flex;
}

.left-block {
  background-color: beige;

  width: 30%;
  display: flex;
  justify-content: start;
}

.mid-block {
  background-color: burlywood;

  width: 40%;
  display: flex;
  justify-content: center;
}

.right-block {
  background-color: yellow;

  width: 30%;
}
</style>
