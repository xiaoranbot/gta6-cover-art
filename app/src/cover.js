// Vice Coast Cover Studio — the cover engine.
//
// Everything the cover looks like lives here: the multi-panel layouts, the Vice City
// gradient-map grades, the skyline-and-sunset title block, the grain and vignette. It draws
// onto any 2D canvas at any size, so the live preview and the exported PNG are the same
// drawing — the export just asks for more pixels. No Rockstar art, logo or font is used:
// the lettering is Anton and Pacifico, both shipped under the SIL Open Font License.

export const SAMPLE_PHOTOS = [
  { id: 'boulevard', file: 'samples/boulevard.jpg', label: 'Boulevard' },
  { id: 'neon-street', file: 'samples/neon-street.jpg', label: 'Neon Street' },
  { id: 'pier', file: 'samples/pier.jpg', label: 'Pier' },
  { id: 'sunset-beach', file: 'samples/sunset-beach.jpg', label: 'Sunset Beach' },
];

// Panel rectangles are fractions of the cover (x, y, w, h). The title band is drawn over
// the bottom of the panels, poster style, so every layout keeps its photos full-bleed.
export const LAYOUTS = [
  {
    id: 'quad', name: 'Four Corners', blurb: 'Four equal panels, the classic cover grid.',
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
  },
  {
    id: 'hero', name: 'Hero + Trio', blurb: 'One big hero shot with three stacked beside it.',
    panels: [
      { x: 0, y: 0, w: 0.62, h: 1 },
      { x: 0.62, y: 0, w: 0.38, h: 1 / 3 }, { x: 0.62, y: 1 / 3, w: 0.38, h: 1 / 3 },
      { x: 0.62, y: 2 / 3, w: 0.38, h: 1 / 3 },
    ],
  },
  {
    id: 'full', name: 'Full Bleed', blurb: 'One photo edge to edge, title over the sunset.',
    panels: [{ x: 0, y: 0, w: 1, h: 1 }],
  },
  {
    id: 'split', name: 'Sunset Split', blurb: 'A wide shot on top, two below it.',
    panels: [
      { x: 0, y: 0, w: 1, h: 0.58 },
      { x: 0, y: 0.58, w: 0.5, h: 0.42 }, { x: 0.5, y: 0.58, w: 0.5, h: 0.42 },
    ],
  },
  {
    id: 'columns', name: 'Vice Columns', blurb: 'Three tall panels side by side.',
    panels: [
      { x: 0, y: 0, w: 1 / 3, h: 1 }, { x: 1 / 3, y: 0, w: 1 / 3, h: 1 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 },
    ],
  },
];

// A grade is a gradient map: each pixel's luminance is re-lit through these stops, so a
// photo takes on a sunset, neon or noir grade while keeping its own shapes. The blend
// keeps a little of the original colour so skin and skies stay believable.
export const GRADES = [
  {
    id: 'sunset', name: 'Sunset Gold', strength: 0.82,
    swatch: 'linear-gradient(135deg,#2a0a2e,#e0405f,#ff9a3d,#ffe9a8)',
    stops: [[0, 26, 8, 40], [0.22, 110, 30, 74], [0.48, 224, 92, 62], [0.74, 255, 178, 84], [1, 255, 240, 198]],
  },
  {
    id: 'neon', name: 'Neon Vice', strength: 0.85,
    swatch: 'linear-gradient(135deg,#0b0430,#7a1fa2,#ff2e88,#37e6ff)',
    stops: [[0, 10, 4, 44], [0.28, 96, 18, 128], [0.55, 232, 42, 158], [0.8, 90, 214, 232], [1, 255, 248, 238]],
  },
  {
    id: 'teal', name: 'Teal Orange', strength: 0.8,
    swatch: 'linear-gradient(135deg,#04222b,#0e7d8c,#ff8a3d,#ffd9a0)',
    stops: [[0, 4, 26, 36], [0.3, 14, 96, 110], [0.55, 120, 140, 130], [0.78, 255, 150, 70], [1, 255, 226, 170]],
  },
  {
    id: 'noir', name: 'Noir', strength: 0.9,
    swatch: 'linear-gradient(135deg,#000,#555,#bbb,#fff)',
    stops: [[0, 0, 0, 0], [0.35, 52, 52, 58], [0.65, 150, 150, 158], [1, 255, 255, 255]],
  },
  {
    id: 'dusk', name: 'Palm Dusk', strength: 0.84,
    swatch: 'linear-gradient(135deg,#160b2e,#5b2a86,#e05a7a,#ffb36b)',
    stops: [[0, 18, 8, 44], [0.3, 84, 34, 118], [0.58, 214, 82, 112], [0.82, 255, 158, 92], [1, 255, 222, 168]],
  },
];

