<script setup lang="ts">
/**
 * 全屏路由过渡：切换路由时，一块「加载页」从底部滑入（显示目标页面名与进度线），
 * 覆盖住旧页面 → 新页面就绪 → 加载页从底部滑出。
 *
 * 实现：router.beforeEach 等待滑入动画完成后再放行导航；
 * nuxtApp.hook('page:finish') 在页面加载完成后触发滑出。
 */
import { gsap } from "gsap";

const overlayEl = ref<HTMLElement | null>(null);
const barEl = ref<HTMLElement | null>(null);
const nameEl = ref<HTMLElement | null>(null);

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
    const bar = barEl.value;
    if (!overlay || reduceMotion.value) return resolve();

    const tl = gsap.timeline({
      onComplete: () => resolve(),
    });

    tl.set(overlay, { display: "flex" })
      .set(bar, { scaleX: 0, transformOrigin: "left center" })
      .to(overlay, { yPercent: 0, duration: 0.55, ease: "power4.inOut" })
      .to(bar, { scaleX: 1, duration: 0.42, ease: "power2.inOut" }, "-=0.28");
  });
}

function animateOut(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = overlayEl.value;
    if (!overlay || reduceMotion.value) {
      gsap.set(overlay, { display: "none" });
      return resolve();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        resolve();
      },
    });

    tl.to(overlay, { yPercent: 100, duration: 0.55, ease: "power4.inOut", delay: 0.05 });
  });
}

onMounted(() => {
  const overlay = overlayEl.value;
  if (!overlay) return;

  const nuxtApp = useNuxtApp();
  const router = useRouter();

  ctx = gsap.context(() => {
    gsap.set(overlay, { yPercent: 100, display: "none" });
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

  // 关键：等新页面真正加载完成（Suspense 解析完）再滑出。
  // 之前用 afterEach 会在页面 async 数据还没回来时就提前放完过渡。
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
    <div
      ref="overlayEl"
      class="fixed inset-0 z-115 hidden flex-col items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <!-- 顶部细线 -->
      <div
        class="absolute inset-x-0 top-0 h-px"
        :style="{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }"
      />

      <p class="font-mono text-[11px] tracking-[0.5em] text-faint uppercase">Mixsu Studio</p>

      <div class="relative mt-6 flex items-baseline gap-4 overflow-hidden">
        <span class="font-display text-6xl font-extrabold tracking-tight text-text md:text-8xl">
          {{ currentName.zh }}
        </span>
        <span class="font-mono text-sm tracking-[0.3em] text-accent">{{ currentName.en }}</span>
      </div>

      <!-- 进度线 -->
      <div ref="barEl" class="mt-10 h-px w-44 overflow-hidden bg-line-soft md:w-64">
        <div class="h-full w-full bg-accent" />
      </div>

      <!-- 角落刻度装饰 -->
      <span class="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-faint">MX·26</span>
      <span class="absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em] text-faint">LOADING</span>
    </div>
  </Teleport>
</template>
