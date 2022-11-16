<template>
  <div
    class="footer"
    style="
      width: 100%;
      height: 100px;
      margin-bottom: -10px;
      background-color: #303133;
      display: flex;
      flex-direction: column;
      align-items: center;
    "
  >
    <div
      class="icpcode"
      style="width: 100%; margin: 5px auto; text-align: center; color: #a8abb2"
    >
      - 互联网ICP备案: 渝ICP备2022011108号 -
    </div>
    <div
      class="says"
      style="width: 100%; height: 65%; display: flex; flex-direction: row"
    >
      <div
        class="text"
        style="
          font-size: 14px;
          margin-top: 12px;
          width: 47%;
          margin-right: 3%;
          text-align: end;
          color: #909399;
        "
      >
        <div>开发者们的开源互助社区</div>
        <div>Version: 1.1.0</div>
      </div>
      <div class="icons" style="width: 50%; height: 80%; display: flex">
        <svg
          class="fronticon"
          :style="{
            color: activeColor,
            height: '100%',
            width: '60px',
            fill: 'currentColor',
          }"
          aria-hidden="true"
          @click="goQQqun"
        >
          <use xlink:href="#icon-qq"></use>
        </svg>
        <svg
          class="fronticon"
          :style="{
            color: activeColor,
            height: '100%',
            width: '60px',
            fill: 'currentColor',
          }"
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
import '@/assets/iconfont/iconfont'
export default {
  data() {
    return {
      activeColor: 'white',
    }
  },
  methods: {
    /**
     * 前往EachStar主页
     */
    goEachStar() {
      window.location.href = 'https://github.com/FTLIKON/EachStar'
    },
    /**
     * 前往QQ群
     */
    goQQqun() {
      window.location.href =
        'https://qm.qq.com/cgi-bin/qm/qr?k=r2jN9fZaagH6qcLVb-QglnYWNPpKMPA6&jump_from=webapi&authKey=Ye43FWw3UiCdZ4bar3EY+qerAgjLHm3uC5xs2DWmeuuO9QeBV26bxaxCPC3YxM6H'
    },
  },
}
</script>
