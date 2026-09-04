<script setup lang="ts">
/**
 * 页脚（Version 3）：广播/胶片风。
 * 顶部 THANKS FOR WATCHING 跑马带 → 滚动填充的 MIXSU STUDIO 巨字 →
 * 自动滚动的封面胶片带 → 演职员表（CREDITS）+ VU 电平表 + 链接 →
 * 底部版权条。
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

const credits = [
  { role: "DIRECTOR", name: "MIXSU" },
  { role: "EDITOR", name: "MIXSU" },
  { role: "3D ARTIST", name: "MIXSU" },
  { role: "DEVELOPER", name: "MIXSU" },
  { role: "MUSE", name: "艺术与好奇心" },
];

const filmCovers = [
  "/covers/mixsu-site.svg",
  "/covers/pov-slice.svg",
  "/covers/motion-cards.svg",
  "/covers/ember-short.svg",
  "/covers/sculpt-study.svg",
  "/covers/blog-golden-hour.svg",
  "/covers/blog-cat-javascript.svg",
  "/covers/blog-nuxt4.svg",
];

const bigRef = ref<HTMLElement | null>(null);
const fillEl = ref<HTMLElement | null>(null);

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* 巨字：滚动时从描边逐渐填充为橙色实心 */
onMounted(() => {
  const root = bigRef.value;
  const fill = fillEl.value;
  if (!root || !fill || usePrefersReducedMotion().value) return;

  const ctx = gsap.context(() => {
    gsap.fromTo(
      fill,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "top 25%",
          scrub: 0.5,
        },
      },
    );
  }, root);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <footer class="relative z-10 mt-32 overflow-hidden border-t border-line-soft bg-bg-soft">
    <!-- 顶部跑马带 -->
    <div class="relative overflow-hidden border-b border-line bg-elevated/60 py-2.5">
      <Marquee :items="['THANKS FOR WATCHING', '感谢观看', 'THE END? NO, KEEP GOING']" :speed="40" separator="//"
        class="text-xs tracking-[0.35em] text-faint uppercase" />
    </div>

    <div class="mx-auto max-w-7xl px-5 pt-16 md:px-10">
      <!-- 巨字标语：描边 → 滚动填充 -->
      <div ref="bigRef" class="relative">
        <div class="select-none" aria-hidden="true">
          <p class="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] tracking-tight text-stroke">
            MIXSU
          </p>
          <p class="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] tracking-tight text-stroke mt-[-0.06em]">
            STUDIO
          </p>
        </div>
        <div ref="fillEl" class="absolute inset-0 select-none">
          <p class="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] tracking-tight text-accent">
            MIXSU
          </p>
          <p class="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.95] tracking-tight text-accent mt-[-0.06em]">
            STUDIO
          </p>
        </div>
        <!-- 手写注脚 -->
        <p class="hand-note absolute -bottom-2 right-0 hidden text-sm text-faint md:block">
          est. 2024 — still experimenting.
        </p>
      </div>

      <!-- 封面胶片带 -->
      <div class="film-strip relative mt-14 overflow-hidden border-y border-line bg-elevated/70 py-3">
        <div class="film-track flex w-max items-center gap-3">
          <template v-for="group in 2" :key="group">
            <div
              v-for="(cover, i) in filmCovers"
              :key="`${group}-${i}`"
              class="relative shrink-0"
            >
              <img :src="cover" alt="" loading="lazy"
                class="h-16 w-40 border border-line-soft object-cover" />
              <span class="absolute bottom-0.5 left-1 font-mono text-[8px] tracking-[0.2em] text-white/60">
                FR-{{ String(i + 1).padStart(2, "0") }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- 信息区：演职员表 + VU 表 + 链接 -->
      <div class="mt-12 grid gap-10 border-t border-line-soft py-12 md:grid-cols-12">
        <!-- CREDITS -->
        <div class="md:col-span-4">
          <p class="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint uppercase">
            <span class="size-1.5 bg-red-400" />
            Credits
          </p>
          <dl class="mt-4 space-y-2">
            <div v-for="c in credits" :key="c.role" class="flex items-baseline gap-3">
              <dt class="w-24 shrink-0 font-mono text-[10px] tracking-[0.2em] text-faint">{{ c.role }}</dt>
              <dd class="h-px flex-1 bg-line-soft" />
              <dd class="font-title text-sm tracking-wide text-text">{{ c.name }}</dd>
            </div>
          </dl>
        </div>

        <!-- VU 表 -->
        <div class="md:col-span-3">
          <p class="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint uppercase">
            <span class="h-px w-4 -skew-x-12 bg-accent" />
            Audio
          </p>
          <div class="vu-bars mt-5" aria-hidden="true">
            <span v-for="i in 7" :key="i" />
          </div>
          <p class="mt-3 font-mono text-[10px] tracking-[0.3em] text-faint">CH.01 — MIXSU STUDIO</p>
          <p class="mt-1.5 max-w-xs text-sm leading-relaxed text-muted opacity-60">
            一个爱剪片子、玩 Blender、写代码的人。我们不会放弃对艺术的追求。
          </p>
        </div>

        <!-- 导航 + 联系 -->
        <div class="flex gap-x-16 md:col-span-5 md:justify-end">
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
          class="cut-corner-sm cut-outline sweep group inline-flex items-center gap-2 bg-surface px-4 py-2 font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent hover:[--cut-line:var(--accent)]"
          @click="scrollTop">
          回到顶部
          <UIcon name="lucide:arrow-up" class="size-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 胶片带滚动 */
.film-track {
  animation: film-roll 36s linear infinite;
}
.film-track:hover {
  animation-play-state: paused;
}
@keyframes film-roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
