<template>
  <div id="menu" :style="{width:0.25 * this.windowWidth+'px'}">
    <el-button class="public-button" @click="openPublicDialog()" type="success">
      <svg
        class="fronticon"
        style="width: 23px; height: 23px"
        aria-hidden="true"
      >
        <use xlink:href="#icon-fabu"></use>
      </svg>
      发布卡片
    </el-button>
    <div v-show="userPrice && type=='GitHub'" class="user-price">
      <svg class="fronticon" style="color: #b88230; width: 23px; height: 23px" aria-hidden="true">
        <use xlink:href="#icon-bonus-line"></use>
      </svg>可用星币: {{ userPrice }}
    </div>
    <div v-show="userPrice && type=='Gitee'" class="user-price">
      <svg class="fronticon" style="color: #b88230; width: 23px; height: 23px" aria-hidden="true">
        <use xlink:href="#icon-bonus-line"></use>
      </svg>可用云币: {{ userPrice }}
    </div>
    <giteePublic ref="giteePublic" />
    <githubPublic ref="githubPublic" />
  </div>
</template>

<script>
import bus from "../utils/emitter";
import giteePublic from "./dialog/giteePublic.vue";
import githubPublic from "./dialog/githubPublic.vue";
import { getUserPrice } from "../api/getUserPrice.js";
import { UserIsLogin } from "../api/UserIsLogin";
export default {
  data() {
    return {
      type: "GitHub",
      userPrice: null,
      windowWidth: 1000,
    };
  },
  mounted() {
    bus.on("refreshUserPrice", this.updateUserPrice);
    bus.on("typeChange", this.typeChange)

    var that = this;
    this.windowWidth = document.documentElement.clientWidth;
    window.onresize = () => {
      return(()=>{
        that.windowWidth = document.documentElement.clientWidth;
      })()
    };
  },
  methods: {
    /**
     * 打开子发布页面
     */
    openPublicDialog() {
      if ( this.type == "Gitee" ) {
        this.$.refs.giteePublic.openPage();
      } else if ( this.type == "GitHub" ) {
        this.$.refs.githubPublic.openPage();
      }
    },

    /**
     * api更新用户积分和type
     */
    async updateUserPrice(type) {
      this.type = type;
      if (await UserIsLogin(type)) {
        this.userPrice = await getUserPrice(type);
      }
    },

    /**
     * 切换页面注销钩子
     */ 
    async typeChange() {
      bus.off("refreshUserInfo", this.updateUserPrice);
      bus.off("typeChange", this.typeChange)
    }
  },
  components: {
    giteePublic,
    githubPublic,
  },
};
</script>

<style scoped>
#menu {
  min-width: 200px;
}

.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
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

.user-price {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "微软雅黑";
  margin-top: 2%;
}
</style>
