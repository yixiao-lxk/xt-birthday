<template>
  <el-dialog
    title="提示"
    :visible.sync="visible"
    append-to-body
    center
    width="400px"
    custom-class="shareDialog"
    :show-close="false"
    @closed="closeShare"
  >
    <div class="shareDialog_body">
      <div class="shareBox_stage">
        <div class="shareBox_container">
          <div class="shareBox" :class="{'created': isShare}" id="shareBox">
            <img :src="robotImg" alt="机甲图片" class="robot_img">
            <img src="@/assets/images/share/cover.png" v-if="!isShare" alt="SSR盒子" class="ssr_box">
            <p class="nicknameView" :class="{'created': isShare}">@XXX用户名用户名</p>
          </div>
          <div class="shareBtnBox" v-if="!isShare">
            <img src="@/assets/images/share/want_share.png" @click="isShare = true" alt="我要分享">
          </div>
          <div class="shareBtnBox created" v-else>
            <img src="@/assets/images/share/save.png" alt="保存图片">
            <img src="@/assets/images/share/share.png" alt="分享">
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "ShareModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
      robotImg: require('@/assets/images/share/robot.png'), //机甲图片
      isShare: false, //是否分享
    };
  },
  watch: {
  },
  methods: {
    //展示分享
    showShare() {
      this.visible = true;
    },
    //关闭分享
    closeShare() {
      this.visible = false;
      this.isShare = false;
    },
  },
};
</script>

<style lang="less">
.el-dialog.shareDialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: none;
  box-shadow: none;
  margin: 0 !important;
}

.el-dialog.shareDialog .el-dialog__header {
  display: none;
}

.el-dialog.shareDialog .el-dialog__body {
  padding: 0;
}

.shareDialog_body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.shareBox_stage {
  position: relative;
  overflow: hidden;
  width: 400px;
  height: 567.164179px;
}

.shareBox_container {
  position: relative;
  width: 670px;
  height: 950px;
  transform-origin: top left;
  transform: scale(0.5970149254);
  .shareBtnBox {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 72px;
    left: 0;
    right: 0;
    gap: 80px;
    > img {
      cursor: pointer;
    }
    &.created {
      bottom: 40px;
    }
  }
}

.shareBox {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(@/assets/images/share/share_bg1.jpg) no-repeat top center;
  background-size: 100% 100%;
  &.created {
    background: url(@/assets/images/share/share_bg2.jpg) no-repeat top center;
    background-size: 100% 100%;
  }
  .robot_img {
    width: 100%;
    height: 100%;
  }
  .ssr_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .nicknameView {
    position: absolute;
    left: 82px;
    bottom: 282px;
    color: #583fe2;
    font-size: 24px;
    font-weight: bold;
    &.created {
      bottom: 260px;
      left: 220px;
    }
  }
}
</style>
