<template>
  <div id="app" class="common-layout">
    <el-container>
      <el-header><top-nav /></el-header>
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

<style lang="scss">

</style>
