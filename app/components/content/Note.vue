<script setup lang="ts">
/**
 * MDC 组件：::note —— 信息提示块
 */
</script>

<template>
  <aside class="not-prose cut-corner-sm my-6 flex gap-3 border border-line border-l-4 border-l-accent bg-surface p-4">
    <UIcon name="lucide:info" class="mt-0.5 size-4 shrink-0 text-accent" />
    <div class="text-sm leading-relaxed text-muted">
      <slot mdc-unwrap="p" />
    </div>
  </aside>
</template>
