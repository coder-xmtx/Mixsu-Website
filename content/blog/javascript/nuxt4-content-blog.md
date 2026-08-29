---
title: 用 Nuxt 4 + Nuxt Content 搭一个自己的博客
description: 从零搭建这个网站的完整记录：内容集合、类型安全查询、MDC 组件与部署前的所有细节。
date: 2026-01-18
category: javascript
tags:
  - Nuxt
  - Nuxt Content
  - 教程
pinned: true
---

# 用 Nuxt 4 + Nuxt Content 搭一个自己的博客

这篇文章记录我用 Nuxt 4 + Nuxt Content 搭建本站博客部分的过程。它不会教你每一行代码，而是给你一条已经走通的路径。

## 为什么选 Nuxt Content

我想要的博客有几个硬性要求：

- 用 Markdown 写文章，改完即生效
- 文章有类型安全的 frontmatter 校验
- 支持 MDC 组件（比如 `::note` 提示块）
- 不需要一个后台管理系统

Nuxt Content v3 全部满足。它把内容编译进一个本地 SQLite 数据库，查询用类型安全的全新 API。

## 第一步：定义内容集合

在项目根目录创建 `content.config.ts`，声明 `blog` 集合与 frontmatter 的 zod schema：

```ts [content.config.ts]
import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        category: z.enum(["life", "javascript", "blender"]),
        tags: z.array(z.string()).default([]),
        pinned: z.boolean().default(false),
      }),
    }),
  },
});
```

之后在 `content/blog/` 下按分类建目录，每篇文章就是一个 Markdown 文件。

## 第二步：查询文章

页面里用 `queryCollection` 查询。Nuxt Content v3 的查询是类型安全的，写错字段名会直接报错：

```vue [app/pages/blog/[category]/index.vue]
<script setup lang="ts">
const route = useRoute();

const { data: posts } = await useAsyncData(`blog-${route.params.category}`, () => {
  return queryCollection("blog")
    .where("category", "=", route.params.category)
    .order("date", "DESC")
    .select("title", "description", "date", "tags", "path")
    .all();
});
</script>
```

## 第三步：渲染文章

详情页用 `ContentRenderer` 渲染，标题、目录这些结构由它处理：

```vue [app/pages/blog/[category]/[slug].vue]
<script setup lang="ts">
const route = useRoute();
const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection("blog").path(route.path).first();
});
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
</template>
```

## 关于 MDC 组件

在 `components/content/` 下放一个 `Note.vue`，Markdown 里就能写：

```md
::note
这是提示块的内容。
::
```

:::note
这是我为本站写的 MDC 组件。`::note` 和 `:::note` 的差异在于块级嵌套深度，前者用于行内段落，后者用于包裹多段内容。
:::

## 部署

静态部署用 `nuxt generate`，动态部署（SSR）用 `nuxt build`。内容数据库在构建时生成，两种模式都开箱即用。

> 源码：本站源码本身就是一个完整示例。
