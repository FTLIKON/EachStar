<template>
  <div id="app">
    <top-nav />
    <router-view />
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
