<template>
  <div id="github">
    <Card />
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

<style>
#github {
  padding-top: 2%;
  background-image: linear-gradient(to bottom, #dcfff9,#ffffff);
}
</style>
