// Vice Coast Cover Studio — cover engine.
// Draws a multi-panel GTA-style poster onto any canvas: photos per panel with
// independent crop/position, gradient-map colour grades, procedural poster art
// (sun disc, palm silhouettes, grain, vignette, halftone) and Anton/Pacifico
// lettering. Everything is drawn in code; no official artwork, logos or fonts.

export const LAYOUTS = {
  full: {
    name: 'Full Bleed',
    cells: [{ x: 0, y: 0, w: 1, h: 1, photo: 0 }],
  },
  heroStrip: {
    name: 'Hero + Strip',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.64, photo: 0 },
      { x: 0, y: 0.64, w: 1 / 3, h: 0.36, photo: 1 },
      { x: 1 / 3, y: 0.64, w: 1 / 3, h: 0.36, photo: 2 },
      { x: 2 / 3, y: 0.64, w: 1 / 3, h: 0.36, photo: 3 },
    ],
  },
  grid: {
    name: '2 x 2 Grid',
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.5, photo: 0 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5, photo: 1 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5, photo: 2 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5, photo: 3 },
    ],
  },
  comic: {
    name: 'Comic Columns',
    cells: [
      { x: 0, y: 0, w: 0.34, h: 1, photo: 0 },
      { x: 0.34, y: 0, w: 0.33, h: 1, photo: 1 },
      { x: 0.67, y: 0, w: 0.33, h: 1, photo: 2 },
    ],
  },
  trio: {
    name: 'Triple Band',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.34, photo: 0 },
      { x: 0, y: 0.34, w: 1, h: 0.33, photo: 1 },
      { x: 0, y: 0.67, w: 1, h: 0.33, photo: 2 },
    ],
  },
  nine: {
    name: 'Nine Grid',
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 1 / 3, photo: 0 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 1 / 3, photo: 1 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 / 3, photo: 2 },
      { x: 0, y: 1 / 3, w: 1 / 3, h: 1 / 3, photo: 3 },
      { x: 1 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3, photo: 0 },
      { x: 2 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3, photo: 1 },
      { x: 0, y: 2 / 3, w: 1 / 3, h: 1 / 3, photo: 2 },
      { x: 1 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3, photo: 3 },
      { x: 2 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3, photo: 0 },
    ],
  },
};

export const GRADES = {
  sunset: {
    name: 'Vice Sunset',
    stops: [[0, [26, 10, 46]], [0.35, [122, 32, 92]], [0.65, [255, 110, 60]], [0.85, [255, 158, 110]], [1, [255, 233, 201]]],
    mix: 0.5, sat: 1.18, contrast: 1.06,
  },
  neon: {
    name: 'Neon Nights',
    stops: [[0, [14, 0, 40]], [0.35, [112, 28, 160]], [0.6, [255, 46, 166]], [0.85, [190, 90, 255]], [1, [120, 240, 255]]],
    mix: 0.55, sat: 1.3, contrast: 1.08,
  },
  teal: {
    name: 'Palm Teal',
    stops: [[0, [4, 30, 28]], [0.35, [14, 96, 88]], [0.65, [64, 170, 150]], [0.85, [232, 192, 122]], [1, [246, 234, 210]]],
    mix: 0.5, sat: 1.08, contrast: 1.05,
  },
  candy: {
    name: 'Candy Pop',
    stops: [[0, [58, 8, 74]], [0.35, [190, 30, 120]], [0.6, [255, 77, 141]], [0.8, [255, 210, 63]], [1, [255, 250, 240]]],
    mix: 0.5, sat: 1.45, contrast: 1.04,
  },
  noir: {
    name: 'Noir',
    stops: [[0, [0, 0, 0]], [0.25, [28, 28, 30]], [0.5, [118, 118, 120]], [0.75, [205, 205, 208]], [1, [255, 255, 255]]],
    mix: 0.85, sat: 0, contrast: 1.28,
  },
};

export const EXPORT_SIZES = [
  { id: 'square', label: 'Square 1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide 1920 x 1080', w: 1920, h: 1080 },
  { id: 'story', label: 'Story 1080 x 1920', w: 1080, h: 1920 },
];

export const PRESETS = {
  sunsetHeist: {
    name: 'Sunset Heist', layout: 'heroStrip', grade: 'sunset',
    title: 'VICE COAST', subtitle: 'Sunset Heist', tagline: 'LEONIDA  •  EST. 2026',
    titlePos: 'bottom', titleColor: '#ffffff', frame: true, halftone: true,
  },
  boulevardQueen: {
    name: 'Boulevard Queen', layout: 'grid', grade: 'teal',
    title: 'BOULEVARD', subtitle: 'Queen of the Coast', tagline: 'PALM ROW  •  GOLDEN HOUR',
    titlePos: 'bottom', titleColor: '#fff7e6', frame: true, halftone: false,
  },
  neonRun: {
    name: 'Neon Run', layout: 'nine', grade: 'neon',
    title: 'NEON RUN', subtitle: 'After Midnight', tagline: 'VICE CITY  •  NO SLEEP',
    titlePos: 'top', titleColor: '#ffe9fb', frame: true, halftone: true,
  },
  comicStrip: {
    name: 'Comic Strip', layout: 'comic', grade: 'candy',
    title: 'VICE COAST', subtitle: 'Three Ways Down', tagline: 'A STORY IN THREE PANELS',
    titlePos: 'bottom', titleColor: '#ffffff', frame: true, halftone: true,
  },
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
    // one slot per layout cell (max 9); photo is an index into the photos array
    slots: Array.from({ length: 9 }, (_, i) => ({ photo: i % 4, scale: 1, dx: 0, dy: 0 })),
  };
}

