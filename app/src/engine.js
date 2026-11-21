// Vice Coast Cover Studio — cover engine, written fresh for round 5.
//
// One module owns everything a cover looks like: the panel frames, the Vice City
// tone maps, the hand-drawn skyline, the sunset headline band, grain and shade.
// It paints onto any 2D canvas at any pixel size, so the live preview and the
// exported PNG run the same code — export just asks for more pixels. All art is
// drawn in code; the lettering is Anton and Pacifico under the SIL Open Font
// License. No Rockstar logo, artwork or font anywhere.

export const SAMPLES = [
  { key: 'boulevard', path: 'samples/boulevard.jpg', name: 'Boulevard' },
  { key: 'neon-street', path: 'samples/neon-street.jpg', name: 'Neon Street' },
  { key: 'pier', path: 'samples/pier.jpg', name: 'Pier' },
  { key: 'sunset-beach', path: 'samples/sunset-beach.jpg', name: 'Sunset Beach' },
];

// A frame is a set of panel cells, each [x, y, w, h] as fractions of the cover.
// The headline band is painted over the bottom of the panels, poster style.
export const FRAMES = [
  {
    id: 'quad', label: 'Four Corners', note: 'Four equal panels — the classic cover grid.',
    cells: [[0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]],
  },
  {
    id: 'hero', label: 'Hero + Trio', note: 'One tall hero shot, three stacked beside it.',
    cells: [[0, 0, 0.62, 1], [0.62, 0, 0.38, 1 / 3], [0.62, 1 / 3, 0.38, 1 / 3], [0.62, 2 / 3, 0.38, 1 / 3]],
  },
  {
    id: 'full', label: 'Full Bleed', note: 'A single photo edge to edge, title over the dusk.',
    cells: [[0, 0, 1, 1]],
  },
  {
    id: 'split', label: 'Sunset Split', note: 'A wide shot on top, two panels below it.',
    cells: [[0, 0, 1, 0.58], [0, 0.58, 0.5, 0.42], [0.5, 0.58, 0.5, 0.42]],
  },
  {
    id: 'columns', label: 'Vice Columns', note: 'Three tall panels standing side by side.',
    cells: [[0, 0, 1 / 3, 1], [1 / 3, 0, 1 / 3, 1], [2 / 3, 0, 1 / 3, 1]],
  },
];

// A tone is a gradient map: a pixel's brightness is re-lit through the ramp, so a
// photo takes on a sunset, neon or noir mood while keeping its own shapes. A little
// of the original colour is kept, so skin and skies stay believable.
export const TONES = [
  {
    id: 'sunset', label: 'Sunset Gold', mix: 0.8,
    css: 'linear-gradient(135deg,#2b0a33,#c22a5e,#ff8c3a,#ffe6a1)',
    ramp: [[0, 30, 9, 45], [0.25, 118, 34, 80], [0.5, 228, 96, 66], [0.75, 255, 172, 78], [1, 255, 238, 192]],
  },
  {
    id: 'neon', label: 'Neon Vice', mix: 0.84,
    css: 'linear-gradient(135deg,#0a0333,#7c1ea6,#ff2e8a,#3ae2ff)',
    ramp: [[0, 12, 5, 48], [0.3, 102, 20, 134], [0.55, 236, 44, 160], [0.8, 96, 212, 234], [1, 255, 246, 236]],
  },
  {
    id: 'teal', label: 'Teal Orange', mix: 0.78,
    css: 'linear-gradient(135deg,#052530,#0f7f8e,#ff8a3d,#ffd9a2)',
    ramp: [[0, 5, 28, 40], [0.3, 16, 100, 114], [0.55, 128, 142, 132], [0.78, 255, 152, 72], [1, 255, 224, 168]],
  },
  {
    id: 'noir', label: 'Noir', mix: 0.88,
    css: 'linear-gradient(135deg,#000,#4d4d55,#b5b5bd,#fff)',
    ramp: [[0, 0, 0, 0], [0.35, 48, 48, 54], [0.65, 146, 146, 154], [1, 255, 255, 255]],
  },
  {
    id: 'dusk', label: 'Palm Dusk', mix: 0.82,
    css: 'linear-gradient(135deg,#170c30,#5c2b88,#df5a7c,#ffb16c)',
    ramp: [[0, 20, 9, 48], [0.3, 88, 36, 122], [0.58, 216, 84, 114], [0.82, 255, 160, 94], [1, 255, 220, 166]],
  },
];

