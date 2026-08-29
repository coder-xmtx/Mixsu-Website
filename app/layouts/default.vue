<template>
  <div class="relative min-h-screen">
    <!-- 氛围层 -->
    <GridLines />
    <NoiseOverlay />
    <ScrollProgress />
    <AppCursor />

    <!-- 头部 -->
    <SiteHeader />

    <!-- 内容 -->
    <main class="relative z-10">
      <slot />
    </main>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>
