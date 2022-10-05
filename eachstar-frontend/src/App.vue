<template>
  <div id="app">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header>
        <top-nav />
      </el-header>

      <el-container>
        <!-- 侧边菜单 -->
        <el-aisde class="aside-view"><aside-menu /></el-aisde>

        <!-- 卡片页面和底部栏 -->
        <el-main class="main-view">
          <router-view />
          <bottom-line />
        </el-main>
      </el-container>
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

.aside-view {
  width: 20%;
  height: calc(100vh - 61px);
  overflow-y: hidden;
}

.main-view {
  width: 80%;
  padding-right: 20%;
  height: calc(100vh - 61px);
  overflow-y: auto;
}
</style>
