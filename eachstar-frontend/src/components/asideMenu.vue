<template>
  <div id="menu">
    <el-button class="public-button" type="success">
        发布卡片
    </el-button>

    <Public @publicCard="publicCard" ref="Public" />
  </div>
</template>

<script>
import Public from "../components/public.vue";
export default {
  methods: {
    openPublicDialog() {
      this.$.refs.Public.openPage();
    },
  },
  components: {
    Public,
  },
}
</script>

<style scoped>
.public-button {
    width: 80%;
    height: 50px;
    margin-top: 3%;
    font-size: larger;
    font-weight: bolder;
    text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;

    border-radius: 15px;
    box-shadow: var(--el-box-shadow-dark);
}
</style>