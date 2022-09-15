<template>
  <div class="title">
    <div class="title-left">
      <div class="title-left-image"></div>
      <router-link to="/login"> 　　 <span class="">导航一</span> </router-link>
      <router-link to="/login"> 　　<span class="">导航二</span> </router-link>
      <router-link to="/login"> 　　<span class="">导航三</span> </router-link>
      <router-link to="/login"> 　　<span class="">导航四</span> </router-link>
      <router-link to="/login"> 　　<span class="">导航五</span> </router-link>
    </div>
    <div></div>
    <div class="serch">
      <div contenteditable class="inputType" placeholder="请输入文字"></div>
      <div class="button">搜索</div>
    </div>
    <div class="title-right">
      <div class="title-right-image"></div>
      <router-link to="/login"> 　　 <span class="">导航六</span> </router-link>
      <router-link to="/login"> 　　<span class="">导航七</span> </router-link>
      <router-link to="/login"> 　　<span class="">导航八</span> </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "Title",
};
</script>
<style>
.title {
  margin-left: 0px;
  height: 48px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #dcdcdc;
  display: flex;
  justify-content: space-between;
}
.title-left {
  width: 580px;
  height: 28px;
  margin-left: 0;
  background: #fff;
  display: flex;
}
.title-left-image {
  height: 10px;
  width: 120px;
}
span {
  font-size: 10px;
}
a {
  width: 70px;
  height: 48px;
  color: black;
  margin: 0px 10px;
  text-decoration: none;
  line-height: 48px;
  text-align: center;
}
a:hover {
  background-color: #bebebe;
}
.serch {
  height: 32px;
  width: 500px;
  background-color: #fff;
  margin: auto;
  display: flex;
}
.inputType {
  width: 400px;
  height: 30px;
  text-indent: 1em;
  line-height: 34px;
  background-color: #fff;
  border: 1px solid black;
  border-top-left-radius: 17px;
  border-bottom-left-radius: 17px;
  font-size: 12px;
}
.inputType:focus {
  outline: none;
  border: 1px solid rgb(230, 32, 213);
}
.button {
  color: #fff;
  text-align: center;
  background: rgba(204, 51, 0, 1);
  border-left: 1px solid rgba(0, 0, 0, 0.45);
  width: 100px;
  height: 32px;
  line-height: 34px;
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
.title-right {
  width: 380px;
  height: 48px;
  display: flex;
}
.title-right-image {
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 20px;
  margin: auto;
  margin-left: 40px;
}
</style>