// ---- colour grades: build a 256-entry LUT per grade, then map pixels ----
const lutCache = new Map();

function gradeLut(gradeId) {
  if (lutCache.has(gradeId)) return lutCache.get(gradeId);
  const g = GRADES[gradeId] || GRADES.sunset;
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = g.stops[0];
    let b = g.stops[g.stops.length - 1];
    for (let s = 0; s < g.stops.length - 1; s++) {
      if (t >= g.stops[s][0] && t <= g.stops[s + 1][0]) { a = g.stops[s]; b = g.stops[s + 1]; break; }
    }
    const f = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0]);
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = Math.round(a[1][c] + (b[1][c] - a[1][c]) * f);
  }
  const out = { lut, mix: g.mix, sat: g.sat, contrast: g.contrast };
  lutCache.set(gradeId, out);
  return out;
}

function applyGrade(imageData, gradeId) {
  const { lut, mix, sat, contrast } = gradeLut(gradeId);
  const d = imageData.data;
  const invMix = 1 - mix;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const gr = d[i + 1];
    const b = d[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * gr + 0.114 * b);
    let nr = lut[lum * 3] * mix + r * invMix;
    let ng = lut[lum * 3 + 1] * mix + gr * invMix;
    let nb = lut[lum * 3 + 2] * mix + b * invMix;
    // saturation around luminance
    const l2 = 0.299 * nr + 0.587 * ng + 0.114 * nb;
    nr = l2 + (nr - l2) * sat;
    ng = l2 + (ng - l2) * sat;
    nb = l2 + (nb - l2) * sat;
    // contrast around mid grey
    nr = 128 + (nr - 128) * contrast;
    ng = 128 + (ng - 128) * contrast;
    nb = 128 + (nb - 128) * contrast;
    d[i] = nr < 0 ? 0 : nr > 255 ? 255 : nr;
    d[i + 1] = ng < 0 ? 0 : ng > 255 ? 255 : ng;
    d[i + 2] = nb < 0 ? 0 : nb > 255 ? 255 : nb;
  }
  return imageData;
}

function drawPhotoCell(ctx, img, cell, slot, gradeId, W, H) {
  const cx = cell.x * W;
  const cy = cell.y * H;
  const cw = cell.w * W;
  const ch = cell.h * H;
  const tmp = drawPhotoCell.tmp || (drawPhotoCell.tmp = document.createElement('canvas'));
  const tw = Math.max(2, Math.round(cw));
  const th = Math.max(2, Math.round(ch));
  tmp.width = tw;
  tmp.height = th;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const base = Math.max(tw / iw, th / ih);
  const scale = base * (slot.scale || 1);
  const pw = iw * scale;
  const ph = ih * scale;
  const ox = (tw - pw) / 2 + (slot.dx || 0) * tw;
  const oy = (th - ph) / 2 + (slot.dy || 0) * th;
  tctx.fillStyle = '#241a30';
  tctx.fillRect(0, 0, tw, th);
  tctx.drawImage(img, ox, oy, pw, ph);
  const graded = applyGrade(tctx.getImageData(0, 0, tw, th), gradeId);
  tctx.putImageData(graded, 0, 0);
  ctx.drawImage(tmp, cx, cy, cw, ch);
}

function drawPlaceholderCell(ctx, cx, cy, cw, ch, n) {
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

let noiseCanvas = null;
function getNoise() {
  if (noiseCanvas) return noiseCanvas;
  noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = 140;
  noiseCanvas.height = 140;
  const nctx = noiseCanvas.getContext('2d');
  const img = nctx.createImageData(140, 140);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  nctx.putImageData(img, 0, 0);
  return noiseCanvas;
}

function drawSunDisc(ctx, W, H) {
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

function drawPalm(ctx, x, y, s, lean, flip) {
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

function drawHalftone(ctx, W, H) {
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

function drawPosterArt(ctx, W, H, state) {
  if (state.sun) drawSunDisc(ctx, W, H);
  if (state.palms) {
    const s = Math.min(W, H) / 620;
    drawPalm(ctx, W * 0.03, H * 1.01, s * 0.85, 0.55, false);
    drawPalm(ctx, W * 0.95, H * 1.01, s * 0.55, -0.5, true);
  }
  if (state.halftone) drawHalftone(ctx, W, H);
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

function fitFont(ctx, text, maxWidth, startSize, family, weight) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > 12 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function drawTitleBlock(ctx, W, H, state) {
  const bottom = state.titlePos === 'bottom';
  const bandH = H * 0.30;
  const bandY = bottom ? H - bandH : 0;
  // legibility scrim
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
  const titleSize = fitFont(ctx, title || 'VICE COAST', W * 0.92, base * 0.11 * (state.titleSize / 100), 'Anton, sans-serif', '400');
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
    // side rules
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
      drawPhotoCell(ctx, img, { x: px / W, y: py / H, w: pw / W, h: ph / H }, slot, state.grade, W, H);
    } else {
      drawPlaceholderCell(ctx, px, py, pw, ph, slot.photo);
    }
  });
  drawPosterArt(ctx, W, H, state);
  drawTitleBlock(ctx, W, H, state);
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
