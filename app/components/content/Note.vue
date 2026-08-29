<script setup lang="ts">
/**
 * MDC 组件：::note —— 信息提示块
 */
</script>

<template>
  <aside class="not-prose my-6 flex gap-3 rounded-xl border border-line bg-surface p-4">
    <UIcon name="lucide:info" class="mt-0.5 size-4 shrink-0 text-accent" />
    <div class="text-sm leading-relaxed text-muted">
      <slot mdc-unwrap="p" />
    </div>
  </aside>
</template>
