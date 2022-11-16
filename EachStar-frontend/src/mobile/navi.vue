<template>
  <el-affix :offset="0">
    <div class="navi">
      <!-- 左边logo -->
      <div class="logo">
        <img
          class="logo-pic"
          src="@/assets/images/icon.png"
          @click="goEachStar"
        />
        <span class="text" @click="goEachStar()">EachStar</span>
      </div>

      <!-- 右边菜单 -->
      <div class="navi-menu">
        <!-- 切换按钮 -->
        <el-button class="toggle-btn" v-if="toggleCooldown" loading>
          冷却中
        </el-button>
        <el-button
          class="toggle-btn"
          v-else-if="type == 'GitHub'"
          @click="handleChangeType()"
          style="background-color: #333436; color: #ffffff"
        >
          去码云版
        </el-button>
        <el-button
          class="toggle-btn"
          v-else
          @click="handleChangeType()"
          style="background-color: #cdd0d6; color: #333436"
        >
          去GitHub版
        </el-button>

        <el-divider direction="vertical"></el-divider>
        
        <!-- 菜单栏 -->
        <Menu v-if="isLogin"></Menu>
      </div>
    </div>
  </el-affix>
</template>

<script>
import bus from '@/lib/bus.js'
import Menu from '@/mobile/button/menu.vue'
import { goEachStar } from '@/lib/url.js'
import { getUserType, getOtherType, isLogin } from '@/api/login'
import { useDark } from '@vueuse/core'
export default {
  data() {
    return {
      type: getUserType(),
      isLogin: isLogin(),
      isDark: useDark(),
      toggleCooldown: false,
    }
  },
  mounted() {
    this.fetchData()

    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    goEachStar,
    fetchData() {
      this.type = getUserType()
      this.isLogin = isLogin()
      this.isDark = getUserType() != 'GitHub'
    },

    handleChangeType() {
      // toggle cooldown
      var that = this
      this.toggleCooldown = true
      setTimeout(() => {
        that.toggleCooldown = false
      }, 2000)

      bus.emit('updateUser', getOtherType(this.type))
    },
    handleOtherType(type) {
      return getOtherType(type)
    },
  },
  components: {
    Menu,
  },
}
</script>

<style lang="scss" scoped>
.navi {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: var(--el-box-shadow);
  backdrop-filter: blur(3px);
  .logo-pic {
    width: 12%;
    min-width: 50px;
  }
  .text {
    color: #ffffff;
    font-weight: bold;
    font-size: 24px;
    text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133;
    display: flex;
    align-items: center;
  }
}

.logo {
  display: flex;
  flex-direction: row;
}
.navi-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.toggle-btn {
  margin-left: 10px;
  font-weight: bold;
}
</style>
