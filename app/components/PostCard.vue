<script setup lang="ts">
/**
 * 博客文章卡片：行内式列表项，用于分类页与首页精选。
 */
import type { BlogCategory } from "~/utils/meta";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    date: string;
    category: BlogCategory;
    tags?: string[];
    to: string;
    index?: number;
  }>(),
  {
    tags: () => [],
    index: 0,
  },
);

const meta = computed(() => BLOG_CATEGORIES[props.category]);
</script>

<template>
  <Reveal variant="up" :delay="Math.min(index * 0.08, 0.3)" :y-offset="40">
    <NuxtLink :to="to" data-cursor="hover"
      class="group grid gap-3 border-b border-line-soft py-6 transition-colors duration-300 hover:border-accent/40 md:grid-cols-[120px_1fr_auto] md:items-baseline">
      <span class="font-mono text-xs text-faint">{{ formatDate(date) }}</span>

      <div>
        <h3
          class="font-display text-xl tracking-tight text-text transition-colors duration-300 group-hover:text-accent md:text-xl">
          {{ title }}
        </h3>
        <p class="mt-1.5 line-clamp-1 text-sm text-muted">{{ description }}</p>
      </div>

      <div class="flex items-center gap-3 md:justify-end">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] tracking-widest text-muted">
          <UIcon :name="meta.icon" class="size-3 text-accent" />
          {{ meta.label }}
        </span>
        <UIcon name="lucide:arrow-right"
          class="size-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </NuxtLink>
  </Reveal>
</template>
