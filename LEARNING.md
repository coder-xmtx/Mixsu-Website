# Mixsu Studio — 项目学习文档

> 本文档面向想要阅读、修改、扩展本站的开发者，从「整个项目是怎么组织的」讲起，
> 逐步深入到页面、内容、设计系统与动效体系。建议配合源码逐节阅读。

---

## 1. 项目是什么

Mixsu Studio 是一个**个人数字工作室网站**：作品集 + 博客 + 个人介绍。

设计上的三条底线（来自 AGENTS.md）：

1. **拒绝后台模板感** —— 不用侧边栏 + 表格卡片的「管理系统」语言，允许打破常规。
2. **暗色优先** —— 默认深灰蓝底 + 柔和橙强调色，同时完整支持亮色模式。
3. **动效是叙事的一部分** —— 所有动画服务于阅读节奏，并尊重 `prefers-reduced-motion`。

---

## 2. 技术栈

| 领域 | 技术 | 说明 |
| ---- | ---- | ---- |
| 框架 | Nuxt 4.5（Vue 3 + TypeScript） | SSR 优先，`app/` 目录结构 |
| UI | Nuxt UI v4（@nuxt/ui） | 主要使用其主题体系与少量组件，页面组件多为自绘 |
| 动效 | GSAP 3.15 | ScrollTrigger / SplitText / Flip |
| 内容 | Nuxt Content v3 | Markdown / MDC 驱动，SQLite 本地数据库 |
| 样式 | Tailwind CSS v4 + CSS Variables | 主题色全部走语义 CSS 变量 |
| 状态 | Pinia | 已接入，目前页面内未重度使用 |
| 图标 | @nuxt/icon + @iconify-json/lucide | 本地打包，离线可用 |
| 包管理 | pnpm 11 | 见「常见问题」中 store 注意事项 |

---

## 3. 目录结构

```
Mixsu-Website-v2/
├── nuxt.config.ts          # Nuxt 配置：模块、SEO、图标、内容高亮、字体 provider 清理
├── content.config.ts       # 内容集合 schema（zod 校验 frontmatter）
├── pnpm-workspace.yaml     # pnpm 配置（allowBuilds）
├── .npmrc                  # pnpm store-dir 固定（本机环境需要）
├── content/
│   ├── projects/           # 项目内容（Markdown + frontmatter）
│   └── blog/
│       ├── life/           # 博客分类：生活
│       ├── javascript/     # 博客分类：JavaScript
│       └── blender/        # 博客分类：Blender
├── public/
│   ├── favicon.ico         # 网站 icon
│   ├── portrait.png        # 头像（900×900）
│   └── covers/*.svg        # 项目封面（脚本生成，见 scripts/）
├── scripts/
│   └── gen-covers.mjs      # 封面生成脚本（node scripts/gen-covers.mjs 重新生成）
└── app/                    # Nuxt 4 的应用根
    ├── app.vue             # 根组件：UApp + RouteLoader + NuxtLayout
    ├── app.config.ts       # Nuxt UI 语义色注册（primary = 自定义橙）
    ├── error.vue           # 404 / 错误页
    ├── assets/css/main.css # ★ 设计系统核心：主题变量、字体、工具类、正文排版
    ├── layouts/default.vue # 默认布局：氛围层 + 头部 + 内容 + 页脚
    ├── components/         # 全局组件（自动导入）
    │   ├── content/        # MDC 组件（Markdown 里用 ::note 等调用）
    │   ├── AppCursor.vue   # 自定义光标（桌面端）
    │   ├── GridLines.vue   # 流动网格背景
    │   ├── NoiseOverlay.vue# 胶片噪点
    │   ├── RouteLoader.vue # 全屏路由过渡
    │   ├── SiteHeader.vue  # 头部导航（含移动端全屏菜单）
    │   ├── SiteFooter.vue  # 页脚
    │   ├── ThemeToggle.vue # 暗/亮切换
    │   ├── ScrollProgress.vue # 顶部阅读进度条
    │   ├── Reveal.vue      # 滚动入场动画容器
    │   ├── Magnetic.vue    # 磁吸效果容器
    │   ├── Marquee.vue     # 无限跑马灯
    │   ├── SplitHeading.vue# 逐字揭开大标题
    │   ├── SectionHeading.vue # 区块标题（编号 + 提示词 + 大标题）
    │   ├── ArrowLink.vue   # 带箭头滑动的链接
    │   ├── ProjectCard.vue # 项目卡片
    │   ├── PostCard.vue    # 文章列表项
    │   └── CategoryCard.vue# 博客分类卡片
    ├── composables/
    │   ├── useGsap.ts      # GSAP 实例与插件注册（全站唯一注册点）
    │   └── useMediaQuery.ts# SSR 安全的媒体查询（pointer/reduced-motion）
    ├── utils/
    │   ├── meta.ts         # 分类元数据（博客/项目）与日期格式化
    │   └── content.ts      # Markdown AST 文本统计（阅读时长）
    └── pages/              # 路由页面（见下节）
```

