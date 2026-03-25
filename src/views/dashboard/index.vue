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
            <div v-if="activity_status == 0">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" src="@/assets/images/components/unlocked_img.png" alt="">
            </div>
            <div v-else>
              <div v-if="components[0].status == 0">
                <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
                <img class="unlockedImg" src="@/assets/images/components/unlocked_video_1.png" alt="">
              </div>
              <img v-else :src="require(`@/assets/images/part/head-${components[0].image_id}.png`)" alt="头" />
            </div>
            <img class="refresh_btn" src="@/assets/images/components/refresh_btn.png" alt="刷新" />
            <span class="refresh_count_view">{{components[0].count}}</span>
            <div class="buttonView">

            </div>
          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box body">
            <div v-if="activity_status == 0">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" src="@/assets/images/components/unlocked_img.png" alt="">
            </div>
            <div v-else>
              <div v-if="components[1].status == 0">
                <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
                <img class="unlockedImg" src="@/assets/images/components/unlocked_video_2.png" alt="">
              </div>
              <img v-else :src="require(`@/assets/images/part/body-${components[1].image_id}.png`)" alt="身体" />
            </div>
            <img class="refresh_btn" src="@/assets/images/components/refresh_btn.png" alt="刷新" />
            <span class="refresh_count_view">{{components[1].count}}</span>
            <div class="buttonView">

            </div>
          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box weapon">
            <div v-if="activity_status == 0">
              <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
              <img class="unlockedImg" src="@/assets/images/components/unlocked_img.png" alt="">
            </div>
            <div v-else>
              <div v-if="components[2].status == 0">
                <img src="@/assets/images/components/unlocked_bg.png" alt="解锁背景" />
                <img class="unlockedImg" src="@/assets/images/components/unlocked_video_3.png" alt="">
              </div>
              <img v-else :src="require(`@/assets/images/part/weapon-${components[2].image_id}.png`)" alt="武器" />
            </div>
            <img class="refresh_btn" src="@/assets/images/components/refresh_btn.png" alt="刷新" />
            <span class="refresh_count_view">{{components[2].count}}</span>
            <div class="buttonView">

            </div>
          </div>
        </div>
      </div>
      <div class="bottom_btn_box">
        <img v-if="activity_status != 0 && components.length > 0 && components[0].status == 1 && components[1].status == 1 && components[2].status == 1" src="@/assets/images/combine_img.png" alt="" @click="showShareDialog">
        <img v-else src="@/assets/images/combine_wait_img.png" alt="">
      </div>
    </div>
    <!-- <div class="ruleView">
      <a href="javascript:void(0)" target="_blank">查看更多</a>
      <a href="javascript:void(0)" @click="showRule">活动详细规则</a>
    </div> -->
    <share ref="shareRef" @close="handleCloseShare" />
    <rule ref="ruleRef"/>
  </main>
</template>

<script>
import share from "./components/share.vue";
import rule from "./components/rule.vue";
import { getActivityInfo } from "@/utils/api";

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
      activity_status: 0,
      components: [],
      combination: "",
      user_nickname: "",
    };
  },
  components: {
    share,
    rule,
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
      const res = await getActivityInfo({ activity_id });
      console.log("活动信息", res);
      this.activity_status = res.activity_status;
      this.components = res.components;
      this.combination = res.components.map((item) => item.image_id).join("-"),
      this.user_nickname = res.user_nickname,
      console.log("组合数据", this.combination);
    },
    // 展示分享弹窗
    showShareDialog() {
      this.$refs.shareRef.showShare(this.combination, this.user_nickname);
    },
    // 展示规则弹窗
    showRule() {
      this.$refs.ruleRef.showRule();
    },
    // 关闭分享弹窗
    handleCloseShare() {

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
