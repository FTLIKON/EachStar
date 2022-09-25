<template>
  <el-menu
    id="menu"
    mode="horizontal"
    default-active="1"
    @select="menuSelect"
    :ellipsis="false"
  >
    <div class="left-block">
      <div class="logo">EachStar</div>
    </div>

    <div class="mid-block">
      <el-menu-item index="1">
        <router-link to="/github" class="link">发现仓库</router-link>
      </el-menu-item>
      <el-divider direction="vertical" />
      <el-menu-item index="2">
        <router-link to="/test" class="link">你的仓库</router-link>
      </el-menu-item>
    </div>

    <div class="right-block">
      <el-button @click="authButton()" id="auth-button">注册 / 登录</el-button>
    </div>
  </el-menu>
  <GithubAuth ref="GithubAuth"/>
</template>

<script>
import GithubAuth from './githubAuth.vue';
export default {
    components: { 
      GithubAuth
    },
    data() {
        return {
            userName: this.$cookies.get("user"),
        };
    },
    methods: {
        authButton() {
            this.$.refs.GithubAuth.openPage();
        },
        menuSelect(key, keyPath) {
            console.log(key);
        },
    }
};
</script>

<style scoped>
#menu {
  background-color: none;

  display: flex;
}

.left-block {
  background-color: none;

  width: 30%;
  display: flex;
  justify-content: start;
  align-items: center;
}
.mid-block {
  background-color: none;

  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-block {
  background-color: none;

  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.logo {
  color: #303133;

  margin-left: 10%
}

.link {
  text-decoration: none;
  color: #303133;
}

.divider {
  margin-top: 2%;
}
#auth-button {
  font-weight: bold;
  color: white;
  background-color: #409EFF;
  
  margin: auto 1%;
  margin-left: auto;

  border: none;
  border-radius: 6px;
  text-shadow: 0px 0px 1px #303133; 
}

#logo {
  font-weight: bold;
  font-size: x-large;
  color: white;
  
  margin-right: 1%;
  margin-left: 1%;
  margin-top: auto;
  margin-bottom: auto;

  text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133; 
}
</style>
