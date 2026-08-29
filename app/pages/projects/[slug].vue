<script setup lang="ts">
/**
 * 项目详情页。
 */
import { gsap } from "gsap";

const route = useRoute();

const { data: project } = await useAsyncData(route.path, () =>
  queryCollection("projects").path(route.path).first(),
);

if (!project.value) {
  throw createError({ statusCode: 404, message: "项目不存在" });
}

const { data: related } = await useAsyncData(`related-${route.path}`, () =>
  queryCollection("projects")
    .where("category", "=", project.value!.category)
    .where("path", "<>", route.path)
    .order("date", "DESC")
    .limit(2)
    .select("title", "description", "date", "category", "tags", "cover", "path")
    .all(),
);

const meta = computed(() => PROJECT_CATEGORIES[project.value!.category]);

useSeoMeta({
  description: project.value!.description,
});

const headRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const root = headRef.value;
  if (!root) return;
  const ctx = gsap.context(() => {
    gsap.from("[data-detail-fade]", { autoAlpha: 0, y: 26, duration: 0.8, ease: "power3.out", stagger: 0.1 });
    gsap.from("[data-detail-cover]", {
      autoAlpha: 0,
      scale: 1.04,
      duration: 1,
      ease: "power3.out",
      delay: 0.15,
    });
  }, root);
  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <div v-if="project" class="mx-auto max-w-5xl px-5 pt-28 md:px-10 md:pt-32">
    <!-- 返回 -->
    <Reveal variant="fade">
      <NuxtLink
        to="/projects"
        class="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-faint transition-colors hover:text-accent"
      >
        <UIcon name="lucide:arrow-left" class="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        返回作品集
      </NuxtLink>
    </Reveal>

    <!-- 头部 -->
    <header ref="headRef" class="mt-8">
      <div data-detail-fade class="flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent-soft px-3 py-1 font-mono text-[11px] tracking-widest text-accent">
          <UIcon :name="meta.icon" class="size-3.5" />
          {{ meta.label }}
        </span>
        <span class="font-mono text-xs text-faint">{{ formatDate(project.date) }}</span>
        <span v-if="project.role" class="font-mono text-xs text-faint">· {{ project.role }}</span>
      </div>

      <h1 data-detail-fade class="mt-5 font-display text-4xl font-extrabold tracking-tight text-text md:text-6xl">
        {{ project.title }}
      </h1>

      <p data-detail-fade class="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
        {{ project.description }}
      </p>

      <div data-detail-fade v-if="project.tags?.length" class="mt-6 flex flex-wrap gap-2">
        <span v-for="tag in project.tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>

      <!-- 封面 -->
      <div data-detail-cover class="relative mt-10 overflow-hidden rounded-2xl border border-line">
        <img
          v-if="project.cover"
          :src="project.cover"
          :alt="project.title"
          class="aspect-[3/2] w-full object-cover"
        />
      </div>
    </header>

    <!-- 正文 -->
    <article class="mt-14 pb-8">
      <ContentRenderer :value="project" class="prose-content" />
    </article>

    <!-- 链接 -->
    <div v-if="project.links?.length" class="mt-12 flex flex-wrap gap-3 border-t border-line-soft pt-8">
      <a
        v-for="link in project.links"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="hover"
        class="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-sm tracking-widest text-text transition-all duration-300 hover:border-accent hover:text-accent"
      >
        {{ link.label }}
        <UIcon name="lucide:arrow-up-right" class="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>

    <!-- 相关项目 -->
    <section v-if="related?.length" class="mt-20">
      <Reveal variant="fade">
        <h2 class="font-display text-2xl font-bold tracking-tight text-text">同类作品</h2>
      </Reveal>
      <div class="mt-8 grid gap-8 md:grid-cols-2">
        <ProjectCard
          v-for="(item, i) in related"
          :key="item.path"
          :title="item.title"
          :description="item.description"
          :date="item.date"
          :category="item.category"
          :tags="item.tags"
          :cover="item.cover"
          :to="item.path"
          :index="i + 1"
        />
      </div>
    </section>
  </div>
</template>
