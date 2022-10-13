<template>
  <div class="main">
    <div class="icpcode">- 互联网ICP备案：渝ICP备2022011108号 -</div>
    <div class="public">
      <div class="says">
        <div class="saytext">开发者们的开源互助社区</div>
        <div class="saytext">World is powered by cooperation</div>
        <div class="saytext">Version: 1.0.0</div>
      </div>
      <div class="icons">
        <svg
          class="fronticon"
          style="color: #000000; margin-top: 2%"
          aria-hidden="true"
          href="https://github.com/FTLIKON/EachStar"
        >
          <use xlink:href="#icon-qq"></use>
        </svg>
        <svg
          class="fronticon"
          style="color: #000000; margin-top: 2%"
          aria-hidden="true"
        >
          <use xlink:href="#icon-github"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.fronticon {
  width: 60px;
  height: 60px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
.main {
  width: 100%;
  height: 100px;
  background-color: #303133;
  display: flex;
  align-items: center;
  flex-direction: column;
  .icpcode {
    margin-top: 5px;
    margin-bottom: 5px;
    color: #a8abb2;
  }
  .public {
    display: flex;
    flex-direction: row;
    .says {
      display: flex;
      flex-direction: column;
      .saytext {
        margin-right: auto;
        color: #909399;
        margin-top: 2px;
      }
    }
    .icons {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
