<script setup lang="ts">
/**
 * 首屏引导加载层（Version 3）：
 * 首次进入时覆盖全屏，等待关键字体（document.fonts）就绪后才播放
 * 开场动画并揭幕——解决「字体还没加载完内容先出现 → 字体跳变」的问题。
 *
 * 时序：
 *   1. 挂载后立即显示（SSR 首屏就渲染出来，客户端不闪内容）；
 *   2. Promise.race(fonts.ready, 1.4s 超时) 等待字体；
 *   3. 播放 MIXSU 字母序列 + 进度计数（约 0.9s）；
 *   4. 斜向裁切上滑揭幕，随后销毁自己。
 * 仅在硬加载（刷新/首访）时出现；SPA 内部路由切换不触发。
 */
import { gsap } from "gsap";

const overlay = ref<HTMLElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const counter = ref<HTMLElement | null>(null);

const reduceMotion = usePrefersReducedMotion();
const gone = ref(false);

function waitFonts(): Promise<void> {
  if (import.meta.server) return Promise.resolve();
  const loads = [
    document.fonts.load("700 40px 'Astron'"),
    document.fonts.load("40px 'YouSheBiaoTiHei'"),
    document.fonts.load("40px 'Source Han Serif'"),
    document.fonts.load("40px 'JetBrains Mono'"),
    document.fonts.load("40px 'Philosopher'"),
  ];
  return Promise.race([
    Promise.all(loads).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, 1400)),
  ]);
}

onMounted(async () => {
  const el = overlay.value;
  if (!el) return;

  // 引导期间锁定滚动
  document.documentElement.style.overflow = "hidden";
  const restore = () => {
    document.documentElement.style.overflow = "";
  };

  await waitFonts();

  // 通知页面：揭幕开始（Hero 等入场动画此时开始播放）
  const reveal = () => {
    (window as unknown as { __bootDone?: boolean }).__bootDone = true;
    window.dispatchEvent(new CustomEvent("boot:done"));
  };

  if (reduceMotion.value) {
    reveal();
    gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: () => (gone.value = true) });
    restore();
    return;
  }

  const ctx = gsap.context(() => {
    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        reveal();
        gsap.to(el, {
          yPercent: -102,
          duration: 0.65,
          ease: "power4.inOut",
          onComplete: () => {
            restore();
            gone.value = true;
          },
        });
      },
    });

    // 进度计数 + 进度条
    tl.to(
      obj,
      {
        v: 100,
        duration: 0.95,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(obj.v);
          if (counter.value) counter.value.textContent = String(v).padStart(3, "0");
          if (bar.value) gsap.set(bar.value, { scaleX: obj.v / 100 });
        },
      },
      0.1,
    )
      // MIXSU 字母逐个升起
      .fromTo(
        el.querySelectorAll("[data-boot-char]"),
        { yPercent: 130, rotate: 3, autoAlpha: 0 },
        { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: "power4.out" },
        0.15,
      )
      .fromTo("[data-boot-meta]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.55);
  }, el);

  onUnmounted(() => ctx.revert());
});

onUnmounted(() => {
  document.documentElement.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <div v-if="!gone" ref="overlay" class="fixed inset-0 z-130 flex flex-col items-center justify-center bg-bg">
      <!-- 斜向排线角饰 -->
      <div class="hatch-accent pointer-events-none absolute inset-y-[-20%] left-[-10%] w-1/3 -skew-x-[18deg] opacity-40" aria-hidden="true" />
      <span class="pointer-events-none absolute left-5 top-5 font-mono text-[10px] tracking-[0.4em] text-faint" aria-hidden="true">MX·BOOT</span>
      <span class="pointer-events-none absolute right-5 top-5 font-mono text-[10px] tracking-[0.4em] text-faint" aria-hidden="true">LOADING</span>
      <span class="pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.4em] text-faint" aria-hidden="true">MIXSU STUDIO</span>
      <span class="pointer-events-none absolute bottom-5 right-5 font-mono text-[10px] tracking-[0.4em] text-accent" aria-hidden="true">///</span>

      <!-- MIXSU 字母序列 -->
      <div class="flex overflow-hidden font-display text-6xl font-extrabold leading-none text-text md:text-8xl">
        <span v-for="(ch, i) in 'MIXSU'" :key="i" class="inline-block overflow-hidden pb-2">
          <span data-boot-char class="inline-block">{{ ch }}</span>
        </span>
      </div>

      <!-- 进度条 + 计数器 -->
      <div data-boot-meta class="mt-10 flex w-52 flex-col gap-3 md:w-64">
        <div class="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-faint">
          <span>ASSETS</span>
          <span ref="counter" class="text-accent">000</span>
        </div>
        <div ref="bar" class="h-[3px] w-full origin-left bg-line-soft">
          <div class="h-full w-full -skew-x-12 bg-accent" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
