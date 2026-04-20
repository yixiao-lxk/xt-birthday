<!--
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-13 16:04:19
 * @LastEditors  : chen
 * @LastEditTime : 2026-02-10 15:03:27
 * Copyright (C) 2026 chen. All rights reserved.
-->
<template>
  <main>
    <div class="container">
      <div class="group_box">
        <div class="group_item_box">
          <div class="group_body_box head">
            <div v-if="components[0] && components[0].group_status == 0">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" src="@/assets/images/components/unlocked_img_1.png" alt="">
            </div>
            <div v-if="(components[0] && components[0].group_status == 1) || err_code == -3">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" @click.stop="refreshComponent(0)" src="@/assets/images/components/unlocked_video_1.png" alt="">
            </div>
            <div v-if="components[0] && components[0].group_status == 2">
              <img :src="(components[0] && components[0].image_url) || ''" alt="头" />
            </div>
            <img class="refresh_btn" @click.stop="refreshComponent(0)" src="@/assets/images/components/refresh_btn.png"
              alt="" />
            <span class="refresh_count_view">{{ (components[0] && components[0].remain_refresh_count) || 0 }}</span>
            <div class="buttonView">

            </div>
          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box body">
            <div v-if="components[1] && components[1].group_status == 0">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" src="@/assets/images/components/unlocked_img_2.png" alt="">
            </div>
            <div v-if="(components[1] && components[1].group_status == 1) || err_code == -3">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" @click.stop="refreshComponent(1)" src="@/assets/images/components/unlocked_video_2.png" alt="">
            </div>
            <div v-if="components[1] && components[1].group_status == 2">
              <img :src="(components[1] && components[1].image_url) || ''" alt="身体" />
            </div>
            <img class="refresh_btn" @click.stop="refreshComponent(1)" src="@/assets/images/components/refresh_btn.png"
              alt="" />
            <span class="refresh_count_view">{{ (components[1] && components[1].remain_refresh_count) || 0 }}</span>
            <div class="buttonView">

            </div>
          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box weapon">
            <div v-if="components[2] && components[2].group_status == 0">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" src="@/assets/images/components/unlocked_img_3.png" alt="">
            </div>
            <div v-if="(components[2] && components[2].group_status == 1) || err_code == -3">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" @click.stop="refreshComponent(2)" src="@/assets/images/components/unlocked_video_3.png" alt="">
            </div>
            <div v-if="components[2] && components[2].group_status == 2">
              <img :src="(components[2] && components[2].image_url) || ''" alt="武器" />
            </div>
            <img class="refresh_btn" @click.stop="refreshComponent(2)" src="@/assets/images/components/refresh_btn.png"
              alt="" />
            <span class="refresh_count_view">{{ (components[2] && components[2].remain_refresh_count) || 0 }}</span>
            <div class="buttonView">

            </div>
          </div>
        </div>
      </div>
      <div class="bottom_btn_box" v-if="components.length">
        <img v-if="components.every((item) => item.group_status == 2)" src="@/assets/images/combine_img.png" alt=""
          @click="showShareDialog">
        <img v-else class="disabled" src="@/assets/images/combine_wait_img.png" alt="">
      </div>
      <div class="bottom_btn_box" v-if="err_code == -3">
        <img class="disabled" src="@/assets/images/combine_wait_img.png" alt="">
      </div>
    </div>
    <share ref="shareRef" @close="handleCloseShare" />
  </main>
</template>

<script>
import share from "./components/share.vue";
import { getActivityInfo, refreshPart, mergeMecha } from "@/utils/api";

export default {
  name: "DashboardView",
  props: {
    config: {
      type: Object,
      default: () => ({ activity_id: 11011 }),
    },
  },
  data() {
    return {
      err_code: 0,
      components: [],
    };
  },
  components: {
    share
  },
  mounted() {
    this.getInfo();
    // 监听可见性变化
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log("visible:true");
        this.getInfo();
      } else {
        console.log("visible:false");
      }
    });
  },
  methods: {
    // 获取活动信息
    async getInfo() {
      const {
        config: { activity_id },
      } = this;
      try {
        const res = await getActivityInfo({ activity_id });
        this.components = Array.isArray(res.groups) && res.groups.length ? res.groups : this.components;
        console.log("部件数据", res);
      } catch (error) {
        console.log("获取部件数据失败", error);
        this.err_code = error.err_code;
      }
    },
    // 展示分享弹窗
    async showShareDialog() {
      const {
        config: { activity_id },
      } = this;
      const res = await mergeMecha({ activity_id });
      console.log("合并部件数据", res);
      const shareData = {
        poster_url: res.poster_url,
        activity_id: activity_id,
      }
      this.$refs.shareRef.showShare(shareData);
    },
    // 关闭分享弹窗
    handleCloseShare() {

    },

    // 刷新部件
    async refreshComponent(index) {
      const {
        config: { activity_id },
      } = this;
      if(this.components[index].group_status == 0) {
        return;
      }
      if(this.components[index].remain_refresh_count == 0) {
        this.$message.error(`暂无刷新次数，请先观看第${index+1}组视频1分钟获取刷新次数`);
        return;
      }
      const res = await refreshPart({ activity_id, group_id: this.components[index].group_id });
      if (res) {
        this.components[index].image_url = res.image_url;
        this.components[index].group_status = 2;
        this.components[index].remain_refresh_count = res.remain_refresh_count;
      }
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 876px;
  height: 629px;
  background: url(@/assets/images/bottom_bg.png) no-repeat top center;
  position: relative;
  overflow: hidden;

  .group_box {
    display: flex;
    align-items: center;
    gap: 30px;
    width: 784px;
    margin: 160px auto 0;

    .group_item_box {
      width: 241px;
      height: 344px;
      background: url(@/assets/images/components/item_box_bg.png) no-repeat top center;

      .group_body_box {
        position: relative;
        width: 241px;
        height: 344px;

        &.head {
          background: url(@/assets/images/components/head_box_bg.png) no-repeat top center;
        }

        &.body {
          background: url(@/assets/images/components/body_box_bg.png) no-repeat top center;
        }

        &.weapon {
          background: url(@/assets/images/components/weapon_box_bg.png) no-repeat top center;
        }

        .unlockedImg {
          position: absolute;
          top: 0;
          left: 0;
        }

        .refresh_btn {
          position: absolute;
          top: 62px;
          right: 10px;
          cursor: pointer;
        }

        .refresh_count_view {
          position: absolute;
          display: block;
          bottom: 80px;
          right: 10px;
          width: 30px;
          font-size: 16px;
          font-weight: bold;
          color: #2d3063;
        }

        .buttonView {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 146px;
          height: 79px;
        }
      }
    }
  }

  .bottom_btn_box {
    text-align: center;
    margin-top: 20px;

    >img {
      cursor: pointer;
    }
    >img.disabled {
      filter: grayscale(1);
      opacity: 0.8;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}

.ruleView {
  width: 876px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;

  >a {
    font-size: 16px;
    line-height: 50px;
    font-weight: bold;
    color: #fdf467;
    cursor: pointer;
  }
}
</style>
