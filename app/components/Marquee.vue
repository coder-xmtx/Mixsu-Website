<script setup lang="ts">
/**
 * 无限滚动跑马灯（Version 2）：
 * 支持整体倾斜（skew），中英混排——拉丁字形走 Philosopher、中文走标题黑；
 * 分隔符用斜线，营造「电影胶片字幕条」感。悬停暂停。
 */
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    items: string[];
    speed?: number; // px/s
    reverse?: boolean;
    separator?: string;
    skew?: boolean;
    className?: string;
  }>(),
  {
    speed: 60,
    reverse: false,
    separator: "///",
    skew: false,
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
    <div class="w-[110%] -translate-x-[5%]" :class="skew ? 'skew-band' : ''">
      <div ref="track" class="flex w-max items-center whitespace-nowrap will-change-transform">
        <template v-for="group in 2" :key="group">
          <span v-for="(item, i) in items" :key="`${group}-${i}`" class="flex items-center gap-8 px-4">
            <span class="text-deco text-2xl tracking-wide md:text-4xl">
              {{ item }}
            </span>
            <span class="font-mono text-sm text-accent">{{ separator }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
