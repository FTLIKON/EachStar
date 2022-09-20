<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="1">Logo</el-menu-item>
    <el-menu-item index="2">Github</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="3">Points</el-menu-item>
    <el-menu-item index="4">User</el-menu-item>
  </el-menu>
</template>

<script setup>
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}

</style>
