import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

/**
 * 全站 GSAP 访问点。
 * 插件的正式注册统一在 app/plugins/gsap.client.ts 里完成；
 * 这里只负责提供类型友好的访问入口，组件内用 gsap.context() 包裹动画
 * 并在 onUnmounted 时 revert。
 */
export function useGsap() {
  return { gsap, ScrollTrigger, Flip };
}

export type UseGsapReturn = ReturnType<typeof useGsap>;
