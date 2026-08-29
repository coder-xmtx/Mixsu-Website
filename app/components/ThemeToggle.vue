<script setup lang="ts">
/**
 * 暗/亮切换按钮。默认暗色，切换时图标旋转。
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
      { rotate: -120, scale: 0.5, opacity: 0.2 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" },
    );
  }
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<template>
  <button
    type="button"
    class="group relative grid size-10 place-items-center rounded-full border border-line bg-surface text-muted transition-colors duration-300 hover:border-accent/60 hover:text-accent"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <span ref="iconEl" class="inline-grid">
      <UIcon v-if="isDark" name="lucide:sun" class="size-[18px]" />
      <UIcon v-else name="lucide:moon" class="size-[18px]" />
    </span>
  </button>
</template>
