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
    .select("title", "description", "date", "category", "tags", "path")
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
      .from("[data-hero-portrait]", {
        autoAlpha: 0,
        clipPath: "inset(0 0 100% 0)",
        rotate: -8,
        duration: 1.1,
        ease: "power4.inOut",
      }, 0.35)
      .from("[data-hero-desc]", { autoAlpha: 0, y: 20, duration: 0.7 }, 1.0)
      .from("[data-hero-cta]", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08, clearProps: "all" }, 1.1)
      .from("[data-hero-meta]", { autoAlpha: 0, y: 14, duration: 0.6 }, 1.2)
      .from("[data-hero-sweep]", { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power3.inOut" }, 0.7)
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
      <div class="pointer-events-none absolute -top-40 right-[-10%] size-136 rounded-full opacity-60 blur-[120px]"
        :style="{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }" aria-hidden="true" />

      <div class="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <!-- 左：文字 -->
        <div class="relative lg:col-span-7">
          <p data-hero-kicker class="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-muted">
            <span class="size-2 animate-pulse rounded-full bg-accent" />
            HELLO, I'M MIXSU
            <span class="hidden h-px w-14 bg-line sm:block" />
          </p>

          <SplitHeading text="MIXSU" as="h1"
            class="font-display text-[clamp(3.8rem,12vw,8.5rem)] font-extrabold leading-[0.92] tracking-tight title-flow" />

          <!-- 第二行：描边 STUDIO + 橙色扫线 -->
          <div class="mt-2 flex items-center gap-5 md:mt-3 md:gap-7">
            <span data-hero-sweep class="block h-1.5 w-10 bg-accent md:w-14" aria-hidden="true" />
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
              class="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 font-mono text-sm tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]">
              查看作品
              <UIcon name="lucide:arrow-right" class="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </NuxtLink>
            <NuxtLink data-hero-cta to="/blog" data-cursor="hover"
              class="group inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-3.5 font-mono text-sm tracking-widest text-text transition-colors duration-300 hover:border-accent/60 hover:text-accent">
              阅读博客
              <UIcon name="lucide:arrow-right"
                class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </NuxtLink>
          </div>

          <div data-hero-meta class="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-faint">
            <span>✂ 剪辑 2 年</span>
            <span>◈ Blender 1 个月</span>
            <span>&lt;/&gt; 前端 1 年</span>
          </div>
        </div>

        <!-- 右：头像 -->
        <div class="relative lg:col-span-5">
          <div class="relative mx-auto max-w-sm">
            <!-- 错位底框 -->
            <div class="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-accent/50"
              aria-hidden="true" />
            <div data-hero-portrait
              class="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
              <img src="/portrait.png" alt="Mixsu 的头像" class="size-full object-cover" />
              <!-- 底部渐变 -->
              <div class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-bg/70 to-transparent"
                aria-hidden="true" />
            </div>

            <!-- 漂浮标签 -->
            <span
              class="absolute -right-3 top-8 z-10 rotate-6 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-md backdrop-blur md:-right-6">
              INFJ✨
            </span>
            <span
              class="absolute -left-2 bottom-16 z-10 -rotate-3 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-md backdrop-blur md:-left-5">
              \(￣︶￣*\))
            </span>
          </div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div data-hero-hint class="absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:block">
        <div class="flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-faint">
          <span>SCROLL</span>
          <span class="block h-10 w-px overflow-hidden bg-line">
            <span class="block h-1/2 w-full animate-[scrolldot_1.6s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>
      </div>
    </section>

    <!-- ============ 跑马灯 ============ -->
    <Marquee :items="marqueeItems" :speed="50" class="border-y border-line-soft py-5 text-muted" />

    <!-- ============ Manifesto（滚动叙事） ============ -->
    <section ref="manifestoRef" class="mx-auto max-w-5xl px-5 py-32 md:px-10 md:py-44">
      <p class="mb-10 font-mono text-xs tracking-[0.3em] text-accent">/ MANIFESTO</p>
      <div class="space-y-6 font-display text-3xl font-bold leading-snug tracking-tight text-text md:text-5xl">
        <p data-manifesto-line>好的作品不是炫技，</p>
        <p data-manifesto-line>而是让人愿意停下来。</p>
        <p data-manifesto-line>节奏感，来自克制。</p>
        <p data-manifesto-line class="text-accent">设计与审美，依然需要鲜活注入。</p>
      </div>
      <p class="mt-12 font-mono text-sm tracking-[0.25em] text-faint">—— 我的创作信条</p>
    </section>

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
          :date="post.date" :category="post.category" :tags="post.tags" :to="post.path" :index="i" />
      </div>
    </section>

    <!-- ============ 联系 CTA ============ -->
    <section class="mx-auto max-w-7xl px-5 py-28 md:px-10">
      <Reveal variant="clip">
        <h2 class="font-display text-4xl font-extrabold leading-tight tracking-tight text-text md:text-6xl">
          有想一起做的事？
        </h2>
      </Reveal>
      <Reveal variant="up" :delay="0.15" class="mt-8">
        <div class="flex flex-wrap items-center gap-8">
          <a href="mailto:mail_xmtx@163.com" data-cursor="hover"
            class="group inline-flex items-center gap-3 rounded-full border border-accent/60 px-8 py-4 font-mono text-sm tracking-widest text-accent transition-all duration-300 hover:bg-accent hover:text-bg hover:shadow-[0_0_40px_var(--accent-glow)]">
            给我写信
            <UIcon name="lucide:send"
              class="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </Reveal>
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
