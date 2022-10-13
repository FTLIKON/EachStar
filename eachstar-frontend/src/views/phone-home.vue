<template>
  <div class="all">
    <div class="logo">
      <img class="logo-pic" src="icon.png" />
      <div class="title">EachStar</div>
    </div>
    <div>目前暂不支持手机端，请在电脑端访问！</div>
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
.logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10%;
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
</style>
