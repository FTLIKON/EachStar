<template>
  <div class="emptyCardMain">
    <div class="emptycard">您目前还没有卡片，快点击左侧的【发布卡片】吧~</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.emptyCardMain {
  display: flex;
  height: 500px;
  width: 100%;
  align-items: center;
  flex-direction: column;
  .emptycard {
    margin-top: 200px;
    font-weight: bolder;
  }
}
</style>
