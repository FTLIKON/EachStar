<template>
  <el-button class="card-button" v-if="this.card.starred" disabled>
    <svg class="fronticon" aria-hidden="true">
      <use xlink:href="#icon-xingxing1"></use>
    </svg>
    {{ starredButton }}
  </el-button>
  <el-button class="card-button" v-else-if="this.starring" disabled>
    {{ starringButton }}
  </el-button>
  <el-button
    class="card-button"
    v-else-if="cooldown"
    :loading="cooldown"
    disabled
  >
    {{ starCooldownButton }}
  </el-button>
  <el-button class="card-button" v-else @click="this.star()">
    <svg class="fronticon" style="color: #b88230" aria-hidden="true">
      <use xlink:href="#icon-xingxing"></use>
    </svg>
    {{ starButton }}
  </el-button>
</template>

<script>
import bus from '@/lib/bus.js'
import {
  starButton,
  starredButton,
  starringButton,
  starCooldownButton,
} from '@/assets/text.js'
import { starCard } from '@/api/api'
import { starMessage, errorMessage, nologinMessage } from '@/lib/msg'
import { isLogin, getUserType } from '@/api/login.js'
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
    cooldown: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      starButton,
      starredButton,
      starCooldownButton,
      starringButton,
      starring: false,
    }
  },
  methods: {
    async star() {
      if (!isLogin()) {
        // 未登陆
        nologinMessage()
      } else {
        this.$emit('star')
        this.starring = true
        var that = this
        setTimeout(async () => {
          var success = await starCard(getUserType(), that.card.id)
          if (success) {
            that.starring = false
            that.card.starred = true
            that.card.starNum -= 1

            if (that.card.starNum <= 0) {
              bus.emit('updateCard', {})
            }
            bus.emit('updateUser')
            starMessage(that.card.starPrice)
          } else {
            that.starring = false
            errorMessage()
          }
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 20px;
  height: 20px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
.card-button {
  font-size: small;
}
</style>
