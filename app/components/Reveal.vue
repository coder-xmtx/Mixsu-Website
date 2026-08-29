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

  const fromVars: gsap.TweenVars = { duration: props.duration, ease: "power3.out", delay: props.delay };

  switch (props.variant) {
    case "fade":
      Object.assign(fromVars, { autoAlpha: 0 });
      break;
    case "left":
      Object.assign(fromVars, { autoAlpha: 0, x: -props.yOffset });
      break;
    case "right":
      Object.assign(fromVars, { autoAlpha: 0, x: props.yOffset });
      break;
    case "zoom":
      Object.assign(fromVars, { autoAlpha: 0, scale: 0.92 });
      break;
    case "clip":
      Object.assign(fromVars, { clipPath: "inset(0 0 100% 0)" });
      break;
    default:
      Object.assign(fromVars, { autoAlpha: 0, y: props.yOffset });
  }

  const ctx = gsap.context(() => {
    gsap.from(target, {
      ...fromVars,
      scrollTrigger: {
        trigger: target,
        start: `top ${100 - props.threshold * 100}%`,
        toggleActions: props.once ? "play none none none" : "play reverse play reverse",
      },
    });
  }, target);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <component :is="as" ref="el" :class="class">
    <slot />
  </component>
</template>
