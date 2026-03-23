<template>
  <el-dialog
    title="提示"
    :visible.sync="visible"
    append-to-body
    center
    width="764px"
    :show-close="false"
  >
    <div class="shareDialog_body">
      <img src="@/assets/images/rule.png" alt="规则">
      <span class="close" @click="closeShare"></span>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "RuleModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
    };
  },
  watch: {
  },
  methods: {
    showRule() {
      this.visible = true;
    },
    closeShare() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less">

.el-dialog .el-dialog__header {
  display: none;
}

.el-dialog .el-dialog__body {
  padding: 0;
}
.shareDialog_body {
  position: relative;
  .close {
    position: absolute;
    top: 38px;
    right: 40px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}

</style>
