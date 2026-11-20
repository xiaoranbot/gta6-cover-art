// Vice Coast Cover Studio — cover engine, rebuilt.
// Draws a GTA-style multi-panel poster onto any canvas: one photo per panel
// with its own crop, gradient-map colour grades, procedural poster art
// (sun disc, palm silhouettes, city skyline, grain, vignette, halftone) and
// Anton / Pacifico lettering. Everything is drawn in code — no official
// artwork, logos or fonts are used anywhere.

function cell(x, y, w, h, photo) {
  return { x, y, w, h, photo };
}

function gradeSpec(name, stops, mix, sat, contrast) {
  return { name, stops, mix, sat, contrast };
}

function presetSpec(name, layout, grade, title, subtitle, tagline, titlePos, titleColor, frame, halftone) {
  return { name, layout, grade, title, subtitle, tagline, titlePos, titleColor, frame, halftone };
}

export const LAYOUTS = {
  full: {
    name: 'Full Bleed',
    cells: [cell(0, 0, 1, 1, 0)],
  },
  heroStrip: {
    name: 'Hero + Strip',
    cells: [
      cell(0, 0, 1, 0.64, 0),
      cell(0, 0.64, 1 / 3, 0.36, 1),
      cell(1 / 3, 0.64, 1 / 3, 0.36, 2),
      cell(2 / 3, 0.64, 1 / 3, 0.36, 3),
    ],
  },
  grid: {
    name: '2 x 2 Grid',
    cells: [
      cell(0, 0, 0.5, 0.5, 0),
      cell(0.5, 0, 0.5, 0.5, 1),
      cell(0, 0.5, 0.5, 0.5, 2),
      cell(0.5, 0.5, 0.5, 0.5, 3),
    ],
  },
  comic: {
    name: 'Comic Columns',
    cells: [
      cell(0, 0, 0.34, 1, 0),
      cell(0.34, 0, 0.33, 1, 1),
      cell(0.67, 0, 0.33, 1, 2),
    ],
  },
  trio: {
    name: 'Triple Band',
    cells: [
      cell(0, 0, 1, 0.34, 0),
      cell(0, 0.34, 1, 0.33, 1),
      cell(0, 0.67, 1, 0.33, 2),
    ],
  },
  nine: {
    name: 'Nine Grid',
    cells: [
      cell(0, 0, 1 / 3, 1 / 3, 0),
      cell(1 / 3, 0, 1 / 3, 1 / 3, 1),
      cell(2 / 3, 0, 1 / 3, 1 / 3, 2),
      cell(0, 1 / 3, 1 / 3, 1 / 3, 3),
      cell(1 / 3, 1 / 3, 1 / 3, 1 / 3, 0),
      cell(2 / 3, 1 / 3, 1 / 3, 1 / 3, 1),
      cell(0, 2 / 3, 1 / 3, 1 / 3, 2),
      cell(1 / 3, 2 / 3, 1 / 3, 1 / 3, 3),
      cell(2 / 3, 2 / 3, 1 / 3, 1 / 3, 0),
    ],
  },
  spotlight: {
    name: 'Spotlight',
    cells: [
      cell(0, 0, 0.62, 1, 0),
      cell(0.62, 0, 0.38, 0.5, 1),
      cell(0.62, 0.5, 0.38, 0.5, 2),
    ],
  },
};

export const GRADES = {
  sunset: gradeSpec('Vice Sunset',
    [[0, [26, 10, 46]], [0.35, [122, 32, 92]], [0.65, [255, 110, 60]], [0.85, [255, 158, 110]], [1, [255, 233, 201]]],
    0.5, 1.18, 1.06),
  neon: gradeSpec('Neon Nights',
    [[0, [14, 0, 40]], [0.35, [112, 28, 160]], [0.6, [255, 46, 166]], [0.85, [190, 90, 255]], [1, [120, 240, 255]]],
    0.55, 1.3, 1.08),
  teal: gradeSpec('Palm Teal',
    [[0, [4, 30, 28]], [0.35, [14, 96, 88]], [0.65, [64, 170, 150]], [0.85, [232, 192, 122]], [1, [246, 234, 210]]],
    0.5, 1.08, 1.05),
  candy: gradeSpec('Candy Pop',
    [[0, [58, 8, 74]], [0.35, [190, 30, 120]], [0.6, [255, 77, 141]], [0.8, [255, 210, 63]], [1, [255, 250, 240]]],
    0.5, 1.45, 1.04),
  noir: gradeSpec('Noir',
    [[0, [0, 0, 0]], [0.25, [28, 28, 30]], [0.5, [118, 118, 120]], [0.75, [205, 205, 208]], [1, [255, 255, 255]]],
    0.85, 0, 1.28),
  gold: gradeSpec('Vice Gold',
    [[0, [30, 16, 4]], [0.35, [120, 62, 10]], [0.6, [214, 128, 32]], [0.85, [255, 190, 90]], [1, [255, 240, 200]]],
    0.5, 1.15, 1.05),
};

