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
