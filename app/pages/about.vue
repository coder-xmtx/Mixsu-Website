<script setup lang="ts">
useSeoMeta({
  description: "关于 Mixsu：一个爱剪片子、玩 Blender、写代码的人。",
});

const skills = [
  {
    title: "剪辑",
    en: "EDITING",
    icon: "lucide:clapperboard",
    years: "2 年",
    items: ["Premiere Pro", "DaVinci Resolve", "混剪 / 卡点", "调色"],
  },
  {
    title: "3D / Blender",
    en: "3D CRAFT",
    icon: "lucide:box",
    years: "1 个月",
    items: ["建模", "灯光 / 渲染", "Cycles"],
  },
  {
    title: "开发",
    en: "DEVELOP",
    icon: "lucide:terminal",
    years: "1 年",
    items: ["Vue / Nuxt", "TypeScript", "GSAP 动效", "Tailwind CSS", "Node.js"],
  },
];

const timeline = [
  { year: "2024", text: "高考结束，踏入大学" },
  { year: "2025", text: "不断摸索，累积经验，探索前沿技术栈" },
  { year: "2026", text: "借助 DSH，Mixsu Studio 上线" },
];
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 pt-32 md:px-10 md:pt-40">
    <!-- 头部 -->
    <div class="grid items-center gap-14 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <SectionHeading index="03" kicker="About" title="关于我"
          description="一个同时热爱三件事的人：剪辑、3D 和写代码。它们在我这里不是三个技能，而是一种东西——把想法做成作品的能力。" />
        <Reveal variant="up" :delay="0.25" class="mt-8">
          <div class="space-y-5 text-base leading-relaxed text-muted md:text-lg">
            <p>
              我是 Mixsu，也可叫我小明同学，是一名独立创作者，喜欢创作、实践，目前正在累积自己的技术栈。
              我相信好的作品来自持续的小练习，而不是偶尔的大爆发。
            </p>
            <p>
              这个网站是我的数字工作室：作品放在最显眼的地方，文章记录想法和踩过的坑。
              如果你在找一个「能把想法做完」的人，也许我们聊得来。
            </p>
          </div>
        </Reveal>
        <Reveal variant="up" :delay="0.35" class="mt-8 flex items-center gap-6">
          <a href="mailto:mail_xmtx@163.com" data-cursor="hover"
            class="cut-corner-sm sweep group inline-flex items-center gap-2.5 bg-accent px-7 py-3.5 font-mono text-sm tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]">
            联系我
            <UIcon name="lucide:send"
              class="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </Reveal>
      </div>

      <!-- 头像 -->
      <div class="relative lg:col-span-5">
        <div class="relative mx-auto max-w-xs">
          <div class="hatch-accent absolute inset-0 -translate-x-4 translate-y-4 border border-accent/40"
            aria-hidden="true" />
          <div class="cut-corner-lg shadow-hard relative aspect-square border border-line bg-surface">
            <img src="/portrait.png" alt="Mixsu 的头像" class="size-full object-cover" />
            <span
              class="absolute left-0 top-0 border-b border-r border-line bg-bg/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-accent backdrop-blur">
              SELF/03
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能 -->
    <section class="mt-32">
      <SectionHeading index="01" kicker="Skills" title="我会的" description="好好学习，天天向上" />

      <div class="mt-14 grid gap-8 md:grid-cols-3">
        <Reveal v-for="(skill, i) in skills" :key="skill.title" variant="wipe" :delay="i * 0.12" :duration="0.8"
          class="h-full">
          <div
            class="cut-corner cut-outline shadow-hard flex h-full flex-col bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:[--cut-line:var(--accent)]">
            <div class="flex items-baseline justify-between">
              <span class="inline-flex items-baseline gap-2.5 font-title text-xl tracking-wide text-text">
                <UIcon :name="skill.icon" class="size-5 text-accent" />
                {{ skill.title }}
              </span>
              <span class="font-mono text-xs text-accent">{{ skill.years }}</span>
            </div>
            <p class="text-deco mt-1 text-xs italic tracking-[0.25em] text-faint">{{ skill.en }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span v-for="item in skill.items" :key="item"
                class="cut-corner-sm cut-outline cut-line-soft px-3 py-1 text-xs text-muted">
                {{ item }}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- 时间线 -->
    <section class="mt-32">
      <SectionHeading index="02" kicker="Timeline" title="走过的路" description="每一个转折点，都始于一次「试试看」。" />

      <div class="relative mt-14 max-w-2xl">
        <span class="absolute bottom-2 left-2 top-2 w-px bg-line" aria-hidden="true" />
        <div class="space-y-10">
          <Reveal v-for="(item, i) in timeline" :key="item.year" variant="left" :delay="i * 0.06" :y-offset="24">
            <div class="group relative flex items-start gap-6 pl-10">
              <span
                class="absolute left-0 top-2 size-4 rotate-45 border-2 border-accent bg-bg transition-transform duration-300 group-hover:scale-125"
                aria-hidden="true" />
              <span class="absolute left-2 top-5 h-px w-6 -skew-x-12 bg-line" aria-hidden="true" />
              <div>
                <p class="font-mono text-sm tracking-[0.2em] text-accent">/ {{ item.year }}</p>
                <p class="mt-1.5 text-sm leading-relaxed text-muted md:text-base">{{ item.text }}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative mt-32 overflow-hidden border border-line bg-surface px-8 py-16 text-center md:py-24">
      <div class="hatch-accent pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <span class="pointer-events-none absolute left-4 top-4 font-mono text-lg text-faint/60" aria-hidden="true">+</span>
      <span class="pointer-events-none absolute right-4 bottom-4 rotate-45 font-mono text-sm text-accent/60" aria-hidden="true">◆</span>
      <div class="relative">
        <Reveal variant="up">
          <h2 class="font-title text-3xl tracking-wide text-text md:text-5xl">
            一起做点有意思的事？
          </h2>
        </Reveal>
        <Reveal variant="up" :delay="0.15" class="mt-6">
          <p class="mx-auto max-w-md text-base leading-relaxed text-muted">
            无论是合作项目，还是单纯想聊聊剪辑和 3D，都欢迎来信。
          </p>
        </Reveal>
        <Reveal variant="up" :delay="0.25" class="mt-10">
          <a href="mailto:mail_xmtx@163.com" data-cursor="hover"
            class="cut-corner-sm sweep group inline-flex items-center gap-2.5 bg-accent px-8 py-4 font-mono text-xs tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)] md:text-sm">
            mail_xmtx@163.com
            <UIcon name="lucide:arrow-up-right"
              class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  </div>
</template>
