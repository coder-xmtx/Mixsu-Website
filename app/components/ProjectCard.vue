<script setup lang="ts">
/**
 * 项目卡片：封面 + 分类 + 标题 + 描述。
 * 悬停时封面轻微缩放、箭头滑出；进入视口时从下方升起。
 */
import type { ProjectCategory } from "~/utils/meta";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    date: string;
    category: ProjectCategory;
    tags?: string[];
    cover?: string;
    to: string;
    featured?: boolean;
    index?: number;
  }>(),
  {
    tags: () => [],
    cover: "",
    featured: false,
    index: 0,
  },
);

const meta = computed(() => PROJECT_CATEGORIES[props.category]);
</script>

<template>
  <Reveal variant="up" :delay="(index % 2) * 0.1" :y-offset="56" class="group block h-full">
    <NuxtLink :to="to" data-cursor="hover" class="flex h-full flex-col gap-5">
      <!-- 封面 -->
      <div class="relative aspect-3/2 overflow-hidden rounded-2xl border border-line bg-surface">
        <img v-if="cover" :src="cover" :alt="title" loading="lazy"
          class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        <div v-else class="grid size-full place-items-center font-display text-6xl font-extrabold text-stroke">
          {{ title.slice(0, 1) }}
        </div>
        <!-- 分类角标 -->
        <span
          class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/85 px-3 py-1 font-mono text-[11px] tracking-widest text-text backdrop-blur">
          <UIcon :name="meta.icon" class="size-3.5 text-accent" />
          {{ meta.label }}
        </span>
        <!-- 悬停箭头 -->
        <span
          class="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-accent text-bg opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <UIcon name="lucide:arrow-up-right" class="size-4" />
        </span>
      </div>

      <!-- 信息 -->
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex items-center justify-between gap-4">
          <h3
            class="font-display text-xl font-bold tracking-tight text-text transition-colors duration-300 group-hover:text-accent">
            {{ title }}
          </h3>
          <span class="shrink-0 font-mono text-xs text-faint">{{ formatDate(date) }}</span>
        </div>
        <p class="line-clamp-2 text-sm leading-relaxed text-muted">{{ description }}</p>
        <div v-if="tags.length" class="mt-2 flex flex-wrap gap-1.5 pt-2">
          <span v-for="tag in tags.slice(0, 3)" :key="tag"
            class="rounded-full border border-line-soft px-2.5 py-0.5 font-mono text-[11px] text-faint">
            {{ tag }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </Reveal>
</template>
