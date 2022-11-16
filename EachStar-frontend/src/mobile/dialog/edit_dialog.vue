<template>
  <el-dialog
    v-model="dialogVisible"
    :title="editDialogTitle"
    append-to-body
    width="95%"
  >
    <!-- 标题 -->
    <el-input v-model="title" clearable disabled style="margin-bottom: 8px" />
    <!-- 描述 -->
    <el-input
      v-model="context"
      placeholder="请用两句话，简单描述您的项目..."
      maxlength="150"
      show-word-limit
      :autosize="{ minRows: 4, maxRows: 8 }"
      type="textarea"
      clearable
      style="margin-bottom: 8px"
    />

    <!-- 价值 文字+滑动条 -->
    <div class="slider-text">
      <svg
        class="fronticon"
        style="color: #b88230"
        aria-hidden="true"
        v-show="type == 'GitHub'"
      >
        <use xlink:href="#icon-bonus-line"></use>
      </svg>
      <svg
        class="fronticon"
        style="
          color: #c45656;
          margin-right: 1%;
          margin-bottom: 0.7%;
          width: 20px;
          height: 20px;
        "
        aria-hidden="true"
        v-show="type == 'Gitee'"
      >
        <use xlink:href="#icon-yunpan"></use>
      </svg>
      {{ handlePriceName() }}价值: {{ starPrice }}
    </div>
    <el-slider
      v-model="starPrice"
      class="slider"
      :step="1"
      :min="1"
      :max="min_floor(5, (beforeStarValue + userPrice) / starNum)"
      :disabled="min_floor(5, (beforeStarValue + userPrice) / starNum) == 1"
    />
    <!-- 次数 文字+滑动条 -->
    <div class="slider-text">
      <svg class="fronticon" style="color: #409eff" aria-hidden="true">
        <use xlink:href="#icon-cishu"></use>
      </svg>
      悬赏次数: {{ starNum }}
    </div>
    <el-slider
      v-model="starNum"
      class="slider"
      :step="1"
      :min="0"
      :max="min_floor(50, (beforeStarValue + userPrice) / starPrice)"
      :disabled="min_floor(5, (beforeStarValue + userPrice) / starPrice) == 1"
    />

    <!-- 数据展示 -->
    <div style="width: 100%; display: flex">
      <!-- 消耗星币 -->
      <span style="width: 53%; text-align: right">
        <svg
          class="fronticon"
          aria-hidden="true"
          style="color: #67c23a"
          v-show="starNum * starPrice - beforeStarValue < 0"
        >
          <use xlink:href="#icon-jiantou_yemian_xiangshang"></use>
        </svg>
        <svg
          class="fronticon"
          aria-hidden="true"
          style="color: #f56c6c"
          v-show="starNum * starPrice - beforeStarValue > 0"
        >
          <use xlink:href="#icon-jiantou_yemian_xiangxia"></use>
        </svg>
        {{ starNum * starPrice - beforeStarValue > 0 ? '消耗' : '返还'
        }}{{ handlePriceName() }}:
        {{ Math.abs(starPrice * starNum - beforeStarValue) }}
        <el-divider direction="vertical" />
      </span>

      <!-- 剩余星币 -->
      <span>
        剩余{{ handlePriceName() }}:
        {{ userPrice - starPrice * starNum + beforeStarValue }}
      </span>
    </div>

    <!-- 尾部BtnGroup -->
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button @click="handleEditButton" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import bus from '@/lib/bus.js'
import { editDialogTitle } from '@/assets/text.js'
import { getUserType, getUserPrice } from '@/api/login.js'
import { min_floor } from '@/utils/math.js'
import { editCard } from '@/api/api'
import { editMessage } from '@/lib/msg.js'
import { nopriceMessage } from '../../lib/msg'
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      min_floor,
      editDialogTitle,
      dialogVisible: false,
      userPrice: getUserPrice(),
      type: getUserType(),
      cardId: undefined,

      title: undefined,
      context: undefined,
      starPrice: 1,
      starNum: 1,
      beforeStarValue: 1,
    }
  },
  mounted() {},
  methods: {
    openPage(data) {
      // 打开发布页面
      this.type = getUserType()
      this.starPrice = parseInt(data.starPrice)
      this.starNum = parseInt(data.starNum)
      this.userPrice = parseInt(getUserPrice())
      this.beforeStarValue = this.starPrice * this.starNum
      this.title = data.title
      this.context = data.context
      this.cardId = data.id
      this.dialogVisible = true
    },
    async handleEditButton() {
      // 确认修改卡片按钮
      var success = await editCard(
        this.type,
        this.cardId,
        this.title,
        this.context,
        this.starPrice,
        this.starNum
      )
      if (success) {
        editMessage(this.beforeStarValue - this.starPrice * this.starNum)
        this.dialogVisible = false
        bus.emit('updateCard', {
          type: getUserType(),
          page: 1,
        })
        bus.emit('updateUser')
      }
    },
    handlePriceName() {
      return this.type == 'GitHub' ? '星币' : '云币'
    },
  },
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 23px;
  height: 23px;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
.slider {
  margin-top: auto;
  margin-bottom: auto;
  width: 90%;
  margin-left: 10%;
}
.slider-text {
  margin-top: auto;
  margin-bottom: auto;
  width: 100%;
  text-align: left;
}
.dialog-footer {
  margin-top: 3%;
  margin-bottom: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
