<script setup lang="ts">
/**
 * 无限滚动跑马灯：内容复制两份，GSAP 以匀速循环平移。
 * 悬停时暂停。
 */
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    items: string[];
    speed?: number; // px/s
    reverse?: boolean;
    separator?: string;
    className?: string;
  }>(),
  {
    speed: 60,
    reverse: false,
    separator: "✦",
    className: "",
  },
);

const track = ref<HTMLElement | null>(null);
const reduceMotion = usePrefersReducedMotion();
let tween: gsap.core.Tween | null = null;

onMounted(() => {
  const el = track.value;
  if (!el || reduceMotion.value) return;

  const distance = el.scrollWidth / 2;
  const duration = distance / props.speed;

  tween = gsap.to(el, {
    xPercent: props.reverse ? 50 : -50,
    duration,
    ease: "none",
    repeat: -1,
  });

  el.addEventListener("mouseenter", () => tween?.pause());
  el.addEventListener("mouseleave", () => tween?.play());
});

onUnmounted(() => {
  tween?.kill();
});
</script>

<template>
  <div class="overflow-hidden" :class="className">
    <div ref="track" class="flex w-max items-center whitespace-nowrap will-change-transform">
      <template v-for="group in 2" :key="group">
        <span
          v-for="(item, i) in items"
          :key="`${group}-${i}`"
          class="flex items-center gap-6 px-3"
        >
          <span class="font-display text-2xl font-bold tracking-wide uppercase md:text-4xl">
            {{ item }}
          </span>
          <UIcon name="lucide:asterisk" class="size-4 text-accent" />
        </span>
      </template>
    </div>
  </div>
</template>