export const INKS = [
  { id: 'sunset', label: 'Sunset', stops: ['#fff3c2', '#ffb347', '#ff5e8a'] },
  { id: 'white', label: 'White', stops: ['#ffffff', '#f2e9ff', '#d6c6ff'] },
  { id: 'gold', label: 'Gold', stops: ['#fff8d4', '#ffd34d', '#e8930c'] },
  { id: 'pink', label: 'Pink', stops: ['#ffe3f2', '#ff7ad9', '#ff2e88'] },
  { id: 'cyan', label: 'Cyan', stops: ['#dffbff', '#7df3ff', '#17b6d8'] },
];

export const SIZES = [
  { id: 'square', label: 'Square · 1080 × 1080', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait · 1080 × 1350', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide · 1920 × 1080', w: 1920, h: 1080 },
  { id: 'story', label: 'Story · 1080 × 1920', w: 1080, h: 1920 },
];

export function freshCover() {
  return {
    frame: 'hero',
    tone: 'sunset',
    headline: 'VICE COAST',
    tagline: 'chasing the neon sunset',
    ink: 'sunset',
    headScale: 1,
    grain: 0.55,
    shade: 0.6,
    // One slot per frame cell, at most four. A slot points at a photo and holds its
    // crop: scale (zoom) and pan dx/dy in -1..1. A slot with no photo falls back to
    // the first sample, so a cover is never blank.
    slots: [
      { photo: 'sample:boulevard', scale: 1.12, dx: 0, dy: 0 },
      { photo: 'sample:neon-street', scale: 1.12, dx: 0, dy: 0 },
      { photo: 'sample:pier', scale: 1.12, dx: 0, dy: 0 },
      { photo: 'sample:sunset-beach', scale: 1.12, dx: 0, dy: 0 },
    ],
  };
}

export function frameOf(id) {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}

export function toneOf(id) {
  return TONES.find((t) => t.id === id) ?? TONES[0];
}

export function inkOf(id) {
  return INKS.find((c) => c.id === id) ?? INKS[0];
}

export function slotCount(cover) {
  return frameOf(cover.frame).cells.length;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const clampPan = (v) => Math.max(-1, Math.min(1, v));

// Expand a tone's ramp into a 256-step lookup table, one RGB triple per brightness.
export function toneTable(ramp) {
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = ramp[0];
    let b = ramp[ramp.length - 1];
    for (let s = 0; s < ramp.length - 1; s++) {
      if (t >= ramp[s][0] && t <= ramp[s + 1][0]) { a = ramp[s]; b = ramp[s + 1]; break; }
    }
    const span = b[0] - a[0] || 1;
    const f = clamp01((t - a[0]) / span);
    lut[i * 3] = Math.round(a[1] + (b[1] - a[1]) * f);
    lut[i * 3 + 1] = Math.round(a[2] + (b[2] - a[2]) * f);
    lut[i * 3 + 2] = Math.round(a[3] + (b[3] - a[3]) * f);
  }
  return lut;
}

