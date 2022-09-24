<template>
  <el-space class="card-space" fill direction="vertical">
    <!-- 卡片列表 -->
    <el-card v-for="i in current_page_data" :key="i" class="box-card">
      <!-- card data -->
      <div class="card-header">
        <div class="card-title">{{i.title}}</div>
        <div class="card-discription">{{i.discription}}</div>
        <el-button id="card-button" type="success" plain>☆ Star</el-button>
      </div>
    </el-card>
  </el-space>
  <!-- 发布卡片按钮 -->
  <el-button type="success" size="large" id="public-button" @click="openPublicPage()">发布卡片</el-button>
  <el-pagination
    id="pagination"
    layout="prev, pager, next"
    @current-change="pageChange"
    :total="total_page*10"/>
  <publicPage ref="publicPage" @publicCard="addCard"/>
</template>

<script>
import { reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { throttledWatch } from "@vueuse/shared";
import publicPage from "./public.vue";

export default {
  components: { publicPage },

  data() {
    return {
      total_page: 5,
      current_page: 1,
      page_size: 5,
      
      current_page_data: [],
    }
  },

  setup() {
    const ins = getCurrentInstance();
    onMounted(() => {
    });
  },

  methods: {
    openPublicPage: function(){
      this.$.refs.publicPage.openPage();
    },

    addCard: function(data){
      this.current_page_data.push(data);
    },

    getData: function(page){
      axios.get('localhost:8081/sel/'+id).then((res) => {
        console.log(res.data);
      })
    },

    pageChange: function(page){
      console.log(page);
    }
  },
};
</script>

<style>
.card-space {
  width: 60%;
  margin-left: 20%;
}

.card-title {
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
  margin-bottom: 2%;

  color: #303133;
  font-size: large;
  font-weight: bold;
}

.card-discription {
  flex-direction: row;
  justify-content: flex-start;
  text-align: left;
  margin-bottom: 2%;
  margin-left: 3%;

  color: #606266;
}

#card-button {
  width: 18%;
  margin-left: 82%;

  font-size: large;
  font-weight: bold;
}

#public-button {
  width: 16%;
  margin-left: 2%;
  margin-right: 2%;
  
  font-weight: bolder;
  font-size: large;
  text-shadow: 0px 0px 2px #303133; 

  border-radius: 15px;
}

#pagination {
  margin-top: 2%;
  justify-content: center;
}
</style>