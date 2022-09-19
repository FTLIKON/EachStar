<template>
  <div class="title">
    <div class="nav-box">
      <router-link class="nav-item" to="/login"
        ><div class="inner"><span class="text">导航五</span></div></router-link
      >
    </div>
    <div class="user-box" @click="onUserInfo">
      <div class="inner">
        <div class="info-box">
          <div class="info-content">
            <span class="tip">未登录</span>
            <img class="avatar-img" src="../assets/images/express/幽灵.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "top-nav",
  data() {
  },
  methods: {
    /**
     * 用户按钮
     */
    onUserInfo() {
      this.$PL.show(this, {
        name: "user-panel",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// 响应式
@media screen and (min-width: 801px) {
  .nav-box {
    justify-content: center;
  }
}
@media screen and (max-width: 800px) {
  #logo {
    display: none;
  }
}
@media screen and (min-width: 641px) {
  .user-box .info-box {
    display: flex;
  }
  .nav-item {
    height: fit-content;
    &::before {
      border-radius: 24px;
    }
    .inner {
      padding: 5px 15px;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
}
@media screen and (max-width: 640px) {
  .user-box .info-box {
    display: none;
  }
  .nav-item {
    height: 100%;
    &::before {
      border-radius: 0;
    }
    .inner {
      padding: 0 15px;
      .text {
        display: none;
      }
    }
  }
}

// 侧边栏
.title {
  z-index: 100;
  box-sizing: border-box;
  position: fixed;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: fit-content;
  left: 0;
  top: 0;
  background: rgba(241, 243, 245, 0.7);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: 0.4s;
  &.fixed {
    box-shadow: 0px 8px 48px rgba(0, 0, 0, 0.05);
  }
}

// 导航
.nav-box {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
    margin-right: 50px;
    text-decoration: none;
    color: unset;
    &::before {
      z-index: -1;
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.05);
      opacity: 0;
      transition: 0.2s;
    }
    &[active="true"],
    &:hover {
      &::before {
        opacity: 1;
      }
      .inner {
        color: rgba(0, 0, 0, 0.9);
      }
    }
    &:hover {
      &::before {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    .inner {
      color: rgba(0, 0, 0, 0.6);
      transition: 0.2s;
      .iconfont {
        font-size: 22px;
      }
      .text {
        font-family: "Microsoft JhengHei UI";
        font-weight: normal;
        font-size: 24px;
      }
    }
  }
}
// 用户
.user-box {
  flex-shrink: 0;
  max-width: 196px;
  height: fit-content;
  position: relative;
  cursor: pointer;
  &::before {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 36px;
    opacity: 0;
    transition: 0.2s;
  }
  &[active="true"],
  &:hover {
    &::before {
      opacity: 1;
    }
    .inner {
      color: rgba(0, 0, 0, 0.9);
    }
  }
  .inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    color: rgba(0, 0, 0, 0.6);
    transition: 0.2s;
    .info-box {
      flex-grow: 1;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      margin-left: 10px;
      .info-content {
        display: flex;
        flex-direction: column;
        .nickname {
          font-size: 15px;
          color: rgba(0, 0, 0, 0.9);
          text-align: right;
        }
        .sub-info {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.4);
          text-align: right;
        }
        .tip {
          font-size: 18px;
        }
      }
      .iconfont {
        display: block;
        width: 18px;
        height: 18px;
        font-size: 18px;
        overflow: hidden;
      }
    }
    .avatar-img {
      box-sizing: border-box;
      width: 42px;
      height: 42px;
      border: solid 2px rgba(0, 0, 0, 0.4);
      border-radius: 24px;
      margin-left: 10px;
      object-fit: cover;
    }
  }
}
</style>
