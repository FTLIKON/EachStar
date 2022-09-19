<template>
  <div class="background">
    <div class="user-panel-box">
      <div class="title-box">
        <span class="main">登入</span>
        <span class="sub">登录或注册</span>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.background {
  background-color: rgb(0, 0, 0);
}
.user-panel-box {
  box-sizing: border-box;
  position: fixed;
  width: 640px;
  height: fit-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  background-color: #fff;
  border-radius: 8px;
  padding: 40px 50px;
  z-index: 200;
}

.title-box {
  margin-bottom: 30px;
  .main {
    font-size: 36px;
    font-weight: bold;
    margin-right: 5px;
    letter-spacing: 0.05em;
  }
  .sub {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.05em;
  }
}
</style>
