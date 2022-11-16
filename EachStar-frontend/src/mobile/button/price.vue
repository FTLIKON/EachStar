<template>
  <div>
    <svg
      class="fronticon"
      style="color: #b88230; width: 23px; height: 23px; margin-bottom: 1px;"
      aria-hidden="true"
      v-show="type == 'GitHub'"
    >
      <use xlink:href="#icon-bonus-line"></use>
    </svg>
    <svg
      class="fronticon"
      style="width: 18px; height: 18px; color: #c45656; margin-bottom: 3%"
      aria-hidden="true"
      v-show="type == 'Gitee'"
    >
      <use xlink:href="#icon-yunpan"></use>
    </svg>
    可用{{ priceName }}:{{ userPrice }}
  </div>
</template>

<script>
import bus from "@/lib/bus.js";
import { getUserType, getUserPrice } from "@/api/login.js";
export default {
  data() {
    return {
      visable: false,
      type: getUserType(),
      priceName: getUserType() == "GitHub" ? "星币" : "云币",
      userPrice: getUserPrice(),
    };
  },
  mounted() {
    bus.on("afterUpdated", this.fetchData);
  },
  methods: {
    fetchData() {
      // 获取数据
      this.type = getUserType();
      this.priceName = getUserType() == "GitHub" ? "星币" : "云币";
      this.userPrice = getUserPrice();
    },
    handleClick() {
      this.visable = true;
    },
  },
  components: {},
};
</script>

<style scoped>
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
