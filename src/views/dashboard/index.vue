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

          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box body">

          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box weapon">

          </div>
        </div>
      </div>
      <div class="bottom_btn_box">
        <img src="@/assets/images/combine_wait_img.png" alt="">
      </div>
    </div>
  </main>
</template>

<script>
import { getActivityInfo } from "@/utils/api";

export default {
  name: "Dashboard",
  props: {
    config: {
      type: Object,
      default: () => ({ activity_id: 11011 }),
    },
  },
  data() {
    return {

    };
  },
  mounted() {
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
</style>
