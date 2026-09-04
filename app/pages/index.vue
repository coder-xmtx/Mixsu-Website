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

let heroCtx: gsap.Context | null = null;

function playHero() {
  const root = heroRef.value;
  if (!root || reduceMotion.value) return;

  heroCtx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from("[data-hero-kicker]", { autoAlpha: 0, y: 24, duration: 0.7 }, 0.1)
      .fromTo(
        "[data-hero-portrait]",
        { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", x: 30 },
        { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", x: 0, duration: 1.1, ease: "power4.inOut", clearProps: "clipPath" },
        0.3,
      )
      .from("[data-hero-reticle]", { autoAlpha: 0, scale: 0.85, duration: 1, ease: "power3.out" }, 0.5)
      .from("[data-hero-desc]", { autoAlpha: 0, y: 20, duration: 0.7 }, 0.9)
      .from("[data-hero-cta]", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08, clearProps: "all" }, 1.0)
      .from("[data-hero-meta]", { autoAlpha: 0, y: 14, duration: 0.6 }, 1.1)
      .from("[data-hero-sweep]", { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power3.inOut" }, 0.6)
      .from("[data-hero-deco]", { autoAlpha: 0, scale: 0.6, duration: 0.7, stagger: 0.08, ease: "back.out(2)" }, 0.8)
      .from("[data-hero-tc]", { autoAlpha: 0, x: 12, duration: 0.6 }, 1.2)
      .from("[data-hero-hint]", { autoAlpha: 0, duration: 0.8 }, 1.4);

    // 头像轻微视差
    gsap.to("[data-hero-portrait]", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });
  }, root);
}

/**
 * Hero 入场与 BootLoader 揭幕协同：等 boot:done（字体就绪、开场动画播放）
 * 再开始，否则入场动画全被遮罩盖住。SPA 内部导航时 boot 早已完成，直接播放。
 */
onMounted(() => {
  const w = window as unknown as { __bootDone?: boolean };
  if (w.__bootDone) {
    playHero();
    return;
  }

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    playHero();
  };
  window.addEventListener("boot:done", start, { once: true });
  // 兜底：3.5s 后无论如何都开始（例如 BootLoader 被移除/异常）
  const fallback = setTimeout(start, 3500);

  onUnmounted(() => {
    clearTimeout(fallback);
    window.removeEventListener("boot:done", start);
    heroCtx?.revert();
  });
});

/* ---------------- Manifesto 滚动叙事 + SVG 描线 ---------------- */

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

    // SVG 竖线随滚动画出
    const path = root.querySelector<SVGPathElement>("[data-manifesto-path]");
    if (path) {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "bottom 45%",
          scrub: 1,
        },
      });
    }
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

const marqueeItemsAlt = ["CUT", "RENDER", "SHIP", "PLAY", "LOOP", "REPEAT"];
</script>

