// Vice Coast Cover Studio — cover engine.
//
// Draws GTA-style multi-panel poster art on a 2D canvas: layouts, gradient-map
// colour grades, poster finishes and bold lettering. Pure browser code, no
// dependencies, no network. Photos are graded pixel by pixel with a 256-entry
// lookup table built from each grade's gradient stops.

// Seven multi-panel layouts. Each cell is a fraction of the cover:
// x and y are the top-left corner, w and h the size, all from 0 to 1.
export const LAYOUTS = {
  full: {
    name: 'Full Bleed',
    cells: [{ x: 0, y: 0, w: 1, h: 1 }],
  },
  heroStrip: {
    name: 'Hero + Strip',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.62 },
      { x: 0, y: 0.62, w: 1 / 3, h: 0.38 },
      { x: 1 / 3, y: 0.62, w: 1 / 3, h: 0.38 },
      { x: 2 / 3, y: 0.62, w: 1 / 3, h: 0.38 },
    ],
  },
  grid: {
    name: '2 x 2 Grid',
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  comic: {
    name: 'Comic Columns',
    cells: [
      { x: 0, y: 0, w: 0.36, h: 1 },
      { x: 0.36, y: 0, w: 0.28, h: 1 },
      { x: 0.64, y: 0, w: 0.36, h: 1 },
    ],
  },
  trio: {
    name: 'Triple Band',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.34 },
      { x: 0, y: 0.34, w: 1, h: 0.32 },
      { x: 0, y: 0.66, w: 1, h: 0.34 },
    ],
  },
  nine: {
    name: 'Nine Grid',
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 1 / 3 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 1 / 3 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 / 3 },
      { x: 0, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 1 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 2 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 0, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 1 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 2 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
    ],
  },
  spotlight: {
    name: 'Spotlight',
    cells: [
      { x: 0, y: 0, w: 0.62, h: 1 },
      { x: 0.62, y: 0, w: 0.38, h: 1 / 3 },
      { x: 0.62, y: 1 / 3, w: 0.38, h: 1 / 3 },
      { x: 0.62, y: 2 / 3, w: 0.38, h: 1 / 3 },
    ],
  },
};

// Six gradient-map colour grades. Stops are [position 0..1, red, green, blue].
// mix blends the mapped colour over the photo, sat scales saturation,
// contrast pivots around middle grey.
export const GRADES = {
  sunset: {
    name: 'Vice Sunset',
    mix: 0.55, sat: 1.15, contrast: 1.08,
    stops: [
      [0, 26, 10, 46],
      [0.25, 96, 24, 88],
      [0.5, 214, 72, 96],
      [0.75, 255, 158, 76],
      [1, 255, 226, 160],
    ],
  },
  neon: {
    name: 'Neon Nights',
    mix: 0.6, sat: 1.25, contrast: 1.05,
    stops: [
      [0, 8, 8, 28],
      [0.3, 64, 16, 96],
      [0.55, 224, 48, 160],
      [0.8, 64, 220, 220],
      [1, 235, 245, 255],
    ],
  },
  teal: {
    name: 'Palm Teal',
    mix: 0.5, sat: 1.1, contrast: 1.04,
    stops: [
      [0, 6, 32, 40],
      [0.3, 16, 96, 110],
      [0.6, 64, 168, 160],
      [0.85, 180, 225, 205],
      [1, 240, 250, 240],
    ],
  },
  candy: {
    name: 'Candy Pop',
    mix: 0.55, sat: 1.35, contrast: 1.06,
    stops: [
      [0, 40, 8, 60],
      [0.3, 150, 32, 130],
      [0.55, 255, 80, 140],
      [0.8, 255, 170, 60],
      [1, 255, 240, 200],
    ],
  },
  noir: {
    name: 'Noir',
    mix: 0.85, sat: 0, contrast: 1.18,
    stops: [
      [0, 0, 0, 0],
      [0.35, 60, 60, 60],
      [0.7, 160, 160, 160],
      [1, 255, 255, 255],
    ],
  },
  gold: {
    name: 'Vice Gold',
    mix: 0.55, sat: 1.12, contrast: 1.06,
    stops: [
      [0, 30, 16, 8],
      [0.3, 110, 66, 22],
      [0.6, 214, 150, 52],
      [0.85, 255, 205, 110],
      [1, 255, 240, 200],
    ],
  },
};

// The four post sizes the app exports.
export const EXPORT_SIZES = [
  { id: 'square', label: 'Square 1080 × 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait 1080 × 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide 1920 × 1080', w: 1920, h: 1080 },
  { id: 'story', label: 'Story 1080 × 1920', w: 1080, h: 1920 },
];

