<template>
  <el-dialog
    v-model="dialogVisible"
    :title="publicDialogTitle"
    style="width: 95%"
    append-to-body
  >
    <div class="input-block">
      <!-- 链接 -->
      <el-input
        class="title-input"
        v-model="title"
        :placeholder="handleTitle()"
        clearable
      />
      <!-- 描述 -->
      <el-input
        class="discription-input"
        v-model="context"
        placeholder="请用两句话，简单描述您的项目..."
        maxlength="150"
        show-word-limit
        :autosize="{ minRows: 4, maxRows: 8 }"
        type="textarea"
        clearable
      />
      <!-- 价值 文字+滑动条 -->
      <div class="slider-text">
        <svg
          class="fronticon"
          style="color: #b88230; margin-right: 1%"
          aria-hidden="true"
          v-show="type == 'GitHub'"
        >
          <use xlink:href="#icon-bonus-line"></use>
        </svg>
        <svg
          class="fronticon"
          style="width: 18px; height: 18px; color: #c45656; margin-bottom: 0.7%"
          aria-hidden="true"
          v-show="type == 'Gitee'"
        >
          <use xlink:href="#icon-yunpan"></use>
        </svg>
        {{ type == 'GitHub' ? '星币' : '云币' }}价值: {{ starPrice }}
      </div>
      <el-slider
        v-model="starPrice"
        class="slider"
        :step="1"
        :min="1"
        :max="min_floor(5, userPrice / starNum)"
        :disabled="min_floor(5, userPrice / starNum) == 1"
      />

      <!-- 次数 文字+滑动条 -->
      <div class="slider-text">
        <svg
          class="fronticon"
          style="
            color: #409eff;
            width: 23px;
            height: 23px;
            vertical-align: -0.47em;
            margin-right: 1%;
          "
          aria-hidden="true"
        >
          <use xlink:href="#icon-cishu"></use>
        </svg>
        悬赏次数: {{ starNum }}
      </div>
      <el-slider
        v-model="starNum"
        class="slider"
        :step="1"
        :min="1"
        :max="min_floor(50, userPrice / starPrice)"
        :disabled="min_floor(5, userPrice / starPrice) == 1"
      />

      <!-- 数据展示 -->
      <div class="user-rank-calc">
        消耗{{ type == 'GitHub' ? '星币' : '云币' }}: {{ starPrice * starNum }}
        <el-divider direction="vertical" />
        剩余{{ type == 'GitHub' ? '星币' : '云币' }}:
        {{ userPrice - starPrice * starNum }}
      </div>

      <!-- 尾部BtnGroup -->
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="handlePublicButton" type="primary">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import bus from '@/lib/bus.js'
import { publicDialogTitle } from '@/assets/text.js'
import { getUserType, getUserPrice } from '@/api/login.js'
import { min_floor } from '@/utils/math.js'
import { publicCard } from '@/api/api'
import { publicMessage, urlErrorMessage } from '@/lib/msg.js'
import { validateUrl } from '@/utils/validate.js'
import { publicConfirm } from '@/lib/confirm.js'
export default {
  data() {
    return {
      min_floor,
      publicDialogTitle,
      dialogVisible: false,
      userPrice: getUserPrice(),
      type: getUserType(),

      title: null,
      context: "",
      starPrice: 1,
      starNum: 1,
    }
  },
  mounted() {
    bus.on('afterUpdated', this.fetchData)
  },
  methods: {
    openPage() {
      // 打开发布页面
      this.dialogVisible = true
      this.userPrice = getUserPrice()
    },
    fetchData() {
      // 响应用户信息更新
      this.type = getUserType()
      this.userPrice = getUserPrice()
    },
    async handlePublicButton() {
      if (await publicConfirm(this.type)) {
        // 确认发布
        if (!validateUrl(this.title)) {
          // 验证 Url
          urlErrorMessage()
        } else {
          // 发布卡片按钮
          var success = await publicCard(
            this.type,
            this.title,
            this.context,
            this.starPrice,
            this.starNum
          )
          if (success) {
            publicMessage(this.starPrice * this.starNum)
            this.dialogVisible = false
            bus.emit('updateCard', {
              type: getUserType(),
              page: 1,
            })
            bus.emit('updateUser')
            this.userPrice = getUserPrice()
            this.starPrice = 1
            this.starNum = 1
          }
        }
      }
    },
    handleTitle() {
      return (
        '项目地址,例: https://' +
        this.type.toLowerCase() +
        '.com/FTLIKON/EachStar'
      )
    },
    handlePriceName() {
      return this.type == 'GitHub' ? '星币' : '云币'
    },
  },
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 25px;
  height: 25px;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}

.publicConfirm-block {
  .title {
    width: 100%;
    font-weight: bold;
    margin-bottom: 5%;
    font-size: large;
  }
}

.input-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.discription-input,
.title-input {
  width: 90%;
  margin-bottom: 10px;
}

.rank-block {
  width: 90%;
  display: flex;
}
.slider {
  margin-top: auto;
  margin-bottom: auto;
  width: 87%;
  margin-left: 13%;
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
  justify-items: center;
}
</style>
