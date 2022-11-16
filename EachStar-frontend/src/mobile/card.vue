<template>
  <div v-if="data.length != 0 || myrepo == false">
    <!-- 卡片列表 -->
    <el-card v-for="item in data" :key="item" class="card-list">
      <!-- 标题 -->
      <div class="card-titleblock">
        <a
          class="card-title"
          :href="item.title"
          target="_blank"
          style="font-size: 16px; font-weight: bold; margin-right: auto"
        >
          {{ parseTitle(item.title) }}
        </a>
        <div class="card-time">{{ getPastTimeString(item.updatedAt) }}</div>
      </div>

      <!-- 卡片内容 -->
      <div v-if="!myrepo" class="card-context">
        {{ item.context }}
      </div>

      <!-- 修改提示 -->
      <div class="card-low-notice" v-if="myrepo && item.starNum == 0">
        {{ lowNumText }}
      </div>

      <!-- slot with 我的仓库 -->
      <div
        v-if="myrepo"
        style="
          margin-left: 3px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: end;
        "
      >
        <!-- 价值描述 -->
        <div style="width: 100%; margin-bottom: 10px; font-size: 14px">
          <!-- 价值 -->
          <span style="color: #b88230">
            <svg class="fronticon" aria-hidden="true" v-show="type == 'GitHub'">
              <use xlink:href="#icon-bonus-line"></use>
            </svg>
            <svg
              class="fronticon"
              style="
                width: 19px;
                height: 19px;
                color: #b88230;
                margin-bottom: 0.4%;
                margin-right: 0.7%;
              "
              aria-hidden="true"
              v-show="type == 'Gitee'"
            >
              <use xlink:href="#icon-yunpan"></use>
            </svg>
            {{ parsePriceString() }}: {{ item.starPrice }}
          </span>
          <el-divider direction="vertical"></el-divider>

          <!-- 次数 -->
          <span style="color: #409eff">
            <svg
              class="fronticon"
              style="width: 23px; height: 23px; vertical-align: -0.42em"
              aria-hidden="true"
            >
              <use xlink:href="#icon-cishu"></use>
            </svg>
            {{ parseNumString() }}: {{ item.starNum }}
          </span>
        </div>

        <!-- 操作插槽 -->
        <div>
          <slot style="margin-left: auto" name="scope" :data="item" />
        </div>
      </div>

      <!-- slot with 发现仓库 -->
      <div
        v-else
        style="
          margin-left: 3px;
          font-size: 12px;
          display: flex;
          align-items: center;
        "
      >
        <!-- 悬赏次数 -->
        <span style="font-size: 14px; color: #409eff">
          <svg
            class="fronticon"
            style="width: 23px; height: 23px; vertical-align: -0.42em"
            aria-hidden="true"
          >
            <use xlink:href="#icon-cishu"></use>
          </svg>
          {{ parseNumString() }}: {{ item.starNum }}
        </span>

        <span style="margin-left: auto">
          <slot name="scope" :data="item" />
        </span>
      </div>
    </el-card>

    <!-- 分页列表 -->
    <div class="pagi" style="display: flex">
      <el-pagination
        background
        style="margin: 16px auto"
        layout="prev, pager, next"
        v-model:currentPage="this.page"
        :page-count="this.totalPage"
        @current-change="handleChange"
      />
    </div>
  </div>

  <div
    v-else
    style="
      font-size: large;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 15%;
    "
  >
    暂无卡片，快点击右下角的 “+” 试试吧~
  </div>
</template>

<script>
import bus from '@/lib/bus.js'
import { goUrl } from '@/lib/url.js'
import { lowNumText } from '@/assets/text.js'
import { getUserType } from '@/api/login.js'
import { getPastTimeString } from '@/utils/time'
import '@/assets/scss/mobile/card.scss'
export default {
  props: {
    data: {
      type: Object,
      default: [],
    },
    myrepo: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    totalPage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      lowNumText,
      page: 1,
    }
  },
  mounted() {
    bus.on('updateCard', this.updatePage)
  },
  methods: {
    goUrl,
    getPastTimeString,
    updatePage(info) {
      // 响应页面更新
      if (info.page) {
        this.page = info.page
      }
    },
    parseTitle(str) {
      return str
        .replace('https://github.com/', '')
        .replace('https://gitee.com/', '')
    },
    parsePriceString() {
      if (this.myrepo) {
        return this.type == 'GitHub' ? '星币价值' : '云币价值'
      } else {
        return this.type == 'GitHub' ? '可获得星币' : '可获得云币'
      }
    },
    parseNumString() {
      return this.myrepo ? '剩余悬赏' : '悬赏次数'
    },
    handleChange(page) {
      bus.emit('updateCard', {
        page,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.fronticon {
  width: 23px;
  height: 23px;
  vertical-align: -0.45em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}

.card-context {
  font-size: 16px;
  margin: 8px 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
