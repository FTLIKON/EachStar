<template>
  <div id="app">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header>
        <top-nav />
      </el-header>

      <!-- 卡片页面和侧边栏 -->
      <el-container>
        <router-view />
        <aside-menu />
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

<style>
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

</style>
