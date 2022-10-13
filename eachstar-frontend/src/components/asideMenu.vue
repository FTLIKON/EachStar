<template>
  <div id="menu" :style="{width:0.25 * this.windowWidth+'px'}">
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
import bus from "../utils/emitter";
import PublicDialog from "./dialog/public.vue";
import { getUserPrice } from "../api/getUserPrice.js";
export default {
  data() {
    return {
      userPrice: null,
      windowWidth: 1000,
    };
  },
  mounted() {
    this.updateUserPrice();
    bus.on("refreshUserInfo", this.updateUserPrice);

    var that = this;
    window.onresize = () => {
      return(()=>{
        console.log(document.documentElement.clientWidth);
        that.windowWidth = document.documentElement.clientWidth;
      })()
    };
  },
  methods: {
    /**
     * 打开子发布页面
     */
    openPublicDialog() {
      this.$.refs.PublicDialog.openPage();
    },

    /**
     * api更新用户积分
     */
    async updateUserPrice() {
      this.userPrice = await getUserPrice();
    },
  },
  components: {
    PublicDialog,
  },
};
</script>

<style scoped>
#menu {
  min-width: 200px;
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
  width: 80%;
  height: 50px;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}

.user-price {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "微软雅黑";
  margin-top: 2%;
}
</style>