export const TITLE_COLORS = [
  { id: 'sunset', name: 'Sunset', stops: ['#fff3c4', '#ffb347', '#ff5e8a'] },
  { id: 'white', name: 'White', stops: ['#ffffff', '#f2e9ff', '#d9c8ff'] },
  { id: 'gold', name: 'Gold', stops: ['#fff8d6', '#ffd34d', '#e8930c'] },
  { id: 'pink', name: 'Pink', stops: ['#ffe3f2', '#ff7ad9', '#ff2e88'] },
  { id: 'cyan', name: 'Cyan', stops: ['#dffbff', '#7df3ff', '#19b8d8'] },
];

export const EXPORT_SIZES = [
  { id: 'square', label: 'Square · 1080 × 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait · 1080 × 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide · 1920 × 1080', w: 1920, h: 1080 },
  { id: 'story', label: 'Story · 1080 × 1920', w: 1080, h: 1920 },
];

export function defaultState() {
  return {
    layout: 'hero',
    grade: 'sunset',
    title: 'VICE COAST',
    subtitle: 'chasing the neon sunset',
    titleColor: 'sunset',
    titleSize: 1,
    grain: 0.55,
    vignette: 0.6,
    // One slot per layout panel, up to four. A slot holds the photo key, its zoom and its
    // pan (-1..1 in each axis); empty slots fall back to the first sample so the cover
    // is never blank.
    panels: [
      { key: 'sample:boulevard', zoom: 1.12, ox: 0, oy: 0 },
      { key: 'sample:neon-street', zoom: 1.12, ox: 0, oy: 0 },
      { key: 'sample:pier', zoom: 1.12, ox: 0, oy: 0 },
      { key: 'sample:sunset-beach', zoom: 1.12, ox: 0, oy: 0 },
    ],
  };
}

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) ?? GRADES[0];
}

export function titleColorById(id) {
  return TITLE_COLORS.find((c) => c.id === id) ?? TITLE_COLORS[0];
}

export function activePanelCount(state) {
  return layoutById(state.layout).panels.length;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const clamp11 = (v) => Math.max(-1, Math.min(1, v));

// Build a 256-entry lookup table from a grade's stops, interpolated per channel.
export function buildGradeLut(stops) {
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s][0] && t <= stops[s + 1][0]) { a = stops[s]; b = stops[s + 1]; break; }
    }
    const span = b[0] - a[0] || 1;
    const f = clamp01((t - a[0]) / span);
    lut[i * 3] = Math.round(a[1] + (b[1] - a[1]) * f);
    lut[i * 3 + 1] = Math.round(a[2] + (b[2] - a[2]) * f);
    lut[i * 3 + 2] = Math.round(a[3] + (b[3] - a[3]) * f);
  }
  return lut;
}

