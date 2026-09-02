<script setup lang="ts">
/**
 * 站点头部（Version 2）：
 * 桌面端——Logo + 带角标/斜线分隔/斜切下划线的「指挥台」式导航 + ON AIR 状态灯；
 * 移动端——斜向裁切展开的全屏菜单，条目错峰升起 + 巨型幽灵字 + 底部信息条。
 */
import { gsap } from "gsap";

const links = [
  { label: "首页", en: "HOME", to: "/" },
  { label: "作品", en: "WORKS", to: "/projects" },
  { label: "博客", en: "BLOG", to: "/blog" },
  { label: "关于", en: "ABOUT", to: "/about" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/coder-xmtx" },
  { label: "Bilibili", href: "https://space.bilibili.com/1208877584" },
  { label: "邮箱", href: "mailto:mail_xmtx@163.com" },
];

const route = useRoute();
const scrolled = ref(false);
const menuOpen = ref(false);
const menuEl = ref<HTMLElement | null>(null);

/** 首页精确匹配，其余按前缀匹配（博客/作品子页也算激活） */
function isActive(to: string) {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}

function onScroll() {
  scrolled.value = window.scrollY > 32;
}

function openMenu() {
  menuOpen.value = true;
  document.documentElement.style.overflow = "hidden";
}

function closeMenu() {
  menuOpen.value = false;
  document.documentElement.style.overflow = "";
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && menuOpen.value) closeMenu();
}

watch(menuOpen, (open) => {
  const menu = menuEl.value;
  if (!menu || import.meta.server || !open) return;

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.fromTo("[data-menu-head]", { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.08)
    .fromTo(
      menu.querySelectorAll("[data-menu-item]"),
      { yPercent: 120, skewY: 4, autoAlpha: 0 },
      { yPercent: 0, skewY: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08 },
      0.16,
    )
    .fromTo("[data-menu-ghost]", { autoAlpha: 0, yPercent: 46 }, { autoAlpha: 0.1, yPercent: 0, duration: 1.0, ease: "power3.out" }, 0.3)
    .fromTo("[data-menu-foot]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07 }, 0.55);
}, { flush: "post" });

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKeydown);
  document.documentElement.style.overflow = "";
});