// Five one-click presets. Each one sets layout, grade, lettering and two
// finish switches together, so a single click restyles the whole cover.
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
    title: 'NEON RUN', subtitle: 'Midnight Drive', tagline: 'VICE CITY  •  AFTER DARK',
    titlePos: 'top', titleColor: '#ffffff', frame: false, halftone: true,
  },
  comicStrip: {
    name: 'Comic Strip', layout: 'comic', grade: 'candy',
    title: 'COMIC STRIP', subtitle: 'Palm Shadows', tagline: 'ISSUE NO. 6  •  2026',
    titlePos: 'bottom', titleColor: '#ffe9f2', frame: true, halftone: true,
  },
  goldenHour: {
    name: 'Golden Hour', layout: 'spotlight', grade: 'gold',
    title: 'GOLDEN HOUR', subtitle: 'Last Light', tagline: 'OCEAN DRIVE  •  6 PM',
    titlePos: 'bottom', titleColor: '#fff3d6', frame: true, halftone: false,
  },
};

// A fresh cover state. Photos hold loaded Image objects; slots hold one entry
// per layout cell: which photo it shows, its zoom in percent, and its pan as
// fractions of the cell size.
export function defaultState() {
  return {
    layout: 'heroStrip',
    grade: 'sunset',
    title: 'VICE COAST',
    subtitle: 'Sunset Heist',
    tagline: 'LEONIDA  •  EST. 2026',
    titlePos: 'bottom',
    titleColor: '#ffffff',
    titleSize: 100,
    outline: true,
    shadow: true,
    frame: true,
    halftone: true,
    grain: true,
    vignette: true,
    sun: true,
    palms: true,
    skyline: true,
    size: 'square',
    photos: [],
    slots: [],
  };
}

// Build a slot list for a layout, keeping any slots the caller already had.
export function slotsFor(layoutId, keep) {
  const layout = LAYOUTS[layoutId] || LAYOUTS.heroStrip;
  const out = [];
  for (let i = 0; i < layout.cells.length; i++) {
    const old = keep && keep[i];
    if (old) {
      out.push({ photo: old.photo, zoom: old.zoom, panX: old.panX, panY: old.panY });
    } else {
      out.push({ photo: -1, zoom: 100, panX: 0, panY: 0 });
    }
  }
  return out;
}

// Apply a preset to a state object, keeping the current photos and slots.
export function applyPreset(state, preset) {
  state.layout = preset.layout;
  state.grade = preset.grade;
  state.title = preset.title;
  state.subtitle = preset.subtitle;
  state.tagline = preset.tagline;
  state.titlePos = preset.titlePos;
  state.titleColor = preset.titleColor;
  state.frame = preset.frame;
  state.halftone = preset.halftone;
  state.slots = slotsFor(preset.layout, state.slots);
}

// ---- gradient-map grades -------------------------------------------------

const lutCache = new Map();

// Build the 256-entry lookup table for a grade by walking its gradient stops.
export function gradeLUT(gradeId) {
  const g = GRADES[gradeId] || GRADES.sunset;
  if (lutCache.has(gradeId)) return lutCache.get(gradeId);
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
    const span = b[0] - a[0] || 1;
    const f = Math.min(1, Math.max(0, (t - a[0]) / span));
    lut[i * 3] = Math.round(a[1] + (b[1] - a[1]) * f);
    lut[i * 3 + 1] = Math.round(a[2] + (b[2] - a[2]) * f);
    lut[i * 3 + 2] = Math.round(a[3] + (b[3] - a[3]) * f);
  }
  const built = { lut, mix: g.mix, sat: g.sat, contrast: g.contrast };
  lutCache.set(gradeId, built);
  return built;
}

// Run a grade over raw pixel data in place: luminance picks the mapped colour,
// then mix, saturation and contrast are applied in that order.
export function gradeImageData(imageData, gradeId) {
  const { lut, mix, sat, contrast } = gradeLUT(gradeId);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    const li = lum * 3;
    let nr = r + (lut[li] - r) * mix;
    let ng = g + (lut[li + 1] - g) * mix;
    let nb = b + (lut[li + 2] - b) * mix;
    const gray = 0.299 * nr + 0.587 * ng + 0.114 * nb;
    nr = gray + (nr - gray) * sat;
    ng = gray + (ng - gray) * sat;
    nb = gray + (nb - gray) * sat;
    nr = (nr - 128) * contrast + 128;
    ng = (ng - 128) * contrast + 128;
    nb = (nb - 128) * contrast + 128;
    d[i] = nr < 0 ? 0 : nr > 255 ? 255 : nr;
    d[i + 1] = ng < 0 ? 0 : ng > 255 ? 255 : ng;
    d[i + 2] = nb < 0 ? 0 : nb > 255 ? 255 : nb;
  }
  return imageData;
}

// ---- photo painting ------------------------------------------------------