// Re-light raw pixels through the lookup table, blended with the original.
export function applyGradeToImageData(imageData, lut, strength) {
  const d = imageData.data;
  const keep = 1 - strength;
  for (let i = 0; i < d.length; i += 4) {
    const lum = Math.round(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
    const o = lum * 3;
    d[i] = d[i] * keep + lut[o] * strength;
    d[i + 1] = d[i + 1] * keep + lut[o + 1] * strength;
    d[i + 2] = d[i + 2] * keep + lut[o + 2] * strength;
  }
  return imageData;
}

// Draw a photo cover-fit into a rectangle, zoomed and panned. Pan is a fraction of the
// slack the zoom leaves, so the photo can never be dragged out of its panel.
export function drawPhotoCover(ctx, img, x, y, w, h, zoom, ox, oy) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const s = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * s;
  const dh = ih * s;
  const slackX = Math.max(0, (dw - w) / 2);
  const slackY = Math.max(0, (dh - h) / 2);
  const dx = x + (w - dw) / 2 + clamp11(ox) * slackX;
  const dy = y + (h - dh) / 2 + clamp11(oy) * slackY;
  ctx.drawImage(img, dx, dy, dw, dh);
}

// A deterministic skyline: blocky towers with lit windows and a couple of palm trees,
// drawn from a seed so every cover in a session shares the same coast. All original
// line art, drawn in code. It sits inside the title band, a dark silhouette with
// glowing windows, never a bar across the photos.
export function drawSkyline(ctx, x, baseY, w, h, color) {
  ctx.save();
  ctx.fillStyle = color;
  let bx = x;
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const winColors = ['#ffd34d', '#7df3ff', '#ff9de2'];
  const win = Math.max(2, w * 0.007);
  while (bx < x + w) {
    const bw = w * (0.035 + rand() * 0.05);
    const bh = h * (0.3 + rand() * 0.55);
    ctx.fillRect(bx, baseY - bh, bw, bh);
    if (rand() > 0.55) ctx.fillRect(bx + bw * 0.3, baseY - bh - h * 0.1, bw * 0.4, h * 0.1);
    const nw = 2 + Math.floor(rand() * 4);
    for (let k = 0; k < nw; k++) {
      ctx.fillStyle = winColors[Math.floor(rand() * winColors.length)];
      ctx.globalAlpha = 0.55 + rand() * 0.45;
      ctx.fillRect(
        bx + bw * (0.14 + rand() * 0.62),
        baseY - bh * (0.14 + rand() * 0.68),
        win, win,
      );
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    bx += bw + w * 0.014;
  }
  // Palm trees: a leaning trunk and six fronds that rise and droop.
  const palms = [x + w * 0.1, x + w * 0.88];
  for (const px of palms) {
    const ph = h * 0.85;
    const topX = px + w * 0.018;
    const topY = baseY - ph;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, w * 0.005);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px, baseY);
    ctx.quadraticCurveTo(px + w * 0.008, baseY - ph * 0.55, topX, topY);
    ctx.stroke();
    ctx.lineWidth = Math.max(1.5, w * 0.0035);
    for (let f = 0; f < 6; f++) {
      const a = ((-160 + f * 28) * Math.PI) / 180;
      const len = w * 0.042;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(
        topX + Math.cos(a) * len * 0.55, topY + Math.sin(a) * len * 0.55 - len * 0.28,
        topX + Math.cos(a) * len, topY + Math.sin(a) * len + len * 0.34,
      );
      ctx.stroke();
    }
  }
  ctx.restore();
}

let noiseCanvas = null;
function grainPattern(ctx) {
  if (!noiseCanvas) {
    noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 140;
    noiseCanvas.height = 140;
    const nctx = noiseCanvas.getContext('2d');
    const img = nctx.createImageData(140, 140);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 118 + Math.floor(Math.random() * 40);
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    nctx.putImageData(img, 0, 0);
  }
  return ctx.createPattern(noiseCanvas, 'repeat');
}

