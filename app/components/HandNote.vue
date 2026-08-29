<script setup lang="ts">
/**
 * 手写注释：斜置的手写体批注，带淡入动效与轻微浮动。
 */
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    text: string;
    rotate?: number;
    className?: string;
  }>(),
  {
    rotate: -4,
    className: "",
  },
);

const el = ref<HTMLElement | null>(null);
const reduceMotion = usePrefersReducedMotion();

onMounted(() => {
  const target = el.value;
  if (!target || reduceMotion.value) return;

  const ctx = gsap.context(() => {
    gsap.from(target, { autoAlpha: 0, y: 14, rotate: props.rotate - 6, duration: 0.8, ease: "power3.out", delay: 0.2 });
    gsap.to(target, {
      y: -6,
      rotate: props.rotate + 1.5,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.4,
    });
  }, target);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <span
    ref="el"
    class="hand-note inline-block text-accent will-change-transform"
    :style="{ rotate: `${rotate}deg` }"
    :class="className"
  >
    {{ text }}
  </span>
</template>
