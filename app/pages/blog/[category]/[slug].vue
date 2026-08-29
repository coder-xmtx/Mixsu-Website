<script setup lang="ts">
/**
 * 文章详情页。
 */
const route = useRoute();
const category = route.params.category as string;

if (!(category in BLOG_CATEGORIES)) {
  throw createError({ statusCode: 404, statusMessage: "分类不存在" });
}

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection("blog").path(route.path).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "文章不存在" });
}

const { data: related } = await useAsyncData(`related-${route.path}`, () =>
  queryCollection("blog")
    .where("category", "=", category)
    .where("path", "<>", route.path)
    .order("date", "DESC")
    .limit(3)
    .select("title", "description", "date", "category", "path")
    .all(),
);

const meta = computed(() => BLOG_CATEGORIES[category as BlogCategory]);

useSeoMeta({
  title: `${post.value!.title} — Mixsu Studio`,
  description: post.value!.description,
  ogType: "article",
});

// 估算阅读时长（中文约 400 字/分钟）
const readingTime = computed(() => estimateReadingMinutes(post.value?.body as never));
</script>

<template>
  <div v-if="post" class="mx-auto max-w-3xl px-5 pt-28 md:px-0 md:pt-32">
    <!-- 返回 -->
    <Reveal variant="fade">
      <NuxtLink
        :to="`/blog/${category}`"
        class="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint transition-colors hover:text-accent"
      >
        <UIcon name="lucide:arrow-left" class="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        返回{{ meta.label }}
      </NuxtLink>
    </Reveal>

    <!-- 文章头 -->
    <header class="mt-10">
      <Reveal variant="fade">
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent-soft px-3 py-1 font-mono text-[11px] tracking-widest text-accent">
            <UIcon :name="meta.icon" class="size-3.5" />
            {{ meta.label }}
          </span>
          <span class="font-mono text-xs text-faint">{{ formatDate(post.date) }}</span>
          <span class="font-mono text-xs text-faint">· {{ readingTime }} 分钟</span>
        </div>
      </Reveal>

      <Reveal variant="clip" :delay="0.08">
        <h1 class="mt-6 font-display text-3xl font-extrabold leading-tight tracking-tight text-text md:text-5xl">
          {{ post.title }}
        </h1>
      </Reveal>

      <Reveal variant="up" :delay="0.16" :y-offset="20">
        <p class="mt-5 text-base leading-relaxed text-muted md:text-lg">{{ post.description }}</p>
      </Reveal>

      <Reveal v-if="post.tags?.length" variant="fade" :delay="0.22" class="mt-6 flex flex-wrap gap-2">
        <span v-for="tag in post.tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </Reveal>

      <Reveal variant="fade" :delay="0.25">
        <div class="mt-10 border-b border-line-soft" />
      </Reveal>
    </header>

    <!-- 正文 -->
    <article class="prose-content mt-12 pb-4">
      <ContentRenderer :value="post" />
    </article>

    <!-- 结尾 -->
    <footer class="mt-16 border-t border-line-soft pt-10">
      <div class="flex flex-wrap items-center justify-between gap-6">
        <p class="hand-note text-xl text-muted">写于 {{ formatDate(post.date) }} · 谢谢阅读 ✦</p>
        <NuxtLink
          :to="`/blog/${category}`"
          data-cursor="hover"
          class="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs tracking-widest text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          同分类更多文章
          <UIcon name="lucide:arrow-right" class="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </NuxtLink>
      </div>

      <!-- 相关文章 -->
      <div v-if="related?.length" class="mt-12">
        <p class="font-mono text-xs tracking-[0.25em] text-faint">继续阅读</p>
        <div class="mt-4">
          <PostCard
            v-for="(item, i) in related"
            :key="item.path"
            :title="item.title"
            :description="item.description"
            :date="item.date"
            :category="item.category"
            :to="item.path"
            :index="i"
          />
        </div>
      </div>
    </footer>
  </div>
</template>
