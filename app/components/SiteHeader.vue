<script setup lang="ts">
/**
 * 站点头部：非对称布局 — 左侧 Logo，右侧导航 + 主题切换。
 * 滚动后出现毛玻璃背景；移动端为全屏菜单。
 */
import { gsap } from "gsap";

const links = [
  { label: "首页", to: "/" },
  { label: "作品", to: "/projects" },
  { label: "博客", to: "/blog" },
  { label: "关于", to: "/about" },
];

const route = useRoute();
const scrolled = ref(false);
const menuOpen = ref(false);
const menuEl = ref<HTMLElement | null>(null);

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

watch(menuOpen, (open) => {
  const menu = menuEl.value;
  if (!menu || import.meta.server || !open) return;

  const items = menu.querySelectorAll("[data-menu-item]");
  gsap.fromTo(
    items,
    { yPercent: 110 },
    { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.07, delay: 0.15 },
  );
}, { flush: "post" });

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  document.documentElement.style.overflow = "";
});

watch(
  () => route.fullPath,
  () => closeMenu(),
);
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-[100] transition-all duration-500"
    :class="scrolled ? 'border-b border-line-soft bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
      <!-- Logo -->
      <NuxtLink
        to="/"
        data-cursor="hover"
        class="group flex items-baseline gap-1 font-display text-xl font-extrabold tracking-tight text-text"
      >
        Mixsu
        <span class="text-accent transition-transform duration-300 group-hover:rotate-180 inline-block">✦</span>
      </NuxtLink>

      <!-- 桌面导航 -->
      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          data-cursor="hover"
          class="relative px-4 py-2 font-mono text-[13px] tracking-widest transition-colors duration-300"
          :class="route.path === link.to ? 'text-accent' : 'text-muted hover:text-text'"
        >
          {{ link.label }}
          <span
            class="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-all duration-300"
            :class="route.path === link.to ? 'opacity-100' : 'opacity-0 scale-0'"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />

        <!-- 移动端菜单按钮 -->
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-text md:hidden"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="menuOpen"
          @click="menuOpen ? closeMenu() : openMenu()"
        >
          <UIcon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="size-5" />
        </button>
      </div>
    </div>

    <!-- 移动端全屏菜单 -->
    <Teleport to="body">
      <Transition name="menu">
        <div v-if="menuOpen" ref="menuEl" class="fixed inset-0 z-[105] flex flex-col bg-bg md:hidden">
          <div class="gridlines" aria-hidden="true" />
          <div class="flex h-16 items-center justify-between px-5">
            <span class="font-display text-xl font-extrabold">Mixsu ✦</span>
            <button
              type="button"
              class="grid size-10 place-items-center rounded-full border border-line text-muted"
              aria-label="关闭菜单"
              @click="closeMenu"
            >
              <UIcon name="lucide:x" class="size-5" />
            </button>
          </div>
          <nav class="relative flex flex-1 flex-col justify-center gap-2 px-8">
            <NuxtLink
              v-for="(link, i) in links"
              :key="link.to"
              :to="link.to"
              data-menu-item
              class="flex items-baseline gap-4 overflow-hidden py-3"
              @click="closeMenu"
            >
              <span class="font-mono text-xs text-accent">0{{ i + 1 }}</span>
              <span
                class="font-display text-5xl font-bold tracking-tight"
                :class="route.path === link.to ? 'text-accent' : 'text-text'"
              >{{ link.label }}</span>
            </NuxtLink>
          </nav>
          <div class="relative px-8 pb-10">
            <p class="hand-note text-lg text-muted">欢迎光临我的小工作室 ✎</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: clip-path 0.5s cubic-bezier(0.83, 0, 0.17, 1), opacity 0.4s ease;
}
.menu-enter-from,
.menu-leave-to {
  clip-path: circle(0% at 92% 8%);
  opacity: 0;
}
.menu-enter-to,
.menu-leave-from {
  clip-path: circle(150% at 92% 8%);
  opacity: 1;
}
</style>
