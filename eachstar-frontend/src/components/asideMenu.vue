<template>
  <div id="menu">
    <el-button class="public-button" @click="openPublicDialog()" type="success">
      发布卡片
    </el-button>
    <el-button class="price-button" type="success">
      我的星币 {{ userPrice }}
    </el-button>
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
    font-size: larger;
    font-weight: bolder;
    text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;

    border-radius: 15px;
    box-shadow: var(--el-box-shadow-dark);
}
</style>