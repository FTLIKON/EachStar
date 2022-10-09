<template>
  <div id="menu">
    <el-button class="public-button" @click="openPublicDialog()" type="success">
      <svg
        class="fronticon"
        style="width: 23px; height: 23px"
        aria-hidden="true"
      >
        <use xlink:href="#icon-fabu"></use>
      </svg>
      发布卡片
    </el-button>
    <div v-show="userPrice" class="user-price">
      <svg
        class="fronticon"
        style="color: #b88230; width: 23px; height: 23px"
        aria-hidden="true"
      >
        <use xlink:href="#icon-bonus-line"></use></svg
      >可用星币: {{ userPrice }}
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
    };
  },
  methods: {
    openPublicDialog() {
      this.$.refs.PublicDialog.openPage();
    },

    getUserPrice() {
      // 获取用户积分
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
};
</script>

<style scoped>
#menu {
  width: 100%;
  min-width: 85px;
}

.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
.public-button {
  width: 50%;
  min-width: 110px;
  height: 50px;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
  margin-left: 10%;
  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}

.user-price {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /*垂直居中*/
  font-family: "微软雅黑";
  margin-top: 2%;
  margin-left: 5%;
}
</style>
