<template>
  <el-drawer
    v-model="dialogVisible"
    direction="ltr"
    size="80%"
    append-to-body
    :title="handleTitle()"
  >
    <div
      style="
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <!-- 头像 -->
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        "
      >
        <el-avatar
          style="height: 80px; width: 80px"
          v-show="userName != ''"
          :src="userIcon"
        />
      </div>

      <!-- 币 -->
      <Price></Price>

      <!-- 切换仓库 -->
      <el-button
        @click="handleRepo()"
        style="width: 50%; margin: 20px 0 0 0; font-size: 16px"
      >
        <svg class="fronticon" aria-hidden="true">
          <use xlink:href="#icon-fangdajing"></use>
        </svg>
        发现仓库
      </el-button>

      <el-button
        @click="handleMyRepo()"
        style="width: 50%; margin: 10px 0 0 0; font-size: 16px"
      >
        <svg class="fronticon" aria-hidden="true">
          <use xlink:href="#icon-geren"></use>
        </svg>
        我的仓库
      </el-button>

      <div style="margin-top: auto;">
        <div style="margin-top: 3px; margin-left: 6px">
          <svg class="fronticon" aria-hidden="true">
            <use xlink:href="#icon-github"></use>
          </svg>
          本站已开源:
          <el-link href="https://github.com/FTLIKON/EachStar">
            FTLIKON/EachStar
          </el-link>
        </div>
        <div style="margin-top: 3px; margin-left: 6px">
          <svg class="fronticon" aria-hidden="true">
            <use xlink:href="#icon-qq"></use>
          </svg>
          交流QQ群:
          <el-link
            href="https://qm.qq.com/cgi-bin/qm/qr?k=r2jN9fZaagH6qcLVb-QglnYWNPpKMPA6&jump_from=webapi&authKey=Ye43FWw3UiCdZ4bar3EY+qerAgjLHm3uC5xs2DWmeuuO9QeBV26bxaxCPC3YxM6H"
          >
            184109839
          </el-link>
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 按钮 -->
      <el-button
        size="small"
        type="danger"
        @click="logout"
        style="width: 50%; height: 36px; font-size: 16px"
      >
        退出登录
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import bus from '@/lib/bus.js'
import Price from '@/mobile/button/price.vue'
import { getUserType, getUser } from '@/api/login.js'
import { userLogout } from '@/api/api'
import { logoutConfirm } from '@/lib/confirm.js'
export default {
  data() {
    return {
      dialogVisible: false,
      type: getUserType(),
      userName: getUser().name,
      userIcon: getUser().avatar,
      myrepo: false,
    }
  },
  mounted() {
    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    fetchData() {
      this.type = getUserType()
      this.userName = getUser().name
      this.userIcon = getUser().avatar
    },

    async logout() {
      if (await logoutConfirm()) {
        userLogout(getUserType())
      }
    },
    handleRepo() {
      // 切换发现仓库
      this.myrepo = false
      bus.emit('updateCard', { myrepo: this.myrepo })
      this.dialogVisible = false
    },
    handleMyRepo() {
      // 切换我的仓库
      this.myrepo = true
      bus.emit('updateCard', { myrepo: this.myrepo })
      this.dialogVisible = false
    },
    handleTitle() {
      return '👋 您好, ' + this.userName
    },
  },
  components: { Price },
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 22px;
  height: 22px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
