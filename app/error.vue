<script setup lang="ts">
/**
 * 错误页：404 及其他错误。
 */
import { gsap } from "gsap";

const props = defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>();

// 标签页标题保持全局一致（nuxt.config 已固定）

const el = ref<HTMLElement | null>(null);

onMounted(() => {
  const root = el.value;
  if (!root) return;
  const ctx = gsap.context(() => {
    gsap.from("[data-error-fade]", { autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.12, delay: 0.1 });
  }, root);
  onUnmounted(() => ctx.revert());
});

const is404 = computed(() => (props.error.statusCode ?? 404) === 404);
</script>

<template>
  <div ref="el" class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
    <div
      class="pointer-events-none absolute top-1/3 left-1/2 size-[28rem] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
      :style="{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }"
      aria-hidden="true"
    />

    <p data-error-fade class="font-mono text-xs tracking-[0.4em] text-accent">
      {{ is404 ? "ERROR 404" : `ERROR ${error.statusCode ?? "?"}` }}
    </p>

    <h1 data-error-fade class="mt-6 font-display text-[clamp(6rem,20vw,13rem)] font-extrabold leading-none tracking-tight text-stroke select-none">
      {{ is404 ? "404" : error.statusCode }}
    </h1>

    <p data-error-fade class="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
      {{ is404 ? "这里什么都没有——可能是链接写错了，也可能是我把它藏得太好了。" : (error.message || "出了点问题。") }}
    </p>

    <div data-error-fade class="mt-10 flex flex-wrap items-center justify-center gap-4">
      <NuxtLink
        to="/"
        data-cursor="hover"
        class="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 font-mono text-sm tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]"
      >
        回到首页
        <UIcon name="lucide:home" class="size-4" />
      </NuxtLink>
      <NuxtLink
        to="/blog"
        data-cursor="hover"
        class="inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-3.5 font-mono text-sm tracking-widest text-text transition-colors duration-300 hover:border-accent/60 hover:text-accent"
      >
        去博客逛逛
      </NuxtLink>
    </div>
  </div>
</template>
