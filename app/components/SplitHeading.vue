<script setup lang="ts">
/**
 * 大标题逐字揭开动画：每个字符包在 overflow-hidden 容器中，
 * 挂载后按顺序从下方升起。适合 hero 主标题。
 */
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    text: string;
    as?: string;
    stagger?: number;
    delay?: number;
    duration?: number;
    className?: string;
  }>(),
  {
    as: "h1",
    stagger: 0.055,
    delay: 0,
    duration: 1.05,
    className: "",
  },
);

const chars = computed(() => props.text.split(""));
const el = ref<HTMLElement | null>(null);
const reduceMotion = usePrefersReducedMotion();

onMounted(() => {
  const root = el.value;
  if (!root || reduceMotion.value) return;

  const ctx = gsap.context(() => {
    const inner = root.querySelectorAll<HTMLElement>("[data-char]");
    gsap.fromTo(
      inner,
      { yPercent: 120, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        duration: props.duration,
        ease: "power4.out",
        stagger: props.stagger,
        delay: props.delay,
      },
    );
  }, root);

  onUnmounted(() => ctx.revert());
});
</script>

<template>
  <component
    :is="as"
    ref="el"
    :class="['flex flex-wrap', className]"
    :aria-label="text"
  >
    <span
      v-for="(ch, i) in chars"
      :key="i"
      class="inline-block overflow-hidden pb-[0.08em]"
    >
      <span
        data-char
        class="inline-block will-change-transform"
        :class="ch === ' ' ? 'whitespace-pre' : ''"
      >{{ ch }}</span>
    </span>
  </component>
</template>
