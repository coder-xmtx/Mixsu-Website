/**
 * SSR 安全的媒体查询监听。
 * 服务端渲染时返回默认值，客户端挂载后跟随查询变化。
 */
export function useMediaQuery(query: string, initial = false) {
  const matches = ref(initial);

  if (import.meta.client) {
    const mql = window.matchMedia(query);
    matches.value = mql.matches;

    const onChange = (e: MediaQueryListEvent) => {
      matches.value = e.matches;
    };
    mql.addEventListener("change", onChange);
    onUnmounted(() => mql.removeEventListener("change", onChange));
  }

  return matches;
}

/** 是否为精确指针设备（桌面端） */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine)", false);
}

/** 用户是否偏好减少动效 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}
