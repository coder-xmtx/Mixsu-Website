/**
 * 博客分类元数据
 */
export const BLOG_CATEGORIES = {
  life: {
    label: "生活",
    en: "Life",
    icon: "lucide:coffee",
    description: "随笔、年度回顾、工作台——关于生活的一切碎碎念。",
  },
  javascript: {
    label: "JavaScript",
    en: "JavaScript",
    icon: "lucide:code-2",
    description: "Nuxt、Vue、GSAP 与前端工程化的实践笔记。",
  },
  blender: {
    label: "Blender",
    en: "Blender",
    icon: "lucide:box",
    description: "建模、灯光、几何节点——3D 创作路上的坑与心得。",
  },
} as const;

export type BlogCategory = keyof typeof BLOG_CATEGORIES;

/**
 * 项目分类元数据
 */
export const PROJECT_CATEGORIES = {
  video: { label: "剪辑", en: "Video", icon: "lucide:clapperboard" },
  blender: { label: "Blender", en: "Blender", icon: "lucide:box" },
  dev: { label: "开发", en: "Dev", icon: "lucide:terminal" },
} as const;

export type ProjectCategory = keyof typeof PROJECT_CATEGORIES;

/**
 * 日期格式化：2026-01-18
 */
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
