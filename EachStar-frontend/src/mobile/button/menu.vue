<template>
  <UserDialog ref="dialog"></UserDialog>
  <svg
    class="fronticon"
    style="margin-right: 5%"
    aria-hidden="true"
    @click="open"
  >
    <use xlink:href="#icon-caidan"></use>
  </svg>
</template>

<script>
import UserDialog from '@/mobile/dialog/user_dialog.vue'
export default {
  data() {
    return {}
  },
  methods: {
    open() {
      this.$refs.dialog.open()
    },
  },
  components: { UserDialog },
}
</script>
<style lang="scss" scoped>
.fronticon {
  width: 40px;
  height: 40px;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
