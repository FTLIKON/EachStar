<template>
  <div id="menu">
    <el-button class="public-button" @click="openPublicDialog()" type="success">
      发布卡片
    </el-button>
    <div v-show="userPrice" class="user-price">
      可用星币: {{ userPrice }}
    </div>
    <PublicDialog ref="PublicDialog" />
  </div>
</template>

<script>
import axios from "axios";
import PublicDialog from "./dialog/public.vue";
export default {
  mounted() {
    this.getUserPrice();
  },
  data() {
    return {
      userPrice: null,
    }
  },
  methods: {
    openPublicDialog() {
      this.$.refs.PublicDialog.openPage();
    },

    getUserPrice() { // 获取用户积分
      var that = this;
      var config = {
        method: "get",
        url: "server/api/user/@me",
      };
      axios(config)
      .then(function (response) {
        that.userPrice = response.data.price;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
  },
  components: {
    PublicDialog,
  },
}
</script>

<style scoped>
.public-button {
  width: 80%;
  height: 50px;
  margin-top: 3%;
  margin-left: 0px !important;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;

  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}
.user-price {
  width: 80%;
  height: 50px;
  margin-top: 3%;
  margin-left: 0px !important;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);

  --el-button-text-color: var(--el-color-white);
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-outline-color: var(--el-color-primary-light-5);

  vertical-align: middle;
  background-color: var(--el-button-bg-color);
  border: var(--el-border);
  border-color: var(--el-button-border-color);
  padding: 8px 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  color: var(--el-button-text-color);
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  transition: .1s;
}
</style>