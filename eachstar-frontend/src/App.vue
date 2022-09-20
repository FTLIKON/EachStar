<template>
  <div id="app">
    <el-container>
      <!-- header -->
      <el-header><top-nav /></el-header>

      <!-- main content -->
      <el-main><router-view /></el-main>
    </el-container>
  </div>
</template>

<script>
import TopNav from "./components/top-nav.vue";
export default {
  components: {
    "top-nav": TopNav,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #121921;
}

body {
  margin: 0;
}

.el-header {
  box-shadow: var(--el-box-shadow-lighter);
}
</style>
