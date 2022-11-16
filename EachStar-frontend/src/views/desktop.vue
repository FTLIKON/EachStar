<template>
  <div style="min-width: 1110px">
    <Navi @changeRepo="handleRepo" />
    <Menu style="width: 25%"></Menu>
    <div
      class="repo"
      ref="cardbox"
      v-loading.body="cardLoading"
      style="
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        align-items: flex-end;
        min-height: calc(100vh - 60px);
      "
    >
      <!-- 卡片列表 -->
      <div class="card-box" style="width: 100%; flex: 1">
        <transition name="el-zoom-in-top">
          <Card
            :totalPage="handleTotalPage()"
            :data="this.cardData"
            :myrepo="this.myrepo"
            :type="this.type"
            v-show="!cardLoading"
          >
            <!-- Repo 卡片操作 -->
            <template #scope="scope">
              <Star
                v-if="!this.myrepo"
                :card="scope.data"
                :cooldown="starCooldown"
                @star="handleStar"
              />
              <Edit v-if="this.myrepo" :card="scope.data" />
              <Delete v-if="this.myrepo" :card="scope.data" />
            </template>
          </Card>
        </transition>
      </div>

      <Board style="width: 24%"></Board>
      <!-- 页脚 -->
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import bus from '@/lib/bus.js'
import Navi from '@/desktop/navi.vue'
import Card from '@/desktop/card.vue'
import Star from '@/desktop/button/star.vue'
import Delete from '@/desktop/button/delete.vue'
import Edit from '@/desktop/button/edit.vue'
import Footer from '@/desktop/footer.vue'
import Menu from '@/desktop/menu.vue'
import Board from '@/desktop/board.vue'
import { getCard, fetchUserInfo } from '@/api/api'
import { getUserType, isLogin, getUserPrice } from '@/api/login'
export default {
  data() {
    return {
      type: getUserType(),
      myrepo: false,
      cardCount: 0,
      cardData: [],

      cardLoading: true,
      starCooldown: false,
    }
  },
  mounted() {
    // 主页面加载时从接口更新用户信息
    if (isLogin()) {
      fetchUserInfo(this.type).then(() => {
        bus.emit('afterUpdated')
      })
    }

    // 初次加载卡片和信息
    this.updateCard({})
    console.log('默认type为 -> ' + this.type)

    bus.on('updateCard', this.updateCard) // 更新卡片列表
    bus.on('updateUser', this.updateUser) // 更新用户信息
  },
  methods: {
    /**
     * EventBus -> updateCard
     *  info.type 类型 : 默认为this.type
     *  info.page 页面 : 默认为1
     *  info.myrepo 是否为我的仓库 : 默认为this.myrepo
     */
    async updateCard(info) {
      // 更新卡片列表
      this.cardLoading = true
      this.type =
        info.type != '' && info.type != null && info.type != undefined
          ? info.type
          : this.type
      this.page =
        info.page != undefined && info.page != null && info.page != 0
          ? info.page
          : 1
      this.myrepo =
        info.myrepo != undefined && info.myrepo != null
          ? info.myrepo
          : this.myrepo
      // 根据info.type类型, 当前页数获取数据
      var nowData = await getCard(this.type, (this.page - 1) * 10, this.myrepo)
      this.cardCount = nowData.count
      this.cardData = nowData.data
      this.cardLoading = false
      document.documentElement.scrollTop = 0
    },
    /**
     * EventBus -> updateUser
     *   type 类型 : 默认为当前类型 - 若有更改则修改type
     */
    async updateUser(type = getUserType()) {
      // 更新用户信息
      if (type != this.type) {
        // 若更改类型则更新卡片
        this.type = type
        await this.updateCard({ type, myrepo: false })
      }

      fetchUserInfo(type) // 获取用户信息&传递完成消息
        .then(() => {
          bus.emit('afterUpdated')
        })
    },

    async handleRepo(myrepo) {
      // 切换我的仓库
      this.myrepo = myrepo
      await this.updateCard({
        myrepo: myrepo,
      })
    },
    handleStar() {
      // 点击 Star
      var that = this
      that.starCooldown = true
      setTimeout(() => {
        that.starCooldown = false
      }, 2000)
    },
    handleTotalPage() {
      // 计算总页数
      return Math.ceil(this.cardCount / 10)
    },
  },
  components: {
    Navi,
    Card,
    Star,
    Edit,
    Delete,
    Footer,
    Menu,
    Board,
  },
}
</script>
