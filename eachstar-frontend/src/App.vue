<template>
  <div id="app">
<<<<<<< HEAD
    <top-nav />
    <router-view />
=======
    <el-container>
      <!-- header -->
      <el-header><top-nav /></el-header>

      <!-- main content -->
      <router-view />
    </el-container>
>>>>>>> 23d6608 (update: card-box)
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
}

html, body {
  margin: 0;
  padding: 0;
}

</style>
