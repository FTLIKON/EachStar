<template>
  <el-dialog v-model="dialogVisible" title="发布卡片">
    <div class="input-block">
      <el-input
        class="title-input"
        v-model="cardTitle"
        placeholder="您的项目链接，例如：https://github.com/FTLIKON/EachStar"
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
        <span class="slider-text">🪙积分价值: {{ starPrice }}</span>
        <el-slider
          v-model="starPrice"
          class="slider"
          :step="1"
          :min="1"
          :max="5"
        ></el-slider>
      </div>
      <div class="rank-num-block">
        <span class="slider-text">👤悬赏次数: {{ starNum }}</span>
        <el-slider
          v-model="starNum"
          class="slider"
          :step="1"
          :min="1"
          :max="50"
        ></el-slider>
      </div>
      <div class="user-rank-calc">
        消耗积分: {{ starPrice * starNum }}
        <el-divider direction="vertical" /> 剩余积分:
        {{ userPrice - starPrice * starNum }}
      </div>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="publicConfirm = true">发布</el-button>
      </span>
    </div>
  </el-dialog>

  <el-dialog v-model="publicConfirm" title="确认发布">
    <div class="publicConfirm-block">
      <div class="title">请确认您的github仓库已公开，其他人才能给您star哦~</div>
      <span class="dialog-footer">
        <el-button @click="publicConfirm = false">取消</el-button>
        <el-button type="primary" @click="publicCard()"
          >确认, 立即发布</el-button
        >
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { register } from "../api/auth";
import { ElMessage } from "element-plus";
import { validateGithubUrl } from "../utils/validate.js";
import axios from "axios";

export default {
  data() {
    return {
      dialogVisible: false,
      publicConfirm: false,
      cardTitle: "",
      cardDiscription: "",
      starPrice: 1,
      starNum: 1,

      userPrice: "查询中...",
    };
  },
  methods: {
    publicCard: function () {
      if (this.userPrice - this.starPrice * this.starNum < 0) {
        ElMessage({
          message: "您当前积分不足~ 快去star别人的卡片吧!",
          type: "warning",
        });
      } else if (validateGithubUrl(this.cardTitle)) {
        ElMessage({
          message: "您输入的似乎不是Github链接, 请检查",
          type: "warning",
        });
      } else {
        var that = this;
        // debug
        // publicCard Arguments -> title, context, starPrice, starNum, time
        this.dialogVisible = false;
        this.$emit(
          "publicCard",
          that.cardTitle,
          that.cardDiscription,
          that.starPrice,
          that.starNum,
          that.getExpireTime()
        );
      }
    },

    openPage() {
      // 打开发布页面->需要登录
      let userName = this.$cookies.get("userName");
      if (userName) {
        this.dialogVisible = true;

        var that = this;
        var config = {
          method: "get",
          url: "server/api/user/@me",
        };
        axios(config)
          .then(function (response) {
            console.log(response.data.price);
            that.userPrice = response.data.price;
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        ElMessage({
          message: "请先进行 注册/登录!",
          type: "warning",
        });
      }
    },

    getExpireTime() {
      let now = new Date();
      now = now.setDate(now.getDate() + 10);
      now = new Date(now);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minute < 10) minute = "0" + minute;
      if (second < 10) second = "0" + second;
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  },
};
</script>

<style lang="scss" scoped>
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
