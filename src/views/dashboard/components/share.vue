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
            <img src="@/assets/images/share/qrcode.png" v-if="isShare" alt="二维码" class="qrcode">
          </div>
          <div class="shareBtnBox" v-if="!isShare">
            <img @click="generateImg" src="@/assets/images/share/want_share.png" alt="我要分享">
          </div>
          <div class="shareBtnBox created" v-else>
            <img @click="saveImg" src="@/assets/images/share/save.png" alt="保存图片">
            <img src="@/assets/images/share/share.png" alt="分享">
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  name: "ShareModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
      robotImg: require('@/assets/images/share/robot.png'), //机甲图片
      isShare: false, //是否分享
      base64Img: '', //分享图片base64
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
    //生成图片
    async generateImg() {
      this.isShare = true;
      await this.$nextTick();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready.catch(() => undefined);
      }
      const shareBox = document.getElementById('shareBox');
      const exportWidth = 670;
      const exportHeight = 950;
      const canvas = await html2canvas(shareBox, {
        backgroundColor: null,
        useCORS: true,
        scale: 1,
        width: exportWidth,
        height: exportHeight,
        windowWidth: exportWidth,
        windowHeight: exportHeight,
        onclone: (clonedDoc) => {
          const clonedShareBox = clonedDoc.getElementById('shareBox');
          if (!clonedShareBox) return;

          const container = clonedShareBox.closest('.shareBox_container');
          if (container) {
            container.style.transform = 'none';
            container.style.transformOrigin = 'top left';
            container.style.width = `${exportWidth}px`;
            container.style.height = `${exportHeight}px`;
          }

          const stage = clonedShareBox.closest('.shareBox_stage');
          if (stage) {
            stage.style.width = `${exportWidth}px`;
            stage.style.height = `${exportHeight}px`;
            stage.style.overflow = 'visible';
          }

          clonedShareBox.style.width = `${exportWidth}px`;
          clonedShareBox.style.height = `${exportHeight}px`;
        },
      });
      this.base64Img = canvas.toDataURL('image/png');
    },
    //保存图片
    saveImg() {
      // 检查是否在B站App中
      const { inBiliApp, isSupport, callNative } = window.biliBridge;
      if (inBiliApp) {
        isSupport("ability.saveImageToPhotosAlbum").then((support) => {
          if (support) {
            callNative({
              method: "ability.saveImageToPhotosAlbum",
              data: {
                base64Data: this.base64Img, // base64 字符串，上限 2M，filePath 与 base64Data 必填其一
                hintMsg: "需要保存图片到相册，以便您可以分享给朋友", // GR 要求申请权限时必须要给予相应的场景说明。
              },
              callback: (info) => {
                console.log("保存图片结果:", info);
                // 保存成功后关闭弹窗
                if (info.code === 0) {
                  this.$message.success("保存成功");
                } else {
                  this.$message.error(info.errMsg || "保存失败");
                }
                this.closeShare();
              },
            });
          } else {
            // not support
            this.downloadImage();
          }
        });
      } else {
        this.downloadImage();
      }
    },
    //下载图片 
    downloadImage() {
      const link = document.createElement("a");
      link.href = this.base64Img;
      link.download = "share_image.png";

      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.$message.success("保存成功");
      this.closeShare();
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
  .qrcode {
    position: absolute;
    left: 26px;
    bottom: 135px;
    width: 134px;
    height: 134px;
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
