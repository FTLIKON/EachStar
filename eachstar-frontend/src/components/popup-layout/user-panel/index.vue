<template>
  <div class="user-panel-box">
    <user-sign/>
  </div>
</template>

<script>
import userSign from "./user-sign";

export default {
  components: {
    userSign,
  },
  data() {
    return {
      isLogged: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-panel-box {
  box-sizing: border-box;
  position: fixed;
  width: 640px;
  height: fit-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  background-color: #fff;
  border-radius: 8px;
  padding: 40px 50px;
  z-index: 200;
}
</style>
