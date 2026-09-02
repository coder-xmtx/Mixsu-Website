<script setup lang="ts">
/**
 * 区块标题（Version 2）：斜线编号 + Philosopher 提示词 + 标题黑大标题 + 斜切色块。
 */
withDefaults(
  defineProps<{
    index?: string;
    kicker?: string;
    title: string;
    description?: string;
    align?: "start" | "center";
    className?: string;
  }>(),
  {
    index: "",
    kicker: "",
    description: "",
    align: "start",
    className: "",
  },
);
</script>

<template>
  <div :class="[align === 'center' ? 'text-center' : '', className]">
    <Reveal variant="fade" as="div" class="flex items-center gap-3" :class="align === 'center' ? 'justify-center' : ''">
      <span v-if="index" class="font-mono text-xs tracking-[0.2em] text-accent">/{{ index }}</span>
      <span v-if="kicker" class="text-deco text-sm italic tracking-[0.15em] text-muted">{{ kicker }}</span>
      <span class="h-px w-12 -skew-x-12 bg-line" />
      <span class="size-1.5 rotate-45 bg-accent/70" />
    </Reveal>

    <Reveal variant="clip" :delay="0.08" class="mt-4">
      <h2 class="flex items-center gap-4 font-title text-3xl tracking-wide text-text md:text-5xl"
        :class="align === 'center' ? 'justify-center' : ''">
        <span class="hidden h-[0.9em] w-1.5 -skew-x-12 bg-accent md:block" aria-hidden="true" />
        {{ title }}
      </h2>
    </Reveal>

    <Reveal v-if="description" variant="up" :delay="0.18" :y-offset="24" class="mt-5">
      <p class="max-w-xl text-base leading-relaxed text-muted" :class="align === 'center' ? 'mx-auto' : ''">
        {{ description }}
      </p>
    </Reveal>
  </div>
</template>
