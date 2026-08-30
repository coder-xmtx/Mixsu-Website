<script setup lang="ts">
/**
 * 滚动入场动画容器：元素进入视口时执行一次入场动画。
 * variant:
 *  - up     : 从下方升起
 *  - fade   : 仅淡入
 *  - left   : 从左侧滑入
 *  - right  : 从右侧滑入
 *  - zoom   : 缩放淡入
 *  - clip   : 从上向下揭开（适合标题）
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const props = withDefaults(
  defineProps<{
    variant?: "up" | "fade" | "left" | "right" | "zoom" | "clip";
    delay?: number;
    duration?: number;
    yOffset?: number;
    threshold?: number;
    once?: boolean;
    as?: string;
    class?: string;
    animate?: boolean;
  }>(),
  {
    variant: "up",
    delay: 0,
    duration: 0.9,
    yOffset: 48,
    threshold: 0.15,
    once: true,
    as: "div",
    class: "",
    animate: true,
  },
);

const el = ref<HTMLElement | null>(null);
const reduceMotion = usePrefersReducedMotion();

onMounted(() => {
  const target = el.value;
  if (!target || !props.animate || reduceMotion.value) return;

  const fromVars: gsap.TweenVars = {};
  const toVars: gsap.TweenVars = {
    duration: props.duration,
    ease: "power3.out",
    delay: props.delay,
  };

  switch (props.variant) {
    case "fade":
      fromVars.autoAlpha = 0;
      toVars.autoAlpha = 1;
      break;
    case "left":
      fromVars.autoAlpha = 0;
      fromVars.x = -props.yOffset;
      toVars.autoAlpha = 1;
      toVars.x = 0;
      break;
    case "right":
      fromVars.autoAlpha = 0;
      fromVars.x = props.yOffset;
      toVars.autoAlpha = 1;
      toVars.x = 0;
      break;
    case "zoom":
      fromVars.autoAlpha = 0;
      fromVars.scale = 0.92;
      toVars.autoAlpha = 1;
      toVars.scale = 1;
      break;
    case "clip":
      fromVars.clipPath = "inset(0 0 100% 0)";
      toVars.clipPath = "inset(0 0 0% 0)";
      break;
    default:
      fromVars.autoAlpha = 0;
      fromVars.y = props.yOffset;
      toVars.autoAlpha = 1;
      toVars.y = 0;
  }

  const ctx = gsap.context(() => {
    const tween = gsap.fromTo(target, fromVars, {
      ...toVars,
      // immediateRender: true —— 首屏之外的元素先立即隐藏，滚动到时是"平滑入场"，
      // 不会出现"先显示 → 跳回隐藏 → 再动画"的跳变（immediateRender: false 的问题）。
      immediateRender: true,
      paused: true,
    });

    const ensureVisible = (self: ScrollTrigger) => {
      // 防"卡隐藏"：起点已进入视口（首屏内 / 刷新后已滚动过）时，
      // 直接把动画跳到终点，元素保持可见且无跳变。
      if (self.progress > 0 && !tween.isActive()) {
        tween.progress(1);
      }
    };

    const st = ScrollTrigger.create({
      trigger: target,
      start: `top ${100 - props.threshold * 100}%`,
      toggleActions: props.once ? "play none none none" : "play reverse play reverse",
      animation: tween,
      onRefresh: ensureVisible,
    });

    ensureVisible(st);
  }, target);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <component :is="as" ref="el" :class="class">
    <slot />
  </component>
</template>