// Re-light raw pixels through the lookup table, blended with the original shot.
export function gradePixels(imageData, lut, mix) {
  const d = imageData.data;
  const keep = 1 - mix;
  for (let i = 0; i < d.length; i += 4) {
    const lum = Math.round(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
    const o = lum * 3;
    d[i] = d[i] * keep + lut[o] * mix;
    d[i + 1] = d[i + 1] * keep + lut[o + 1] * mix;
    d[i + 2] = d[i + 2] * keep + lut[o + 2] * mix;
  }
  return imageData;
}

// Draw a photo cover-fit into a rectangle, scaled and panned. Pan is a fraction of
// the slack the zoom leaves, so a photo can never be dragged out of its panel.
export function paintPhoto(ctx, img, x, y, w, h, scale, dx, dy) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const s = Math.max(w / iw, h / ih) * scale;
  const dw = iw * s;
  const dh = ih * s;
  const freeX = Math.max(0, (dw - w) / 2);
  const freeY = Math.max(0, (dh - h) / 2);
  const px = x + (w - dw) / 2 + clampPan(dx) * freeX;
  const py = y + (h - dh) / 2 + clampPan(dy) * freeY;
  ctx.drawImage(img, px, py, dw, dh);
}

// Small deterministic random stream, so every cover in a session shares one coast.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A hand-drawn skyline: blocky towers with lit windows, rooftop aerials, and two
// leaning palms. Original line art, drawn in code, standing in the headline band
// as a dark silhouette with glowing windows.
export function paintSkyline(ctx, x, groundY, w, h, color) {
  ctx.save();
  const next = mulberry32(20261121);
  const lit = ['#ffd34d', '#7df3ff', '#ff9de2'];
  const pane = Math.max(2, w * 0.007);
  ctx.fillStyle = color;
  let bx = x;
  while (bx < x + w) {
    const bw = w * (0.035 + next() * 0.05);
    const bh = h * (0.3 + next() * 0.55);
    ctx.fillRect(bx, groundY - bh, bw, bh);
    if (next() > 0.55) {
      ctx.fillRect(bx + bw * 0.3, groundY - bh - h * 0.1, bw * 0.4, h * 0.1);
    }
    const windows = 2 + Math.floor(next() * 4);
    for (let k = 0; k < windows; k++) {
      ctx.fillStyle = lit[Math.floor(next() * lit.length)];
      ctx.globalAlpha = 0.55 + next() * 0.45;
      ctx.fillRect(
        bx + bw * (0.14 + next() * 0.62),
        groundY - bh * (0.14 + next() * 0.68),
        pane, pane,
      );
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    bx += bw + w * 0.014;
  }
  // Palms: a leaning trunk and six fronds that arc up, then droop.
  for (const px of [x + w * 0.1, x + w * 0.88]) {
    const ph = h * 0.85;
    const topX = px + w * 0.018;
    const topY = groundY - ph;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, w * 0.005);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px, groundY);
    ctx.quadraticCurveTo(px + w * 0.008, groundY - ph * 0.55, topX, topY);
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

let noiseTile = null;
function grainTile(ctx) {
  if (!noiseTile) {
    noiseTile = document.createElement('canvas');
    noiseTile.width = 140;
    noiseTile.height = 140;
    const nctx = noiseTile.getContext('2d');
    const img = nctx.createImageData(140, 140);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 118 + Math.floor(Math.random() * 40);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    nctx.putImageData(img, 0, 0);
  }
  return ctx.createPattern(noiseTile, 'repeat');
}

// The headline band: a dusk sky fading up from the photos, a striped synthwave
// sun glowing behind the words, the skyline along its middle, the big Anton
// headline in a gradient with a dark keyline, and the Pacifico tagline glowing
// beneath it. The band height follows the cover so the lettering always fits.
export function paintHeadline(ctx, cover, W, H) {
  const bandH = Math.round(H * (cover.frame === 'full' ? 0.3 : 0.26));
  const bandY = H - bandH;
  const sky = ctx.createLinearGradient(0, bandY, 0, H);
  sky.addColorStop(0, 'rgba(38,10,54,0)');
  sky.addColorStop(0.35, 'rgba(58,14,74,0.82)');
  sky.addColorStop(1, 'rgba(22,6,36,0.96)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, bandY, W, bandH);

  // Low sun: a warm disc with widening slits cut across its lower half, glowing.
  const sunR = bandH * 0.52;
  const sunX = W * 0.5;
  const sunY = bandY + bandH * 0.42;
  const halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.1, sunX, sunY, sunR * 1.9);
  halo.addColorStop(0, 'rgba(255,196,110,0.5)');
  halo.addColorStop(0.5, 'rgba(255,110,120,0.18)');
  halo.addColorStop(1, 'rgba(255,110,120,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(sunX - sunR * 2, sunY - sunR * 2, sunR * 4, sunR * 4);
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.clip();
  const disc = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  disc.addColorStop(0, '#ffe9a8');
  disc.addColorStop(0.55, '#ff9a3d');
  disc.addColorStop(1, '#ff2e88');
  ctx.fillStyle = disc;
  ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
  ctx.fillStyle = 'rgba(58,14,74,0.9)';
  for (let i = 0; i < 4; i++) {
    const gapY = sunY + sunR * (0.05 + i * 0.2);
    ctx.fillRect(sunX - sunR, gapY, sunR * 2, sunR * (0.03 + i * 0.02));
  }
  ctx.restore();

  paintSkyline(ctx, 0, bandY + bandH * 0.52, W, bandH * 0.5, '#12041f');

  const headline = (cover.headline || 'VICE COAST').toUpperCase();
  const ink = inkOf(cover.ink);
  let size = Math.round(H * 0.115 * cover.headScale);
  const maxW = W * 0.92;
  const headY = bandY + bandH * 0.46;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${size}px Anton, 'Arial Black', sans-serif`;
  if (ctx.measureText(headline).width > maxW) {
    size = Math.max(24, Math.floor(size * (maxW / ctx.measureText(headline).width)));
    ctx.font = `${size}px Anton, 'Arial Black', sans-serif`;
  }
  const fill = ctx.createLinearGradient(0, headY - size * 0.55, 0, headY + size * 0.55);
  fill.addColorStop(0, ink.stops[0]);
  fill.addColorStop(0.55, ink.stops[1]);
  fill.addColorStop(1, ink.stops[2]);
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(22,6,36,0.9)';
  ctx.lineWidth = Math.max(3, size * 0.07);
  ctx.strokeText(headline, W / 2, headY);
  ctx.shadowColor = 'rgba(255,46,136,0.45)';
  ctx.shadowBlur = size * 0.12;
  ctx.fillStyle = fill;
  ctx.fillText(headline, W / 2, headY);
  ctx.restore();

  const tag = (cover.tagline || '').trim();
  if (tag) {
    const tagSize = Math.max(16, Math.round(size * 0.34));
    ctx.font = `${tagSize}px Pacifico, cursive`;
    ctx.save();
    ctx.shadowColor = '#ff2e88';
    ctx.shadowBlur = tagSize * 0.55;
    ctx.fillStyle = '#ffd7ef';
    ctx.fillText(tag, W / 2, bandY + bandH * 0.82);
    ctx.restore();
  }
}

// Paint the whole cover onto a canvas of W x H. `photos` maps photo keys to
// loaded <img> elements (or null); a missing photo falls back to the first sample.
export function paintCover(canvas, cover, photos, W, H) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#12081f';
  ctx.fillRect(0, 0, W, H);

  const frame = frameOf(cover.frame);
  const tone = toneOf(cover.tone);
  const lut = toneTable(tone.ramp);
  const gap = Math.max(2, Math.round(Math.min(W, H) * 0.008));
  const fallback = photos.get('sample:boulevard') ?? null;

  const cellCanvas = document.createElement('canvas');
  const cellCtx = cellCanvas.getContext('2d');

  frame.cells.forEach((cell, i) => {
    const slot = cover.slots[i] ?? cover.slots[0];
    const img = photos.get(slot.photo) ?? fallback;
    const x = Math.round(cell[0] * W) + (cell[0] > 0 ? gap / 2 : 0);
    const y = Math.round(cell[1] * H) + (cell[1] > 0 ? gap / 2 : 0);
    const w = Math.round(cell[2] * W) - (cell[0] > 0 ? gap / 2 : 0) - (cell[0] + cell[2] < 1 ? gap / 2 : 0);
    const h = Math.round(cell[3] * H) - (cell[1] > 0 ? gap / 2 : 0) - (cell[1] + cell[3] < 1 ? gap / 2 : 0);
    if (!img || w <= 0 || h <= 0) return;
    cellCanvas.width = w;
    cellCanvas.height = h;
    cellCtx.fillStyle = '#12081f';
    cellCtx.fillRect(0, 0, w, h);
    paintPhoto(cellCtx, img, 0, 0, w, h, slot.scale, slot.dx, slot.dy);
    const data = cellCtx.getImageData(0, 0, w, h);
    gradePixels(data, lut, tone.mix);
    cellCtx.putImageData(data, 0, 0);
    ctx.drawImage(cellCanvas, x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = Math.max(1, Math.round(Math.min(W, H) * 0.0012));
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  });

  paintHeadline(ctx, cover, W, H);

  // Poster frame: a dark outer edge and a thin bright keyline inside it.
  const edge = Math.max(6, Math.round(Math.min(W, H) * 0.012));
  ctx.strokeStyle = '#0d0518';
  ctx.lineWidth = edge;
  ctx.strokeRect(edge / 2, edge / 2, W - edge, H - edge);
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = Math.max(1, Math.round(edge * 0.14));
  ctx.strokeRect(edge + 2, edge + 2, W - edge * 2 - 4, H - edge * 2 - 4);

  // Corner stamp: the studio's own mark, top left.
  const stampH = Math.max(22, Math.round(H * 0.032));
  const stampPad = Math.round(stampH * 0.45);
  ctx.font = `${Math.round(stampH * 0.52)}px Anton, 'Arial Black', sans-serif`;
  const stampText = '★ VICE COAST';
  const stampW = ctx.measureText(stampText).width + stampPad * 2;
  const stampX = edge + Math.round(W * 0.02);
  const stampY = edge + Math.round(H * 0.02);
  ctx.fillStyle = 'rgba(13,5,24,0.72)';
  ctx.beginPath();
  ctx.roundRect(stampX, stampY, stampW, stampH, stampH / 2);
  ctx.fill();
  ctx.fillStyle = '#ffcf5c';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(stampText, stampX + stampPad, stampY + stampH / 2 + 1);

  if (cover.shade > 0) {
    const vg = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.75,
    );
    vg.addColorStop(0, 'rgba(10,4,20,0)');
    vg.addColorStop(1, `rgba(10,4,20,${0.42 * cover.shade})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }

  if (cover.grain > 0) {
    ctx.save();
    ctx.globalAlpha = 0.05 + 0.07 * cover.grain;
    ctx.fillStyle = grainTile(ctx);
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  return canvas;
}

// Render a cover at export size and hand back a PNG blob, ready to download.
export function exportPng(cover, photos, width, height) {
  const canvas = document.createElement('canvas');
  paintCover(canvas, cover, photos, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG export failed'));
    }, 'image/png');
  });
}

// Load one photo (a sample file or an object URL) into an <img>.
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

export async function loadSamples() {
  const photos = new Map();
  for (const sample of SAMPLES) {
    try {
      photos.set(`sample:${sample.key}`, await loadImage(sample.path));
    } catch {
      // A missing sample leaves its panels on the fallback; the cover still paints.
    }
  }
  return photos;
}

// Wait until the vendored Anton and Pacifico faces are usable, so headlines never
// paint in a fallback font. Times out kindly: the cover still draws without them.
export async function fontsReady() {
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
