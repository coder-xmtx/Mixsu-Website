<script setup lang="ts">
useHead({
  htmlAttrs: { lang: "zh-CN" },
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <BootLoader />
    <RouteLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
