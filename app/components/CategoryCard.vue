<script setup lang="ts">
/**
 * 博客分类卡片（Version 2）：斜切大卡片 + 硬阴影 + Astron 幽灵编号。
 */
import type { BlogCategory } from "~/utils/meta";

const props = defineProps<{
  category: BlogCategory;
  count: number;
  index?: number;
}>();

const meta = computed(() => BLOG_CATEGORIES[props.category]);
const to = computed(() => `/blog/${props.category}`);
</script>

<template>
  <Reveal variant="wipe" :delay="(index ?? 0) * 0.12" :duration="0.8" class="h-full">
    <NuxtLink :to="to" data-cursor="hover"
      class="group shadow-hard relative flex h-full flex-col justify-between overflow-hidden border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 md:p-9">
      <!-- 右上角斜切三角 -->
      <span
        class="absolute right-0 top-0 block h-0 w-0 border-l-[22px] border-t-[22px] border-l-transparent border-t-accent/80 transition-all duration-500 group-hover:border-l-[30px] group-hover:border-t-[30px]"
        aria-hidden="true"
      />

      <!-- 幽灵编号（Astron） -->
      <span
        class="pointer-events-none absolute -bottom-4 right-2 select-none font-display text-8xl font-extrabold leading-none text-line-soft transition-colors duration-500 group-hover:text-accent-soft md:text-9xl"
        aria-hidden="true">
        {{ String((index ?? 0) + 1).padStart(2, "0") }}
      </span>

      <div class="relative">
        <div class="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-faint">
          <span class="flex items-center gap-1.5 text-accent">
            <UIcon :name="meta.icon" class="size-4" />
            /{{ String((index ?? 0) + 1).padStart(2, "0") }}
          </span>
          <span class="text-deco italic uppercase">{{ meta.en }}</span>
        </div>
        <h3
          class="mt-5 font-title text-3xl tracking-wide text-text transition-colors duration-300 group-hover:text-accent">
          {{ meta.label }}
        </h3>
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-muted">{{ meta.description }}</p>
      </div>

      <div class="relative mt-8 flex items-center justify-between">
        <span class="font-mono text-xs text-faint">{{ count }} 篇 →</span>
        <span
          class="cut-corner-sm cut-outline grid size-10 place-items-center text-muted transition-all duration-500 group-hover:bg-accent group-hover:text-bg group-hover:[--cut-line:var(--accent)]">
          <UIcon name="lucide:arrow-right"
            class="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </NuxtLink>
  </Reveal>
</template>
