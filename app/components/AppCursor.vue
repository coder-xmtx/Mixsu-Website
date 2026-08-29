<script setup lang="ts">
/**
 * 自定义光标：小圆点 + 跟随环，悬停可交互元素时放大。
 * 仅桌面精确指针设备启用；触屏设备完全不渲染。
 * 启用后会给 <html> 加 .custom-cursor 以隐藏原生光标。
 */
import { gsap } from "gsap";

const dotEl = ref<HTMLElement | null>(null);
const ringEl = ref<HTMLElement | null>(null);
const isFine = useFinePointer();
const reduceMotion = usePrefersReducedMotion();

const enabled = computed(() => isFine.value && !reduceMotion.value);

let cleanup: (() => void) | null = null;
let visible = false;
let dotX: ((v: number) => void) | null = null;
let dotY: ((v: number) => void) | null = null;
let ringX: ((v: number) => void) | null = null;
let ringY: ((v: number) => void) | null = null;

/** 显示光标：若尚未可见，先瞬间定位到当前鼠标位置再淡入 */
function showAt(x: number, y: number) {
  if (visible) {
    dotX?.(x);
    dotY?.(y);
    ringX?.(x);
    ringY?.(y);
    return;
  }
  visible = true;
  gsap.set([dotEl.value, ringEl.value], { x, y });
  gsap.to([dotEl.value, ringEl.value], { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
}

function onMove(e: MouseEvent) {
  showAt(e.clientX, e.clientY);
}

function onOver(e: MouseEvent) {
  // 鼠标从窗口外滑入时 mouseover 同样触发：保证光标先出现
  if (!visible) showAt(e.clientX, e.clientY);

  const target = (e.target as HTMLElement)?.closest?.(
    "a, button, [role='button'], input, textarea, select, [data-cursor='hover'], label, summary",
  );
  if (target) {
    gsap.to(ringEl.value, { scale: 1.8, borderColor: "var(--accent)", duration: 0.35, ease: "power3.out", overwrite: "auto" });
    gsap.to(dotEl.value, { scale: 0.4, duration: 0.3, overwrite: "auto" });
  } else {
    gsap.to(ringEl.value, { scale: 1, borderColor: "var(--faint)", duration: 0.35, ease: "power3.out", overwrite: "auto" });
    gsap.to(dotEl.value, { scale: 1, duration: 0.3, overwrite: "auto" });
  }
}

function onDown() {
  gsap.to(ringEl.value, { scale: 0.8, duration: 0.2, overwrite: "auto" });
}

function onUp() {
  gsap.to(ringEl.value, { scale: 1.8, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
}

function onLeave() {
  visible = false;
  gsap.to([dotEl.value, ringEl.value], { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
}

function setup() {
  if (!enabled.value || !dotEl.value || !ringEl.value) return;

  document.documentElement.classList.add("custom-cursor");
  gsap.set([dotEl.value, ringEl.value], { autoAlpha: 0, xPercent: -50, yPercent: -50 });

  dotX = gsap.quickTo(dotEl.value, "x", { duration: 0.12, ease: "power2.out" });
  dotY = gsap.quickTo(dotEl.value, "y", { duration: 0.12, ease: "power2.out" });
  ringX = gsap.quickTo(ringEl.value, "x", { duration: 0.5, ease: "power3.out" });
  ringY = gsap.quickTo(ringEl.value, "y", { duration: 0.5, ease: "power3.out" });

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseover", onOver, { passive: true });
  window.addEventListener("mousedown", onDown, { passive: true });
  window.addEventListener("mouseup", onUp, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);

  cleanup = () => {
    document.documentElement.classList.remove("custom-cursor");
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseover", onOver);
    window.removeEventListener("mousedown", onDown);
    window.removeEventListener("mouseup", onUp);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    dotX = dotY = ringX = ringY = null;
  };
}

onMounted(() => {
  setup();
  watch(enabled, (v) => {
    if (v) {
      nextTick(setup);
    } else {
      cleanup?.();
      cleanup = null;
    }
  });
});

onUnmounted(() => cleanup?.());
</script>

<template>
  <Teleport to="body">
    <div
      v-if="enabled"
      ref="ringEl"
      class="pointer-events-none fixed left-0 top-0 z-120 size-10 rounded-full border"
      :style="{ borderColor: 'var(--faint)' }"
    />
    <div
      v-if="enabled"
      ref="dotEl"
      class="pointer-events-none fixed left-0 top-0 z-120 size-1.5 rounded-full"
      :style="{ background: 'var(--accent)' }"
    />
  </Teleport>
</template>
