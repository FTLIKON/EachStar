<template>
  <div id="app">
    <el-container style="height:100%">
      <!-- 头部导航栏 -->
      <el-header class="top-nav" v-show="!isPhone">
        <top-nav />
      </el-header>

      <el-container style="overflow: auto">
        <!-- 侧边菜单 -->
        <!-- <el-aisde class="aside-view"><aside-menu /></el-aisde> -->

        <!-- 卡片页面和底部栏 -->
        <el-main class="main-view" ref="box">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopNav from "./components/topNav.vue";
import AsideMenu from "./components/asideMenu.vue";
import bus from "./utils/emitter";
export default {
  components: {
    TopNav,
    AsideMenu,
  },
  mounted() {
    bus.on("scrollToTop", this.scrollTop);
    if (this._isMobile()) {
      // 跳转至手机端路由
      this.$router.replace("/phone-home");
      this.isPhone = true;
    }
  },
  data() {
    return { isPhone: false };
  },
  methods: {
    scrollTop() {
      this.$nextTick(() => {
        this.$refs.box.scrollTop = 0;
      })
    },
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
  overflow: hidden;
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
}
</style>
