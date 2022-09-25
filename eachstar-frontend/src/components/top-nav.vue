<template>
  <el-menu
    id="menu"
    mode="horizontal"
    default-active="1"
    @select="menuSelect"
    
    :ellipsis="false"
  >
    <div class="left-block">
      <div class="logo">EachStar</div>
    </div>

    <div class="mid-block">
      <el-menu-item index="1">
        <router-link to="/github" class="link">发现仓库</router-link>
      </el-menu-item>
      <el-divider direction="vertical" />
      <el-menu-item index="2">
        <router-link to="/test" class="link">你的仓库</router-link>
      </el-menu-item>
    </div>

    <div class="right-block">
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
  color: #303133;

  margin-left: 10%
}

.link {
  text-decoration: none;
  color: #303133;
}
</style>
