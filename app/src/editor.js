// Vice Coast Cover Studio — the editor.
//
// Wires the controls in index.html to the cover engine in engine.js: loading
// photos, picking frames and tones, editing the caption, dragging panels to crop
// them, and exporting the finished cover as a PNG. Everything runs in the
// browser; no photo is ever uploaded anywhere.

import {
  SAMPLES, FRAMES, TONES, INKS, SIZES,
  freshCover, frameOf, slotCount,
  paintCover, exportPng, loadImage, loadSamples, fontsReady,
} from './engine.js';

const PREVIEW = 960;

const cover = freshCover();
const photos = new Map(); // photo key -> loaded <img>
const uploadUrls = new Map(); // upload key -> object URL (for thumbnails)
let picked = 0;
let samplesIn = false;

const $ = (id) => document.getElementById(id);
const stage = $('stageCanvas');

// ------------------------------------------------------------------ lookups

function photoName(key) {
  if (key.startsWith('sample:')) {
    return SAMPLES.find((p) => `sample:${p.key}` === key)?.name ?? 'Photo';
  }
  return key.split(':').slice(2).join(':') || 'Uploaded photo';
}

function photoThumb(key) {
  if (key.startsWith('sample:')) return `samples/${key.slice('sample:'.length)}.jpg`;
  return uploadUrls.get(key) ?? '';
}

function pickedSlot() {
  return cover.slots[picked];
}

// ------------------------------------------------------------ preview paint

let paintQueued = false;
function repaint() {
  if (paintQueued) return;
  paintQueued = true;
  requestAnimationFrame(() => {
    paintQueued = false;
    paintCover(stage, cover, photos, PREVIEW, PREVIEW);
    $('stageSize').textContent = `${PREVIEW} × ${PREVIEW} preview`;
  });
}

function refreshSlotInfo() {
  const slot = pickedSlot();
  $('slotInfo').textContent =
    `Panel ${picked + 1} of ${slotCount(cover)} · ${photoName(slot.photo)} · ` +
    `zoom ${slot.scale.toFixed(2)}×`;
}

// -------------------------------------------------------------- control UI

function buildFrames() {
  const box = $('framePicker');
  box.innerHTML = '';
  for (const frame of FRAMES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pick' + (cover.frame === frame.id ? ' on' : '');
    btn.innerHTML = `${frame.label}<small>${frame.cells.length} panel${frame.cells.length > 1 ? 's' : ''}</small>`;
    btn.addEventListener('click', () => {
      cover.frame = frame.id;
      picked = Math.min(picked, slotCount(cover) - 1);
      $('frameNote').textContent = frame.note;
      buildFrames();
      refreshSlots();
      refreshSlotInfo();
      repaint();
    });
    box.appendChild(btn);
  }
  $('frameNote').textContent = frameOf(cover.frame).note;
}

function buildTones() {
  const box = $('tonePicker');
  box.innerHTML = '';
  for (const tone of TONES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pick' + (cover.tone === tone.id ? ' on' : '');
    btn.innerHTML = `<span class="swatch" style="background:${tone.css}"></span><span class="swatch-label">${tone.label}</span>`;
    btn.addEventListener('click', () => {
      cover.tone = tone.id;
      buildTones();
      repaint();
    });
    box.appendChild(btn);
  }
}

function buildInks() {
  const row = $('inkRow');
  row.innerHTML = '';
  for (const ink of INKS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ink-dot' + (cover.ink === ink.id ? ' on' : '');
    btn.title = ink.label;
    btn.setAttribute('aria-label', `Title colour ${ink.label}`);
    btn.style.background = `linear-gradient(135deg, ${ink.stops.join(', ')})`;
    btn.addEventListener('click', () => {
      cover.ink = ink.id;
      buildInks();
      repaint();
    });
    row.appendChild(btn);
  }
}

function buildTray() {
  const tray = $('photoTray');
  tray.innerHTML = '';
  for (const sample of SAMPLES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thumb';
    btn.title = `${sample.name} — click to put it in the selected panel`;
    btn.innerHTML = `<img src="${sample.path}" alt="${sample.name} sample photo"><span>${sample.name}</span>`;
    btn.addEventListener('click', () => {
      pickedSlot().photo = `sample:${sample.key}`;
      refreshSlots();
      refreshSlotInfo();
      repaint();
    });
    tray.appendChild(btn);
  }
}

