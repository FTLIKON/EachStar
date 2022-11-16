<template>
  <div
    style="
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 50px;
    "
    v-show="showJudge"
  >
    <el-card class="board-card">
      <div class="board-title">更新公告</div>
      <div class="board-text">
        ● 前端重构，支持移动端
        <div class="board-time">2022/11/10</div>
      </div>
      <div class="board-text">
        ● EachStar 正式公测
        <div class="board-time">2022/10/15</div>
      </div>
    </el-card>
    <div style="width: 300px">
      <div style="margin-top: 5px; margin-left: 6px">
        <svg class="fronticon" aria-hidden="true">
          <use xlink:href="#icon-github"></use>
        </svg>
        本站已开源:
        <el-link href="https://github.com/FTLIKON/EachStar">
          FTLIKON/EachStar
        </el-link>
      </div>
      <div style="margin-top: 3px; margin-left: 6px">
        <svg class="fronticon" aria-hidden="true">
          <use xlink:href="#icon-qq"></use>
        </svg>
        交流QQ群:
        <el-link
          href="https://qm.qq.com/cgi-bin/qm/qr?k=r2jN9fZaagH6qcLVb-QglnYWNPpKMPA6&jump_from=webapi&authKey=Ye43FWw3UiCdZ4bar3EY+qerAgjLHm3uC5xs2DWmeuuO9QeBV26bxaxCPC3YxM6H"
        >
          184109839
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showJudge: true,
      /**
       * 用于多样式自适应
       */
      // nowStyle: this.rightStyle,
      // leftStyle: {
      //   top: '170px',
      //   left: '30px',
      // },
      // rightStyle: {
      // }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleWidth)
  },
  methods: {
    handleWidth() {
      this.showJudge = document.body.clientWidth > 1111
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
.board-card {
  width: 300px;
  display: flex;
  flex-direction: column;
  .board-title {
    color: #67c23a;
    font-size: large;
    margin-bottom: 5px;
  }
  .board-text {
    margin-bottom: 3px;
    display: flex;
    flex-direction: row;
    .board-time {
      font-size: small;
      margin-left: auto;
      margin-top: auto;
    }
  }
}
</style>
