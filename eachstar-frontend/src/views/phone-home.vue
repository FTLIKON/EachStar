<template>
  <div class="all">
    <img class="logo-pic" src="../assets/images/icon.png" />
    <div class="title">EachStar</div>
    <div class="text">欢迎光临EachStar! 我们是开源仓库互助平台</div>
    <div class="text">我们的唯一网址：www.each-star.com</div>
    <div class="text">非常抱歉，暂不支持手机端，请在电脑端访问！</div>
  </div>
</template>

<script></script>
export default { name: "phonehome" }
<style lang="scss" scoped>
.all {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.title {
  color: #ffffff;
  font-weight: bold;
  font-size: 50px;
  text-shadow: 1px 1px 2px #303133, 0px 0px 3px #303133;
}
.logo-pic {
  width: 20%;
  min-width: 100px;
  margin-right: 2%;
}
.text {
  margin-top: 5%;
}
</style>
