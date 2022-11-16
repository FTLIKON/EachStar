<template>
  <div
    v-if="!this.isLogin"
    style="display: flex; flex-direction: column; align-items: center"
  >
    <img
      style="width: 50%; margin-bottom: 15px; margin-top: 15px"
      src="@/assets/images/githubLogo.webp"
      v-show="this.type == 'GitHub'"
    />
    <img
      style="width: 30%; margin-bottom: 15px; margin-top: 15px"
      src="@/assets/images/giteeLogo.png"
      v-show="this.type == 'Gitee'"
    />

    <el-button style="font-size: large" type="primary" @click="handleClick">
      使用{{ type }}快捷登录
    </el-button>
  </div>
</template>

<script>
import bus from '@/lib/bus.js'
import { goLogin, getUserType, isLogin } from '@/api/login.js'
export default {
  data() {
    return {
      isLogin: isLogin(),
      type: getUserType(),
      title: '使用 ' + getUserType() + ' 快捷登录',
    }
  },
  mounted() {
    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    fetchData() {
      this.type = getUserType()
      this.isLogin = isLogin(getUserType())
      this.title = '使用 ' + getUserType() + ' 快捷登录'
    },
    handleClick() {
      goLogin(getUserType())
    },
  },
}
</script>