function refreshSlots() {
  const list = $('slotList');
  list.innerHTML = '';
  const count = slotCount(cover);
  for (let i = 0; i < count; i++) {
    const slot = cover.slots[i];
    const row = document.createElement('div');
    row.className = 'slot-row' + (i === picked ? ' picked' : '');
    row.innerHTML =
      `<img src="${photoThumb(slot.photo)}" alt="">` +
      `<span class="slot-name">Panel ${i + 1} · ${photoName(slot.photo)}` +
      `<small>drag in preview to move · scroll to zoom</small></span>`;
    const swap = document.createElement('button');
    swap.type = 'button';
    swap.className = 'swap-btn';
    swap.textContent = 'Replace…';
    swap.addEventListener('click', (event) => {
      event.stopPropagation();
      picked = i;
      $('fileInput').click();
    });
    row.appendChild(swap);
    row.addEventListener('click', () => {
      picked = i;
      refreshSlots();
      refreshSlotInfo();
    });
    list.appendChild(row);
  }
}

function buildExports() {
  const grid = $('exportGrid');
  grid.innerHTML = '';
  for (const size of SIZES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button accent';
    btn.textContent = size.label;
    btn.addEventListener('click', () => doExport(size));
    grid.appendChild(btn);
  }
}

async function doExport(size) {
  const note = $('exportNote');
  note.textContent = `Drawing ${size.w} × ${size.h}…`;
  try {
    await fontsReady();
    const blob = await exportPng(cover, photos, size.w, size.h);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vice-coast-${size.w}x${size.h}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    note.textContent = `Saved vice-coast-${size.w}x${size.h}.png ✓ (${(blob.size / 1024).toFixed(0)} KiB)`;
  } catch (error) {
    note.textContent = `Export failed: ${error.message}`;
  }
}

// Rebuild every control from the current cover, so a scene (scenes.js) that sets
// the cover from the URL can make the buttons and inputs agree with it.
function syncAll() {
  buildFrames();
  buildTones();
  buildInks();
  refreshSlots();
  $('headlineInput').value = cover.headline;
  $('taglineInput').value = cover.tagline;
  $('headSlider').value = String(Math.round(cover.headScale * 100));
  $('headOut').textContent = `${Math.round(cover.headScale * 100)}%`;
  $('grainSlider').value = String(Math.round(cover.grain * 100));
  $('grainOut').textContent = `${Math.round(cover.grain * 100)}%`;
  refreshSlotInfo();
}

async function fillSamples() {
  if (!samplesIn) {
    const loaded = await loadSamples();
    for (const [key, img] of loaded) photos.set(key, img);
    samplesIn = true;
  }
  cover.slots[0].photo = 'sample:boulevard';
  cover.slots[1].photo = 'sample:neon-street';
  cover.slots[2].photo = 'sample:pier';
  cover.slots[3].photo = 'sample:sunset-beach';
  refreshSlots();
  refreshSlotInfo();
  repaint();
}

async function takeUploads(files) {
  const list = [...files].filter((f) => f.type.startsWith('image/')).slice(0, 4);
  if (!list.length) return;
  let target = picked;
  for (const file of list) {
    const url = URL.createObjectURL(file);
    const key = `upload:${Date.now()}:${file.name}`;
    try {
      const img = await loadImage(url);
      photos.set(key, img);
      uploadUrls.set(key, url);
      cover.slots[target % 4].photo = key;
      target += 1;
    } catch {
      URL.revokeObjectURL(url);
    }
  }
  picked = Math.min(target - 1, slotCount(cover) - 1);
  refreshSlots();
  refreshSlotInfo();
  repaint();
}

// ------------------------------------------------------- canvas drag / zoom

function toCanvasPoint(event) {
  const rect = stage.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PREVIEW,
    y: ((event.clientY - rect.top) / rect.height) * PREVIEW,
  };
}

function hitCell(point) {
  const frame = frameOf(cover.frame);
  for (let i = 0; i < frame.cells.length; i++) {
    const c = frame.cells[i];
    if (point.x >= c[0] * PREVIEW && point.x < (c[0] + c[2]) * PREVIEW &&
        point.y >= c[1] * PREVIEW && point.y < (c[1] + c[3]) * PREVIEW) {
      return i;
    }
  }
  return -1;
}

