<template>
  <el-dialog v-model="dialogVisible" style="width: 45%" title="发布卡片">
    <div class="input-block">
      <el-input
        class="title-input"
        v-model="cardTitle"
        placeholder="您的项目链接，例如：https://gitee.com/FTLIKON/EachStar"
        clearable
      />
      <el-input
        class="discription-input"
        v-model="cardDiscription"
        placeholder="请用两句话，简单描述您的项目..."
        maxlength="150"
        show-word-limit
        :autosize="{ minRows: 4, maxRows: 8 }"
        type="textarea"
        clearable
      />
      <div class="rank-block">
        <span class="slider-text"
          ><svg class="fronticon" style="color: #b88230" aria-hidden="true">
            <use xlink:href="#icon-bonus-line"></use></svg
          >云币价值: {{ starPrice }}</span
        >
        <el-slider
          v-model="starPrice"
          class="slider"
          :step="1"
          :min="1"
          :max="5"
        ></el-slider>
      </div>
      <div class="rank-num-block">
        <span class="slider-text"
          ><svg
            class="fronticon"
            style="
              color: #409eff;
              width: 23px;
              height: 23px;
              vertical-align: -0.47em;
            "
            aria-hidden="true"
          >
            <use xlink:href="#icon-cishu"></use></svg
          >悬赏次数: {{ starNum }}</span
        >
        <el-slider
          v-model="starNum"
          class="slider"
          :step="1"
          :min="1"
          :max="50"
        ></el-slider>
      </div>
      <div class="user-rank-calc">
        消耗星币: {{ starPrice * starNum }}
        <el-divider direction="vertical" /> 剩余云币:
        {{ userPrice - starPrice * starNum }}
      </div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="publicConfirm = true">确定</el-button>
      </span>
    </div>
  </el-dialog>

  <el-dialog
    v-model="publicConfirm"
    style="width: 35%; margin-top: 270px"
    title="确认发布"
  >
    <div class="publicConfirm-block">
      <div class="title">请确认您的gitee仓库已公开，其他人才能给您star哦~</div>
      <span class="dialog-footer">
        <el-button @click="publicConfirm = false">取消</el-button>
        <el-button type="primary" @click="publicButton()"
          >确认, 立即发布</el-button
        >
      </span>
    </div>
  </el-dialog>
</template>

<script> import { ElMessage } from "element-plus";
import { validateGithubUrl } from "../../utils/validate.js";
import axios from "axios";
import "../../iconfont/iconfont";
import bus from "../../utils/emitter";
import { getExpireTime } from "../../utils/common.js";
import { getUserPrice } from "../../api/getUserPrice";
import { getUserName } from "../../api/getUserName.js";
import { publicCard } from "../../api/publicCard.js"
import { UserIsLogin } from "../../api/UserIsLogin.js";

export default {
  data() {
    return {
      dialogVisible: false,
      publicConfirm: false,
      userPrice: "查询中...",

      cardTitle: "",
      cardDiscription: "",
      starPrice: 1,
      starNum: 1,
    };
  },
  methods: {
    /**
     * 发布按钮
     */ 
    async publicButton() {
      // 剩余积分不足
      if (this.userPrice - this.starPrice * this.starNum < 0) {
        ElMessage({
          message: "您当前云币不足~ 快去star别人的卡片吧!",
          type: "warning",
        });
        this.publicConfirm = false;
    
      // 检查是否gitee链接
      } else if (validateGiteeUrl(this.cardTitle)) {
        ElMessage({
          message: "您输入的似乎不是Gitee链接, 请检查",
          type: "warning",
        });
        this.publicConfirm = false;

      } else {
        this.dialogVisible = false;
        this.publicConfirm = false;
        ElMessage("正在尝试发布, 请稍等");

        let access = await publicCard(
          "GitHub", this.cardTitle, this.cardDiscription, this.starPrice, this.starNum);
        if (access) {
          ElMessage({
            message: "发布成功! 为您重定向至第一页...",
            type: "success",
          });
          bus.emit("refreshUserInfo");
          bus.emit("refreshUserPrice");
          bus.emit("refreshPageData");
        }
      }
    },

    /**
     * 提供可调用的public页面
     */ 
    async openPage() {
      if (!await UserIsLogin("Gitee")) { // 登录
        ElMessage({
          message: "请先进行 登录/注册!",
          type: "warning",
        });
      } else {
        this.dialogVisible = true; // 显示页面
        this.userPrice = await getUserPrice("Gitee");
      }
    },
  },
};
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
.rank-num-block {
  width: 90%;

  display: flex;
}
.slider {
  margin-top: auto;
  margin-bottom: auto;
  width: 67%;
}
.slider-text {
  margin-top: auto;
  margin-bottom: auto;
  width: 25%;
}
.dialog-footer {
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
