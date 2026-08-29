<script setup lang="ts">
/**
 * 页脚：大字标语 + 导航/联系 + 返回顶部。
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
  { label: "邮箱", href: "mailto:hello mail_xmtx@163.com" },
];

const bigTitle = ref<HTMLElement | null>(null);

onMounted(() => {
  const el = bigTitle.value;
  if (!el) return;

  const ctx = gsap.context(() => {
    // 大字标语随滚动轻微上移/淡出
    gsap.fromTo(
      el,
      { yPercent: 40, autoAlpha: 0.35 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
        },
      },
    );
  }, el);

  onUnmounted(() => ctx.revert());
});

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="relative z-10 mt-32 overflow-hidden border-t border-line-soft bg-bg-soft">
    <div class="mx-auto max-w-7xl px-5 pt-16 md:px-10">
      <!-- 大字标语 -->
      <div ref="bigTitle" class="overflow-hidden">
        <p
          class="select-none font-display text-[clamp(3rem,11vw,9rem)] font-extrabold leading-[0.95] tracking-tight text-stroke">
          MIXSU
        </p>
        <p
          class="select-none font-display text-[clamp(3rem,11vw,9rem)] font-extrabold leading-[0.95] tracking-tight text-stroke -mt-[0.06em]">
          STUDIO
        </p>
      </div>

      <!-- 信息区 -->
      <div class="mt-14 grid gap-10 border-t border-line-soft py-12 md:grid-cols-3">
        <div>
          <p class="font-display text-lg font-bold">Mixsu Studio ✦</p>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            一个爱剪片子、玩 Blender、写代码的人，把喜欢的东西都放在这里。
          </p>
        </div>

        <div>
          <p class="font-mono text-xs tracking-[0.25em] text-faint uppercase">导航</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" data-cursor="hover"
                class="link-underline text-sm text-muted transition-colors hover:text-text">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="font-mono text-xs tracking-[0.25em] text-faint uppercase">联系</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="s in socials" :key="s.label">
              <a :href="s.href" target="_blank" rel="noopener noreferrer" data-cursor="hover"
                class="link-underline text-sm text-muted transition-colors hover:text-text">
                {{ s.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部条 -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line-soft py-6">
        <p class="font-mono text-xs text-faint">
          © {{ year }} Mixsu Studio
        </p>
        <button type="button" data-cursor="hover"
          class="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent"
          @click="scrollTop">
          回到顶部
          <UIcon name="lucide:arrow-up" class="size-3.5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  </footer>
</template>
