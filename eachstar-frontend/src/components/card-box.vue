<template>
  <el-space class="card-space" fill direction="vertical">
    <el-card v-for="i in 123" :key="i" class="box-card">
      <div class="card-header">
        <span>Github仓库 </span>
        <el-button class="button">点击 Star</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'item ' + o }}
      </div>
    </el-card>
  </el-space>
  <el-button
    type="success"
    size="large"
    id="issue-button"
  >发布卡片</el-button>
</template>

<script>
</script>

<style>
#issue-button {
  width: 15%;
  margin-left: 4%;
  
  font-weight: bolder;
  font-size: large;
}

.card-space {
  width: 60%;
  margin-left: 17%;
}
</style>