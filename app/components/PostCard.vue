<script setup lang="ts">
/**
 * 博客文章卡片（Version 3）：行内列表项 + 可选 21:9 宽幅缩略图。
 * 用于分类页与首页精选。
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
    cover?: string;
    index?: number;
  }>(),
  {
    tags: () => [],
    cover: "",
    index: 0,
  },
);

const meta = computed(() => BLOG_CATEGORIES[props.category]);
</script>

<template>
  <Reveal variant="wipe" :delay="Math.min(index * 0.08, 0.3)" :duration="0.7">
    <NuxtLink :to="to" data-cursor="hover"
      class="group grid gap-4 border-b border-line-soft py-6 transition-colors duration-300 hover:border-accent/40 md:grid-cols-[320px_1fr_auto] md:items-center">
      <!-- 21:9 宽幅缩略图 -->
      <div v-if="cover" class="cut-corner-sm shadow-hard-sm relative aspect-[21/9] overflow-hidden bg-surface outline-1 -outline-offset-1 outline-line">
        <img :src="cover" :alt="title" loading="lazy"
          class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
      </div>

      <div>
        <span class="font-mono text-xs text-faint">{{ formatDate(date) }}</span>
        <h3
          class="mt-1 font-title text-xl tracking-wide text-text transition-colors duration-300 group-hover:text-accent">
          {{ title }}
        </h3>
        <p class="mt-1.5 line-clamp-2 text-sm text-muted">{{ description }}</p>
      </div>

      <div class="flex items-center gap-3 md:justify-end">
        <span
          class="cut-corner-sm cut-outline inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] tracking-widest text-muted transition-colors duration-300 group-hover:text-accent group-hover:[--cut-line:var(--accent)]">
          <UIcon :name="meta.icon" class="size-3 text-accent" />
          {{ meta.label }}
        </span>
        <UIcon name="lucide:arrow-right"
          class="size-4 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </NuxtLink>
  </Reveal>
</template>
