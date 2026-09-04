<script setup lang="ts">
/**
 * 分类文章列表页（Version 2）：16:9 斜切横幅 + 带缩略图的文章列表。
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
    .select("title", "description", "date", "category", "tags", "cover", "path")
    .all(),
);

useSeoMeta({
  description: meta.value.description,
});

const bannerRef = ref<HTMLElement | null>(null);

/* 横幅入场：斜向裁切擦入 */
onMounted(() => {
  const root = bannerRef.value;
  if (!root || usePrefersReducedMotion().value) return;

  const { gsap } = useGsap();
  const ctx = gsap.context(() => {
    gsap.fromTo(
      root,
      { autoAlpha: 0, clipPath: "polygon(100% 0%, 100% 100%, 72% 100%, 100% 0%)" },
      { autoAlpha: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.9, ease: "power3.inOut", delay: 0.1, clearProps: "clipPath" },
    );
  }, root);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-32 md:px-10 md:pt-40">
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
          <h1 class="mt-4 font-title text-5xl tracking-wide text-text md:text-7xl">
            {{ meta.label }}
          </h1>
        </Reveal>
      </div>
      <Reveal variant="up" :delay="0.2">
        <p class="max-w-xs text-sm leading-relaxed text-muted">{{ meta.description }}</p>
      </Reveal>
    </div>

    <!-- 21:9 分类横幅 -->
    <div ref="bannerRef" class="mt-12">
      <div class="cut-corner-lg shadow-hard relative overflow-hidden border border-line bg-surface">
        <img :src="meta.cover" :alt="`${meta.label} 分类横幅`" class="aspect-[21/9] w-full object-cover" />
        <span
          class="absolute left-0 top-0 border-b border-r border-line bg-bg/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-accent backdrop-blur">
          CATEGORY/{{ meta.en.toUpperCase() }}
        </span>
        <span
          class="absolute bottom-0 right-0 border-l border-t border-line bg-bg/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-faint backdrop-blur">
          WIDE · 21:9
        </span>
      </div>
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
        :cover="post.cover"
        :to="post.path"
        :index="i"
      />
    </div>

    <Reveal v-if="!posts?.length" variant="fade" class="py-20 text-center">
      <p class="text-sm text-muted">这个分类还没有文章。</p>
    </Reveal>
  </div>
</template>
