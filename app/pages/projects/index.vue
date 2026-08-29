<script setup lang="ts">
/**
 * 作品列表页：分类筛选（Flip 过渡）。
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

useSeoMeta({
  description: "Mixsu 的作品集：剪辑、Blender 与开发项目。",
});

const { data: projects } = await useAsyncData("projects-all", () =>
  queryCollection("projects")
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "cover", "featured", "path")
    .all(),
);

const active = ref<"all" | ProjectCategory>("all");
const gridEl = ref<HTMLElement | null>(null);
const reduceMotion = usePrefersReducedMotion();

const counts = computed(() => {
  const all = projects.value ?? [];
  return {
    all: all.length,
    video: all.filter((p) => p.category === "video").length,
    blender: all.filter((p) => p.category === "blender").length,
    dev: all.filter((p) => p.category === "dev").length,
  };
});

const filtered = computed(() => {
  const all = projects.value ?? [];
  if (active.value === "all") return all;
  return all.filter((p) => p.category === active.value);
});

const tabs = computed(() => [
  { key: "all" as const, label: "全部", count: counts.value.all },
  { key: "video" as const, label: "剪辑", count: counts.value.video },
  { key: "blender" as const, label: "Blender", count: counts.value.blender },
  { key: "dev" as const, label: "开发", count: counts.value.dev },
]);

function applyFilter(key: "all" | ProjectCategory) {
  if (key === active.value) return;
  const grid = gridEl.value;
  if (grid && !reduceMotion.value) {
    const state = Flip.getState("[data-proj]");
    active.value = key;
    nextTick(() => {
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.fromTo(
        grid.querySelectorAll("[data-proj]"),
        { autoAlpha: 0, scale: 0.985 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.045,
          delay: 0.05,
          clearProps: "all",
          onComplete: () => ScrollTrigger.refresh(),
        },
      );
    });
  } else {
    active.value = key;
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 pt-32 md:px-10 md:pt-40">
    <SectionHeading
      index="01"
      kicker="Portfolio"
      title="作品集"
      description="剪辑、Blender 与开发 —— 每个项目都是一次完整的创作练习。"
    />

    <!-- 分类筛选 -->
    <Reveal variant="fade" :delay="0.2" class="mt-12">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          data-cursor="hover"
          class="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-sm tracking-widest transition-all duration-300"
          :class="
            active === tab.key
              ? 'border-accent bg-accent text-bg'
              : 'border-line text-muted hover:border-accent/60 hover:text-text'
          "
          @click="applyFilter(tab.key)"
        >
          {{ tab.label }}
          <span class="text-[11px]" :class="active === tab.key ? 'text-bg/70' : 'text-faint'">{{ tab.count }}</span>
        </button>
      </div>
    </Reveal>

    <!-- 作品网格 -->
    <div ref="gridEl" class="mt-12 grid gap-x-8 gap-y-14 pb-8 md:grid-cols-2">
      <ProjectCard
        v-for="(project, i) in filtered"
        :key="project.path"
        data-proj
        :animate="false"
        :title="project.title"
        :description="project.description"
        :date="project.date"
        :category="project.category"
        :tags="project.tags"
        :cover="project.cover"
        :to="project.path"
        :featured="project.featured"
        :index="i"
      />
    </div>

    <Reveal v-if="!filtered.length" variant="fade" class="py-20 text-center">
      <p class="text-sm text-muted">这个分类还没有作品。</p>
    </Reveal>
  </div>
</template>
