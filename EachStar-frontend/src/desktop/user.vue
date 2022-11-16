<template>
  <div
    class="user"
    style="
      display: flex;
      flex-wrap: nowrap;
      margin-right: 8px;
      align-items: center;
    "
  >
    <div class="loginbtn" v-show="userName == ''"><Login /></div>
    <div
      class="name"
      v-show="userName != ''"
      style="font-size: 14px; margin: auto 12px"
    >
      您好，{{ userName }}
    </div>

    <!-- 用户头像&退出登录 -->
    <el-popover
      :visible="visible"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
      trigger="hover"
    >
      <div style="text-align: right; margin: 0">
        <el-button @click="logout" type="danger" plain>退出登录</el-button>
      </div>
      <template #reference>
        <el-avatar class="icon" v-show="userName != ''" :src="userIcon" />
      </template>
    </el-popover>
  </div>
</template>

<script>
import bus from "@/lib/bus.js";
import { getUserType, getUser } from "@/api/login.js";
import Login from "@/desktop/button/login.vue";
import { userLogout } from "../api/api";
import { logoutConfirm } from "@/lib/confirm.js";
export default {
  data() {
    return {
      type: getUserType(),
      userName: getUser().name,
      userIcon: getUser().avatar,
    };
  },
  mounted() {
    bus.on("afterUpdated", this.fetchData);
  },
  methods: {
    fetchData() {
      this.type = getUserType();
      this.userName = getUser().name;
      this.userIcon = getUser().avatar;
    },
    async logout() {
      if (await logoutConfirm()) {
        userLogout(getUserType());
      }
    },
  },
  components: { Login },
};
</script>
