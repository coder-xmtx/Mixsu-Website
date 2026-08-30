<script setup lang="ts">
/**
 * 博客分类卡片：大字分类 + 描述 + 文章数，悬停倾斜。
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
  <Reveal variant="up" :delay="(index ?? 0) * 0.12" :y-offset="48" class="h-full">
    <NuxtLink :to="to" data-cursor="hover"
      class="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors duration-500 hover:border-accent/50 md:p-9">
      <!-- 背景大图标 -->
      <UIcon :name="meta.icon"
        class="pointer-events-none absolute -right-5 -top-5 size-32 text-line-soft transition-all duration-700 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-accent-soft" />

      <div class="relative">
        <div class="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-faint">
          <span class="text-accent">0{{ (index ?? 0) + 1 }}</span>
          <span class="uppercase">{{ meta.en }}</span>
        </div>
        <h3
          class="mt-5 font-display text-md font-bold tracking-tight text-text transition-colors duration-300 group-hover:text-accent md:text-4xl">
          {{ meta.label }}
        </h3>
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-muted">{{ meta.description }}</p>
      </div>

      <div class="relative mt-8 flex items-center justify-between">
        <span class="font-mono text-xs text-faint">{{ count }} 篇文章</span>
        <span
          class="grid size-10 place-items-center rounded-full border border-line text-muted transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
          <UIcon name="lucide:arrow-right"
            class="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </NuxtLink>
  </Reveal>
</template>
