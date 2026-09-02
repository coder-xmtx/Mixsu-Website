/**
 * 一次性脚本：为博客文章与分类生成 16:9（1280×720）的凌厉风 SVG 封面。
 * 用法: node scripts/gen-blog-covers.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1280;
const H = 720;

/**
 * 斜切风封面模板：
 * 深色渐变底 + 斜向大色带 + 细网格 + 巨型字符 + 四角刻度 + 底部标签条
 */
const COVERS = [
  {
    id: "blog-cat-life",
    bg: ["#141a16", "#1a231d", "#223025"],
    accent: "#f0a35e",
    accent2: "#8fc7a5",
    glyph: "生",
    glyphLatin: "LIFE",
    label: "LIFE · 生活随笔",
    pattern: "bands",
  },
  {
    id: "blog-cat-javascript",
    bg: ["#11161f", "#182030", "#212c42"],
    accent: "#f0a35e",
    accent2: "#7fd6c2",
    glyph: "代",
    glyphLatin: "JS",
    label: "JAVASCRIPT · 技术笔记",
    pattern: "bands",
  },
  {
    id: "blog-cat-blender",
    bg: ["#15131a", "#1e1a28", "#2a2338"],
    accent: "#f0a35e",
    accent2: "#9b7fd6",
    glyph: "渲",
    glyphLatin: "3D",
    label: "BLENDER · 3D 创作",
    pattern: "wire",
  },
  {
    id: "blog-my-desk",
    bg: ["#141a16", "#1a231d", "#223025"],
    accent: "#f0a35e",
    accent2: "#8fc7a5",
    glyph: "桌",
    glyphLatin: "DESK",
    label: "LIFE · 我的桌面",
    pattern: "bands",
  },
  {
    id: "blog-gsap-scroll",
    bg: ["#11161f", "#182030", "#212c42"],
    accent: "#f0a35e",
    accent2: "#7fd6c2",
    glyph: "滚",
    glyphLatin: "SCROLL",
    label: "JAVASCRIPT · GSAP SCROLLTRIGGER",
    pattern: "scroll",
  },
  {
    id: "blog-nuxt4",
    bg: ["#10141b", "#151c28", "#1f2838"],
    accent: "#f0a35e",
    accent2: "#7fd6c2",
    glyph: "N",
    glyphLatin: "NUXT·4",
    label: "JAVASCRIPT · NUXT CONTENT",
    pattern: "browser",
  },
  {
    id: "blog-golden-hour",
    bg: ["#1b1410", "#261a12", "#332214"],
    accent: "#f0a35e",
    accent2: "#f7c878",
    glyph: "光",
    glyphLatin: "LIGHT",
    label: "BLENDER · GOLDEN HOUR",
    pattern: "sun",
  },
];

function gridPattern() {
  return `<defs>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="skewX(-8)">
      <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(255,255,255,0.055)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>`;
}

function noise() {
  return `<defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.055"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" filter="url(#noise)"/>`;
}

function vignette() {
  return `<defs>
    <radialGradient id="vig" cx="50%" cy="45%" r="80%">
      <stop offset="55%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.6)"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>`;
}

function cornerMarks() {
  const m = (x, y) =>
    `<path d="M ${x} ${y} v 34 M ${x} ${y} h 34" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="2.5"/>`;
  return `${m(30, 30)}${m(W - 30, 30)}${m(30, H - 30)}${m(W - 30, H - 30)}`;
}

/** 斜向大色带 */
function slantBands(c) {
  const bands = [
    { x: 520, w: 90, o: 0.16 },
    { x: 660, w: 40, o: 0.34 },
    { x: 900, w: 180, o: 0.08 },
  ];
  return `<g transform="skewX(-14)">
    ${bands
      .map(
        (b) =>
          `<rect x="${b.x}" y="-80" width="${b.w}" height="${H + 160}" fill="${c.accent}" opacity="${b.o}"/>`,
      )
      .join("")}
    <rect x="1010" y="-80" width="14" height="${H + 160}" fill="${c.accent2}" opacity="0.5"/>
  </g>`;
}

/** 大字符 + 英文小字 */
function glyphBlock(c) {
  return `<g>
    <text x="${W - 260}" y="${H - 180}" font-family="'Arial Black','Microsoft YaHei','PingFang SC',sans-serif" font-weight="900" font-size="300" fill="${c.accent}" opacity="0.92" text-anchor="middle" dominant-baseline="middle">${c.glyph}</text>
    <text x="${W - 260}" y="${H - 60}" font-family="'Courier New',monospace" font-size="34" letter-spacing="14" fill="rgba(255,255,255,0.8)" text-anchor="middle">${c.glyphLatin}</text>
  </g>`;
}

