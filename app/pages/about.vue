<script setup lang="ts">
useSeoMeta({
  title: "关于 — Mixsu Studio",
  description: "关于 Mixsu：一个爱剪片子、玩 Blender、写代码的人。",
});

const skills = [
  {
    title: "剪辑",
    icon: "lucide:clapperboard",
    years: "6 年",
    items: ["Premiere Pro", "DaVinci Resolve", "混剪 / 卡点", "调色", "声音设计"],
  },
  {
    title: "3D / Blender",
    icon: "lucide:box",
    years: "3 年",
    items: ["建模", "几何节点", "雕刻", "灯光 / 渲染", "Cycles"],
  },
  {
    title: "开发",
    icon: "lucide:terminal",
    years: "4 年",
    items: ["Vue / Nuxt", "TypeScript", "GSAP 动效", "Tailwind CSS", "Node.js"],
  },
];

const timeline = [
  { year: "2019", text: "开始自学剪辑，从给朋友剪婚礼视频起家" },
  { year: "2021", text: "入坑 Blender，被「一个球能变成任何东西」震撼" },
  { year: "2022", text: "开始写前端，发现代码和剪辑一样，都是节奏的艺术" },
  { year: "2024", text: "第一次把剪辑、3D 和代码结合：做了一支全 CG 预告片" },
  { year: "2026", text: "Mixsu Studio 上线，所有作品终于有了一个家" },
];
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 pt-32 md:px-10 md:pt-40">
    <!-- 头部 -->
    <div class="grid items-center gap-14 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <SectionHeading
          index="03"
          kicker="About"
          title="关于我"
          description="一个同时热爱三件事的人：剪辑、3D 和写代码。它们在我这里不是三个技能，而是一种东西——把想法做成作品的能力。"
        />
        <Reveal variant="up" :delay="0.25" class="mt-8">
          <div class="space-y-5 text-base leading-relaxed text-muted md:text-lg">
            <p>
              我是 Mixsu，一名独立创作者。白天写前端，晚上剪片子，周末把时间交给 Blender。
              我相信好的作品来自持续的小练习，而不是偶尔的大爆发。
            </p>
            <p>
              这个网站是我的数字工作室：作品放在最显眼的地方，文章记录想法和踩过的坑。
              如果你在找一个「能把想法做完」的人，也许我们聊得来。
            </p>
          </div>
        </Reveal>
        <Reveal variant="up" :delay="0.35" class="mt-8 flex items-center gap-6">
          <a
            href="mailto:hello@mixsu.studio"
            data-cursor="hover"
            class="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 font-mono text-sm tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_36px_var(--accent-glow)]"
          >
            联系我
            <UIcon name="lucide:send" class="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <HandNote text="不忙的时候回得很快" class="text-lg md:text-xl" />
        </Reveal>
      </div>

      <!-- 头像 -->
      <div class="relative lg:col-span-5">
        <div class="relative mx-auto max-w-xs">
          <div class="absolute inset-0 -translate-x-4 translate-y-4 rounded-2xl border border-accent/50" aria-hidden="true" />
          <div class="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
            <img src="/portrait.png" alt="Mixsu 的头像" class="size-full object-cover" />
          </div>
          <HandNote text="本人，如假包换 ✦" class="absolute -bottom-5 right-2 z-10 text-xl md:text-2xl" :rotate="4" />
        </div>
      </div>
    </div>

    <!-- 技能 -->
    <section class="mt-32">
      <SectionHeading index="01" kicker="Skills" title="我会的" description="三根支柱，一个底座：持续学习。" />

      <div class="mt-14 grid gap-6 md:grid-cols-3">
        <Reveal
          v-for="(skill, i) in skills"
          :key="skill.title"
          variant="up"
          :delay="i * 0.12"
          :y-offset="40"
          class="h-full"
        >
          <div class="flex h-full flex-col rounded-2xl border border-line bg-surface p-7 transition-colors duration-500 hover:border-accent/40">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-2.5 font-display text-xl font-bold text-text">
                <UIcon :name="skill.icon" class="size-5 text-accent" />
                {{ skill.title }}
              </span>
              <span class="font-mono text-xs text-accent">{{ skill.years }}</span>
            </div>
            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="item in skill.items"
                :key="item"
                class="rounded-full border border-line-soft px-3 py-1 text-xs text-muted"
              >
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
        <span class="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden="true" />
        <div class="space-y-10">
          <Reveal v-for="(item, i) in timeline" :key="item.year" variant="left" :delay="i * 0.06" :y-offset="24">
            <div class="relative flex items-start gap-6 pl-8">
              <span
                class="absolute left-0 top-2 size-[15px] rounded-full border-2 border-accent bg-bg"
                aria-hidden="true"
              />
              <div>
                <p class="font-mono text-sm tracking-[0.2em] text-accent">{{ item.year }}</p>
                <p class="mt-1.5 text-sm leading-relaxed text-muted md:text-base">{{ item.text }}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mt-32 rounded-3xl border border-line bg-surface px-8 py-16 text-center md:py-24">
      <Reveal variant="up">
        <h2 class="font-display text-3xl font-extrabold tracking-tight text-text md:text-5xl">
          一起做点有意思的事？
        </h2>
      </Reveal>
      <Reveal variant="up" :delay="0.15" class="mt-6">
        <p class="mx-auto max-w-md text-base leading-relaxed text-muted">
          无论是合作项目、约稿，还是单纯想聊聊剪辑和 3D，都欢迎来信。
        </p>
      </Reveal>
      <Reveal variant="up" :delay="0.25" class="mt-10">
        <a
          href="mailto:hello@mixsu.studio"
          data-cursor="hover"
          class="group inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 font-mono text-sm tracking-widest text-bg transition-all duration-300 hover:shadow-[0_0_40px_var(--accent-glow)]"
        >
          hello@mixsu.studio
          <UIcon name="lucide:arrow-up-right" class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </Reveal>
      <Reveal variant="fade" :delay="0.4" class="mt-8">
        <HandNote text="或者，先随便逛逛也行" class="text-lg text-muted md:text-xl" />
      </Reveal>
    </section>
  </div>
</template>
