<script setup lang="ts">
/**
 * 顶部阅读进度条：随滚动缩放，颜色为强调橙。
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const bar = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!bar.value) return;
  gsap.set(bar.value, { scaleX: 0, transformOrigin: "left center" });
  gsap.to(bar.value, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
});
</script>

<template>
  <div ref="bar" class="fixed inset-x-0 top-0 z-[110] h-[2px] origin-left" :style="{ background: 'var(--accent)' }" />
</template>
