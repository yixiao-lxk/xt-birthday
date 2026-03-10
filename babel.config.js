/*
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-13 15:27:58
 * @LastEditors  : chen
 * @LastEditTime : 2026-01-19 15:13:32
 * Copyright (C) 2026 chen. All rights reserved.
 */
module.exports = {
  compact: false,
  presets: [
    "@vue/cli-plugin-babel/preset",
    ["@babel/preset-env", { modules: false }],
  ],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};
