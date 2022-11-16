<template>
  <el-dialog
    style="width: 20%; min-width: 300px; margin-top: 200px"
    v-model="dialogVisible"
    append-to-body
    :title="title"
  >
    <div class="main-block">
      <img
        class="github-logo"
        src="@/assets/images/githubLogo.webp"
        v-show="this.type == 'GitHub'"
      />
      <img
        class="gitee-logo"
        src="@/assets/images/giteeLogo.png"
        v-show="this.type == 'Gitee'"
      />

      <el-button class="link-button" type="primary" @click="handleDialogClick">
        使用{{ type }}快捷登录
      </el-button>
    </div>
  </el-dialog>
  <el-button class="auth-button" @click="handleClick()">{{ loginButton }}</el-button>
</template>

<script>
import { loginButton } from '@/assets/text.js'
import { goLogin, getUserType } from '@/api/login.js'
export default {
  data() {
    return {
      loginButton,
      dialogVisible: false,

      type: getUserType(),
      title: '登入/注册',
    }
  },
  methods: {
    handleClick() {
      this.dialogVisible = true
      this.type = getUserType()
      this.title = '登入/注册'
    },
    handleDialogClick() {
      goLogin(getUserType())
    },
  },
}
</script>
<style lang="scss" scoped>
.main-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gitee-logo {
  width: 45%;
  height: 30%;
  max-width: 120px;
  margin-bottom: 5%;
}
.github-logo {
  width: 60%;
  height: 40%;
  max-width: 180px;
  margin-bottom: 5%;
}
.link-button {
  min-width: 200px;
  min-height: 50px;
  margin-left: 15%;
  margin-right: 15%;
  margin-bottom: 5%;
  font-size: larger;
  font-weight: bolder;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;

  border-radius: 15px;
  box-shadow: var(--el-box-shadow-dark);
}
.auth-button {
  font-weight: bold;
  color: white;
  background-color: #409eff;

  margin-left: -150%;
  font-size: medium;
  border: none;
  border-radius: 6px;
  text-shadow: 1px 1px 2px #303133, 0px 0px 2px #303133;
}
</style>
