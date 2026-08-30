# Mixsu Studio 学习文档

> 这是一份写给"只有 HTML / CSS / JavaScript 三件套 + Vue 基础"的学习者的项目导读。
> 目标不是背 API，而是搞懂：这个网站是怎么搭起来的、每一块代码为什么这样写、
> 以及踩过的坑为什么是坑。建议打开源码边看边读，遇到不懂的概念回到对应小节。

---

## 目录

1. [项目是什么](#1-项目是什么)
2. [技术栈一览](#2-技术栈一览)
3. [环境准备与常用命令](#3-环境准备与常用命令)
4. [目录结构](#4-目录结构)
5. [Nuxt 核心概念（面向 Vue 开发者）](#5-nuxt-核心概念面向-vue-开发者)
6. [页面拆解](#6-页面拆解)
7. [内容体系：Nuxt Content](#7-内容体系nuxt-content)
8. [设计系统：CSS 变量与主题](#8-设计系统css-变量与主题)
9. [动效体系：GSAP](#9-动效体系gsap)
10. [踩坑记录（Bug 修复史）](#10-踩坑记录bug-修复史)
11. [扩展指南（快速上手）](#11-扩展指南快速上手)

---

## 1. 项目是什么

Mixsu Studio 是一个**个人数字工作室网站**：作品集 + 博客 + 个人介绍，目标是做出
"有手工感、有节奏感、暗色氛围"的个人站点，而不是传统后台模板。

从 AGENTS.md 提炼出的三条设计底线：

1. **拒绝后台模板感**——不用侧边栏 + 表格卡片那套"管理系统"语言，允许打破常规排版。
2. **暗色优先**——默认深灰蓝底 + 柔和橙强调色，同时完整支持亮色模式。
3. **动效是叙事的一部分**——动画用于引导视线、解释层级，而不是装饰性抖动；同时尊重 `prefers-reduced-motion`。

---

## 2. 技术栈一览

| 领域 | 技术 | 一句话说明 |
| ---- | ---- | ---- |
| 框架 | Nuxt 4.5（Vue 3 + TypeScript） | 在 Vue 之上加了 SSR、路由、自动导入、文件即路由等能力 |
| UI | Nuxt UI v4（@nuxt/ui） | 主要用它做主题体系；页面里的组件基本都是自己画的 |
| 动效 | GSAP 3.15 | 业界最主流的 JS 动画库，擅长时间线、滚动驱动、Flip 布局动画 |
| 内容 | Nuxt Content v3 | 用 Markdown 写博客/项目，编译进本地 SQLite 数据库 |
| 样式 | Tailwind CSS v4 + CSS 变量 | 主题色全部走语义变量，暗亮两套 |
| 状态 | Pinia | 已接入，但目前页面内没重度使用 |
| 图标 | @nuxt/icon + @iconify-json/lucide | 图标本地打包，离线可用 |
| 包管理 | pnpm | 注意本机的 store 配置（见第 3 节） |

> 学习顺序建议：先看第 5 节搞懂 Nuxt 的"水合"和"自动导入"，再去看页面和动效，
> 否则很多写法会显得"莫名其妙"。

---

## 3. 环境准备与常用命令

```bash
pnpm install             # 安装依赖
pnpm nuxt prepare        # 生成类型（改 nuxt.config / content.config 后必跑）
pnpm nuxt dev --port 3000  # 开发服务器
pnpm nuxi typecheck      # 类型检查
pnpm nuxt build          # 生产构建（SSR 模式）
pnpm nuxt generate       # 静态生成（纯静态托管）
node scripts/gen-covers.mjs  # 重新生成项目封面 SVG
```

### 本机环境注意事项

- `.npmrc` 里固定了 `store-dir=D:\.pnpm-store\v11`，这是为了配合本机旧的 pnpm store。
  换机器时删除这行让 pnpm 自选即可，否则会报 `ERR_PNPM_UNEXPECTED_STORE`。
- `pnpm-workspace.yaml` 里的 `allowBuilds` 允许了 `better-sqlite3`、`esbuild`、`vue-demi`
  这几个需要编译原生代码/脚本的包（pnpm 10+ 默认禁止依赖的构建脚本）。
- 在受限沙箱里跑 dev/build，Nitro 服务器以管道 stdio 启动子进程会报 `spawn EPERM`，
  需要完整权限运行。日常本地开发不受影响。

---

## 4. 目录结构

```
Mixsu-Website-v2/
├── nuxt.config.ts          # Nuxt 配置：模块、SEO、图标、代码高亮、主题
├── content.config.ts       # 内容集合 schema（用 zod 校验 frontmatter）
├── content/                # 内容源（Markdown）
│   ├── projects/           # 项目
│   └── blog/               # 博客，按分类分子目录
├── public/                 # 静态资源（favicon、头像、封面 SVG）
├── scripts/                # 工具脚本（生成封面等）
├── app/                    # Nuxt 4 的应用根（注意不是 src/，也不是根目录）
│   ├── app.vue             # 根组件：UApp + RouteLoader + NuxtLayout
│   ├── app.config.ts       # Nuxt UI 主题注册
│   ├── error.vue           # 404 / 错误页
│   ├── assets/css/main.css # ★ 设计系统核心（变量、字体、正文排版、动效类）
│   ├── layouts/default.vue # 默认布局（氛围层 + 头部 + 内容 + 页脚）
│   ├── plugins/
│   │   └── gsap.client.ts  # ★ GSAP 插件注册（ScrollTrigger / Flip）
│   ├── components/         # 全局组件（自动导入）
│   │   ├── content/        # MDC 组件（Markdown 里 ::note 等）
│   │   ├── AppCursor.vue   # 自定义光标
│   │   ├── GridLines.vue   # 流动网格背景
│   │   ├── NoiseOverlay.vue# 胶片噪点
│   │   ├── RouteLoader.vue # 全屏路由过渡
│   │   ├── SiteHeader.vue  # 头部导航（含移动端全屏菜单）
│   │   ├── SiteFooter.vue  # 页脚
│   │   ├── ThemeToggle.vue # 暗/亮切换
│   │   ├── ScrollProgress.vue # 顶部阅读进度条
│   │   ├── Reveal.vue      # 滚动入场动画容器
│   │   ├── Magnetic.vue    # 磁吸效果容器
│   │   ├── Marquee.vue     # 无限跑马灯
│   │   ├── SplitHeading.vue# 逐字揭开大标题
│   │   ├── SectionHeading.vue # 区块标题
│   │   ├── ArrowLink.vue   # 带箭头滑动的链接
│   │   ├── ProjectCard.vue # 项目卡片
│   │   ├── PostCard.vue    # 文章列表项
│   │   └── CategoryCard.vue# 博客分类卡片
│   ├── composables/        # 组合式函数（自动导入）
│   │   ├── useGsap.ts      # GSAP 访问器（返回 gsap + 插件引用）
│   │   └── useMediaQuery.ts# SSR 安全的媒体查询
│   ├── utils/              # 工具函数（自动导入）
│   │   ├── meta.ts         # 分类元数据 + 日期格式化
│   │   └── content.ts      # Markdown AST 字数统计（阅读时长）
│   └── pages/              # 页面（文件即路由）
```

> Nuxt 4 把应用代码放在 `app/` 目录，而 `content/`、`public/`、`nuxt.config.ts`
> 仍留在项目根目录。别和 Nuxt 3 的"根目录直接放 pages/"搞混。

---

## 5. Nuxt 核心概念（面向 Vue 开发者）

如果你只写过纯 Vue（比如 Vite + Vue 的 SPA），下面几个概念是理解本项目的关键。

### 5.1 SSR、CSR 与"水合"（hydration）

- **SSR（服务端渲染）**：服务器把组件渲染成 HTML 字符串，直接返回给浏览器，所以首屏能立刻看到内容，对 SEO 也友好。
- **CSR（客户端渲染）**：浏览器拿到 JS 后，在浏览器里生成 DOM。传统 SPA 就是这样，首屏会白屏等 JS。
- **水合（hydration）**：Nuxt 做 SSR 后，浏览器拿到的 HTML 是"死的"（没有事件、没有响应式）。
  Vue 在客户端重新跑一遍，把响应式和事件"贴"到已有的 DOM 上，这个过程叫水合。

**水合报错 `Hydration completed but contains mismatches` 的含义**：服务器渲染出的 HTML 和客户端第一次渲染的虚拟 DOM 不一致。
最常见原因是**两端读到了不同的环境信息**（比如 `window`、`matchMedia`、随机数、当前时间）。

本项目的典型例子：`AppCursor.vue` 里用 `useFinePointer()` 判断是不是桌面端精确指针设备。
服务器上没有 `window.matchMedia`，返回 `false`；客户端是桌面就返回 `true`，
于是服务器渲染"没有光标 DOM"，客户端渲染"有光标 DOM"，两边对不上，就报水合错误。

> 修复思路：让两端**第一次渲染时结果一致**。本项目用了一个 `mounted` 门控——
> 首屏两端都渲染 `false`，挂载之后再置 `true`。详见第 10 节。

### 5.2 自动导入（Auto Import）

Nuxt 会自动导入三样东西，**不需要手动 import**：

- `app/components/` 下的组件 → 模板里直接用 `<ProjectCard />`
- `app/composables/` 下的函数 → 脚本里直接用 `useMediaQuery(...)`
- `app/utils/` 下的函数 → 脚本里直接用 `formatDate(...)`

例如 `app/pages/index.vue` 顶部并没有 `import { ProjectCard } from ...`，但模板里直接用。
这是 Nuxt 的便利，但代价是"这个函数从哪来"变得不直观，读代码时心里要有这张地图。

> 关键坑：自动导入是"**用到才导入**"。如果某个模块只是被定义、从没被任何地方调用，
> 它的副作用（比如顶层的 `gsap.registerPlugin`）**根本不会执行**。这正是第 10 节的第一个大 Bug。

### 5.3 插件（plugins）

`app/plugins/` 下的文件会在应用启动时执行一次，用于"一次性初始化"：

- 文件名带 `.client` 后缀 → 只在浏览器端执行（本项目 `gsap.client.ts` 就是，因为 GSAP 需要 window）。
- 文件名带 `.server` 后缀 → 只在服务端执行。

```ts
// app/plugins/gsap.client.ts
export default defineNuxtPlugin({
  setup() {
    gsap.registerPlugin(ScrollTrigger, Flip);
  },
  hooks: {
    // 每次页面加载完成（Suspense 解析完）后刷新所有 ScrollTrigger
    "page:finish": () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
  },
});
```

### 5.4 文件即路由

`app/pages/` 下的文件路径就是路由路径：

| 文件 | 路由 |
| ---- | ---- |
| `pages/index.vue` | `/` |
| `pages/projects/index.vue` | `/projects` |
| `pages/projects/[slug].vue` | `/projects/任意名` |
| `pages/blog/[category]/[slug].vue` | `/blog/分类/文章名` |

方括号 `[]` 是动态段，值在组件里通过 `useRoute().params.xxx` 拿到。

### 5.5 数据获取：useAsyncData + queryCollection

页面顶部的 `await useAsyncData(...)` 是 Nuxt 数据获取的标准姿势：

```ts
const { data: projects } = await useAsyncData("projects-all", () =>
  queryCollection("projects")
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "cover", "path")
    .all(),
);
```

要点：

- 第一个参数 `"projects-all"` 是**唯一 key**，Nuxt 用它做缓存/去重，同页面两个查询不能用同一个 key。
- 回调里返回 Promise，Nuxt 在 SSR 时预取数据并塞进页面 payload，客户端水合时直接复用，不会重复请求。
- `await` 会让页面组件进入 **Suspense**（挂起）状态：数据没回来之前页面不渲染，回来之后才渲染。
  这个"Suspense 解析完"的时机，就是插件里 `page:finish` 钩子触发的时机。

---

## 6. 页面拆解

### 6.1 首页 `app/pages/index.vue`

从上到下：

1. **Hero**：`MIXSU`（流动渐变标题）+ `STUDIO`（描边字）+ 简介 + 两个 CTA 按钮 + 头像。
   - 入场用一条 GSAP 时间线（`data-hero-*` 选择器逐个淡入）。
   - 头像有 clipPath 揭开 + 滚动视差。
   - 大标题 `MIXSU` 用了 `.title-flow` 类做流动渐变。
2. **Marquee**：无限跑马灯（`Marquee.vue`）。
3. **Manifesto**：滚动叙事，4 句话随滚动逐行点亮（ScrollTrigger scrub）。
4. **精选作品**：`featured: true` 的项目卡片（`ProjectCard`）。
5. **最新文章**：按日期倒序取 3 篇（`PostCard`）。
6. **联系 CTA**：发邮件按钮。

### 6.2 作品集 `app/pages/projects/index.vue`

- 顶部 4 个筛选按钮（全部/剪辑/Blender/开发）。
- 点筛选时用 GSAP **Flip** 做卡片位置过渡（详见第 9.4 节）。
- 卡片通过 `:animate="false"` 传给 `ProjectCard`，关闭其内部的滚动入场动画，避免和 Flip 打架。

### 6.3 项目详情 `app/pages/projects/[slug].vue`

- `queryCollection("projects").path(route.path).first()` 取当前项目。
- 找不到就 `throw createError({ statusCode: 404 })`。
- 正文用 `<ContentRenderer :value="project" class="prose-content" />` 渲染 Markdown。

### 6.4 博客 `app/pages/blog/**`

- `blog/index.vue`：分类卡片 + 置顶文章。
- `blog/[category]/index.vue`：某分类下的文章列表。
- `blog/[category]/[slug].vue`：文章详情，含阅读时长估算（`estimateReadingMinutes`）与相关文章。

### 6.5 关于 `app/pages/about.vue`

静态页面：简介、技能卡片、时间线、联系 CTA。没有内容查询，纯手写数据。

---

## 7. 内容体系：Nuxt Content

### 7.1 集合定义

`content.config.ts` 用 `defineCollection` + zod schema 定义了两个集合：

```ts
projects: defineCollection({
  type: "page",
  source: "projects/**",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(["video", "blender", "dev"]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // ...
  }),
}),
```

zod schema 的用途：**校验 frontmatter**。字段类型写错、枚举写错，构建/查询时直接报错。
`z.date()` 会自动把 frontmatter 里的 `2026-08-29` 解析成 `Date` 对象。

### 7.2 新增一篇博客

1. 在 `content/blog/<分类>/` 下新建 `xxx.md`。
2. 写 frontmatter：

```md
---
title: 文章标题
description: 一句话摘要（列表页与 SEO 使用）
date: 2026-08-29
category: javascript        # life | javascript | blender
tags:
  - Nuxt
pinned: false               # true 会出现在博客首页"置顶文章"
---
```

3. 正文用 Markdown 写，可直接用 MDC 组件。

### 7.3 新增一个项目

在 `content/projects/` 下新建 `xxx.md`：

```md
---
title: 项目名
description: 项目摘要
date: 2026-08-29
category: dev               # video | blender | dev
tags:
  - Vue
cover: /covers/xxx.svg     # 封面路径（可选）
featured: true             # true 会出现在首页"精选作品"
role: 独立制作
links:
  - label: 源码
    url: https://github.com/...
---
```

封面用 `scripts/gen-covers.mjs` 生成，按自己的配置加一条记录后 `node scripts/gen-covers.mjs`。

### 7.4 MDC 组件

`app/components/content/` 下的组件可以在 Markdown 里直接调用：

```md
::note
普通提示（信息风格）
::

::tip
技巧提示（橙色底）
::

::warning
警告（红色）
::
```

组件里用 `<slot mdc-unwrap="p" />` 去掉 Markdown 自动包裹的 `<p>`，避免多余的边距。

### 7.5 代码高亮

配置在 `nuxt.config.ts` 的 `content.build.markdown.highlight`。注意键名是 `theme`（单数），
写成 `themes` 会报 `NUXT_B1001 Could not compile template mdc-highlighter.mjs`。

---

## 8. 设计系统：CSS 变量与主题

核心在 `app/assets/css/main.css`。所有颜色都是**语义变量**，`:root`（亮色）和 `.dark`（暗色）各定义一套：

| 变量 | 用途 |
| ---- | ---- |
| `--bg` / `--bg-soft` | 页面背景 / 次级背景 |
| `--surface` / `--elevated` | 卡片 / 悬浮层 |
| `--line` / `--line-soft` | 边框、分隔线 |
| `--text` / `--muted` / `--faint` | 正文 / 次级文字 / 弱化文字 |
| `--accent` / `--accent-strong` / `--accent-soft` | 强调橙 / 深橙 / 橙色淡底 |
| `--accent-glow` | 橙色光晕 |
| `--selection` / `--noise-opacity` | 选中色 / 噪点透明度 |

`@theme inline` 把变量映射成 Tailwind 工具类，所以模板里能写 `bg-bg`、`text-text`、`border-line`、
`text-accent`、`bg-surface` 等。

字体也在 `@theme inline` 里定义：

- `--font-display`：大标题
- `--font-sans`：正文
- `--font-code`：代码（JetBrains Mono 优先，带等宽回退栈）
- `--font-mono`：编号、标签等

正文排版在 `.prose-content` 系列规则里，包括标题、段落、链接、列表、**引用块**（`>`）、行内代码、
代码块、表格等。其中 `>` 引用块用左侧橙色竖线 + 圆角浅底呈现。

---

## 9. 动效体系：GSAP

### 9.1 核心概念速览

GSAP 的四个基础方法：

- `gsap.to(el, { x: 100 })`：从当前状态动画**到**目标状态。
- `gsap.from(el, { x: 100 })`：从指定状态动画**回**当前状态（常用作入场）。
- `gsap.fromTo(el, { x: 0 }, { x: 100 })`：显式指定起点和终点。
- `gsap.set(el, { x: 0 })`：立即设置，不动画。

常用属性（全部驼峰）：

- `autoAlpha`：透明度 + 可见性的组合，`autoAlpha: 0` 会自动加 `visibility: hidden`（比 `opacity` 更适合淡入淡出）。
- `x / y`：平移（默认 px），`xPercent / yPercent`：按百分比平移，两者互不干扰。
- `scale / rotation`：缩放 / 旋转。
- `stagger`：多个目标时错开动画时间。
- `ease`：缓动，如 `"power3.out"`、`"none"`。

### 9.2 时间线（Timeline）

把多个动画串成一条时间线，避免用 `delay` 硬算：

```ts
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.from("[data-hero-kicker]", { autoAlpha: 0, y: 24, duration: 0.7 }, 0.15)
  .from("[data-hero-cta]", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08 }, 1.1);
```

第三个参数是**位置参数**：`0.15` 表示在时间线第 0.15 秒处开始。首页 Hero 的入场就是一条时间线。

### 9.3 滚动驱动（ScrollTrigger）

`ScrollTrigger` 让动画跟随滚动。两种典型用法：

**Scrub 型**（进度绑定滚动，常用于"叙事"）——首页 Manifesto：

```ts
gsap.fromTo(
  lines,
  { autoAlpha: 0.12, y: 30 },
  {
    autoAlpha: 1, y: 0, stagger: 0.25, ease: "none",
    scrollTrigger: { trigger: root, start: "top 78%", end: "bottom 55%", scrub: 1 },
  },
);
```

**入场型**（滚到视口再播放一次）——`Reveal.vue`：

```ts
gsap.fromTo(target, fromVars, {
  ...toVars,
  immediateRender: false,
  scrollTrigger: {
    trigger: target,
    start: "top 85%",
    toggleActions: "play none none none",
  },
});
```

顶部进度条 `ScrollProgress.vue` 用 `start: 0, end: "max"` 表示"从顶部到最大滚动距离"，
这是进度条的标准写法（不要用 `trigger: document.documentElement`，那会算错）。

### 9.4 Flip 布局动画

`Flip` 用于"两个布局状态之间平滑过渡"（卡片重排、筛选、增删）。作品集筛选：

```ts
const state = Flip.getState("[data-proj]"); // 记录当前位置
active.value = key;                        // 改变数据
nextTick(() => {
  Flip.from(state, {                        // 让卡片从旧位置飞到新位置
    duration: 0.5,
    ease: "power2.inOut",
    onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }),
  });
});
```

要点：

- `Flip.getState()` → 改 DOM → `Flip.from()`，三步曲。
- `onEnter` 处理"新增"的卡片，`onLeave` 处理"移除"的卡片。
- 不要同时再对同一批元素套一层 `gsap.fromTo` 淡入，那会跟 Flip 自身的动画打架，造成卡顿。

### 9.5 组件内动画的规范

所有组件内的 GSAP 代码必须：

1. 在 `onMounted` 里创建（此时 DOM 才存在）。
2. 用 `gsap.context(() => {...}, rootEl)` 包裹，选择器自动限定在组件内。
3. 在 `onUnmounted` 里 `ctx.revert()` 清理（tween 和 ScrollTrigger 一起销毁）。

```ts
onMounted(() => {
  const root = el.value;
  if (!root) return;
  const ctx = gsap.context(() => {
    gsap.fromTo(".item", { autoAlpha: 0 }, { autoAlpha: 1 });
  }, root);
  onUnmounted(() => ctx.revert());
});
```

---

## 10. 踩坑记录（Bug 修复史）

这一节是这个项目最有价值的学习材料——每个坑都是"看起来能跑，实际有 bug"的典型。

### 10.1 GSAP 插件没注册（最严重）

**现象**：所有 `scrollTrigger` 动画都不生效，控制台报 `Invalid property scrollTrigger ... Missing plugin? gsap.registerPlugin()`。

**原因**：`gsap.registerPlugin(ScrollTrigger, Flip)` 原本写在 `composables/useGsap.ts` 的顶层，
但 `useGsap()` 从没被任何地方调用，而 Nuxt 自动导入是"用到才导入"，
所以这个文件是**死代码**，注册语句永远不执行。

**修复**：把注册逻辑移到 `app/plugins/gsap.client.ts`（插件一定会执行）。

**教训**：一次性初始化的代码要放在"必定执行"的位置（插件），不要放在"可能没人用"的模块里。

### 10.2 水合 mismatch

**现象**：控制台报 `Hydration completed but contains mismatches`。

**原因**：`AppCursor` 用 `useFinePointer()`（内部读 `window.matchMedia`）在模板 `v-if` 里判断是否渲染光标，
服务器和客户端结果不一致。

**修复**：加 `mounted` 门控，首屏两端都渲染 `false`，挂载后再置 `true`。

**教训**：任何依赖浏览器环境的信息（matchMedia、localStorage、随机数、时间），
如果参与**首屏渲染**，就要想办法让两端首次结果一致。

### 10.3 路由过渡提前放完

**现象**：切换页面时，加载遮罩先滑走了，但新页面内容还没出来（白屏一瞬）。

**原因**：原来用 `router.afterEach` 触发遮罩滑出，但 `afterEach` 在导航确认后立即触发，
此时新页面的 `await useAsyncData` 还在 Suspense 挂起中，数据没回来。

**修复**：改用 `nuxtApp.hook("page:finish", ...)`，等页面真正加载完成（Suspense 解析完）再滑出。

**教训**：`afterEach` ≠ "页面加载完成"，只有 `page:finish` 才代表 Suspense 结束。

### 10.4 顶部进度条走不满

**现象**：首页正常，但切到别的页面后，滚到底了进度条才走一小段。

**原因**：进度条用 `trigger: document.documentElement` + `end: "bottom bottom"`，
`html` 元素的测量值不稳定，算出的"终点"经常不对；再加上路由切换后文档高度变了，
但 ScrollTrigger 没刷新，`max` 还是旧页面的。

**修复**：改用 `start: 0, end: "max"`，并在插件里挂 `page:finish` 钩子刷新所有 ScrollTrigger。

**教训**：进度条用 `end: "max"`；SPA 里路由切换后要手动 `ScrollTrigger.refresh()`。

### 10.5 卡片渲染不对 / 链接点不了

**现象**：首页精选作品卡片显示异常，旁边的"查看全部作品""进入博客"点不动。

**原因**：`Reveal` 组件用 `gsap.from(..., { autoAlpha: 0, scrollTrigger: ... })`，
`from` 默认 `immediateRender: true`，会在挂载时**立刻把元素隐藏**。
一旦 ScrollTrigger 没有正确触发（首屏内、刷新后已滚动过等），元素就永久停在 `visibility: hidden`——
看起来就是"渲染不对"或"点不了"。

**修复**：改成 `gsap.fromTo(..., { immediateRender: false })`，让元素"默认可见、滚到才动画"（fail-open），
而不是"默认隐藏、等触发"（fail-closed）。

**教训**：`from`/`fromTo` 配合 ScrollTrigger 时，一定要警惕 `immediateRender` 的行为。

### 10.6 作品集筛选卡顿

**现象**：从"全部"切到"剪辑"等分类时，动画卡顿。

**原因**：`Flip.from` 用了 `absolute: true`（触发回流），又叠加了一段对所有卡片做的
`gsap.fromTo` 淡入缩放，两套动画同时作用于同一批元素，互相打架。

**修复**：去掉 `absolute` 和整组 `fromTo`，只保留干净的 Flip，用 `onEnter` 单独处理新增卡片。

### 10.7 其它小坑

- **付费插件**：`import { SplitText } from "gsap/SplitText"` 在新版 GSAP 中已免费（随 `gsap` 包一起发），
  但本项目没用它，已从 `useGsap.ts` 里移除，避免误导入。
- **邮箱拼写**：`mailto:hello mail_xmtx@163.com` 中间多了个空格，已改为 `mailto:mail_xmtx@163.com`。
- **未使用的导入**：`nuxt.config.ts` 里的 `import { provide } from "vue"` 是多余的，已删。

---

## 11. 扩展指南（快速上手）

- **想换强调色**：改 `main.css` 里 `:root` / `.dark` 的 `--accent*` 系列变量，
  以及 `@theme` 里的 `--color-primary-*`（Nuxt UI 语义色）。
- **想新增博客分类**：1) `content.config.ts` 的 `category` 枚举加一项；2) `app/utils/meta.ts` 的
  `BLOG_CATEGORIES` 加元数据；3) 建 `content/blog/<新分类>/` 目录。路由自动生效。
- **想新增项目分类**：同上，改 `PROJECT_CATEGORIES` 与 projects 集合枚举。
- **想改导航**：`SiteHeader.vue` 的 `links` 数组 + `RouteLoader.vue` 的 `PAGE_NAMES` 映射。
- **想加一个滚动入场动画**：包一层 `<Reveal variant="up">` 即可。
- **想加一个自定义 GSAP 动画**：参考 9.5 的三条规范，记得放进 `gsap.context` 并 `revert`。
- **想新增图标**：把图标名加进 `nuxt.config.ts` 的 `icon.clientBundle.icons` 列表。
