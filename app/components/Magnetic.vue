<script setup lang="ts">
/**
 * 磁吸效果容器：鼠标靠近时元素向光标方向偏移，离开时回弹。
 */
import { gsap } from "gsap";

const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.35 });

const el = ref<HTMLElement | null>(null);
const isFine = useFinePointer();
const reduceMotion = usePrefersReducedMotion();

let ctx: gsap.Context | null = null;
let onPointerMove: ((e: PointerEvent) => void) | null = null;
let onPointerLeave: (() => void) | null = null;

onMounted(() => {
  const target = el.value;
  if (!target || !isFine.value || reduceMotion.value) return;

  ctx = gsap.context(() => {
    const xTo = gsap.quickTo(target, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.4, ease: "power3.out" });

    onPointerMove = (e: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * props.strength);
      yTo(relY * props.strength);
    };

    onPointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    target.addEventListener("pointermove", onPointerMove);
    target.addEventListener("pointerleave", onPointerLeave);
  }, target);

  onUnmounted(() => {
    if (onPointerMove) target.removeEventListener("pointermove", onPointerMove);
    if (onPointerLeave) target.removeEventListener("pointerleave", onPointerLeave);
    ctx?.revert();
  });
});
</script>

<template>
  <div ref="el" class="inline-block will-change-transform">
    <slot />
  </div>
</template>
