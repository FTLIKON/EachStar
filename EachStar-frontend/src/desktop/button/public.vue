<template>
  <div>
    <PublicDialog ref="PublicDialog" />
    <el-button class="public-button" type="primary" @click="handleClick">
      <svg
        class="fronticon"
        style="width: 23px; height: 23px"
        aria-hidden="true"
      >
        <use xlink:href="#icon-fabu"></use>
      </svg>
      发布卡片
    </el-button>
  </div>
</template>

<script>
import PublicDialog from '@/desktop/dialog/public_dialog.vue'
import { nologinMessage, nopriceMessage } from '@/lib/msg.js'
import { isLogin, getUserPrice } from '@/api/login.js'
export default {
  methods: {
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
  width: 50%;
  height: 50px;
  min-width: 150px;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
