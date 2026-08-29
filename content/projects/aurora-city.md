---
title: 极光之城
description: 一座漂浮在极光之下的赛博城市。Blender 全流程练习作品，涵盖建模、程序化材质、体积雾与灯光排布。
date: 2025-11-02
category: blender
tags:
  - Blender
  - 场景
  - 赛博朋克
cover: /covers/aurora-city.svg
featured: true
role: 独立制作
links:
  - label: 站酷
    url: https://www.zcool.com.cn
---

# 极光之城

一座漂浮在极光之下的赛博城市。这个项目是我在 Blender 里做过的最大规模场景，从零开始，大概花了三周的下班时间。

## 思路

一开始只有一张参考图：极光、海面、悬浮的楼群。我想把「冷」和「暖」放在同一帧里——极光蓝绿是冷的，而每一扇窗户里透出的橙色灯光是暖的。

## 过程

- **建模**：楼体全部用几何节点生成，随机高度与切角，保证重复中带着变化。
- **材质**：玻璃用 Principled BSDF 叠加菲涅尔渐变；楼体墙面用程序化网格纹理，避免 UV 展开的重复劳动。
- **灯光**：主光是一张 HDR 极光贴图，辅以数百个点光源模拟窗户。
- **体积**：底部加了一层雾 + 体积散射，把楼群"沉"进海面。

::note
体积散射很吃渲染时间，最终用 4.0 的 Cycles 渲染 256 采样 + 降噪，单帧大约 12 分钟。
::

## 收获

最大的收获是学会了用灯光讲故事：同一条街道，把暖光比例调高 10%，情绪就完全不一样了。

<video controls poster="/covers/aurora-city.svg">
  <source src="#" type="video/mp4" />
  你的浏览器不支持视频播放。
</video>

> 渲染设置：Cycles · 1920×1080 · 256 samples · Denoise
