// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/content", "@nuxt/icon", "@pinia/nuxt"],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: { lang: "zh-CN" },
      title: "Mixsu Studio — 个人工作室",
      meta: [
        {
          name: "description",
          content: "Mixsu 的个人工作室：剪辑作品、Blender 创作与技术文章。",
        },
        { name: "theme-color", content: "#0f1218" },
        { property: "og:title", content: "Mixsu Studio" },
        {
          property: "og:description",
          content: "剪辑 · Blender · 前端开发 —— Mixsu 的个人数字工作室。",
        },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },

  icon: {
    clientBundle: {
      icons: [
        "lucide:arrow-down-right",
        "lucide:arrow-left",
        "lucide:arrow-right",
        "lucide:arrow-up",
        "lucide:arrow-up-right",
        "lucide:asterisk",
        "lucide:box",
        "lucide:clapperboard",
        "lucide:code-2",
        "lucide:coffee",
        "lucide:home",
        "lucide:info",
        "lucide:lightbulb",
        "lucide:menu",
        "lucide:moon",
        "lucide:send",
        "lucide:sun",
        "lucide:terminal",
        "lucide:triangle-alert",
        "lucide:x",
      ],
    },
  },

  fonts: {
    provider: "local",
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 2 },
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: ["ts", "js", "vue", "bash", "json", "css", "html", "md"],
        },
      },
    },
    experimental: { sqliteConnector: "native" },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
