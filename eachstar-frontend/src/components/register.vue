<template>
  <!-- 添加或修改业务对话框 -->
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="500px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="bizform" :model="bizform" label-width="80px">
      <el-form-item label="邮箱" prop="bizName">
        <el-input v-model="bizform.bizName" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="bizCode">
        <el-input v-model="bizform.bizCode" placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  login,
  register,
} from "../api/auth";
export default {
  name: "testDialog",
  data() {
    return {
      // 弹出层标题
      title: "注册账号",
      // 是否显示弹出层
      open: true,
      // 表单参数
      bizform: {},
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm: function () {
      updateBizDefine(this.bizform).then((response) => {
        if (response.data) {
          this.msgSuccess("注册成功");
          this.open = false;
          // 调用主页面的getList方法刷新主页面
          this.$parent.getList();
        } else {
          this.msgError(response.resultMsg);
        }
      });
    },
  },
};
</script>


<style></style>
