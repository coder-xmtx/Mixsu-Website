<script setup lang="ts">
/**
 * 博客首页：分类卡片 + 精选文章。
 */
useSeoMeta({
  description: "Mixsu 的博客：生活、JavaScript 与 Blender 的实践记录。",
});

const { data: allPosts } = await useAsyncData("blog-all", () =>
  queryCollection("blog")
    .select("category", "path")
    .all(),
);

const { data: pinnedPosts } = await useAsyncData("blog-pinned", () =>
  queryCollection("blog")
    .where("pinned", "=", true)
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "path")
    .all(),
);

const categoryCount = computed<Record<string, number>>(() => {
  const acc: Record<string, number> = {};
  for (const post of allPosts.value ?? []) {
    acc[post.category] = (acc[post.category] ?? 0) + 1;
  }
  return acc;
});

const categoryKeys = Object.keys(BLOG_CATEGORIES) as BlogCategory[];
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 pt-32 md:px-10 md:pt-40">
    <SectionHeading index="02" kicker="Blog" title="博客" description="技术笔记、生活随笔，写给自己，也写给你。" />

    <!-- 分类卡片 -->
    <div class="mt-14 grid gap-6 md:grid-cols-3">
      <CategoryCard v-for="(key, i) in categoryKeys" :key="key" :category="key" :count="categoryCount[key] ?? 0"
        :index="i" />
    </div>

    <!-- 精选文章 -->
    <section class="mt-24">
      <div class="flex items-end justify-between gap-6">
        <SectionHeading index="—" kicker="Featured" title="置顶文章" />
      </div>
      <div class="mt-8">
        <PostCard v-for="(post, i) in pinnedPosts" :key="post.path" :title="post.title" :description="post.description"
          :date="post.date" :category="post.category" :tags="post.tags" :to="post.path" :index="i" />
      </div>
    </section>
  </div>
</template>
