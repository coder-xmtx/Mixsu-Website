<script setup lang="ts">
/**
 * 屏幕两侧的竖向装饰轨（仅超宽屏显示）：
 * 左侧竖排站点名 + 右侧竖排坐标信息，随滚动轻微反向漂移。
 * 全部 pointer-events-none，纯氛围层。
 */
import { gsap } from "gsap";

const left = ref<HTMLElement | null>(null);
const right = ref<HTMLElement | null>(null);

onMounted(() => {
  if (usePrefersReducedMotion().value) return;
  const ctx = gsap.context(() => {
    gsap.to("[data-rail]", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 1.2,
      },
    });
  }, left.value?.parentElement ?? undefined);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <div class="pointer-events-none fixed inset-y-0 z-20 hidden 2xl:block" aria-hidden="true">
    <!-- 左侧竖排 -->
    <div ref="left" class="absolute left-5 top-1/2">
      <p data-rail class="font-mono text-[10px] tracking-[0.5em] text-faint" style="writing-mode: vertical-rl">
        MIXSU STUDIO — PERSONAL WORKSPACE
      </p>
      <span data-rail class="mt-3 block h-16 w-px bg-line" />
    </div>
    <!-- 右侧竖排 -->
    <div ref="right" class="absolute right-5 top-1/2">
      <p data-rail class="font-mono text-[10px] tracking-[0.5em] text-faint" style="writing-mode: vertical-rl">
        30.59°N 114.31°E — WUHAN
      </p>
      <span data-rail class="mt-3 block h-16 w-px bg-line" />
    </div>
  </div>
</template>
