<template>
  <el-button @click="this.trade()" type="primary" style="font-size: large">
    {{ tradeButton }}
  </el-button>
</template>

<script>
import { tradeButton } from '@/assets/text'
export default {
  data() {
    return {
      tradeButton,
    }
  },

  methods: {
    trade() {},
  },
}
</script>
