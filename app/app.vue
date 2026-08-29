<script setup lang="ts">
useHead({
  htmlAttrs: { lang: "zh-CN" },
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <RouteLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
