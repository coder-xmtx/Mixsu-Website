/**
 * 一次性脚本：为项目生成风格统一的 SVG 封面。
 * 用法: node scripts/gen-covers.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const COVERS = [
  {
    id: "aurora-city",
    bg: ["#0d1420", "#101c2e", "#1b2f45"],
    accent: "#7fd6c2",
    accent2: "#f0a35e",
    glyph: "A",
    title: "AURORA CITY",
    pattern: "aurora",
  },
  {
    id: "pov-slice",
    bg: ["#150f12", "#251419", "#3a1c1f"],
    accent: "#f0785e",
    accent2: "#f0a35e",
    glyph: "▶",
    title: "POV · SLICE",
    pattern: "film",
  },
  {
    id: "mixsu-site",
    bg: ["#10141b", "#151c28", "#1f2838"],
    accent: "#f0a35e",
    accent2: "#7fd6c2",
    glyph: "</>",
    title: "MIXSU STUDIO",
    pattern: "browser",
  },
  {
    id: "motion-cards",
    bg: ["#0f141c", "#141d2a", "#1c2a3d"],
    accent: "#e9a35b",
    accent2: "#9b7fd6",
    glyph: "◧",
    title: "MOTION CARDS",
    pattern: "cards",
  },
  {
    id: "ember-short",
    bg: ["#170f0b", "#241408", "#331a0a"],
    accent: "#f0a35e",
    accent2: "#f7c878",
    glyph: "E",
    title: "EMBER",
    pattern: "ember",
  },
  {
    id: "sculpt-study",
    bg: ["#0e1116", "#141922", "#1b222e"],
    accent: "#9fb4c8",
    accent2: "#f0a35e",
    glyph: "S",
    title: "SCULPT STUDY",
    pattern: "wire",
  },
];

const W = 900;
const H = 600;

function gridPattern(step = 60, color = "rgba(255,255,255,0.05)") {
  return `<defs>
    <pattern id="grid" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${color}" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>`;
}

function noise() {
  return `<defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" filter="url(#noise)"/>`;
}

function vignette() {
  return `<defs>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="55%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>`;
}

function glyphBlock(glyph, accent, x = 640, y = 320, size = 190) {
  return `<text x="${x}" y="${y}" font-family="'Arial Black', 'Helvetica Neue', sans-serif" font-weight="900" font-size="${size}" fill="${accent}" opacity="0.9" text-anchor="middle" dominant-baseline="middle">${glyph}</text>`;
}

function titleBlock(title, x = 56, y = H - 64) {
  return `<text x="${x}" y="${y}" font-family="'Courier New', monospace" font-size="22" letter-spacing="10" fill="rgba(255,255,255,0.75)">${title}</text>`;
}

function cornerMarks() {
  const m = (x, y) =>
    `<path d="M ${x} ${y} v 26 M ${x} ${y} h 26" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>`;
  return `${m(32, 32)}${m(W - 32, 32)}${m(32, H - 32)}${m(W - 32, H - 32)}`;
}

function patternAurora(c) {
  return `<g opacity="0.85">
    <path d="M -50 420 C 180 300, 320 500, 520 360 S 820 240, 980 320" fill="none" stroke="${c.accent}" stroke-width="3" opacity="0.8"/>
    <path d="M -50 470 C 200 360, 340 540, 560 400 S 840 300, 980 380" fill="none" stroke="${c.accent}" stroke-width="1.6" opacity="0.5"/>
    <path d="M -50 520 C 240 430, 400 580, 600 450 S 860 360, 980 440" fill="none" stroke="${c.accent2}" stroke-width="1.2" opacity="0.45"/>
    <path d="M 0 560 L 180 560 L 210 520 L 340 520 L 380 560 L 900 560" fill="rgba(10,16,26,0.9)"/>
    <path d="M 0 560 L 180 560 L 210 520 L 340 520 L 380 560 L 900 560 L 900 600 L 0 600 Z" fill="rgba(8,12,20,0.95)"/>
    <g fill="${c.accent}" opacity="0.55">
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${60 + i * 96}" y="568" width="3" height="${10 + ((i * 37) % 26)}"/>`).join("")}
    </g>
  </g>`;
}

function patternFilm(c) {
  return `<g>
    <rect x="90" y="140" width="300" height="320" rx="8" fill="rgba(0,0,0,0.55)" stroke="${c.accent}" stroke-width="2" opacity="0.9"/>
    <rect x="130" y="182" width="220" height="150" rx="4" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
    <g fill="${c.accent2}">
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${110 + i * 24}" y="352" width="16" height="34" rx="2"/>`).join("")}
    </g>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${460 + i * 30}" y="${120 + ((i * 53) % 360)}" width="12" height="20" rx="2" fill="${c.accent}" opacity="0.5"/>`).join("")}
  </g>`;
}

function patternBrowser(c) {
  return `<g>
    <rect x="110" y="150" width="420" height="300" rx="10" fill="rgba(10,14,22,0.85)" stroke="${c.accent}" stroke-width="2"/>
    <circle cx="140" cy="184" r="6" fill="#f0785e"/><circle cx="164" cy="184" r="6" fill="#f0c05e"/><circle cx="188" cy="184" r="6" fill="#7fd6a2"/>
    <line x1="120" y1="208" x2="520" y2="208" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
    <rect x="140" y="240" width="150" height="14" rx="7" fill="${c.accent}" opacity="0.7"/>
    <rect x="140" y="274" width="220" height="8" rx="4" fill="rgba(255,255,255,0.22)"/>
    <rect x="140" y="294" width="180" height="8" rx="4" fill="rgba(255,255,255,0.16)"/>
    <rect x="140" y="314" width="200" height="8" rx="4" fill="rgba(255,255,255,0.16)"/>
    <rect x="380" y="240" width="110" height="84" rx="8" fill="none" stroke="${c.accent2}" stroke-width="1.5" opacity="0.7"/>
  </g>`;
}

function patternCards(c) {
  const cards = [
    { x: 300, y: 150, r: -6 },
    { x: 360, y: 170, r: 4 },
    { x: 420, y: 150, r: -2 },
    { x: 480, y: 190, r: 7 },
  ];
  return `<g>
    ${cards.map((card, i) => `
      <g transform="rotate(${card.r} ${card.x + 55} ${card.y + 70})">
        <rect x="${card.x}" y="${card.y}" width="110" height="140" rx="10" fill="rgba(12,17,25,0.92)" stroke="${i === 1 ? c.accent : "rgba(255,255,255,0.28)"}" stroke-width="1.6"/>
        <rect x="${card.x + 14}" y="${card.y + 16}" width="82" height="54" rx="6" fill="${i === 1 ? c.accent : c.accent2}" opacity="0.55"/>
        <rect x="${card.x + 14}" y="${card.y + 86}" width="58" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="${card.x + 14}" y="${card.y + 102}" width="40" height="8" rx="4" fill="rgba(255,255,255,0.16)"/>
      </g>`).join("")}
  </g>`;
}

function patternEmber(c) {
  const dots = Array.from({ length: 42 }, (_, i) => {
    const x = 120 + ((i * 173) % 660);
    const y = 90 + ((i * 97) % 420);
    const r = 1.5 + ((i * 13) % 3);
    const op = 0.25 + ((i * 7) % 5) * 0.12;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 === 0 ? c.accent2 : c.accent}" opacity="${op.toFixed(2)}"/>`;
  }).join("");
  return `<g>${dots}
    <path d="M 640 430 C 660 360, 720 340, 700 260" fill="none" stroke="${c.accent}" stroke-width="2.5" opacity="0.85"/>
    <path d="M 700 260 C 692 230, 706 210, 690 180" fill="none" stroke="${c.accent2}" stroke-width="1.6" opacity="0.8"/>
  </g>`;
}

function patternWire(c) {
  return `<g fill="none" stroke-width="1.4">
    <ellipse cx="600" cy="280" rx="130" ry="170" stroke="${c.accent}" opacity="0.55"/>
    <ellipse cx="600" cy="280" rx="92" ry="120" stroke="${c.accent}" opacity="0.35"/>
    <path d="M 470 280 H 730 M 560 118 L 560 442 M 640 118 L 640 442" stroke="rgba(255,255,255,0.22)"/>
    <circle cx="600" cy="180" r="58" stroke="${c.accent2}" opacity="0.7"/>
    <path d="M 600 238 V 320 M 600 320 L 556 392 M 600 320 L 648 388" stroke="${c.accent}" opacity="0.6"/>
  </g>`;
}

const patternFns = {
  aurora: patternAurora,
  film: patternFilm,
  browser: patternBrowser,
  cards: patternCards,
  ember: patternEmber,
  wire: patternWire,
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
  ${glyphBlock(c.glyph, c.accent)}
  ${cornerMarks()}
  ${titleBlock(c.title)}
  ${noise()}
  ${vignette()}
</svg>
`;
  writeFileSync(`public/covers/${c.id}.svg`, svg);
  console.log("generated", c.id);
}

console.log("done");
