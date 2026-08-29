/**
 * 遍历 Nuxt Content 文档 AST，统计可见文本长度（用于估算阅读时长）。
 */
type ContentNode = {
  type?: string;
  value?: string;
  children?: ContentNode[];
  [key: string]: unknown;
} | string | ContentNode[] | null | undefined;

export function markdownTextLength(node: ContentNode): number {
  if (!node) return 0;
  if (typeof node === "string") return node.length;
  if (Array.isArray(node)) return node.reduce((sum, child) => sum + markdownTextLength(child), 0);
  if (node.type === "text") return (node.value ?? "").length;
  return markdownTextLength(node.children);
}

/**
 * 估算中文阅读时长（约 400 字/分钟，至少 1 分钟）。
 */
export function estimateReadingMinutes(node: ContentNode): number {
  return Math.max(1, Math.round(markdownTextLength(node) / 400));
}
