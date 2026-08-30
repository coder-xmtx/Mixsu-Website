---
title: Motion Cards
description: 一套带 Flip 动画的卡片布局库，让列表排序、筛选、增删都有丝滑的过渡。
date: 2026-03-14
category: dev
tags:
  - Vue
  - GSAP
  - 组件库
cover: /covers/motion-cards.svg
featured: false
role: 独立开发
links:
  - label: npm
    url: https://www.npmjs.com
---

# Motion Cards

一套 Vue 3 卡片布局组件：排序、筛选、增删卡片时，所有元素用 Flip 动画平滑过渡到新位置。

## 为什么做

后台列表最常见的体验是：点一下筛选，卡片"啪"地消失，再"啪"地出现。我想让这个过程有连续性——眼睛应该能追踪卡片从哪来、到哪去。

## 实现

核心只有两步：

1. 用 `Flip.getState()` 记录卡片当前位置
2. 数据变化后，用 `Flip.from()` 让卡片从旧位置飞到新位置

```ts
import { Flip } from "gsap/Flip";

function refreshLayout() {
  const state = Flip.getState(".card");
  // ...更新数据...
  Flip.from(state, {
    duration: 0.6,
    ease: "power3.inOut",
    stagger: 0.04,
  });
}
```

## 特性

- 筛选 / 排序 / 增删全场景覆盖
- 进出场动画可单独配置
- SSR 安全，无布局抖动
