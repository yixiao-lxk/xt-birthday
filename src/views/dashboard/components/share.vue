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
            <!-- <img src="@/assets/images/share/cover.png" v-if="!isShare" alt="SSR盒子" class="ssr_box"> -->
            <p class="nicknameView" :class="{'created': isShare}">@{{nickname}}</p>
            <!-- <img src="@/assets/images/share/qrcode.png" v-if="isShare" alt="二维码" class="qrcode"> -->
          </div>
          <div class="shareBtnBox" v-if="!isShare">
            <img @click.stop="generateImg" src="@/assets/images/share/want_share.png" alt="我要分享">
          </div>
          <div class="shareBtnBox created" v-else>
            <img @click.stop="saveImg" src="@/assets/images/share/save.png" alt="保存图片">
            <img @click.stop="openBilibiliShare" src="@/assets/images/share/share.png" alt="分享">
          </div>
        </div>
      </div>
    </div>
    <div class="shareWrapper" id="shareWrapperRef" ref="shareWrapperRef"></div>
  </el-dialog>
</template>

<script>
import html2canvas from 'html2canvas';
import { getNickname,uploadImage } from "@/utils/api";
import biliSharePc from "@bilibili/share-pc";

// 按需引入 Element UI
import { Dialog } from "element-ui";
import "element-ui/lib/theme-chalk/dialog.css";


export default {
  name: "ShareModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
      robotImg: "",//机甲图片
      isShare: false, //是否分享
      base64Img: '', //分享图片base64
      image_url: "", // 分享图片url
      nickname: "", //用户昵称
      activityId: "", //活动id
    };
  },
  components: {
    [Dialog.name]: Dialog,
  },
  watch: {
  },
  methods: {
    //展示分享
    async showShare(data) {
      // 获取用户昵称
      const res = await getNickname();
      this.nickname = res.name;
      this.activityId = data.activity_id || "";
      this.robotImg = data.poster_url || "";
      this.visible = true;
    },
    //关闭分享
    closeShare() {
      this.visible = false;
      // 清空分享组件容器的DOM
      if (this.$refs.shareWrapperRef) {
        this.$refs.shareWrapperRef.innerHTML = "";
      }
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
                // this.closeShare();
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
      // this.closeShare();
    },
    //打开分享
    async openBilibiliShare() {
      const res = await this.uploadImage();
      //调用分享方法
      this.share(res.image_url);
      // this.closeShare();
    },
    // 上传分享图片
    async uploadImage() {
      try {
        // 将base64图片转换为Blob对象
        const blob = await this.base64ToBlob(this.base64Img);

        // 创建FormData对象
        const formData = new FormData();
        formData.append("file", blob, "share_image.png");
        formData.append("activity_id", this.activityId);

        // 调用上传接口
        const res = await uploadImage(formData);
        return res;
      } catch (error) {
        console.error("上传失败:", error);
        throw error;
      }
    },
    // base64转Blob
    base64ToBlob(base64) {
      return new Promise((resolve) => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        resolve(new Blob([u8arr], { type: mime }));
      });
    },
    //实际分享逻辑
    share(image_url) {
      console.log("share", image_url);
      const pageInfo = window.__BILIACT_PAGEINFO__ || {};
      const options = {
        title: pageInfo.shareTitle || "星穹铁道生日会",
        desc: pageInfo.shareText || "快来参与星穹铁道生日会活动吧！",
        link: location.href,
        pics: image_url,
        // topic_id: pageInfo.topic_id || 1332371,
        // topic_name: pageInfo.topic_name || "星穹铁道生日会",
        topic_id: 1177780,
        topic_name: "星穹铁道生日会",
        // dynamic: {
        //   image: image_url,
        //   descPre: ""
        // }
      };
      biliSharePc.share(options, this.$refs.shareWrapperRef);
    },
  },
};
</script>

<style lang="less">
.el-dialog__wrapper:has(.shareDialog) {
  position: fixed !important;
  top:0;
  left: 0;
  width:100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-dialog.shareDialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: none;
  box-shadow: none;
  margin: 0 !important;
}

.shareWrapper {
  position: absolute;
  bottom: 65px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
}

.el-dialog.shareDialog .el-dialog__header {
  display: none;
}

.el-dialog.shareDialog .el-dialog__body {
  position: relative;
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
    margin: 0;
    &.created {
      bottom: 260px;
      left: 220px;
    }
  }
}
</style>
