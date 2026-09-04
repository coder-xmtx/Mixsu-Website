<script setup lang="ts">
/**
 * 四周流动文字框（作品集页专用）：
 * 视口四边各有一条循环滚动的文字轨（上下横向、左右竖向），
 * 滚动越快文字流得越快、越亮；停下时缓慢漂移。
 * 纯装饰层，pointer-events-none，仅 md+ 显示。
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TEXT =
  "MIXSU STUDIO · SELECTED WORKS · CUT / EDIT / RENDER / SHIP · KEEP CREATING · ";

const root = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

onMounted(() => {
  const el = root.value;
  if (!el || usePrefersReducedMotion().value) return;

  const state = { ts: 0.6, op: 0.15 };

  ctx = gsap.context(() => {
    const tweens: Array<gsap.core.Tween & { __dir?: number }> = [];

    el.querySelectorAll<HTMLElement>("[data-edge-track]").forEach((track) => {
      const horizontal = track.dataset.edge !== "v";
      const dir = Number(track.dataset.dir ?? 1);
      const tween = gsap.fromTo(
        track,
        horizontal ? { xPercent: 0 } : { yPercent: 0 },
        {
          ...(horizontal ? { xPercent: -50 } : { yPercent: -50 }),
          duration: 40,
          ease: "none",
          repeat: -1,
        },
      ) as gsap.core.Tween & { __dir?: number };
      tween.__dir = dir;
      tweens.push(tween);
    });

    // 滚动速度驱动文字流速与亮度
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const v = Math.abs(self.getVelocity());
        const targetTs = 0.6 + Math.min(v / 450, 8);
        const targetOp = 0.15 + Math.min(v / 1100, 0.75);
        state.ts += (targetTs - state.ts) * 0.1;
        state.op += (targetOp - state.op) * 0.1;

        for (const t of tweens) t.timeScale(state.ts * (t.__dir ?? 1));
        gsap.set(el, { opacity: state.op });
      },
    });
  }, el);

  onUnmounted(() => ctx?.revert());
});
</script>

<template>
  <div ref="root" class="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden opacity-15 md:block" aria-hidden="true">
    <!-- 上轨 -->
    <div class="absolute inset-x-0 top-14 border-b border-line-soft/60 py-1">
      <div data-edge-track data-dir="1" class="flex w-max whitespace-nowrap font-mono text-[10px] tracking-[0.35em] text-faint">
        <span v-for="i in 2" :key="i" class="pr-8">{{ TEXT }}{{ TEXT }}</span>
      </div>
    </div>
    <!-- 下轨（反向） -->
    <div class="absolute inset-x-0 bottom-14 border-t border-line-soft/60 py-1">
      <div data-edge-track data-dir="-1" class="flex w-max whitespace-nowrap font-mono text-[10px] tracking-[0.35em] text-faint">
        <span v-for="i in 2" :key="i" class="pr-8">{{ TEXT }}{{ TEXT }}</span>
      </div>
    </div>
    <!-- 左轨（竖向） -->
    <div class="absolute inset-y-0 left-6 border-r border-line-soft/60 px-1">
      <div data-edge-track data-edge="v" data-dir="1" class="flex w-max flex-col whitespace-nowrap font-mono text-[10px] tracking-[0.35em] text-faint" style="writing-mode: vertical-rl">
        <span v-for="i in 2" :key="i" class="pb-8">{{ TEXT }}</span>
      </div>
    </div>
    <!-- 右轨（竖向，反向） -->
    <div class="absolute inset-y-0 right-6 border-l border-line-soft/60 px-1">
      <div data-edge-track data-edge="v" data-dir="-1" class="flex w-max flex-col whitespace-nowrap font-mono text-[10px] tracking-[0.35em] text-faint" style="writing-mode: vertical-rl">
        <span v-for="i in 2" :key="i" class="pb-8">{{ TEXT }}</span>
      </div>
    </div>
  </div>
</template>
