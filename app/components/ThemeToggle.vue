<script setup lang="ts">
/**
 * 暗/亮切换按钮（Version 2）：方形斜切，切换时图标斜切翻转。
 */
import { gsap } from "gsap";

const colorMode = useColorMode();
const iconEl = ref<HTMLElement | null>(null);

const isDark = computed(() => colorMode.value === "dark");

function toggle() {
  const el = iconEl.value;
  if (el) {
    gsap.fromTo(
      el,
      { rotate: -110, skewX: -24, scale: 0.4, opacity: 0.2 },
      { rotate: 0, skewX: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" },
    );
  }
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<template>
  <button
    type="button"
    class="cut-corner-sm cut-outline group relative grid size-10 place-items-center bg-surface text-muted transition-colors duration-300 hover:text-accent hover:[--cut-line:var(--accent)]"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <span ref="iconEl" class="inline-grid">
      <UIcon v-if="isDark" name="lucide:sun" class="size-[18px]" />
      <UIcon v-else name="lucide:moon" class="size-[18px]" />
    </span>
    <!-- 角落刻度 -->
    <span class="pointer-events-none absolute left-1 top-1 h-1.5 w-1.5 border-l border-t border-faint/60 transition-colors group-hover:border-accent" />
    <span class="pointer-events-none absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-faint/60 transition-colors group-hover:border-accent" />
  </button>
</template>