---

## 4. 路由与页面

| 路由 | 文件 | 内容 |
| ---- | ---- | ---- |
| `/` | `pages/index.vue` | 首页：Hero（MIXSU STUDIO）、跑马灯、Manifesto 滚动叙事、精选作品、最新文章、联系 CTA |
| `/projects` | `pages/projects/index.vue` | 作品列表：分类筛选（GSAP Flip 过渡） |
| `/projects/:slug` | `pages/projects/[slug].vue` | 项目详情：ContentRenderer 渲染 + 同类作品推荐 |
| `/blog` | `pages/blog/index.vue` | 博客首页：分类卡片 + 置顶文章 |
| `/blog/:category` | `pages/blog/[category]/index.vue` | 分类文章列表 |
| `/blog/:category/:slug` | `pages/blog/[category]/[slug].vue` | 文章详情：正文 + 阅读时长 + 相关文章 |
| `/about` | `pages/about.vue` | 关于：简介、技能、时间线、联系 CTA |
| 任意不存在路径 | `app/error.vue` | 404 页 |

### 页面数据获取模式

所有内容查询统一使用 Nuxt Content v3 的类型安全查询 + `useAsyncData`：

```ts
const { data: projects } = await useAsyncData("projects-all", () =>
  queryCollection("projects")
    .order("date", "DESC")
    .select("title", "description", "date", "category", "tags", "cover", "path")
    .all(),
);
```

详情页用 `.path(route.path).first()` 匹配，找不到时 `throw createError({ statusCode: 404 })`。

---

## 5. 内容体系（Nuxt Content）

### 5.1 集合定义（content.config.ts）

两个集合：`projects` 与 `blog`，schema 用 zod 校验 frontmatter。
写错字段类型会在构建/查询时报错（类型安全）。

### 5.2 新增一篇博客

1. 在 `content/blog/<分类>/` 下新建 `xxx.md`
2. 写 frontmatter：

```md
---
title: 文章标题
description: 一句话摘要（列表页与 SEO 使用）
date: 2026-08-29
category: javascript        # life | javascript | blender
tags:
  - Nuxt
pinned: false               # true 会出现在博客首页「置顶文章」
---
```

3. 正文用 Markdown，可直接使用 MDC 组件（见下）

### 5.3 新增一个项目

在 `content/projects/` 下新建 `xxx.md`：

```md
---
title: 项目名
description: 项目摘要
date: 2026-08-29
category: dev               # video | blender | dev
tags:
  - Vue
cover: /covers/xxx.svg     # 封面图路径（可选）
featured: true             # true 会出现在首页「精选作品」
role: 独立制作
links:
  - label: 源码
    url: https://github.com/...
---
```

新增封面：参考 `scripts/gen-covers.mjs`，按自己的配置加一条记录后 `node scripts/gen-covers.mjs`。

### 5.4 MDC 组件

`app/components/content/` 下的组件可在 Markdown 中直接使用：

```md
::note
普通提示（信息蓝橙风格，本站为橙边）
::

::tip
技巧提示（橙色底）
::

::warning
警告（红色）
::
```

组件内用 `<slot mdc-unwrap="p" />` 去掉 Markdown 包裹的 `<p>`。

### 5.5 代码高亮

配置在 `nuxt.config.ts` 的 `content.build.markdown.highlight`：

```ts
highlight: {
  theme: { default: "github-light", dark: "github-dark" },  // 注意是 theme（单数）！
  langs: ["ts", "js", "vue", "bash", "json", "css", "html", "md"],
}
```

> 坑：`themes`（复数）会直接让 mdc 模板编译失败，报 `NUXT_B1001 Could not compile template mdc-highlighter.mjs`。

---

## 6. 设计系统

### 6.1 主题变量（app/assets/css/main.css）

所有颜色都是语义变量，`main.css` 里 `:root`（亮色）与 `.dark`（暗色）各定义一份：

