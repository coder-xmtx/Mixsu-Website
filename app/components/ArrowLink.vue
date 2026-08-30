<script setup lang="ts">
/**
 * 带箭头滑动的链接。
 */
import { gsap } from "gsap";
import { NuxtLink } from "#components";

const props = withDefaults(
  defineProps<{
    to?: string;
    href?: string;
    label: string;
    external?: boolean;
    arrow?: boolean;
    className?: string;
  }>(),
  {
    to: undefined,
    href: undefined,
    external: false,
    arrow: true,
    className: "",
  },
);

const arrowEl = ref<HTMLElement | null>(null);

function onEnter() {
  const el = arrowEl.value;
  if (!el) return;
  gsap.to(el, { x: 4, opacity: 1, duration: 0.3, ease: "power2.out" });
}

function onLeave() {
  const el = arrowEl.value;
  if (!el) return;
  gsap.to(el, { x: 0, opacity: 0.6, duration: 0.3, ease: "power2.out" });
}

const isExternal = computed(() => props.external || (props.href?.startsWith("http") ?? false));

// 用组件对象而非字符串 'NuxtLink'：动态组件 :is 传字符串依赖全局注册名解析，
// 解析失败时会渲染成不可点击的自定义元素（看起来在、实际点不动）。
const linkComponent = computed(() => (isExternal.value ? "a" : props.to ? NuxtLink : "button"));
</script>

<template>
  <component :is="linkComponent" :to="to" :href="href" :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined" data-cursor="hover"
    class="group inline-flex items-baseline gap-2 text-sm font-medium text-text transition-colors duration-300 hover:text-accent"
    :class="className" @mouseenter="onEnter" @mouseleave="onLeave">
    <span class="link-underline">{{ label }}</span>
    <span ref="arrowEl" class="inline-block opacity-60 transition-opacity">
      <UIcon :name="isExternal ? 'lucide:arrow-up-right' : 'lucide:arrow-right'" class="size-4" />
    </span>
  </component>
</template>
