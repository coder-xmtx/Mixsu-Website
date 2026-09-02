<script setup lang="ts">
/**
 * 顶部阅读进度条（Version 2 修复版）。
 *
 * 之前用 ScrollTrigger 的 scrub tween：布局组件跨路由存活，导航后文档高度
 * 变化但 trigger 的 start/end 只在下一次 refresh 时重算，于是「切换路由后
 * 进度对不上、刷新才正常」。
 *
 * 现在改为确定性方案：每个滚动帧直接计算
 * progress = scrollY / (scrollHeight - innerHeight)，
 * 与 ScrollTrigger 状态完全解耦，任何时刻都反映真实滚动位置；
 * 路由切换（page:finish）后立即重算一次。
 */
import { gsap } from "gsap";

const bar = ref<HTMLElement | null>(null);

let setScale: ((v: number) => void) | null = null;
let ticking = false;

function read() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  setScale?.(p);
}

function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    read();
    ticking = false;
  });
}

onMounted(() => {
  const el = bar.value;
  if (!el) return;

  gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
  setScale = gsap.quickTo(el, "scaleX", { duration: 0.28, ease: "power2.out" });

  read();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);

  // 路由切换：新页面挂载、文档高度变化后重算（nextTick + 下一帧双保险）
  const nuxtApp = useNuxtApp();
  nuxtApp.hook("page:finish", () => {
    nextTick(() => read());
    requestAnimationFrame(() => read());
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
  });
});
</script>

<template>
  <div
    ref="bar"
    class="fixed inset-x-0 top-0 z-110 h-[3px] origin-left"
    :style="{ background: 'var(--accent)' }"
  >
    <!-- 斜切发光头 -->
    <span
      class="absolute right-0 top-1/2 h-[7px] w-7 -translate-y-1/2 translate-x-1/2 -skew-x-[24deg]"
      :style="{
        background: 'var(--accent-strong)',
        boxShadow: '0 0 14px var(--accent-glow)',
      }"
      aria-hidden="true"
    />
  </div>
</template>
