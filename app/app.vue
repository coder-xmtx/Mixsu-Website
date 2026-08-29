<script setup lang="ts">
useHead({
  htmlAttrs: { lang: "zh-CN" },
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
