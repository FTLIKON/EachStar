<template>
  <div v-if="isLogin" style="position: fixed; right: 0px; bottom: 0px">
    <el-button class="public-button" type="primary" @click="handleClick">
      <svg class="fronticon" aria-hidden="true">
        <use xlink:href="#icon-zengjia"></use>
      </svg>
    </el-button>
    <PublicDialog ref="PublicDialog" />
  </div>
</template>

<script>
import bus from '@/lib/bus.js'
import PublicDialog from '@/mobile/dialog/public_dialog.vue'
import { nologinMessage, nopriceMessage } from '@/lib/msg.js'
import { isLogin, getUserPrice } from '@/api/login.js'
export default {
  data() {
    return {
      isLogin: isLogin(),
    }
  },
  mounted() {
    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    fetchData() {
      this.isLogin = isLogin()
    },
    handleClick() {
      if (isLogin()) {
        if (getUserPrice() > 0) {
          this.$refs.PublicDialog.openPage()
        } else {
          nopriceMessage()
        }
      } else {
        nologinMessage()
      }
    },
  },
  components: { PublicDialog },
}
</script>

<style lang="scss" scoped>
.public-button {
  margin: 20px;
  width: 70px;
  height: 70px;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
  border-radius: 50%;
  box-shadow: var(--el-box-shadow-dark);
}
.fronticon {
  width: 35px;
  height: 35px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
