<template>
  <div id="app">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header>
        <top-nav />
      </el-header>

      <!-- 卡片页面和侧边栏 -->
      <el-container>
        <el-main><router-view /></el-main>
        <el-aisde><aside-menu /></el-aisde>
      </el-container>

      <!-- 底部页面描述 -->
      <el-footer>
        <bottom-line />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import TopNav from './components/topNav.vue';
import BottomLine from './components/bottomLine.vue';
import AsideMenu from './components/asideMenu.vue';
export default {
  components: {
    TopNav,
    BottomLine,
    AsideMenu
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

html, body {
  margin: 0;
  padding: 0;
}

.el-aside {
  width: 200px;
  height: calc(100vh - 61px);
  overflow-y: hidden;
}

.el-main {
  height: calc(100vh - 61px);
  overflow-y: auto;
}
</style>
