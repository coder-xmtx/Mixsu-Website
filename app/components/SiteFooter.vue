<script setup lang="ts">
/**
 * 页脚（Version 2）：Astron 巨字标语 + 斜切色带 + 斜向排线区 + 装饰化链接。
 */
import { gsap } from "gsap";

const year = new Date().getFullYear();

const navLinks = [
  { label: "首页", to: "/" },
  { label: "作品", to: "/projects" },
  { label: "博客", to: "/blog" },
  { label: "关于", to: "/about" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/coder-xmtx" },
  { label: "Bilibili", href: "https://space.bilibili.com/1208877584" },
  { label: "邮箱", href: "mailto:mail_xmtx@163.com" },
];

const bigRef = ref<HTMLElement | null>(null);

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* 巨字随滚动轻微横移，强化「正在退出画面」的感觉 */
onMounted(() => {
  const root = bigRef.value;
  if (!root || usePrefersReducedMotion().value) return;

  const ctx = gsap.context(() => {
    gsap.fromTo(
      root,
      { xPercent: 0 },
      {
        xPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  }, root);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <footer class="relative z-10 mt-32 overflow-hidden border-t border-line-soft bg-bg-soft">
    <!-- 斜切色带分隔 -->
    <div class="absolute inset-x-[-10%] top-0 h-10 -skew-y-2 bg-accent/10" aria-hidden="true">
      <div class="absolute inset-0 hatch-accent opacity-60" />
    </div>

    <div class="mx-auto max-w-7xl px-5 pt-20 md:px-10">
      <!-- 大字标语 -->
      <div ref="bigRef" class="overflow-hidden">
        <div class="flex items-center gap-5">
          <p class="select-none font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] tracking-tight text-stroke">
            MIXSU
          </p>
          <span class="hidden h-2 w-24 -skew-x-12 bg-accent md:block" aria-hidden="true" />
        </div>
        <div class="flex items-center gap-5">
          <p
            class="select-none font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] tracking-tight text-stroke mt-[-0.06em]">
            STUDIO
          </p>
          <p class="hand-note hidden text-sm text-faint md:block">
            est. 2024 — <br />
            still experimenting.
          </p>
        </div>
      </div>

      <!-- 信息区 -->
      <div class="mt-14 grid gap-10 border-t border-line-soft py-12 md:grid-cols-2">
        <div>
          <p class="flex items-baseline gap-2 font-display text-lg font-extrabold">
            <span class="text-text">Mixsu Studio</span>
            <span class="font-mono text-[10px] tracking-[0.3em] text-accent">// v2</span>
          </p>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted opacity-60">
            一个爱剪片子、玩 Blender、写代码的人。
          </p>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted opacity-60">
            我们不会放弃对艺术的追求。
          </p>
        </div>

        <div class="flex gap-x-24">
          <div>
            <p class="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint uppercase">
              <span class="h-px w-4 -skew-x-12 bg-accent" />
              导航
            </p>
            <ul class="mt-4 space-y-2.5">
              <li v-for="(link, i) in navLinks" :key="link.to">
                <NuxtLink :to="link.to" data-cursor="hover"
                  class="slash-underline group flex items-baseline gap-2 text-sm text-muted transition-colors hover:text-text">
                  <span class="font-mono text-[10px] text-faint group-hover:text-accent">0{{ i + 1 }}</span>
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <p class="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint uppercase">
              <span class="h-px w-4 -skew-x-12 bg-accent" />
              联系
            </p>
            <ul class="mt-4 space-y-2.5">
              <li v-for="s in socials" :key="s.label">
                <a :href="s.href" target="_blank" rel="noopener noreferrer" data-cursor="hover"
                  class="slash-underline text-sm text-muted transition-colors hover:text-text">
                  {{ s.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部条 -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line-soft py-6">
        <p class="font-mono text-xs text-faint">
          © {{ year }} Mixsu Studio · Built with Nuxt + GSAP
        </p>
        <button type="button" data-cursor="hover"
          class="cut-corner-sm sweep group inline-flex items-center gap-2 border border-line bg-surface px-4 py-2 font-mono text-xs tracking-widest text-muted transition-colors hover:border-accent/60 hover:text-accent"
          @click="scrollTop">
          回到顶部
          <UIcon name="lucide:arrow-up" class="size-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  </footer>
</template>
