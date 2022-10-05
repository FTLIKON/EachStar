<template>
  <div id="app">
    <el-container>
      <el-header>
        <top-nav />
      </el-header>

      <el-container>
        <router-view />
      </el-container>
      
      <el-footer>
        <bottom-line />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import TopNav from './components/topNav.vue';
import BottomLine from './components/bottomLine.vue';
export default {
    components: { TopNav, BottomLine }
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