/** 底部标签条（斜切） */
function labelBar(c) {
  return `<g>
    <path d="M 0 ${H - 96} L 470 ${H - 96} L 540 ${H - 18} L 0 ${H - 18} Z" fill="rgba(8,10,16,0.88)"/>
    <path d="M 540 ${H - 18} H 470" stroke="${c.accent}" stroke-width="3"/>
    <text x="36" y="${H - 48}" font-family="'Courier New',monospace" font-size="22" letter-spacing="6" fill="${c.accent2}">${c.label}</text>
  </g>`;
}

/* ---------------------------- 图案 ---------------------------- */

function patternWire(c) {
  return `<g fill="none" stroke-width="2">
    <ellipse cx="250" cy="330" rx="180" ry="240" stroke="${c.accent2}" opacity="0.5" transform="rotate(-8 250 330)"/>
    <ellipse cx="250" cy="330" rx="120" ry="170" stroke="${c.accent2}" opacity="0.3" transform="rotate(-8 250 330)"/>
    <path d="M 70 330 H 430 M 250 90 V 570" stroke="rgba(255,255,255,0.16)"/>
    <circle cx="250" cy="230" r="70" stroke="${c.accent}" opacity="0.6"/>
    <path d="M 250 300 V 380 M 250 380 L 190 470 M 250 380 L 312 466" stroke="${c.accent}" opacity="0.5"/>
  </g>`;
}

function patternScroll(c) {
  return `<g>
    <path d="M 120 640 C 60 520 240 470 180 330 C 140 230 30 250 60 120" fill="none" stroke="${c.accent}" stroke-width="4" opacity="0.85"/>
    <path d="M 120 640 C 60 520 240 470 180 330 C 140 230 30 250 60 120" fill="none" stroke="transparent"/>
    ${Array.from({ length: 9 }, (_, i) => {
      const x = 90 + i * 46;
      const y = 620 - i * 58;
      return `<rect x="${x}" y="${y}" width="30" height="10" fill="${i % 2 ? c.accent2 : c.accent}" opacity="${0.85 - i * 0.07}" transform="rotate(-18 ${x} ${y})"/>`;
    }).join("")}
  </g>`;
}

function patternBrowser(c) {
  return `<g>
    <rect x="120" y="180" width="440" height="320" fill="rgba(10,14,22,0.85)" stroke="${c.accent}" stroke-width="2.5"/>
    <path d="M 120 180 L 168 180 L 120 228 Z" fill="${c.accent2}" opacity="0.8"/>
    <line x1="140" y1="252" x2="540" y2="252" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <rect x="160" y="292" width="160" height="16" fill="${c.accent}" opacity="0.75"/>
    <rect x="160" y="330" width="240" height="10" fill="rgba(255,255,255,0.22)"/>
    <rect x="160" y="356" width="190" height="10" fill="rgba(255,255,255,0.16)"/>
    <rect x="160" y="382" width="220" height="10" fill="rgba(255,255,255,0.16)"/>
    <rect x="380" y="292" width="140" height="100" fill="none" stroke="${c.accent2}" stroke-width="2" opacity="0.75"/>
    <path d="M 380 292 L 420 292 L 380 332 Z" fill="${c.accent2}" opacity="0.5"/>
  </g>`;
}

function patternSun(c) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6 - Math.PI / 2;
    const x1 = 250 + Math.cos(a) * 120;
    const y1 = 320 + Math.sin(a) * 120;
    const x2 = 250 + Math.cos(a) * 190;
    const y2 = 320 + Math.sin(a) * 190;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c.accent2}" stroke-width="3" opacity="${0.25 + (i % 3) * 0.2}"/>`;
  }).join("");
  return `<g>
    ${rays}
    <circle cx="250" cy="320" r="95" fill="none" stroke="${c.accent}" stroke-width="3.5" opacity="0.85"/>
    <path d="M 0 560 L 900 560 L 940 600 L 0 600 Z" fill="rgba(8,10,16,0.9)"/>
    <g fill="${c.accent}" opacity="0.6">
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${60 + i * 86}" y="572" width="4" height="${12 + ((i * 37) % 22)}"/>`).join("")}
    </g>
  </g>`;
}

const patternFns = {
  bands: slantBands,
  wire: patternWire,
  scroll: patternScroll,
  browser: patternBrowser,
  sun: patternSun,
};

mkdirSync("public/covers", { recursive: true });

for (const c of COVERS) {
  const [c1, c2, c3] = c.bg;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${gridPattern()}
  ${patternFns[c.pattern](c)}
  ${glyphBlock(c)}
  ${cornerMarks()}
  ${labelBar(c)}
  ${noise()}
  ${vignette()}
</svg>
`;
  writeFileSync(`public/covers/${c.id}.svg`, svg);
  console.log("generated", c.id);
}

console.log("done");
