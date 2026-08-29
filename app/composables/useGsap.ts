import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

// 注册全站通用的 GSAP 插件（仅一次）
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

// 统一的时间节奏：入场 0.9s / 过渡 0.5s
gsap.defaults({
  duration: 0.9,
  ease: "power3.out",
});

/**
 * 全站 GSAP 访问点。
 * 组件内使用 gsap.context() 包裹动画并在 onUnmounted 时 revert。
 */
export function useGsap() {
  return { gsap, ScrollTrigger, SplitText, Flip };
}

export type UseGsapReturn = ReturnType<typeof useGsap>;