watch(
  () => route.fullPath,
  () => closeMenu(),
);
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-100 transition-all duration-500"
    :class="scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-10">
      <!-- Logo -->
      <NuxtLink to="/" data-cursor="hover" class="group flex items-center gap-2.5" aria-label="回到首页">
        <span
          class="cut-corner-sm shadow-hard-sm grid size-9 place-items-center border border-line bg-surface transition-colors duration-300 group-hover:border-accent/60"
        >
          <img src="/favicon.svg" alt="" class="size-5" />
        </span>
        <span class="flex flex-col leading-none">
          <span
            class="font-display text-lg font-extrabold tracking-tight text-text"
          >
            <span class="text-transparent bg-clip-text bg-linear-to-l from-accent-strong to-accent">Mixsu Studio</span>
          </span>
          <span class="mt-1 font-mono text-[9px] tracking-[0.35em] text-faint">// PERSONAL STUDIO</span>
        </span>
      </NuxtLink>

      <!-- 桌面导航：指挥台面板 + 编号 + 斜线分隔 + 斜切下划线 -->
      <nav class="hidden items-center md:flex" aria-label="主导航">
        <div class="corner-ticks flex items-center border border-line bg-surface/70 px-2 backdrop-blur">
          <template v-for="(link, i) in links" :key="link.to">
            <UIcon v-if="i > 0" name="lucide:slash" class="mx-0.5 size-3 text-faint/70" aria-hidden="true" />
            <NuxtLink
              :to="link.to"
              data-cursor="hover"
              class="nav-item group relative flex items-baseline gap-1.5 px-3 py-2 font-mono text-[13px] tracking-widest transition-colors duration-300"
              :class="isActive(link.to) ? 'text-accent' : 'text-muted hover:text-text'"
            >
              <span class="text-[10px]" :class="isActive(link.to) ? 'text-accent' : 'text-faint'">0{{ i + 1 }}</span>
              {{ link.label }}
              <span
                class="absolute inset-x-2.5 -bottom-px h-[2px] origin-left -skew-x-[30deg] bg-accent transition-transform duration-300"
                :class="isActive(link.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'"
                aria-hidden="true"
              />
            </NuxtLink>
          </template>
        </div>
      </nav>

      <div class="flex items-center gap-3">
        <!-- ON AIR 状态灯（桌面） -->
        <span class="hidden items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-faint lg:flex" aria-hidden="true">
          <span class="size-1.5 animate-pulse bg-accent" />
          ON AIR
        </span>

        <ThemeToggle />

        <!-- 移动端菜单按钮：双横线 → X -->
        <button
          type="button"
          class="cut-corner-sm shadow-hard-sm relative grid size-10 place-items-center border border-line bg-surface text-muted transition-colors duration-300 hover:border-accent/60 hover:text-accent md:hidden"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="menuOpen"
          @click="menuOpen ? closeMenu() : openMenu()"
        >
          <span class="relative block h-3 w-4.5">
            <span
              class="absolute left-0 top-0 h-[2px] w-full bg-current transition-all duration-300"
              :class="menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : ''"
            />
            <span
              class="absolute bottom-0 left-0 h-[2px] w-full bg-current transition-all duration-300"
              :class="menuOpen ? 'bottom-auto top-1/2 -translate-y-1/2 -rotate-45' : ''"
            />
          </span>
        </button>
      </div>
    </div>

    <!-- 移动端全屏菜单 -->
    <Teleport to="body">
      <Transition name="menu">
        <div v-if="menuOpen" ref="menuEl" class="fixed inset-0 z-105 flex flex-col overflow-hidden bg-bg md:hidden">
          <!-- 氛围层 -->
          <div class="gridlines" aria-hidden="true" />
          <div
            class="hatch-accent pointer-events-none absolute -right-24 top-1/2 h-[140%] w-48 -translate-y-1/2 rotate-6 opacity-70"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute -top-24 right-1/4 size-72 opacity-40 blur-[110px]"
            :style="{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }"
            aria-hidden="true"
          />

          <!-- 巨型幽灵字 -->
          <p
            data-menu-ghost
            class="pointer-events-none absolute -bottom-6 left-0 select-none whitespace-nowrap font-display text-[26vw] font-extrabold leading-none text-stroke opacity-10"
            aria-hidden="true"
          >
            MIXSU
          </p>

          <!-- 顶部条 -->
          <div data-menu-head class="relative flex h-16 items-center justify-between px-5">
            <div class="flex items-baseline gap-2">
              <span class="font-display text-xl font-extrabold text-text">Mixsu</span>
              <span class="font-mono text-[10px] tracking-[0.35em] text-accent">// MENU</span>
            </div>
            <button
              type="button"
              class="cut-corner-sm relative grid size-10 place-items-center border border-line text-muted transition-colors hover:border-accent/60 hover:text-accent"
              aria-label="关闭菜单"
              @click="closeMenu"
            >
              <UIcon name="lucide:x" class="size-5" />
            </button>
          </div>

          <!-- 导航条目 -->
          <nav class="relative flex flex-1 flex-col justify-center gap-1 px-8" aria-label="移动端导航">
            <NuxtLink
              v-for="(link, i) in links"
              :key="link.to"
              :to="link.to"
              data-menu-item
              class="group flex items-baseline gap-4 overflow-hidden border-b border-line-soft py-4 last:border-b-0"
              @click="closeMenu"
            >
              <span class="w-8 shrink-0 font-mono text-xs text-accent">0{{ i + 1 }}</span>
              <span class="flex flex-1 items-baseline justify-between gap-4">
                <span
                  class="font-title text-4xl tracking-wide transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent"
                  :class="isActive(link.to) ? 'text-accent' : 'text-text'"
                >
                  {{ link.label }}
                </span>
                <span class="text-deco text-sm italic tracking-[0.2em] text-faint transition-all duration-300 group-hover:-translate-x-2 group-hover:text-accent/80">
                  {{ link.en }}
                </span>
              </span>
            </NuxtLink>
          </nav>

          <!-- 底部信息条 -->
          <div data-menu-foot class="relative px-8 pb-8">
            <div class="mb-5 h-px w-full -skew-x-12 bg-line" aria-hidden="true" />
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-5">
                <a
                  v-for="s in socials"
                  :key="s.label"
                  :href="s.href"
                  :target="s.href.startsWith('http') ? '_blank' : undefined"
                  :rel="s.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                  class="slash-underline font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent"
                >
                  {{ s.label }}
                </a>
              </div>
              <p class="font-mono text-[10px] tracking-[0.3em] text-faint">MIXSU STUDIO · 2026</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
/* 斜向裁切展开：从右上角沿对角线铺满 */
.menu-enter-active {
  transition: clip-path 0.55s cubic-bezier(0.77, 0, 0.18, 1);
}
.menu-leave-active {
  transition:
    clip-path 0.4s cubic-bezier(0.77, 0, 0.18, 1),
    opacity 0.3s ease;
}
.menu-enter-to,
.menu-leave-from {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}
.menu-enter-from,
.menu-leave-to {
  clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 0%);
  opacity: 0;
}
.menu-enter-from {
  opacity: 1;
}
</style>
