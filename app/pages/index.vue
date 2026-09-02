<script setup lang="ts">
import { gsap } from "gsap";


useSeoMeta({
  // 标签页标题保持全局一致（nuxt.config 已固定），这里只维护 description
  description: "Mixsu 的个人数字工作室：剪辑作品、Blender 创作与技术文章。",
});

/* ---------------- 内容查询 ---------------- */

const { data: featuredProjects } = await useAsyncData("home-featured-projects", () =>
  queryCollection("projects")
    .where("featured", "=", true)
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "cover", "featured", "path")
    .all(),
);

const { data: latestPosts } = await useAsyncData("home-latest-posts", () =>
  queryCollection("blog")
    .order("date", "DESC")
    .limit(3)
    .select("title", "description", "date", "category", "tags", "cover", "path")
    .all(),
);

/* ---------------- Hero 入场动画 ---------------- */

const heroRef = ref<HTMLElement | null>(null);
const reduceMotion = usePrefersReducedMotion();

onMounted(() => {
  const root = heroRef.value;
  if (!root || reduceMotion.value) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from("[data-hero-kicker]", { autoAlpha: 0, y: 24, duration: 0.7 }, 0.15)
      .fromTo(
        "[data-hero-portrait]",
        { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", x: 30 },
        { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", x: 0, duration: 1.1, ease: "power4.inOut", clearProps: "clipPath" },
        0.35,
      )
      .from("[data-hero-desc]", { autoAlpha: 0, y: 20, duration: 0.7 }, 1.0)
      .from("[data-hero-cta]", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08, clearProps: "all" }, 1.1)
      .from("[data-hero-meta]", { autoAlpha: 0, y: 14, duration: 0.6 }, 1.2)
      .from("[data-hero-sweep]", { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power3.inOut" }, 0.7)
      .from("[data-hero-deco]", { autoAlpha: 0, scale: 0.6, duration: 0.7, stagger: 0.08, ease: "back.out(2)" }, 0.9)
      .from("[data-hero-hint]", { autoAlpha: 0, duration: 0.8 }, 1.5);

    // 头像轻微视差
    gsap.to("[data-hero-portrait]", {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });

  }, root);

  onUnmounted(() => ctx.revert());
});

/* ---------------- Manifesto 滚动叙事 ---------------- */

const manifestoRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const root = manifestoRef.value;
  if (!root || reduceMotion.value) return;

  const ctx = gsap.context(() => {
    const lines = root.querySelectorAll<HTMLElement>("[data-manifesto-line]");
    gsap.fromTo(
      lines,
      { autoAlpha: 0.12, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 1,
        },
      },
    );
  }, root);

  onUnmounted(() => ctx.revert());
});

/* ---------------- 数据 ---------------- */

const marqueeItems = [
  "剪辑 Editing",
  "Blender 3D",
  "前端 Frontend",
  "动画 Motion",
  "写作 Writing",
  "设计 Design",
];
</script>

