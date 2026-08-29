---
title: Mixsu Studio（本站）
description: 你现在看到的这个网站。Nuxt 4 + Nuxt UI + GSAP + Nuxt Content 打造的个人数字工作室。
date: 2026-08-20
category: dev
tags:
  - Nuxt
  - Vue
  - GSAP
  - 设计
cover: /covers/mixsu-site.svg
featured: true
role: 设计 / 开发
links:
  - label: 源码
    url: https://github.com
  - label: 在线预览
    url: /
---

# Mixsu Studio（本站）

你现在看到的这个网站，本身就是我最新的作品。它的目标是：像一个有手工感的数字工作室，而不是模板后台。

## 技术栈

- **Nuxt 4** + Vue 3 + TypeScript
- **Nuxt UI**（语义化主题色，几乎全部自绘组件）
- **GSAP**（ScrollTrigger / SplitText / Flip）
- **Nuxt Content**（Markdown 驱动的博客与项目）

## 设计决策

- **暗色优先**：深灰蓝底 + 柔和橙强调，亮色模式同样可用
- **拒绝后台感**：不对称网格、错位排版、手写批注、胶片噪点
- **动效是叙事**：入场、滚动触发、页面过渡共享同一套时间节奏

::note
想了解搭建过程？我在[博客](/blog/javascript/nuxt4-content-blog)里写了详细文章。
::

## 一些细节

- 自定义光标只在精确指针设备上启用，触屏完全不受影响
- 所有动画尊重 `prefers-reduced-motion`
- 全文支持亮/暗双主题，CSS 变量驱动，无闪烁

> 状态：持续迭代中