<template>
  <div>
    <!-- ============ HERO：标题压头像的叠层构图 ============ -->
    <section ref="heroRef" class="relative min-h-screen overflow-hidden pt-24 pb-10">
      <!-- 右上角橙色氛围光 -->
      <div class="pointer-events-none absolute -top-40 right-[-10%] size-136 opacity-60 blur-[120px]"
        :style="{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }" aria-hidden="true" />
      <!-- 左下斜向排线块 -->
      <div class="hatch-accent pointer-events-none absolute bottom-24 left-[-4%] size-64 -skew-x-12 opacity-50"
        aria-hidden="true" />
      <!-- 角落 + 装饰 -->
      <span data-hero-deco
        class="pointer-events-none absolute left-5 top-24 z-30 font-mono text-lg text-faint/70 md:left-10">+</span>
      <span data-hero-deco
        class="pointer-events-none absolute right-5 top-28 z-30 rotate-45 font-mono text-sm text-accent/70 md:right-10">◆</span>

      <div class="mx-auto max-w-[1560px] px-5 md:px-10">
        <div class="relative grid items-center gap-10 lg:h-[calc(100vh-9rem)] lg:grid-cols-12">
          <!-- 幽灵编号（压在大标题后面） -->
          <span
            class="pointer-events-none absolute -top-16 left-[-1%] z-0 hidden select-none font-display text-[19rem] font-extrabold leading-none text-stroke opacity-25 lg:block"
            aria-hidden="true">
            01
          </span>

          <!-- 左：文字区（z-20，压在头像上） -->
          <div class="relative z-20 lg:col-span-9">
            <p data-hero-kicker
              class="mb-6 flex items-center gap-3 font-mono text-xs leading-none tracking-[0.3em] text-muted">
              <span class="size-2 shrink-0 animate-pulse bg-accent" />
              HELLO, I'M MIXSU
              <span class="hidden h-px w-14 -skew-x-12 bg-line sm:block" />
              <span class="hidden font-mono text-[10px] tracking-[0.25em] text-faint lg:inline">// CN · GUANGZHOU</span>
            </p>

            <SplitHeading text="MIXSU" as="h1"
              class="font-display text-[clamp(3.6rem,11.5vw,9rem)] font-extrabold leading-[0.92] tracking-tight title-flow" />

            <!-- 第二行：描边 STUDIO + 橙色扫线 -->
            <div class="mt-2 flex items-center gap-5 md:mt-3 md:gap-7">
              <span data-hero-sweep class="block h-2 w-10 -skew-x-12 bg-accent md:w-16" aria-hidden="true" />
              <SplitHeading text="STUDIO" as="p" :delay="0.25"
                class="font-display text-[clamp(2.2rem,7vw,5rem)] font-bold leading-none tracking-[0.08em] text-stroke" />
            </div>

            <div class="mt-7">
              <p data-hero-desc class="max-w-lg text-base leading-relaxed text-muted md:text-lg">
                一个爱剪片子、玩 Blender、写代码的人。
                这里是我的数字工作室 —— 有作品、有文章、有一点不切实际的浪漫。
              </p>
            </div>

            <div class="mt-9 flex flex-wrap items-center gap-4">
              <NuxtLink data-hero-cta to="/projects" data-cursor="hover"
                class="cut-corner-sm sweep group inline-flex items-center gap-2.5 bg-accent px-7 py-3.5 font-display text-sm leading-none tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]">
                查看作品
                <UIcon name="lucide:arrow-right"
                  class="size-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
              </NuxtLink>
              <NuxtLink data-hero-cta to="/blog" data-cursor="hover"
                class="cut-corner-sm cut-outline sweep group inline-flex items-center gap-2.5 px-7 py-3.5 font-display text-sm leading-none tracking-widest text-text transition-colors duration-300 hover:text-accent hover:[--cut-line:var(--accent)]">
                阅读博客
                <UIcon name="lucide:arrow-right"
                  class="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </NuxtLink>
            </div>

            <div data-hero-meta
              class="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs leading-none text-faint">
              <span>✂ 剪辑 2 年</span>
              <span class="text-accent/60">/</span>
              <span>◈ Blender 1 个月</span>
              <span class="text-accent/60">/</span>
              <span>&lt;/&gt; 前端 1 年</span>
            </div>
          </div>

          <!-- 右：倾斜头像面板（z-10，被标题压住左上角） -->
          <div
            class="relative z-10 mx-auto mt-6 w-full max-w-xs lg:col-span-3 lg:col-start-10 lg:-ml-28 lg:mt-0 lg:max-w-none">
            <div data-hero-portrait class="relative rotate-[1.6deg]">
              <!-- SVG 准星装饰 -->
              <svg data-hero-reticle class="pointer-events-none absolute -inset-10 z-0 text-accent/50"
                viewBox="0 0 200 200" fill="none" aria-hidden="true">
                <circle class="reticle-ring" cx="100" cy="100" r="97" stroke="currentColor" stroke-width="1" />
                <circle cx="100" cy="100" r="72" stroke="currentColor" stroke-width="0.5" opacity="0.55" />
                <g class="spin-slow">
                  <path d="M100 0 v18 M100 182 v18 M0 100 h18 M182 100 h18" stroke="currentColor" stroke-width="1.6" />
                </g>
                <g opacity="0.5">
                  <path
                    d="M30 30 h10 M30 30 v10 M170 30 h-10 M170 30 v10 M30 170 h10 M30 170 v-10 M170 170 h-10 M170 170 v-10"
                    stroke="currentColor" stroke-width="1" />
                </g>
              </svg>

              <!-- 错位排线底框（锐利） -->
              <div class="hatch-accent absolute inset-0 translate-x-4 translate-y-4 border border-accent/40"
                aria-hidden="true" />
              <div class="cut-corner-lg shadow-hard relative aspect-square border border-line bg-surface">
                <img src="/portrait.png" alt="Mixsu 的头像" class="size-full object-cover" />
                <!-- 底部渐变 -->
                <div class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-bg/70 to-transparent"
                  aria-hidden="true" />
                <!-- 顶部角标 -->
                <span
                  class="absolute left-0 top-0 border-b border-r border-line bg-bg/85 px-3 py-1.5 font-mono text-[10px] leading-none tracking-[0.3em] text-accent backdrop-blur">
                  PORTRAIT/01
                </span>
              </div>

              <!-- 漂浮标签（方形斜切） -->
              <span
                class="cut-corner-sm cut-outline absolute -right-3 top-8 z-10 rotate-6 bg-surface px-3.5 py-1.5 font-mono text-xs leading-none text-muted shadow-md backdrop-blur md:-right-6">
                INFJ ✦
              </span>
              <span
                class="cut-corner-sm cut-outline absolute -left-2 bottom-16 z-10 -rotate-3 bg-surface px-3.5 py-1.5 font-mono text-xs leading-none text-muted shadow-md backdrop-blur md:-left-5">
                \(￣︶￣*\))
              </span>
            </div>
          </div>

          <!-- 右上时码（桌面） -->
          <div data-hero-tc
            class="absolute right-8 top-4 z-30 hidden flex-col items-end gap-1.5 font-mono text-[10px] leading-none tracking-[0.25em] text-faint lg:flex">
            <span class="flex items-center gap-2 text-red-400/90">
              <span class="size-1.5 animate-pulse bg-red-400" />
              REC
            </span>
            <span>TC 00:00:12:06</span>
          </div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div data-hero-hint class="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block">
        <div class="flex flex-col items-center gap-2 font-mono text-[10px] leading-none tracking-[0.3em] text-faint">
          <span>SCROLL</span>
          <span class="block h-10 w-px overflow-hidden bg-line">
            <span class="block h-1/2 w-full animate-[scrolldot_1.6s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>
      </div>
    </section>

    <!-- ============ 双向斜切跑马灯 ============ -->
    <div
      class="relative my-8 -rotate-[2.2deg] scale-x-105 overflow-hidden border-y border-line bg-bg-soft/60 py-4 backdrop-blur">
      <Marquee :items="marqueeItems" :speed="46" class="text-muted" />
      <div class="pointer-events-none absolute inset-0 flex items-center">
        <Marquee :items="marqueeItemsAlt" :speed="30" :reverse="true" separator="//" class="text-stroke opacity-60" />
      </div>
    </div>

    <!-- ============ Manifesto（滚动叙事 + SVG 描线） ============ -->
    <section ref="manifestoRef" class="relative mx-auto max-w-5xl px-5 py-32 md:px-10 md:py-44">
      <!-- 滚动描线的 SVG 竖线 -->
      <svg class="pointer-events-none absolute left-2 top-24 h-[70%] w-10 text-accent/60 md:left-[-2rem]"
        viewBox="0 0 40 500" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path data-manifesto-path d="M 20 0 V 500" stroke="currentColor" stroke-width="1.5" />
      </svg>

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
          :date="post.date" :category="post.category" :tags="post.tags" :cover="post.cover" :to="post.path"
          :index="i" />
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

/* 准星外环：描线画出后保持 */
.reticle-ring {
  stroke-dasharray: 610;
  stroke-dashoffset: 610;
  animation: reticle-draw 1.6s cubic-bezier(0.65, 0, 0.35, 1) forwards 0.7s;
}

@keyframes reticle-draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
