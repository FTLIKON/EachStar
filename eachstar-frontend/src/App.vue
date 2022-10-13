<template>
  <div id="app">
    <el-container style="height:100%">
      <!-- 头部导航栏 -->
      <el-header class="top-nav" v-show="!isPhone">
        <top-nav />
      </el-header>

      <el-container style="height: 100%">
        <!-- 侧边菜单 -->
        <!-- <el-aisde class="aside-view"><aside-menu /></el-aisde> -->

        <!-- 卡片页面和底部栏 -->
        <el-main class="main-view">
          <router-view />
          <bottom-line v-show="!isPhone" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopNav from "./components/topNav.vue";
import BottomLine from "./components/bottomLine.vue";
import AsideMenu from "./components/asideMenu.vue";
export default {
  components: {
    TopNav,
    BottomLine,
    AsideMenu,
  },
  mounted() {
    if (this._isMobile()) {
      // 跳转至手机端路由
      this.$router.replace("/phone-home");
      this.isPhone = true;
    } else {
      // 跳转至 pc 端路由
      this.$router.replace("/github");
    }
  },
  data() {
    return { isPhone: false };
  },
  methods: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.top-nav {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.main-view {
  width: 100%;
  display: flex !important;
  flex-direction: column;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 0px !important;
  overflow:hidden
}
</style>
