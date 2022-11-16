<template>
  <div class="logo">
    <img class="logo-pic" src="@/assets/images/icon.png" @click="goEachStar" />
    <span class="text" @click="goEachStar()">EachStar</span>
    <el-button class="toggle-btn" v-if="toggleCooldown" loading>
      冷却中
    </el-button>
    <el-button
      class="toggle-btn"
      v-else-if="type == 'GitHub'"
      @click="handleChangeType()"
      style="background-color: #333436; color: #ffffff"
    >
      切换至码云版
    </el-button>
    <el-button
      class="toggle-btn"
      v-else
      @click="handleChangeType()"
      style="background-color: #cdd0d6; color: #333436"
    >
      切换至GitHub版
    </el-button>
  </div>
</template>

<script>
import bus from '@/lib/bus.js'
import { goEachStar } from '@/lib/url.js'
import { getUserType, getOtherType } from '@/api/login'
import { useDark } from '@vueuse/core'
export default {
  data() {
    return {
      type: getUserType(),
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
      this.isDark = getUserType() != 'GitHub'
    },

    handleChangeType() {
      if (!this.toggleCooldown) {
        var that = this

        that.toggleCooldown = true
        var otherType = getOtherType(that.type)
        bus.emit('updateUser', otherType)

        setTimeout(() => {
          that.toggleCooldown = false
        }, 2000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  .logo-pic {
    width: 12%;
    min-width: 50px;
  }
  .text {
    color: #ffffff;
    font-weight: bold;
    font-size: 35px;
    text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133;
    display: flex;
    align-items: center;
  }
  .toggle-btn {
    margin-left: 10px;
    font-weight: bold;
  }
}
</style>
