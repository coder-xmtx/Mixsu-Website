<script setup lang="ts">
/**
 * MDC 组件：::tip —— 技巧提示块
 */
</script>

<template>
  <aside class="not-prose my-6 flex gap-3 rounded-xl border border-accent/40 bg-accent-soft p-4">
    <UIcon name="lucide:lightbulb" class="mt-0.5 size-4 shrink-0 text-accent" />
    <div class="text-sm leading-relaxed text-text">
      <slot mdc-unwrap="p" />
    </div>
  </aside>
</template>