// Paint one photo into a pixel rectangle, cover-fitting it with the slot's
// zoom and pan, then grading the pixels. A missing photo becomes a dark
// gradient placeholder so empty cells still read as poster panels.
function paintCell(ctx, img, rect, slot, gradeId) {
  const { px, py, pw, ph } = rect;
  if (!img || !img.naturalWidth) {
    const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    grad.addColorStop(0, '#2a1e3d');
    grad.addColorStop(1, '#120e1c');
    ctx.fillStyle = grad;
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.font = `600 ${Math.max(12, Math.round(pw * 0.04))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ADD A PHOTO', px + pw / 2, py + ph / 2);
    return;
  }
  const off = document.createElement('canvas');
  off.width = pw;
  off.height = ph;
  const octx = off.getContext('2d');
  const zoom = (slot && slot.zoom ? slot.zoom : 100) / 100;
  const panX = slot ? slot.panX || 0 : 0;
  const panY = slot ? slot.panY || 0 : 0;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const cover = Math.max(pw / iw, ph / ih) * zoom;
  const dw = iw * cover;
  const dh = ih * cover;
  const dx = (pw - dw) / 2 + panX * pw;
  const dy = (ph - dh) / 2 + panY * ph;
  octx.drawImage(img, dx, dy, dw, dh);
  const data = octx.getImageData(0, 0, pw, ph);
  gradeImageData(data, gradeId);
  octx.putImageData(data, 0, 0);
  ctx.drawImage(off, px, py);
}

// ---- poster scene and finish ---------------------------------------------

// A tiny deterministic random source so grain and skylines look the same
// on every export of the same cover.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawScene(ctx, state, W, H) {
  if (state.sun) {
    const sx = W * 0.78;
    const sy = H * 0.2;
    const sr = W * 0.1;
    const glow = ctx.createRadialGradient(sx, sy, sr * 0.1, sx, sy, sr * 1.6);
    glow.addColorStop(0, 'rgba(255, 186, 92, 0.85)');
    glow.addColorStop(0.5, 'rgba(255, 120, 90, 0.35)');
    glow.addColorStop(1, 'rgba(255, 120, 90, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd9a0';
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }
  if (state.skyline) {
    const rand = mulberry32(20261120);
    const base = H * 0.985;
    ctx.fillStyle = 'rgba(10, 8, 18, 0.85)';
    let x = 0;
    while (x < W) {
      const bw = W * (0.04 + rand() * 0.06);
      const bh = H * (0.05 + rand() * 0.12);
      ctx.fillRect(x, base - bh, bw, bh);
      if (rand() > 0.5) {
        ctx.fillStyle = 'rgba(255, 214, 130, 0.8)';
        ctx.fillRect(x + bw * 0.3, base - bh * 0.7, 3, 4);
        ctx.fillStyle = 'rgba(10, 8, 18, 0.85)';
      }
      x += bw + W * 0.008;
    }
  }
  if (state.palms) {
    ctx.strokeStyle = 'rgba(8, 6, 14, 0.9)';
    ctx.fillStyle = 'rgba(8, 6, 14, 0.9)';
    ctx.lineCap = 'round';
    const palm = (bx, by, s, lean) => {
      ctx.lineWidth = Math.max(3, W * 0.008);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + lean * s, by - s * 0.5, bx + lean * s * 1.4, by - s);
      ctx.stroke();
      const tx = bx + lean * s * 1.4;
      const ty = by - s;
      for (let i = 0; i < 6; i++) {
        const a = (-Math.PI / 6) - (i * Math.PI) / 7 + (lean > 0 ? 0.3 : -0.3);
        ctx.lineWidth = Math.max(2, W * 0.005);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo(
          tx + Math.cos(a) * s * 0.35,
          ty + Math.sin(a) * s * 0.35 - s * 0.12,
          tx + Math.cos(a) * s * 0.62,
          ty + Math.sin(a) * s * 0.62 + s * 0.22,
        );
        ctx.stroke();
      }
    };
    palm(W * 0.06, H * 0.99, H * 0.22, 1);
    palm(W * 0.94, H * 0.99, H * 0.18, -1);
  }
}

function drawFinish(ctx, state, W, H) {
  if (state.halftone) {
    const gap = Math.max(10, Math.round(W * 0.022));
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for (let y = gap / 2; y < H; y += gap) {
      for (let x = gap / 2; x < W; x += gap) {
        const r = 1 + ((x + y) % (gap * 2)) / gap;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  if (state.grain) {
    const rand = mulberry32(1120);
    const count = Math.floor((W * H) / 900);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < count; i++) {
      ctx.fillRect(rand() * W, rand() * H, 1.5, 1.5);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    for (let i = 0; i < count; i++) {
      ctx.fillRect(rand() * W, rand() * H, 1.5, 1.5);
    }
  }
  if (state.vignette) {
    const vg = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.35,
      W / 2, H / 2, Math.max(W, H) * 0.75,
    );
    vg.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vg.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }
  if (state.frame) {
    const inset = Math.max(8, W * 0.02);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(4, W * 0.008);
    ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
  }
}

function drawLettering(ctx, state, W, H) {
  const titleSize = Math.round(W * 0.105 * (state.titleSize / 100));
  const atBottom = state.titlePos !== 'top';
  const titleY = atBottom ? H - W * 0.085 : W * 0.14;
  const subY = atBottom ? titleY - titleSize * 0.85 : titleY + titleSize * 0.85;
  const tagY = atBottom ? subY - titleSize * 0.55 : subY + titleSize * 0.55;
  // A soft dark scrim behind the whole title block keeps the lettering
  // readable over bright photos, whichever end of the cover it sits on.
  const scrimTop = Math.min(titleY, subY, tagY) - titleSize * 0.75;
  const scrimBottom = Math.max(titleY, subY, tagY) + titleSize * 0.75;
  const scrim = ctx.createLinearGradient(0, scrimTop, 0, scrimBottom);
  scrim.addColorStop(0, 'rgba(8, 6, 16, 0)');
  scrim.addColorStop(0.5, 'rgba(8, 6, 16, 0.42)');
  scrim.addColorStop(1, 'rgba(8, 6, 16, 0)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, scrimTop, W, scrimBottom - scrimTop);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (state.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = Math.round(titleSize * 0.12);
    ctx.shadowOffsetY = Math.round(titleSize * 0.03);
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }
  ctx.font = `900 ${titleSize}px Anton, 'Arial Narrow', sans-serif`;
  if (state.outline) {
    ctx.strokeStyle = '#14101f';
    ctx.lineWidth = Math.max(2, Math.round(titleSize * 0.07));
    ctx.lineJoin = 'round';
    ctx.strokeText((state.title || '').toUpperCase(), W / 2, titleY);
  }
  ctx.fillStyle = state.titleColor || '#ffffff';
  ctx.fillText((state.title || '').toUpperCase(), W / 2, titleY);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  const subSize = Math.max(14, Math.round(W * 0.042));
  ctx.font = `${subSize}px Pacifico, cursive`;
  ctx.fillStyle = '#ffd9a0';
  ctx.fillText(state.subtitle || '', W / 2, subY);
  const tagSize = Math.max(10, Math.round(W * 0.018));
  ctx.font = `700 ${tagSize}px 'Arial Narrow', sans-serif`;
  try {
    ctx.letterSpacing = `${Math.round(tagSize * 0.25)}px`;
  } catch (e) {
    // Older browsers ignore letter spacing; the tagline still draws fine.
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.fillText((state.tagline || '').toUpperCase(), W / 2, tagY);
  try {
    ctx.letterSpacing = '0px';
  } catch (e) {
    // No-op on browsers without the property.
  }
}

// ---- main entry points ---------------------------------------------------

// Draw a whole cover onto any 2D context at the given pixel size.
export function drawCover(ctx, state, W, H) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0d0b14';
  ctx.fillRect(0, 0, W, H);
  const layout = LAYOUTS[state.layout] || LAYOUTS.heroStrip;
  const gutter = Math.max(2, Math.round(W * 0.004));
  layout.cells.forEach((cell, i) => {
    const slot = state.slots[i] || { photo: -1, zoom: 100, panX: 0, panY: 0 };
    const photo = slot.photo >= 0 && state.photos[slot.photo] ? state.photos[slot.photo] : null;
    const px = Math.round((cell.x + (cell.x > 0 ? gutter / W : 0)) * W);
    const py = Math.round((cell.y + (cell.y > 0 ? gutter / H : 0)) * H);
    const pw = Math.max(
      1,
      Math.round(cell.w * W)
        - (cell.x > 0 ? gutter : 0)
        - (cell.x + cell.w < 1 ? gutter : 0),
    );
    const ph = Math.max(
      1,
      Math.round(cell.h * H)
        - (cell.y > 0 ? gutter : 0)
        - (cell.y + cell.h < 1 ? gutter : 0),
    );
    paintCell(ctx, photo, { px, py, pw, ph }, slot, state.grade);
  });
  drawScene(ctx, state, W, H);
  drawFinish(ctx, state, W, H);
  drawLettering(ctx, state, W, H);
}

// Render a cover to a fresh canvas at the given pixel size.
export function renderCover(state, W, H) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  drawCover(canvas.getContext('2d'), state, W, H);
  return canvas;
}

// Make sure the two display faces are ready before the first draw, so the
// canvas lettering never falls back to a system font on the first paint.
export async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load('900 40px Anton'),
      document.fonts.load('400 40px Pacifico'),
    ]);
  } catch (e) {
    // Fonts fall back to system faces; the cover still draws.
  }
}