<template>
  <div>
    <!-- ============ HERO ============ -->
    <section ref="heroRef" class="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-16">
      <!-- 右上角橙色氛围光 -->
      <div class="pointer-events-none absolute -top-40 right-[-10%] size-136 opacity-60 blur-[120px]"
        :style="{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }" aria-hidden="true" />
      <!-- 左下斜向排线块 -->
      <div class="hatch-accent pointer-events-none absolute bottom-24 left-[-4%] size-64 -skew-x-12 opacity-50"
        aria-hidden="true" />
      <!-- 角落 + 装饰 -->
      <span data-hero-deco class="pointer-events-none absolute left-5 top-24 font-mono text-lg text-faint/70 md:left-10">+</span>
      <span data-hero-deco class="pointer-events-none absolute right-5 top-28 rotate-45 font-mono text-sm text-accent/70 md:right-10">◆</span>
      <span data-hero-deco class="pointer-events-none absolute bottom-28 left-1/2 hidden font-mono text-sm text-faint/70 md:block">+</span>

      <div class="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <!-- 左：文字 -->
        <div class="relative lg:col-span-7">
          <p data-hero-kicker class="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-muted">
            <span class="size-2 animate-pulse bg-accent" />
            HELLO, I'M MIXSU
            <span class="hidden h-px w-14 -skew-x-12 bg-line sm:block" />
            <span class="hidden font-mono text-[10px] tracking-[0.25em] text-faint lg:inline">// CN · WUHAN</span>
          </p>

          <SplitHeading text="MIXSU" as="h1"
            class="font-display text-[clamp(3.8rem,12vw,8.5rem)] font-extrabold leading-[0.92] tracking-tight title-flow" />

          <!-- 第二行：描边 STUDIO + 橙色扫线 -->
          <div class="mt-2 flex items-center gap-5 md:mt-3 md:gap-7">
            <span data-hero-sweep class="block h-2 w-10 -skew-x-12 bg-accent md:w-16" aria-hidden="true" />
            <SplitHeading text="STUDIO" as="p" :delay="0.3"
              class="font-display text-[clamp(2.4rem,7.5vw,5.4rem)] font-bold leading-none tracking-[0.08em] text-stroke" />
          </div>

          <div class="mt-7">
            <p data-hero-desc class="max-w-lg text-base leading-relaxed text-muted md:text-lg">
              一个爱剪片子、玩 Blender、写代码的人。
              这里是我的数字工作室 —— 有作品、有文章、有一点不切实际的浪漫。
            </p>
          </div>

          <div class="mt-9 flex flex-wrap items-center gap-4">
            <NuxtLink data-hero-cta to="/projects" data-cursor="hover"
              class="cut-corner-sm sweep group inline-flex items-center gap-2.5 bg-accent px-7 py-3.5 font-mono text-sm tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]">
              查看作品
              <UIcon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </NuxtLink>
            <NuxtLink data-hero-cta to="/blog" data-cursor="hover"
              class="cut-corner-sm sweep group inline-flex items-center gap-2.5 border border-line px-7 py-3.5 font-mono text-sm tracking-widest text-text transition-colors duration-300 hover:border-accent/60 hover:text-accent">
              阅读博客
              <UIcon name="lucide:arrow-right"
                class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </NuxtLink>
          </div>

          <div data-hero-meta class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-faint">
            <span>✂ 剪辑 2 年</span>
            <UIcon name="lucide:slash" class="size-3 text-line" />
            <span>◈ Blender 1 个月</span>
            <UIcon name="lucide:slash" class="size-3 text-line" />
            <span>&lt;/&gt; 前端 1 年</span>
          </div>
        </div>

        <!-- 右：头像 -->
        <div class="relative lg:col-span-5">
          <div class="relative mx-auto max-w-sm">
            <!-- 错位排线底框（锐利） -->
            <div class="hatch-accent absolute inset-0 translate-x-4 translate-y-4 border border-accent/40"
              aria-hidden="true" />
            <!-- 外层负责入场动画（避免 GSAP clipPath 与 .cut-corner-lg 冲突） -->
            <div data-hero-portrait class="relative">
              <div class="cut-corner-lg shadow-hard relative aspect-square border border-line bg-surface">
                <img src="/portrait.png" alt="Mixsu 的头像" class="size-full object-cover" />
                <!-- 底部渐变 -->
                <div class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-bg/70 to-transparent"
                  aria-hidden="true" />
                <!-- 顶部斜切角标 -->
                <span
                  class="absolute left-0 top-0 border-b border-r border-line bg-bg/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-accent backdrop-blur">
                  PORTRAIT/01
                </span>
              </div>
            </div>

            <!-- 漂浮标签（方形斜切） -->
            <span
              class="cut-corner-sm absolute -right-3 top-8 z-10 rotate-6 border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-md backdrop-blur md:-right-6">
              INFJ ✦
            </span>
            <span
              class="cut-corner-sm absolute -left-2 bottom-16 z-10 -rotate-3 border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-md backdrop-blur md:-left-5">
              \(￣︶￣*\))
            </span>
          </div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div data-hero-hint class="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block">
        <div class="flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-faint">
          <span>SCROLL</span>
          <span class="block h-10 w-px overflow-hidden bg-line">
            <span class="block h-1/2 w-full animate-[scrolldot_1.6s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>
      </div>
    </section>

    <!-- ============ 跑马灯（斜切胶片条） ============ -->
    <div class="relative">
      <Marquee :items="marqueeItems" :speed="50" :skew="true"
        class="border-y border-line-soft bg-surface/60 py-5 text-muted backdrop-blur" />
    </div>

    <!-- ============ Manifesto（滚动叙事） ============ -->
    <section ref="manifestoRef" class="mx-auto max-w-5xl px-5 py-32 md:px-10 md:py-44">
      <p class="text-deco mb-10 flex items-center gap-3 text-sm italic tracking-[0.25em] text-accent">
        <span class="h-px w-10 -skew-x-12 bg-accent" />
        / MANIFESTO
      </p>
      <div class="space-y-6 font-title text-3xl tracking-wide leading-snug text-text md:text-5xl">
        <p data-manifesto-line>好的作品不是炫技，</p>
        <p data-manifesto-line>而是让人愿意停下来。</p>
        <p data-manifesto-line>节奏感，来自克制。</p>
        <p data-manifesto-line class="text-accent">设计与审美，依然需要鲜活注入。</p>
      </div>
      <p class="mt-12 flex items-center gap-3 font-mono text-sm tracking-[0.25em] text-faint">
        <span class="h-2 w-8 -skew-x-12 bg-accent/60" />
        —— 我的创作信条
      </p>
    </section>

    <!-- ============ 斜切分隔 ============ -->
    <div class="mx-auto max-w-7xl px-5 md:px-10" aria-hidden="true">
      <div class="flex items-center gap-4">
        <span class="h-1.5 w-20 -skew-x-12 bg-accent" />
        <span class="font-mono text-[10px] tracking-[0.4em] text-faint">SELECTED/01</span>
        <span class="h-px flex-1 -skew-x-12 bg-line" />
      </div>
    </div>

    <!-- ============ 精选作品 ============ -->
    <section class="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading index="01" kicker="Selected Works" title="精选作品" description="从赛博城市到混剪短片，挑几件最近最满意的放前面。" />
        <Reveal variant="fade" :delay="0.2">
          <ArrowLink to="/projects" label="查看全部作品" />
        </Reveal>
      </div>

      <div class="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
        <div v-for="(project, i) in featuredProjects" :key="project.path" :class="['h-full', i > 0 ? 'md:mt-24' : '']">
          <ProjectCard :title="project.title" :description="project.description" :date="project.date"
            :category="project.category" :tags="project.tags" :cover="project.cover" :to="project.path"
            :featured="project.featured" :index="i" />
        </div>
      </div>
    </section>

    <!-- ============ 最新文章 ============ -->
    <section class="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading index="02" kicker="Latest Notes" title="最近在写" description="技术笔记与生活随笔，更新频率取决于我有多勤快。" />
        <Reveal variant="fade" :delay="0.2">
          <ArrowLink to="/blog" label="进入博客" />
        </Reveal>
      </div>

      <div class="mt-10">
        <PostCard v-for="(post, i) in latestPosts" :key="post.path" :title="post.title" :description="post.description"
          :date="post.date" :category="post.category" :tags="post.tags" :cover="post.cover" :to="post.path" :index="i" />
      </div>
    </section>
  </div>
</template>

<style>
@keyframes scrolldot {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(200%);
  }
}
</style>