export const EXPORT_SIZES = [
  { id: 'square', label: 'Square 1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide 1920 x 1080', w: 1920, h: 1080 },
  { id: 'story', label: 'Story 1080 x 1920', w: 1080, h: 1920 },
];

export const PRESETS = {
  sunsetHeist: presetSpec('Sunset Heist', 'heroStrip', 'sunset',
    'VICE COAST', 'Sunset Heist', 'LEONIDA  •  EST. 2026', 'bottom', '#ffffff', true, true),
  boulevardQueen: presetSpec('Boulevard Queen', 'grid', 'teal',
    'BOULEVARD', 'Queen of the Coast', 'PALM ROW  •  GOLDEN HOUR', 'bottom', '#fff7e6', true, false),
  neonRun: presetSpec('Neon Run', 'nine', 'neon',
    'NEON RUN', 'After Midnight', 'VICE CITY  •  NO SLEEP', 'top', '#ffe9fb', true, true),
  comicStrip: presetSpec('Comic Strip', 'comic', 'candy',
    'VICE COAST', 'Three Ways Down', 'A STORY IN THREE PANELS', 'bottom', '#ffffff', true, true),
  goldenHour: presetSpec('Golden Hour', 'spotlight', 'gold',
    'GOLDEN HOUR', 'Chase the Light', 'LEONIDA  •  GOLDEN HOUR', 'bottom', '#fff3d6', true, true),
};

export function defaultState() {
  return {
    layout: 'heroStrip',
    grade: 'sunset',
    title: 'VICE COAST',
    subtitle: 'Sunset Heist',
    tagline: 'LEONIDA  •  EST. 2026',
    titlePos: 'bottom',
    titleSize: 100,
    titleColor: '#ffffff',
    outline: true,
    shadow: true,
    frame: true,
    halftone: true,
    grain: true,
    vignette: true,
    sun: true,
    palms: true,
    skyline: true,
    // one slot per layout cell (max 9); photo is an index into the photos array
    slots: Array.from({ length: 9 }, (_, i) => ({ photo: i % 4, scale: 1, dx: 0, dy: 0 })),
  };
}

// ---- colour grades: one 256-entry lookup table per grade, then map pixels ----

const lutCache = new Map();

function lutFor(gradeId) {
  if (lutCache.has(gradeId)) return lutCache.get(gradeId);
  const g = GRADES[gradeId] || GRADES.sunset;
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = g.stops[0];
    let b = g.stops[g.stops.length - 1];
    for (let s = 0; s < g.stops.length - 1; s++) {
      if (t >= g.stops[s][0] && t <= g.stops[s + 1][0]) {
        a = g.stops[s];
        b = g.stops[s + 1];
        break;
      }
    }
    const f = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0]);
    for (let c = 0; c < 3; c++) {
      lut[i * 3 + c] = Math.round(a[1][c] + (b[1][c] - a[1][c]) * f);
    }
  }
  const built = { lut, mix: g.mix, sat: g.sat, contrast: g.contrast };
  lutCache.set(gradeId, built);
  return built;
}

function gradePixels(imageData, gradeId) {
  const { lut, mix, sat, contrast } = lutFor(gradeId);
  const d = imageData.data;
  const keep = 1 - mix;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    let nr = lut[lum * 3] * mix + r * keep;
    let ng = lut[lum * 3 + 1] * mix + g * keep;
    let nb = lut[lum * 3 + 2] * mix + b * keep;
    // saturation pivots on luminance
    const l2 = 0.299 * nr + 0.587 * ng + 0.114 * nb;
    nr = l2 + (nr - l2) * sat;
    ng = l2 + (ng - l2) * sat;
    nb = l2 + (nb - l2) * sat;
    // contrast pivots on mid grey
    nr = 128 + (nr - 128) * contrast;
    ng = 128 + (ng - 128) * contrast;
    nb = 128 + (nb - 128) * contrast;
    d[i] = nr < 0 ? 0 : nr > 255 ? 255 : nr;
    d[i + 1] = ng < 0 ? 0 : ng > 255 ? 255 : ng;
    d[i + 2] = nb < 0 ? 0 : nb > 255 ? 255 : nb;
  }
  return imageData;
}

