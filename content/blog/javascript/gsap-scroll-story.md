---
title: 用 GSAP ScrollTrigger 讲一个滚动故事
description: 滚动不是打断阅读的干扰，而是叙事的一部分。用 ScrollTrigger 的 scrub 与 pin，把页面变成一段可以「播放」的故事。
date: 2026-02-22
category: javascript
tags:
  - GSAP
  - ScrollTrigger
  - 动效
---

# 用 GSAP ScrollTrigger 讲一个滚动故事

本站的动效全部基于 GSAP。这篇文章聊一个核心观点：**滚动动画的目标不是「炫」，而是让阅读有节奏**。

## 两种基本的滚动叙事

### 1. scrub：进度与滚动绑定

当内容需要「跟着手指走」时，用 `scrub`。最典型的就是文字逐行点亮：

```js [app/components/Manifesto.vue]
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const text = ref(null);

onMounted(() => {
  const split = new SplitText(text.value, { type: "lines" });
  gsap.fromTo(
    split.lines,
    { autoAlpha: 0.15, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: text.value,
        start: "top 80%",
        end: "bottom 45%",
        scrub: 1,
      },
    },
  );
});
```

`scrub: 1` 表示进度以 1 秒的平滑度跟随滚动——这是「手感」的关键数字，0 太硬，3 太飘。

### 2. pin：把舞台留出来

需要一段「专属时间」时，把区块钉在视口里，让动画在滚动区间内完成：

```js
gsap.timeline({
  scrollTrigger: {
    trigger: ".scene",
    start: "top top",
    end: "+=120%",
    scrub: 1,
    pin: true,
  },
});
```

## 节奏的一致性

本站所有入场动画共用一套时间参数：`duration: 0.9, ease: "power3.out"`。不同页面看起来「是一个网站」，靠的就是这种一致性。

## 别忘了尊重用户

- 用 `gsap.matchMedia()` 处理 `prefers-reduced-motion`，减少动效的用户直接跳过动画
- 移动端放弃 pin 和复杂 scrub，只保留淡入淡出

::tip
验收标准：把动画全部关掉，页面依然是完整的。动画是锦上添花，不是内容本身。
::

> 延伸阅读：[GSAP 官方文档](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