| 变量 | 用途 |
| ---- | ---- |
| `--bg` / `--bg-soft` | 页面背景 / 页脚等次级背景 |
| `--surface` / `--elevated` | 卡片 / 悬浮层 |
| `--line` / `--line-soft` | 边框、分隔线 |
| `--text` / `--muted` / `--faint` | 正文 / 次级文字 / 弱化文字 |
| `--accent` / `--accent-strong` / `--accent-soft` | 强调橙 / 深橙 / 橙色淡底 |
| `--accent-glow` | 橙色光晕（按钮 hover 阴影等） |
| `--selection` / `--noise-opacity` | 选中色 / 噪点透明度 |

`@theme inline` 把变量映射为 Tailwind 工具类：`bg-bg`、`text-text`、`text-muted`、`border-line`、`text-accent`、`bg-surface` 等。

### 6.2 字体

**全站使用系统字体栈，无外部字体请求**（当前构建环境无法访问 Google Fonts CDN）：

- `--font-display`：大标题（现代黑体，靠字重 + 字距做设计感）
- `--font-sans`：正文
- `--font-hand`：斜体衬线（仅 CSS 类保留，页面中已不再使用）
- `--font-mono`：等宽（编号、标签、代码）

### 6.3 手工感细节

- `NoiseOverlay`：全屏 SVG 噪点（透明度约 5%）
- `GridLines`：两层错位网格缓慢反向漂移（CSS animation），径向蒙版淡出
- 自定义光标：`AppCursor`，仅桌面精确指针设备启用（`(pointer: fine)`）

---

## 7. 动效体系（GSAP）

### 7.1 统一入口

`app/composables/useGsap.ts` 是**唯一**注册插件的地方（ScrollTrigger / SplitText / Flip），并设置了全站统一的默认时长与缓动：

```ts
gsap.defaults({ duration: 0.9, ease: "power3.out" });
```

组件中直接 `import { gsap } from "gsap"`（Nuxt 会自动从依赖解析）。

### 7.2 组件内动画规范（重要）

所有组件内的 GSAP 代码必须：

1. 在 `onMounted` 中创建（此时 DOM 才存在）；
2. 用 `gsap.context(() => {...}, rootEl)` 包裹，选择器自动限定在组件内；
3. 在 `onUnmounted` 里 `ctx.revert()` 清理（tween 与 ScrollTrigger 一起销毁）。

```ts
onMounted(() => {
  const root = el.value;
  if (!root) return;
  const ctx = gsap.context(() => {
    gsap.from(".item", { autoAlpha: 0, y: 40, stagger: 0.1 });
  }, root);
  onUnmounted(() => ctx.revert());
});
```

### 7.3 组件级动效清单

| 组件 | 动效 | 说明 |
| ---- | ---- | ---- |
| `SplitHeading` | 逐字从下方升起（含旋转回正） | 每个字包在 `overflow-hidden` 里形成遮罩 |
| `Reveal` | 滚动入场（up/fade/left/right/zoom/clip） | ScrollTrigger + `once: true` |
| `Marquee` | 无限匀速平移，悬停暂停 | `xPercent` + `repeat: -1` |
| `Magnetic` | 元素向光标磁吸偏移 | `gsap.quickTo` |
| `ScrollProgress` | 顶部进度条 | ScrollTrigger `scrub` |
| `RouteLoader` | 全屏路由过渡 | 见 7.5 |
| `SiteFooter` 大字 | 随滚动淡入上移 | ScrollTrigger `scrub` |
| 首页 Hero | 入场时间线 | 见 `pages/index.vue` |
| 首页 Manifesto | 逐行点亮 | ScrollTrigger `scrub: 1` |

### 7.4 滚动叙事（ScrollTrigger）模式

**Scrub 型**（进度跟随滚动）——Manifesto 逐行点亮：

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

**入场型**——`Reveal` 组件默认：

```ts
gsap.from(target, {
  autoAlpha: 0, y: 48,
  scrollTrigger: { trigger: target, start: "top 85%", toggleActions: "play none none none" },
});
```

### 7.5 全屏路由过渡（RouteLoader）

`app/components/RouteLoader.vue` 实现「加载页」式过渡：

1. `router.beforeEach`：目标路由名写入 overlay → GSAP 时间线把 overlay 从底部滑入（`yPercent 100 → 0`），同时进度线 `scaleX 0 → 1`；
2. 滑入动画完成后放行导航（`return true`），新页面在 overlay 之下切换；
3. `router.afterEach`：overlay 从底部滑出（`yPercent 0 → 100`），露出新页面。