// The title block: a sunset sky band with a glowing sun, the skyline along its top edge,
// the big Anton title in a gradient with a dark keyline, and the Pacifico subtitle glowing
// beneath it. The band height follows the cover so the lettering always has room.
export function drawTitleBlock(ctx, state, W, H) {
  const bandH = Math.round(H * (state.layout === 'full' ? 0.3 : 0.26));
  const bandY = H - bandH;
  const sky = ctx.createLinearGradient(0, bandY, 0, H);
  sky.addColorStop(0, 'rgba(38,10,54,0)');
  sky.addColorStop(0.35, 'rgba(58,14,74,0.82)');
  sky.addColorStop(1, 'rgba(22,6,36,0.96)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, bandY, W, bandH);

  // Low sun glowing behind the title.
  const sunR = bandH * 0.52;
  const sunX = W * 0.5;
  const sunY = bandY + bandH * 0.42;
  const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.1, sunX, sunY, sunR * 1.9);
  glow.addColorStop(0, 'rgba(255,196,110,0.5)');
  glow.addColorStop(0.5, 'rgba(255,110,120,0.18)');
  glow.addColorStop(1, 'rgba(255,110,120,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - sunR * 2, sunY - sunR * 2, sunR * 4, sunR * 4);

  drawSkyline(ctx, 0, bandY + bandH * 0.52, W, bandH * 0.5, '#12041f');

  const title = (state.title || 'VICE COAST').toUpperCase();
  const color = titleColorById(state.titleColor);
  let size = Math.round(H * 0.115 * state.titleSize);
  const maxW = W * 0.92;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fitTitle = () => {
    ctx.font = `${size}px Anton, 'Arial Black', sans-serif`;
    const w = ctx.measureText(title).width;
    if (w > maxW) size = Math.max(24, Math.floor(size * (maxW / w)));
    ctx.font = `${size}px Anton, 'Arial Black', sans-serif`;
  };
  fitTitle();
  const titleY = bandY + bandH * 0.46;
  const fill = ctx.createLinearGradient(0, titleY - size * 0.55, 0, titleY + size * 0.55);
  fill.addColorStop(0, color.stops[0]);
  fill.addColorStop(0.55, color.stops[1]);
  fill.addColorStop(1, color.stops[2]);
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(22,6,36,0.9)';
  ctx.lineWidth = Math.max(3, size * 0.07);
  ctx.strokeText(title, W / 2, titleY);
  ctx.shadowColor = 'rgba(255,46,136,0.45)';
  ctx.shadowBlur = size * 0.12;
  ctx.fillStyle = fill;
  ctx.fillText(title, W / 2, titleY);
  ctx.restore();

  const sub = (state.subtitle || '').trim();
  if (sub) {
    const subSize = Math.max(16, Math.round(size * 0.34));
    ctx.font = `${subSize}px Pacifico, cursive`;
    ctx.save();
    ctx.shadowColor = '#ff2e88';
    ctx.shadowBlur = subSize * 0.55;
    ctx.fillStyle = '#ffd7ef';
    ctx.fillText(sub, W / 2, bandY + bandH * 0.82);
    ctx.restore();
  }
}

// Draw the whole cover onto a canvas of W x H. `images` maps photo keys to loaded
// <img> elements (or null); a missing photo falls back to the first sample image.
export function renderCover(canvas, state, images, W, H) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#12081f';
  ctx.fillRect(0, 0, W, H);

  const layout = layoutById(state.layout);
  const grade = gradeById(state.grade);
  const lut = buildGradeLut(grade.stops);
  const gutter = Math.max(2, Math.round(Math.min(W, H) * 0.008));
  const fallback = images.get('sample:boulevard') ?? null;

  const panelCanvas = document.createElement('canvas');
  const pctx = panelCanvas.getContext('2d');

  layout.panels.forEach((rect, i) => {
    const slot = state.panels[i] ?? state.panels[0];
    const img = images.get(slot.key) ?? fallback;
    const x = Math.round(rect.x * W) + (rect.x > 0 ? gutter / 2 : 0);
    const y = Math.round(rect.y * H) + (rect.y > 0 ? gutter / 2 : 0);
    const w = Math.round(rect.w * W) - (rect.x > 0 ? gutter / 2 : 0) - (rect.x + rect.w < 1 ? gutter / 2 : 0);
    const h = Math.round(rect.h * H) - (rect.y > 0 ? gutter / 2 : 0) - (rect.y + rect.h < 1 ? gutter / 2 : 0);
    if (!img || w <= 0 || h <= 0) return;
    panelCanvas.width = w;
    panelCanvas.height = h;
    pctx.fillStyle = '#12081f';
    pctx.fillRect(0, 0, w, h);
    drawPhotoCover(pctx, img, 0, 0, w, h, slot.zoom, slot.ox, slot.oy);
    const data = pctx.getImageData(0, 0, w, h);
    applyGradeToImageData(data, lut, grade.strength);
    pctx.putImageData(data, 0, 0);
    ctx.drawImage(panelCanvas, x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = Math.max(1, Math.round(Math.min(W, H) * 0.0012));
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  });

  drawTitleBlock(ctx, state, W, H);

  // Poster frame: a dark outer edge and a thin bright keyline inside it.
  const frame = Math.max(6, Math.round(Math.min(W, H) * 0.012));
  ctx.strokeStyle = '#0d0518';
  ctx.lineWidth = frame;
  ctx.strokeRect(frame / 2, frame / 2, W - frame, H - frame);
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = Math.max(1, Math.round(frame * 0.14));
  ctx.strokeRect(frame + 2, frame + 2, W - frame * 2 - 4, H - frame * 2 - 4);

  // Corner badge: the studio's own mark, top left.
  const badgeH = Math.max(22, Math.round(H * 0.032));
  const badgePad = Math.round(badgeH * 0.45);
  ctx.font = `${Math.round(badgeH * 0.52)}px Anton, 'Arial Black', sans-serif`;
  const badgeText = '★ VICE COAST';
  const badgeW = ctx.measureText(badgeText).width + badgePad * 2;
  const bx = frame + Math.round(W * 0.02);
  const by = frame + Math.round(H * 0.02);
  ctx.fillStyle = 'rgba(13,5,24,0.72)';
  ctx.beginPath();
  ctx.roundRect(bx, by, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  ctx.fillStyle = '#ffcf5c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, bx + badgePad, by + badgeH / 2 + 1);

  if (state.vignette > 0) {
    const vg = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.75,
    );
    vg.addColorStop(0, 'rgba(10,4,20,0)');
    vg.addColorStop(1, `rgba(10,4,20,${0.42 * state.vignette})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }

  if (state.grain > 0) {
    ctx.save();
    ctx.globalAlpha = 0.05 + 0.07 * state.grain;
    ctx.fillStyle = grainPattern(ctx);
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  return canvas;
}

// Render a cover at export size and hand back a PNG blob, ready to download.
export function exportCover(state, images, width, height) {
  const canvas = document.createElement('canvas');
  renderCover(canvas, state, images, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG export failed'));
    }, 'image/png');
  });
}

// Load one photo (a sample file or an object URL) into an <img>.
export function loadPhotoImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

export async function loadSampleImages() {
  const images = new Map();
  for (const photo of SAMPLE_PHOTOS) {
    try {
      images.set(`sample:${photo.id}`, await loadPhotoImage(photo.file));
    } catch {
      // A missing sample leaves its panels on the fallback; the cover still renders.
    }
  }
  return images;
}

// Wait until the vendored Anton and Pacifico faces are usable, so titles never render
// in a fallback font. Times out kindly: the cover still draws without them.
export async function waitForCoverFonts() {
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('40px Anton'),
        document.fonts.load('40px Pacifico'),
        document.fonts.ready,
      ]),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
  } catch {
    // Fallback fonts still draw a readable cover.
  }
}
