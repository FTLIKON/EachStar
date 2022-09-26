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
      <el-button v-show="!userId" @click="authButton()" id="auth-button">注册 / 登录</el-button>
      <div v-show="userId" class="user-hello">你好, {{ userName }}!
        <el-button @click="getUserInfo"></el-button>
      </div>
    </div>
  </el-menu>
  <GithubAuth ref="GithubAuth"/>
</template>

<script>
import axios from "axios";
import GithubAuth from './githubAuth.vue';
export default {
    components: { 
      GithubAuth
    },
    data() {
      return {
        userId: this.$cookies.get("userId"),
        userName: this.$cookies.get("userName"),
        uesrIcon: this.$cookies.get("uesrIcon"),
      };
    },
    methods: {
      authButton() {
        this.$.refs.GithubAuth.openPage();
      },
      menuSelect(key, keyPath) {
        console.log(key);
      },

      getUserInfo() {
        var config = {
          method: 'get',
          url: 'server/api/user/@me'
        };
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

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
  
  margin-right: 5%;
  margin-left: 30%;

  border: none;
  border-radius: 6px;
  text-shadow: 0px 0px 1px #303133; 
}
.user-hello {
  margin-right: 5%;
  margin-left: 30%;
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
