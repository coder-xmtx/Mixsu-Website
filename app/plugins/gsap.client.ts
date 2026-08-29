import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

/**
 * 全站唯一、必定会执行的 GSAP 插件注册点（client-only）。
 * 之前注册逻辑放在 composables/useGsap.ts 里，但该文件从未被 import，
 * 导致 ScrollTrigger / Flip 一直没注册，所有 scrollTrigger 动画都失效。
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, Flip);
});
