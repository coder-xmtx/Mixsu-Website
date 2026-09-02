<script setup lang="ts">
/**
 * 全屏路由过渡（Version 2）：
 * 一道巨大的橙色斜切「快门」从左向右扫过全屏，扫过瞬间亮出目标页面名
 * 与百分比计数器；新页面就绪后快门反向扫出。配合 main.css 中斜向裁切的
 * .page-* 过渡，路由切换呈现「快门闭合 → 撕开」的凌厉节奏。
 *
 * 时序：router.beforeEach 等待闭合动画完成后再放行导航；
 * nuxtApp.hook('page:finish') 在 Suspense 解析完成后触发滑出。
 */
import { gsap } from "gsap";

const overlayEl = ref<HTMLElement | null>(null);
const bandEl = ref<HTMLElement | null>(null);
const ghostEl = ref<HTMLElement | null>(null);
const barEl = ref<HTMLElement | null>(null);
const counterEl = ref<HTMLElement | null>(null);

const reduceMotion = usePrefersReducedMotion();

const PAGE_NAMES: Record<string, { zh: string; en: string }> = {
  "/": { zh: "首页", en: "HOME" },
  "/projects": { zh: "作品", en: "WORKS" },
  "/blog": { zh: "博客", en: "BLOG" },
  "/about": { zh: "关于", en: "ABOUT" },
};

const FALLBACK_NAME = { zh: "Mixsu", en: "STUDIO" } as const;

const currentName = ref<{ zh: string; en: string }>(PAGE_NAMES["/"] ?? FALLBACK_NAME);

let busy = false;
let removeGuard: (() => void) | null = null;
let ctx: gsap.Context | null = null;

function targetName(path: string): { zh: string; en: string } {
  const seg = "/" + (path.split("/")[1] || "");
  return PAGE_NAMES[seg] ?? FALLBACK_NAME;
}

function animateIn(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = overlayEl.value;
    const band = bandEl.value;
    const ghost = ghostEl.value;
    if (!overlay || !band || !ghost || reduceMotion.value) return resolve();

    const bar = barEl.value;
    const counter = counterEl.value;

    const tl = gsap.timeline({
      onComplete: () => resolve(),
      defaults: { ease: "power3.inOut" },
    });

    // 快门从左扫入（先淡入再横扫，规避斜切带在屏幕边缘的部分可见）
    tl.set(overlay, { display: "block" })
      .set([band, ghost], { xPercent: -200, autoAlpha: 0 })
      .to([band, ghost], { autoAlpha: 1, duration: 0.14, ease: "power1.out" }, 0)
      .to(band, { xPercent: 260, duration: 0.58, ease: "power2.in" }, 0.05)
      .to(ghost, { xPercent: 245, duration: 0.66, ease: "power2.in" }, 0.12)
      .to([band, ghost], { autoAlpha: 0, duration: 0.16, ease: "power1.in" }, 0.55)
      // 内容在快门扫过中心时亮出
      .fromTo(
        overlay.querySelectorAll("[data-route-fade]"),
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.05, ease: "power3.out" },
        0.3,
      );

    if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const counterObj = { v: 0 };
    tl.add(
      gsap.to(counterObj, {
        v: 100,
        duration: 0.42,
        ease: "power2.inOut",
        onUpdate: () => {
          if (bar) gsap.set(bar, { scaleX: counterObj.v / 100 });
          if (counter) counter.textContent = String(Math.round(counterObj.v)).padStart(2, "0");
        },
      }),
      0.3,
    );
  });
}

function animateOut(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = overlayEl.value;
    const band = bandEl.value;
    const ghost = ghostEl.value;
    if (!overlay || !band || !ghost) return resolve();

    if (reduceMotion.value) {
      overlay.style.display = "none";
      return resolve();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        resolve();
      },
      defaults: { ease: "power3.inOut" },
    });

    // 内容熄灭，快门反向扫出
    tl.to(overlay.querySelectorAll("[data-route-fade]"), { autoAlpha: 0, y: -16, duration: 0.18, ease: "power1.in" }, 0)
      .set([band, ghost], { xPercent: 280, autoAlpha: 0 })
      .to([band, ghost], { autoAlpha: 1, duration: 0.12, ease: "power1.out" }, 0.06)
      .to(band, { xPercent: -220, duration: 0.52, ease: "power2.in" }, 0.08)
      .to(ghost, { xPercent: -235, duration: 0.6, ease: "power2.in" }, 0.14)
      .to([band, ghost], { autoAlpha: 0, duration: 0.14, ease: "power1.in" }, 0.5);
  });
}

onMounted(() => {
  const overlay = overlayEl.value;
  if (!overlay) return;

  const nuxtApp = useNuxtApp();
  const router = useRouter();

  ctx = gsap.context(() => {
    gsap.set(overlay, { display: "none" });
  }, overlay);

  removeGuard = router.beforeEach(async (to, from) => {
    if (busy) return true;

    // 同一路由（锚点/重复点击）不做过渡
    if (from.path === to.path) return true;

    busy = true;
    currentName.value = targetName(to.path);
    await animateIn();
    busy = false;
    return true;
  });

  // 等新页面真正加载完成（Suspense 解析完）再滑出
  nuxtApp.hook("page:finish", () => {
    animateOut();
  });
});

onUnmounted(() => {
  removeGuard?.();
  ctx?.revert();
});
</script>

<template>
  <Teleport to="body">
    <div ref="overlayEl" class="fixed inset-0 z-115 hidden overflow-hidden bg-bg" aria-hidden="true">
      <!-- 阴影斜切带（尾随） -->
      <div
        ref="ghostEl"
        class="absolute inset-y-[-30%] left-0 w-[46%] -skew-x-[16deg] bg-elevated opacity-80"
      />
      <!-- 橙色快门斜切带 -->
      <div ref="bandEl" class="absolute inset-y-[-30%] left-0 w-[46%] -skew-x-[16deg] bg-accent">
        <div class="hatch absolute inset-0 opacity-30" />
      </div>

      <!-- 顶部/底部细线 -->
      <div class="absolute inset-x-0 top-0 h-[3px] bg-accent" />
      <div class="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />

      <!-- 中央内容 -->
      <div class="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <p data-route-fade class="flex items-center gap-3 font-mono text-[11px] tracking-[0.5em] text-faint uppercase">
          <span class="h-px w-8 -skew-x-12 bg-accent" />
          Now Entering
          <span class="h-px w-8 -skew-x-12 bg-accent" />
        </p>

        <div data-route-fade class="mt-6 flex flex-col items-center gap-2 overflow-hidden text-center">
          <span class="font-title text-6xl tracking-wide text-text md:text-8xl">
            {{ currentName.zh }}
          </span>
          <span class="font-display text-2xl font-extrabold tracking-[0.3em] text-accent md:text-4xl">
            {{ currentName.en }}
          </span>
        </div>

        <!-- 进度线与计数器 -->
        <div data-route-fade class="mt-12 flex w-56 flex-col gap-3 md:w-72">
          <div class="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-faint">
            <span>LOADING</span>
            <span ref="counterEl" class="text-accent">00</span>
          </div>
          <div ref="barEl" class="h-[3px] w-full origin-left bg-line-soft">
            <div class="h-full w-full -skew-x-12 bg-accent" />
          </div>
        </div>
      </div>

      <!-- 角落刻度装饰 -->
      <span class="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-faint">MX·26</span>
      <span class="absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em] text-faint">STUDIO</span>
      <span class="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.3em] text-faint">MIXSU/STUDIO</span>
      <span class="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.3em] text-accent">///</span>
    </div>
  </Teleport>
</template>
