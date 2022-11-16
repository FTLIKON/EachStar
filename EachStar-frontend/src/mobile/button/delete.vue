<template>
  <el-button @click="this.delete()" type="danger">
    <svg class="fronticon" aria-hidden="true">
      <use xlink:href="#icon-lajitong"></use>
    </svg>
    {{ deleteButton }}
  </el-button>
</template>

<script>
import bus from '@/lib/bus.js'
import { deleteMessage, nologinMessage } from '@/lib/msg'
import { deleteButton } from '@/assets/text.js'
import { deleteCard } from '@/api/api'
import { getUserType, isLogin } from '@/api/login'
import { deleteConfirm } from '@/lib/confirm'
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteButton,
    }
  },
  methods: {
    async delete() {
      if (!isLogin()) {
        nologinMessage()
        return
      }
      if (await deleteConfirm(this.card.starPrice * this.card.starNum)) {
        var success = await deleteCard(getUserType(), this.card.id)
        if (success) {
          deleteMessage(this.card.starPrice * this.card.starNum)
          bus.emit('updateUser')
          bus.emit('updateCard', {})
        } else {
          errorMessage()
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.fronticon {
  width: 20px;
  height: 20px;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