细节：
- 首次加载与相同路由不触发；
- `prefers-reduced-motion` 时直接跳过（立即放行、立即隐藏）；
- 页面级 CSS 过渡（`main.css` 的 `.page-*` 类）保留，与 overlay 叠加但被遮挡，视觉上只剩 overlay。

### 7.6 无障碍与降级

- 所有动画尊重 `prefers-reduced-motion`（`usePrefersReducedMotion` 判断，跳过动画）；
- 自定义光标、磁吸仅在 `(pointer: fine)` 设备生效；
- 动画全部为增强，关闭后页面内容完整可用。

---

## 8. 主题切换与固定标签页标题

- 暗/亮切换：`ThemeToggle.vue` 调用 `useColorMode()`，默认暗色（`nuxt.config.ts` 的 `colorMode.preference`）。
- 浏览器标签页标题：固定在 `nuxt.config.ts` 的 `app.head.title`（"Mixsu Studio — 个人工作室"）。各页面 `useSeoMeta` **只设置 description，不设置 title**，所以标签页不会随内容变化。

---

## 9. 开发 / 构建命令

```bash
pnpm install            # 安装依赖（注意 .npmrc 的 store-dir，见常见问题）
pnpm nuxt prepare       # 生成类型（改配置/集合后必跑）
pnpm nuxt dev --port 3000   # 开发服务器
pnpm nuxi typecheck     # 类型检查
pnpm nuxt build         # 生产构建（SSR）
pnpm nuxt generate      # 静态生成（纯静态托管）
node scripts/gen-covers.mjs  # 重新生成项目封面 SVG
```

---

## 10. 常见问题（本机环境实测）

1. **pnpm 报 `ERR_PNPM_UNEXPECTED_STORE` / 无法打开 store 数据库**
   本机 pnpm 11 的项目级 store 位于 `D:\program\Project_Development\Mixsu-Website-v2\.pnpm-store\v11`，
   而 node_modules 由旧 store 链接。`.npmrc` 已固定 `store-dir=D:\.pnpm-store\v11`（旧全局 store）。
   若换机器，删除 `.npmrc` 里的 store-dir 让 pnpm 自选即可。

2. **`shiki` 在项目根无法解析（mdc-highlighter 模板编译失败）**
   `shiki` 与 `@shikijs/langs` 已作为 devDependencies 显式安装（pnpm 严格模式下传递依赖不可见）。

3. **`@nuxt/fonts` 反复请求 fonts.google.com 失败**
   当前网络无法访问 Google Fonts。本站已完全使用系统字体栈，并在 `nuxt.config.ts` 的
   `hooks["fonts:providers"]` 中移除 google/googleicons 等远程 provider，避免启动时反复重试。
   注意 `@nuxt/ui` 自带 `@nuxt/fonts`，不能只从 modules 里删，必须用上述 hook 清理。

4. **图标不显示**
   `@nuxt/icon` 默认从 Iconify API 运行时加载图标；本项目已安装 `@iconify-json/lucide`
   并在 `nuxt.config.ts` 的 `icon.clientBundle.icons` 中声明用到的图标，本地打包、离线可用。
   新增图标时记得把图标名加进该列表。

5. **Nuxt Content 代码高亮 `theme` 与 `themes`**
   配置键是 `theme`（单数）。写成 `themes` 会报 `NUXT_B1001 Could not compile template mdc-highlighter.mjs`。

6. **在受限沙箱环境运行 dev/build**
   Nitro 服务器会以管道 stdio 启动子进程，受限权限下报 `spawn EPERM`，需要以完整权限运行
   `pnpm nuxt dev` / `pnpm nuxt build`（日常开发不受影响）。

---

## 11. 扩展指南（快速上手）

- **想换强调色**：改 `main.css` 里 `:root` / `.dark` 的 `--accent*` 系列变量（亮色暗色各一套），以及 `@theme` 里的 `--color-primary-*`（Nuxt UI 语义色）。
- **想新增博客分类**：1) `content.config.ts` 的 `category` 枚举加一项；2) `app/utils/meta.ts` 的 `BLOG_CATEGORIES` 加元数据（label/en/icon/description）；3) 建 `content/blog/<新分类>/` 目录。路由自动生效。
- **想新增项目分类**：同上，改 `PROJECT_CATEGORIES` 与 projects 集合枚举。
- **想改导航**：`SiteHeader.vue` 的 `links` 数组 + `RouteLoader.vue` 的 `PAGE_NAMES` 映射（过渡页要显示名字）。
- **想加一个滚动入场动画**：包一层 `<Reveal variant="up">` 即可。
- **想加一个自定义 GSAP 动画**：参考 7.2 的三条规范。