// ---- photo panels ----

function paintPhoto(ctx, img, cell, slot, gradeId, W, H) {
  const cx = cell.x * W;
  const cy = cell.y * H;
  const cw = cell.w * W;
  const ch = cell.h * H;
  const tmp = paintPhoto.tmp || (paintPhoto.tmp = document.createElement('canvas'));
  const tw = Math.max(2, Math.round(cw));
  const th = Math.max(2, Math.round(ch));
  tmp.width = tw;
  tmp.height = th;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  // cover-fit, then the slot's own zoom and pan
  const base = Math.max(tw / iw, th / ih);
  const scale = base * (slot.scale || 1);
  const pw = iw * scale;
  const ph = ih * scale;
  const ox = (tw - pw) / 2 + (slot.dx || 0) * tw;
  const oy = (th - ph) / 2 + (slot.dy || 0) * th;
  tctx.fillStyle = '#241a30';
  tctx.fillRect(0, 0, tw, th);
  tctx.drawImage(img, ox, oy, pw, ph);
  const graded = gradePixels(tctx.getImageData(0, 0, tw, th), gradeId);
  tctx.putImageData(graded, 0, 0);
  ctx.drawImage(tmp, cx, cy, cw, ch);
}

function paintPlaceholder(ctx, cx, cy, cw, ch, n) {
  const g = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  g.addColorStop(0, '#3a2350');
  g.addColorStop(1, '#1c1030');
  ctx.fillStyle = g;
  ctx.fillRect(cx, cy, cw, ch);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = Math.max(1, cw * 0.004);
  ctx.setLineDash([cw * 0.03, cw * 0.02]);
  ctx.strokeRect(cx + cw * 0.06, cy + ch * 0.06, cw * 0.88, ch * 0.88);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `700 ${Math.max(12, cw * 0.06)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`PHOTO ${n + 1}`, cx + cw / 2, cy + ch / 2 - ch * 0.04);
  ctx.font = `${Math.max(10, cw * 0.035)}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('drop a photo here', cx + cw / 2, cy + ch / 2 + ch * 0.05);
  ctx.textBaseline = 'alphabetic';
}

// ---- procedural poster art ----

let noiseTile = null;
function getNoise() {
  if (noiseTile) return noiseTile;
  noiseTile = document.createElement('canvas');
  noiseTile.width = 140;
  noiseTile.height = 140;
  const nctx = noiseTile.getContext('2d');
  const img = nctx.createImageData(140, 140);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  nctx.putImageData(img, 0, 0);
  return noiseTile;
}