let drag = null;

stage.addEventListener('pointerdown', (event) => {
  const point = toCanvasPoint(event);
  const hit = hitCell(point);
  if (hit === -1) return;
  picked = hit;
  refreshSlots();
  const slot = pickedSlot();
  const cell = frameOf(cover.frame).cells[hit];
  const img = photos.get(slot.photo);
  let slackX = 0;
  let slackY = 0;
  if (img) {
    const w = cell[2] * PREVIEW;
    const h = cell[3] * PREVIEW;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight) * slot.scale;
    slackX = Math.max(0, (img.naturalWidth * s - w) / 2);
    slackY = Math.max(0, (img.naturalHeight * s - h) / 2);
  }
  drag = { x: point.x, y: point.y, dx: slot.dx, dy: slot.dy, slackX, slackY };
  stage.setPointerCapture(event.pointerId);
  stage.classList.add('grabbing');
});

stage.addEventListener('pointermove', (event) => {
  if (!drag) return;
  const point = toCanvasPoint(event);
  const slot = pickedSlot();
  if (drag.slackX > 0) slot.dx = Math.max(-1, Math.min(1, drag.dx + (point.x - drag.x) / drag.slackX));
  if (drag.slackY > 0) slot.dy = Math.max(-1, Math.min(1, drag.dy + (point.y - drag.y) / drag.slackY));
  refreshSlotInfo();
  repaint();
});

function endDrag() {
  drag = null;
  stage.classList.remove('grabbing');
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

stage.addEventListener('wheel', (event) => {
  event.preventDefault();
  const point = toCanvasPoint(event);
  const hit = hitCell(point);
  if (hit === -1) return;
  picked = hit;
  const slot = pickedSlot();
  slot.scale = Math.max(1, Math.min(3, slot.scale * Math.exp(-event.deltaY * 0.0012)));
  refreshSlots();
  refreshSlotInfo();
  repaint();
}, { passive: false });

// -------------------------------------------------------------------- boot

function boot() {
  buildFrames();
  buildTones();
  buildInks();
  buildTray();
  refreshSlots();
  buildExports();
  refreshSlotInfo();

  $('btnSamples').addEventListener('click', fillSamples);
  $('btnUpload').addEventListener('click', () => $('fileInput').click());
  $('fileInput').addEventListener('change', (event) => {
    takeUploads(event.target.files);
    event.target.value = '';
  });

  $('headlineInput').addEventListener('input', (event) => {
    cover.headline = event.target.value;
    repaint();
  });
  $('taglineInput').addEventListener('input', (event) => {
    cover.tagline = event.target.value;
    repaint();
  });
  $('headSlider').addEventListener('input', (event) => {
    cover.headScale = Number(event.target.value) / 100;
    $('headOut').textContent = `${event.target.value}%`;
    repaint();
  });
  $('grainSlider').addEventListener('input', (event) => {
    cover.grain = Number(event.target.value) / 100;
    $('grainOut').textContent = `${event.target.value}%`;
    repaint();
  });

  $('btnResetSlot').addEventListener('click', () => {
    Object.assign(pickedSlot(), { scale: 1.12, dx: 0, dy: 0 });
    refreshSlotInfo();
    repaint();
  });
  $('btnShuffle').addEventListener('click', () => {
    const keys = [...photos.keys()].filter((k) => k.startsWith('sample:'));
    if (!keys.length) return;
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    const count = slotCount(cover);
    for (let i = 0; i < count; i++) cover.slots[i].photo = keys[i % keys.length];
    refreshSlots();
    refreshSlotInfo();
    repaint();
  });

  // First paint: load the samples and the fonts, then draw.
  fontsReady().then(() => {
    fillSamples().catch(() => repaint());
    repaint();
  });
  loadSamples().then((loaded) => {
    for (const [key, img] of loaded) photos.set(key, img);
    samplesIn = true;
    repaint();
  });
  repaint();
}

// The shot scenes (scenes.js) and the console can reach the live editor here.
window.__viceCoast = { cover, photos, repaint, syncAll, fillSamples, exportPng };

boot();
