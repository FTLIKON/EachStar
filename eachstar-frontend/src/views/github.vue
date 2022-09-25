<template>
  <div class="github">
    <div class="card-view">
      kapian1
      kapian2
    </div>

    <div class="aside-menu">
      <button>123</button><br>
      <button>456</button>
    </div>
  </div>
</template>

<script>
import Card from '../components/card-box.vue';
export default {
    name: "github",
    components: { 
      Card,
    }
};
</script>

<style scoped>
.github {
  background-color: aqua;

  height: 600px;
  margin-top: 2%;
  padding-top: 2%;
  display: flex;
  justify-content: start;
}

.card-view {
  background-color: brown;

  margin-left: 20%;
  width: 60%;
}

.aside-menu {
  background-color: yellowgreen;

  width: 20%;
}
</style>
