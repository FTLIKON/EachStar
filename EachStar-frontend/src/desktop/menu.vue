<template>
  <div class="menu">
    <Public style="margin-top: 5px" />
    <Price v-show="logined" style="margin-top: 5px" />
  </div>
</template>

<script>
import bus from '@/lib/bus.js'
import Public from '@/desktop/button/public.vue'
import Price from '@/desktop/button/price.vue'
import { getUserType, isLogin } from '@/api/login'
export default {
  data() {
    return {
      logined: isLogin(),
    }
  },
  mounted() {
    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    fetchData() {
      this.logined = isLogin()
    },
  },
  components: { Public, Price },
}
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  margin-top: 30px;
  width: 25%;
  min-width: 280px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-group {
  margin-top: 5px;
}
</style>