// Deterministic pseudo-random: the skyline must look identical on every render.
function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paintSun(ctx, W, H) {
  const cx = W * 0.73;
  const cy = H * 0.24;
  const r = Math.min(W, H) * 0.125;
  ctx.save();
  ctx.globalAlpha = 0.62;
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
  g.addColorStop(0, 'rgba(255, 233, 168, 0.98)');
  g.addColorStop(0.5, 'rgba(255, 154, 61, 0.9)');
  g.addColorStop(1, 'rgba(255, 90, 130, 0.25)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // thin retro slats across the lower half of the disc
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(24, 8, 44, 0.28)';
  const bands = 5;
  for (let i = 0; i < bands; i++) {
    const y = cy + r * 0.06 + i * r * 0.16;
    ctx.fillRect(cx - r, y, r * 2, r * (0.02 + i * 0.008));
  }
  ctx.restore();
}

function paintPalm(ctx, x, y, s, lean, flip) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip ? -s : s, s);
  ctx.strokeStyle = 'rgba(12, 4, 22, 0.92)';
  ctx.fillStyle = 'rgba(12, 4, 22, 0.92)';
  ctx.lineCap = 'round';
  // tall gently curving trunk
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(lean * 26, -110, lean * 44, -200);
  ctx.stroke();
  const topX = lean * 44;
  const topY = -200;
  // fronds arc up then droop down at the tips, like a real palm crown
  ctx.lineWidth = 5;
  for (let i = 0; i < 7; i++) {
    const a = (-168 + i * 28) * (Math.PI / 180);
    const len = 105 - Math.abs(i - 3) * 14;
    const ex = topX + Math.cos(a) * len;
    const ey = topY + Math.sin(a) * len * 0.55 + 58;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + Math.cos(a) * len * 0.55, topY + Math.sin(a) * len * 0.55 - 18, ex, ey);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(topX, topY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(topX - 7, topY + 6, 4, 0, Math.PI * 2);
  ctx.arc(topX + 7, topY + 7, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Lit-window palette for the skyline: warm amber glass, randomised per pane.
const SKYLINE_WINDOW_RED = 255;
const SKYLINE_WINDOW_BLUE = 110;
const SKYLINE_WINDOW_GREEN_MIN = 190;
const SKYLINE_WINDOW_GREEN_SPAN = 50;
const SKYLINE_WINDOW_ALPHA_MIN = 0.45;
const SKYLINE_WINDOW_ALPHA_SPAN = 0.45;

function paintSkyline(ctx, W, H) {
  const rnd = seededRandom(20261120);
  const base = H;
  const block = 'rgba(10, 4, 22, 0.88)';
  ctx.save();
  ctx.fillStyle = block;
  let x = 0;
  while (x < W) {
    const bw = W * (0.04 + rnd() * 0.05);
    const bh = H * (0.05 + rnd() * 0.13);
    const bx = x;
    const by = base - bh;
    ctx.fillRect(bx, by, bw, bh);
    // a few lit windows on the taller blocks
    if (bh > H * 0.09) {
      const cols = Math.max(1, Math.floor(bw / (W * 0.018)));
      const rows = Math.max(1, Math.floor(bh / (H * 0.03)));
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (rnd() < 0.28) {
            ctx.fillStyle = `rgba(${SKYLINE_WINDOW_RED}, ${SKYLINE_WINDOW_GREEN_MIN + Math.floor(rnd() * SKYLINE_WINDOW_GREEN_SPAN)}, ${SKYLINE_WINDOW_BLUE}, ${SKYLINE_WINDOW_ALPHA_MIN + rnd() * SKYLINE_WINDOW_ALPHA_SPAN})`;
            ctx.fillRect(bx + W * 0.008 + c * W * 0.018, by + H * 0.012 + r * H * 0.03, W * 0.008, H * 0.012);
            ctx.fillStyle = block;
          }
        }
      }
    }
    x += bw + W * 0.004;
  }
  ctx.restore();
}

