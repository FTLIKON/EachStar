<template>
  <el-affix :offset="0">
    <div
      class="navi"
      style="
        height: 60px;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        box-shadow: var(--el-box-shadow);
        backdrop-filter: blur(3px);
      "
    >
      <div
        class="left"
        style="
          width: 30%;
          display: flex;
          justify-content: start;
          align-items: center;
        "
      >
        <Logo />
      </div>

      <div
        class="mid"
        style="
          width: 40%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <el-button
          style="
            text-decoration: none;
            font-size: large;
            border: none;
            backdrop-filter: blur(3px);
            --el-button-bg-color: none;
          "
          @click="handleRepo()"
        >
          <svg class="fronticon" aria-hidden="true">
            <use xlink:href="#icon-fangdajing"></use>
          </svg>
          发现仓库
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          style="
            text-decoration: none;
            font-size: large;
            border: none;
            backdrop-filter: blur(3px);
            --el-button-bg-color: none;
          "
          @click="handleMyrepo()"
        >
          <svg class="fronticon" aria-hidden="true">
            <use xlink:href="#icon-geren"></use>
          </svg>
          我的仓库
        </el-button>
      </div>

      <div
        class="right"
        style="
          width: 30%;
          display: flex;
          justify-content: end;
          align-items: center;
        "
      >
        <User />
      </div>
    </div>
  </el-affix>
</template>
<script>
import bus from '@/lib/bus.js'
import User from '@/desktop/user.vue'
import Logo from '@/desktop/logo.vue'
import { getUserType, isLogin } from '@/api/login.js'
import { nologinMessage } from '@/lib/msg.js'
export default {
  components: {
    Logo,
    User,
  },
  data() {
    return {
      type: getUserType(),
    }
  },
  mounted() {
    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    fetchData() {
      this.type = getUserType()
    },

    handleRepo() {
      this.$emit('changeRepo', false)
    },
    handleMyrepo() {
      if (isLogin()) {
        this.$emit('changeRepo', true)
      } else {
        nologinMessage()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
