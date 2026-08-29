<script setup lang="ts">
/**
 * 区块标题：等宽字体编号 + 提示词 + 大标题 + 可选描述。
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
      <span v-if="index" class="font-mono text-xs tracking-[0.2em] text-accent">{{ index }}</span>
      <span v-if="kicker" class="font-mono text-xs tracking-[0.2em] text-muted uppercase">{{ kicker }}</span>
      <span class="h-px w-10 bg-line" />
    </Reveal>

    <Reveal variant="clip" :delay="0.08" class="mt-4">
      <h2 class="font-display text-3xl font-bold tracking-tight text-text md:text-5xl">
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
