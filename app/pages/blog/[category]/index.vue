<script setup lang="ts">
/**
 * 分类文章列表页。
 */
const route = useRoute();
const category = route.params.category as string;

if (!(category in BLOG_CATEGORIES)) {
  throw createError({ statusCode: 404, message: "分类不存在" });
}

const meta = computed(() => BLOG_CATEGORIES[category as BlogCategory]);

const { data: posts } = await useAsyncData(`blog-${category}`, () =>
  queryCollection("blog")
    .where("category", "=", category)
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "path")
    .all(),
);

useSeoMeta({
  description: meta.value.description,
});
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 pt-32 md:px-10 md:pt-40">
    <Reveal variant="fade">
      <NuxtLink
        to="/blog"
        class="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint transition-colors hover:text-accent"
      >
        <UIcon name="lucide:arrow-left" class="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        全部分类
      </NuxtLink>
    </Reveal>

    <div class="mt-8 flex flex-wrap items-end justify-between gap-6">
      <div>
        <Reveal variant="fade">
          <p class="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-accent">
            <UIcon :name="meta.icon" class="size-4" />
            {{ meta.en }} · {{ posts?.length }} POSTS
          </p>
        </Reveal>
        <Reveal variant="clip" :delay="0.08">
          <h1 class="mt-4 font-display text-5xl font-extrabold tracking-tight text-text md:text-7xl">
            {{ meta.label }}
          </h1>
        </Reveal>
      </div>
      <Reveal variant="up" :delay="0.2">
        <p class="max-w-xs text-sm leading-relaxed text-muted">{{ meta.description }}</p>
      </Reveal>
    </div>

    <div class="mt-14">
      <PostCard
        v-for="(post, i) in posts"
        :key="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :category="post.category"
        :tags="post.tags"
        :to="post.path"
        :index="i"
      />
    </div>

    <Reveal v-if="!posts?.length" variant="fade" class="py-20 text-center">
      <p class="text-sm text-muted">这个分类还没有文章。</p>
    </Reveal>
  </div>
</template>
