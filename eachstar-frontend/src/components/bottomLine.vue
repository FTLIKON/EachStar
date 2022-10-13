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
          @click="goQQqun"
        >
          <use xlink:href="#icon-qq"></use>
        </svg>
        <svg
          class="fronticon"
          style="color: #000000; margin-top: 2%"
          aria-hidden="true"
          @click="goEachStar"
        >
          <use xlink:href="#icon-github"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * 前往EachStar主页
     */
    goEachStar() {
      window.location.href = "https://github.com/FTLIKON/EachStar";
    },
    /**
     * 前往QQ群
     */
    goQQqun() {
      window.location.href =
        "https://qm.qq.com/cgi-bin/qm/qr?k=r2jN9fZaagH6qcLVb-QglnYWNPpKMPA6&jump_from=webapi&authKey=Ye43FWw3UiCdZ4bar3EY+qerAgjLHm3uC5xs2DWmeuuO9QeBV26bxaxCPC3YxM6H";
    },
  },
};
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
      margin-left: 5%;
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
