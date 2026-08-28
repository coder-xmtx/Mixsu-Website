// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  fonts: {
    provider: "bunny",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