function paintHalftone(ctx, W, H) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  const step = Math.max(14, W * 0.016);
  for (let y = step / 2; y < H * 0.22; y += step) {
    const fade = 1 - y / (H * 0.22);
    for (let x = step / 2; x < W; x += step) {
      const r = step * 0.22 * fade + 0.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function paintPosterArt(ctx, W, H, state) {
  if (state.sun) paintSun(ctx, W, H);
  if (state.palms) {
    const s = Math.min(W, H) / 620;
    paintPalm(ctx, W * 0.03, H * 1.01, s * 0.85, 0.55, false);
    paintPalm(ctx, W * 0.95, H * 1.01, s * 0.55, -0.5, true);
  }
  if (state.skyline) paintSkyline(ctx, W, H);
  if (state.halftone) paintHalftone(ctx, W, H);
  if (state.vignette) {
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(8,2,18,0.42)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }
  if (state.grain) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.globalCompositeOperation = 'overlay';
    const pat = ctx.createPattern(getNoise(), 'repeat');
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

// ---- lettering ----

function fitSize(ctx, text, maxWidth, startSize, family, weight) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > 12 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function paintTitle(ctx, W, H, state) {
  const bottom = state.titlePos === 'bottom';
  const bandH = H * 0.30;
  const bandY = bottom ? H - bandH : 0;
  // legibility scrim over the title band
  const scrim = ctx.createLinearGradient(0, bandY, 0, bottom ? H : bandY + bandH);
  if (bottom) {
    scrim.addColorStop(0, 'rgba(10,4,24,0)');
    scrim.addColorStop(0.45, 'rgba(10,4,24,0.45)');
    scrim.addColorStop(1, 'rgba(10,4,24,0.72)');
  } else {
    scrim.addColorStop(0, 'rgba(10,4,24,0.72)');
    scrim.addColorStop(0.55, 'rgba(10,4,24,0.45)');
    scrim.addColorStop(1, 'rgba(10,4,24,0)');
  }
  ctx.fillStyle = scrim;
  ctx.fillRect(0, bandY, W, bandH);

  const cx = W / 2;
  const title = (state.title || '').trim().toUpperCase();
  const sub = (state.subtitle || '').trim();
  const tag = (state.tagline || '').trim().toUpperCase();
  const base = Math.min(W, H);
  const titleSize = fitSize(ctx, title || 'VICE COAST', W * 0.92, base * 0.11 * (state.titleSize / 100), 'Anton, sans-serif', '400');
  const titleY = bottom ? H - H * 0.115 : bandH * 0.6;
  const subY = bottom ? H - H * 0.038 : bandH * 0.9;
  const tagY = bottom ? H - H * 0.205 : bandH * 0.18;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (state.shadow) {
    ctx.shadowColor = 'rgba(20, 0, 40, 0.65)';
    ctx.shadowBlur = titleSize * 0.18;
    ctx.shadowOffsetY = titleSize * 0.06;
  }
  try { ctx.letterSpacing = `${Math.max(1, titleSize * 0.02)}px`; } catch (e) { /* older canvas */ }
  if (title) {
    ctx.font = `400 ${titleSize}px Anton, sans-serif`;
    if (state.outline) {
      ctx.lineWidth = Math.max(2, titleSize * 0.07);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(16, 4, 32, 0.9)';
      ctx.strokeText(title, cx, titleY);
    }
    ctx.fillStyle = state.titleColor || '#ffffff';
    ctx.fillText(title, cx, titleY);
  }
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  try { ctx.letterSpacing = '0px'; } catch (e) { /* ignore */ }
  if (sub) {
    const subSize = Math.max(14, titleSize * 0.42);
    ctx.font = `${subSize}px Pacifico, cursive`;
    ctx.fillStyle = '#ffd9ec';
    ctx.shadowColor = 'rgba(20, 0, 40, 0.6)';
    ctx.shadowBlur = subSize * 0.25;
    ctx.fillText(sub, cx, subY);
    ctx.shadowBlur = 0;
  }
  if (tag) {
    const tagSize = Math.max(10, base * 0.022);
    ctx.font = `700 ${tagSize}px system-ui, sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    try { ctx.letterSpacing = `${tagSize * 0.35}px`; } catch (e) { /* ignore */ }
    const tw = ctx.measureText(tag).width;
    ctx.fillText(tag, cx, tagY);
    // side rules flanking the tagline
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = Math.max(1, tagSize * 0.08);
    const rule = W * 0.07;
    const gap = tw / 2 + W * 0.02;
    ctx.beginPath();
    ctx.moveTo(cx - gap - rule, tagY);
    ctx.lineTo(cx - gap, tagY);
    ctx.moveTo(cx + gap, tagY);
    ctx.lineTo(cx + gap + rule, tagY);
    ctx.stroke();
  }
  ctx.restore();
}

// ---- main render ----

/** Draw the cover described by `state` onto `canvas` (its own pixel size). */
export function drawCover(canvas, state, photos) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const layout = LAYOUTS[state.layout] || LAYOUTS.heroStrip;
  const gutter = Math.round(Math.min(W, H) * 0.008);
  ctx.fillStyle = state.frame ? '#ffffff' : '#12081f';
  ctx.fillRect(0, 0, W, H);
  layout.cells.forEach((cell, i) => {
    const slot = state.slots[i] || { photo: 0, scale: 1, dx: 0, dy: 0 };
    const px = cell.x * W + (cell.x > 0 ? gutter / 2 : 0);
    const py = cell.y * H + (cell.y > 0 ? gutter / 2 : 0);
    const pw = cell.w * W - (cell.x > 0 ? gutter / 2 : 0) - (cell.x + cell.w < 1 ? gutter / 2 : 0);
    const ph = cell.h * H - (cell.y > 0 ? gutter / 2 : 0) - (cell.y + cell.h < 1 ? gutter / 2 : 0);
    const img = photos && photos[slot.photo];
    if (img) {
      paintPhoto(ctx, img, { x: px / W, y: py / H, w: pw / W, h: ph / H }, slot, state.grade, W, H);
    } else {
      paintPlaceholder(ctx, px, py, pw, ph, slot.photo);
    }
  });
  paintPosterArt(ctx, W, H, state);
  paintTitle(ctx, W, H, state);
  if (state.frame) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(3, Math.min(W, H) * 0.012);
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, W - ctx.lineWidth, H - ctx.lineWidth);
  }
}

/** Render a fresh canvas at the requested export size. */
export function renderCover(width, height, state, photos) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  drawCover(canvas, state, photos);
  return canvas;
}

/** Wait until the vendored display fonts are usable. */
export async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load('400 80px Anton'),
      document.fonts.load('400 40px Pacifico'),
      document.fonts.ready,
    ]);
  } catch (e) { /* fall back to system fonts */ }
}
