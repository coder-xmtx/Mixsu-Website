<script setup lang="ts">
/**
 * 作品集（Version 3）：全幅画廊。
 * - 图片占满版面，大图交替铺排（宽幅/竖幅/横幅）；
 * - 点击任一图片：Flip 放大聚焦，旁边滑出详情面板（ESC/点击遮罩关闭）；
 * - 页面四周有随滚动速度流动的文字框（EdgeRails）；
 * - 分类筛选保留，聚焦层打开时锁定滚动。
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

useSeoMeta({
  description: "Mixsu 的作品集：剪辑、Blender 与开发项目。",
});

type ProjectItem = NonNullable<typeof projects.value>[number];

const { data: projects } = await useAsyncData("projects-all", () =>
  queryCollection("projects")
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "cover", "featured", "role", "path")
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

/* 画廊格子样式：宽幅 / 竖幅 / 横幅 交替 */
const TILE_SPANS = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-12",
  "md:col-span-5",
  "md:col-span-7",
] as const;
const TILE_ASPECTS = [
  "aspect-[16/10]",
  "aspect-[4/5] md:aspect-auto md:h-full",
  "aspect-[21/10]",
  "aspect-[4/5]",
  "aspect-[16/10]",
] as const;

function tileClasses(i: number) {
  return {
    span: TILE_SPANS[i % TILE_SPANS.length],
    aspect: TILE_ASPECTS[i % TILE_ASPECTS.length],
  };
}

function applyFilter(key: "all" | ProjectCategory) {
  if (key === active.value) return;
  const grid = gridEl.value;
  if (grid && !reduceMotion.value) {
    const state = Flip.getState("[data-proj]");
    active.value = key;
    nextTick(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        onEnter: (els: Element[]) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          ),
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  } else {
    active.value = key;
  }
}

/* ---------------- 聚焦放大 ---------------- */

const focus = ref<ProjectItem | null>(null);
const focusImg = ref<HTMLImageElement | null>(null);
const focusPanel = ref<HTMLElement | null>(null);

function openFocus(project: ProjectItem, e: MouseEvent) {
  if (reduceMotion.value) {
    navigateTo(project.path);
    return;
  }
  const tileEl = e.currentTarget as HTMLElement;
  const img = tileEl.querySelector("img");
  const state = img ? Flip.getState(img) : null;
  focus.value = project;
  document.documentElement.style.overflow = "hidden";
  nextTick(() => {
    if (state && focusImg.value) {
      Flip.from(state, {
        targets: focusImg.value,
        duration: 0.65,
        ease: "power3.inOut",
      });
    }
    if (focusPanel.value) {
      gsap.fromTo(
        focusPanel.value,
        { autoAlpha: 0, x: 40 },
        { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", delay: 0.15 },
      );
    }
  });
}

function closeFocus() {
  focus.value = null;
  document.documentElement.style.overflow = "";
}

function onFocusKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeFocus();
}

