<template>
  <div id="app">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header class="top-nav">
        <top-nav />
      </el-header>

      <el-container>
        <!-- 侧边菜单 -->
        <!-- <el-aisde class="aside-view"><aside-menu /></el-aisde> -->

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

.top-nav {
  padding-left: 0px;
  padding-right: 0px;
}

.main-view {
  width: 80%;
  padding-left: 0px;
  padding-right: 0px;
  overflow-y: auto;
}
</style>
