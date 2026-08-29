<script setup lang="ts">
/**
 * MDC 组件：::warning —— 警告提示块
 */
</script>

<template>
  <aside class="not-prose my-6 flex gap-3 rounded-xl border border-red-400/40 bg-red-400/10 p-4">
    <UIcon name="lucide:triangle-alert" class="mt-0.5 size-4 shrink-0 text-red-400" />
    <div class="text-sm leading-relaxed text-text">
      <slot mdc-unwrap="p" />
    </div>
  </aside>
</template>