onMounted(() => {
  window.addEventListener("keydown", onFocusKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", onFocusKeydown);
  document.documentElement.style.overflow = "";
});

const focusMeta = computed(() =>
  focus.value ? PROJECT_CATEGORIES[focus.value.category] : null,
);
</script>

<template>
  <div class="relative min-h-screen pt-24">
    <!-- 四周滚动流速文字框 -->
    <EdgeRails />

    <!-- 头部 -->
    <div class="relative z-10 mx-auto max-w-7xl px-5 md:px-10">
      <SectionHeading
        index="01"
        kicker="Portfolio"
        title="作品集"
        description="点开任意一张图 —— 放大聚焦，查看详情。"
      />

      <!-- 分类筛选 -->
      <Reveal variant="fade" :delay="0.2" class="mt-10">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            data-cursor="hover"
            class="cut-corner-sm cut-outline sweep group inline-flex items-center gap-2 px-5 py-2.5 font-mono text-sm leading-none tracking-widest transition-all duration-300"
            :class="
              active === tab.key
                ? 'cut-line-accent bg-accent text-bg'
                : 'text-muted hover:text-text hover:[--cut-line:var(--accent)]'
            "
            @click="applyFilter(tab.key)"
          >
            <span class="text-[10px] opacity-70">/</span>
            {{ tab.label }}
            <span class="text-[11px]" :class="active === tab.key ? 'text-bg/70' : 'text-faint'">{{ tab.count }}</span>
          </button>
        </div>
      </Reveal>
    </div>

    <!-- 全幅画廊 -->
    <div ref="gridEl" class="relative z-10 mt-10 grid grid-cols-2 gap-2 px-2 pb-16 md:grid-cols-12 md:gap-4 md:px-4">
      <button
        v-for="(project, i) in filtered"
        :key="project.path"
        type="button"
        data-proj
        data-cursor="hover"
        class="group relative col-span-1 overflow-hidden border border-line-soft bg-surface"
        :class="[tileClasses(i).span, tileClasses(i).aspect]"
        @click="openFocus(project, $event)"
      >
        <img
          v-if="project.cover"
          :src="project.cover"
          :alt="project.title"
          loading="lazy"
          class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div v-else class="hatch absolute inset-0 grid place-items-center">
          <span class="font-display text-6xl font-extrabold text-stroke">{{ project.title.slice(0, 1) }}</span>
        </div>

        <!-- 悬停信息层 -->
        <span class="absolute inset-0 bg-linear-to-t from-bg/90 via-bg/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-95" />
        <span class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-left">
          <span>
            <span class="block font-mono text-[9px] tracking-[0.3em] text-accent">
              {{ PROJECT_CATEGORIES[project.category].en }} · {{ String(i + 1).padStart(2, "0") }}
            </span>
            <span class="mt-1 block font-title text-lg leading-tight tracking-wide text-text md:text-2xl">
              {{ project.title }}
            </span>
          </span>
          <span
            class="cut-corner-sm cut-outline cut-line-accent grid size-9 shrink-0 place-items-center bg-bg/70 text-accent opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
            <UIcon name="lucide:arrow-up-right" class="size-4" />
          </span>
        </span>
      </button>
    </div>

    <Reveal v-if="!filtered.length" variant="fade" class="relative z-10 py-20 text-center">
      <p class="text-sm text-muted">这个分类还没有作品。</p>
    </Reveal>

    <!-- 聚焦放大层 -->
    <Teleport to="body">
      <Transition name="focus">
        <div v-if="focus" class="fixed inset-0 z-125 flex flex-col bg-bg/95 backdrop-blur-md lg:flex-row">
          <!-- 图片区 -->
          <div class="relative flex min-h-0 flex-1 items-center justify-center p-6 md:p-10">
            <button
              type="button"
              class="cut-corner-sm cut-outline absolute right-4 top-4 z-20 grid size-11 place-items-center bg-bg/80 text-text backdrop-blur transition-colors hover:text-accent hover:[--cut-line:var(--accent)]"
              aria-label="关闭"
              @click="closeFocus"
            >
              <UIcon name="lucide:x" class="size-5" />
            </button>
            <div class="cut-corner-lg shadow-hard relative w-full max-w-4xl overflow-hidden border border-line bg-elevated">
              <img ref="focusImg" :src="focus.cover" :alt="focus.title" class="w-full object-contain" />
              <span class="absolute left-0 top-0 border-b border-r border-line bg-bg/85 px-3 py-1.5 font-mono text-[10px] leading-none tracking-[0.3em] text-accent backdrop-blur">
                FRAME/{{ focus.title.slice(0, 1) }}
              </span>
            </div>
          </div>

          <!-- 详情面板 -->
          <aside
            ref="focusPanel"
            class="relative flex w-full shrink-0 flex-col gap-5 overflow-y-auto border-t border-line bg-surface p-8 lg:w-105 lg:border-l lg:border-t-0"
          >
            <div class="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-faint">
              <span class="size-1.5 animate-pulse bg-accent" />
              NOW VIEWING
            </div>

            <div v-if="focusMeta" class="cut-corner-sm cut-outline inline-flex w-fit items-center gap-1.5 px-3 py-1 font-mono text-[11px] leading-none tracking-widest text-accent">
              <UIcon :name="focusMeta.icon" class="size-3.5" />
              {{ focusMeta.label }}
            </div>

            <h2 class="font-title text-4xl tracking-wide text-text">{{ focus.title }}</h2>

            <p class="font-mono text-xs leading-none text-faint">
              {{ formatDate(focus.date) }}
              <template v-if="focus.role"> · {{ focus.role }}</template>
            </p>

            <p class="text-base leading-relaxed text-muted">{{ focus.description }}</p>

            <div v-if="focus.tags?.length" class="flex flex-wrap gap-2">
              <span v-for="tag in focus.tags" :key="tag" class="tag-chip">{{ tag }}</span>
            </div>

            <div class="mt-auto flex flex-wrap gap-3 pt-6">
              <NuxtLink :to="focus.path" data-cursor="hover"
                class="cut-corner-sm sweep inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-sm leading-none tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]">
                查看完整项目
                <UIcon name="lucide:arrow-right" class="size-4" />
              </NuxtLink>
              <button type="button" data-cursor="hover"
                class="cut-corner-sm cut-outline inline-flex items-center gap-2 px-6 py-3 font-mono text-sm leading-none tracking-widest text-text transition-colors hover:text-accent hover:[--cut-line:var(--accent)]"
                @click="closeFocus">
                返回画廊
              </button>
            </div>

            <p class="pt-2 font-mono text-[10px] leading-none tracking-[0.35em] text-faint">
              MIXSU STUDIO · SELECTED WORK
            </p>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* 聚焦层：斜向展开 */
.focus-enter-active {
  transition:
    clip-path 0.5s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.35s ease;
}
.focus-leave-active {
  transition:
    clip-path 0.35s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.25s ease;
}
.focus-enter-from {
  clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  opacity: 0.6;
}
.focus-leave-to {
  clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  opacity: 0;
}
.focus-enter-to,
.focus-leave-from {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
</style>
