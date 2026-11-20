// Vice Coast Cover Studio — interface wiring.
//
// Loads photos, binds every control on the page, keeps undo history, builds
// share links that restore a cover, and exports PNGs at the four post sizes.

import {
  LAYOUTS,
  GRADES,
  EXPORT_SIZES,
  PRESETS,
  defaultState,
  slotsFor,
  applyPreset,
  drawCover,
  renderCover,
  ensureFonts,
} from './cover.js';
import { applyScene } from './shots.js';

// The four sample photos bundled with the app, in tray order.
const SAMPLES = [
  { name: 'Boulevard', src: './samples/boulevard.jpg' },
  { name: 'Neon Street', src: './samples/neon-street.jpg' },
  { name: 'Pier', src: './samples/pier.jpg' },
  { name: 'Sunset Beach', src: './samples/sunset-beach.jpg' },
];

const state = defaultState();
state.slots = slotsFor(state.layout);
let selectedCell = 0;
let history = [];
let future = [];
let raf = 0;

const $ = (id) => document.getElementById(id);
const canvas = $('cover');
const ctx = canvas.getContext('2d');

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function setStatus(msg) {
  $('status').textContent = msg;
}

// ---- undo history --------------------------------------------------------
// A snapshot is the design only: layout, grade, lettering, finishes, slots
// and the selected cell. Photos stay loaded across undo and redo, so a slot
// that names a photo index keeps pointing at the same photo.
function takeSnapshot() {
  return JSON.stringify({
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
    tagline: state.tagline,
    titlePos: state.titlePos,
    titleColor: state.titleColor,
    titleSize: state.titleSize,
    outline: state.outline,
    shadow: state.shadow,
    frame: state.frame,
    halftone: state.halftone,
    grain: state.grain,
    vignette: state.vignette,
    sun: state.sun,
    palms: state.palms,
    skyline: state.skyline,
    size: state.size,
    slots: state.slots,
    selectedCell,
  });
}

function applySnapshot(json) {
  const s = JSON.parse(json);
  state.layout = s.layout;
  state.grade = s.grade;
  state.title = s.title;
  state.subtitle = s.subtitle;
  state.tagline = s.tagline;
  state.titlePos = s.titlePos;
  state.titleColor = s.titleColor;
  state.titleSize = s.titleSize;
  state.outline = s.outline;
  state.shadow = s.shadow;
  state.frame = s.frame;
  state.halftone = s.halftone;
  state.grain = s.grain;
  state.vignette = s.vignette;
  state.sun = s.sun;
  state.palms = s.palms;
  state.skyline = s.skyline;
  state.size = s.size;
  state.slots = slotsFor(s.layout, s.slots);
  selectedCell = s.selectedCell || 0;
}

function pushHistory() {
  history.push(takeSnapshot());
  if (history.length > 60) history.shift();
  future = [];
}

function undo() {
  if (!history.length) return;
  future.push(takeSnapshot());
  applySnapshot(history.pop());
  syncControls();
  redraw();
  setStatus('Undid the last change.');
}

function redo() {
  if (!future.length) return;
  history.push(takeSnapshot());
  applySnapshot(future.pop());
  syncControls();
  redraw();
  setStatus('Redid the change.');
}

// ---- preview -------------------------------------------------------------

function redraw() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    drawCover(ctx, state, canvas.width, canvas.height);
  });
}

// ---- photos --------------------------------------------------------------

function assignSlotsRoundRobin() {
  if (!state.photos.length) return;
  state.slots.forEach((slot, i) => {
    slot.photo = i % state.photos.length;
  });
}

function addPhotoImage(img) {
  state.photos.push(img);
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadFiles(fileList) {
  const room = 4 - state.photos.length;
  const files = [...fileList].filter((f) => f.type.startsWith('image/')).slice(0, room);
  if (!files.length) {
    setStatus('No new photos — four is the most this cover holds.');
    return;
  }
  for (const file of files) {
    const img = await loadImage(URL.createObjectURL(file));
    if (img) addPhotoImage(img);
  }
  assignSlotsRoundRobin();
  pushHistory();
  renderAll();
  setStatus(`Loaded ${files.length} photo${files.length > 1 ? 's' : ''}.`);
}

async function loadSamples() {
  const imgs = [];
  for (const s of SAMPLES) {
    const img = await loadImage(s.src);
    if (img) imgs.push(img);
  }
  state.photos = imgs;
  assignSlotsRoundRobin();
  pushHistory();
  renderAll();
  setStatus(`Loaded ${imgs.length} sample photos.`);
}

function fillAllPanels() {
  assignSlotsRoundRobin();
  pushHistory();
  renderAll();
  setStatus('Filled every panel with your photos.');
}

// ---- controls ------------------------------------------------------------

function buildButtons(id, entries, current, onPick) {
  const box = $(id);
  box.innerHTML = '';
  entries.forEach(([key, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    if (key === current) b.className = 'active';
    b.addEventListener('click', () => onPick(key));
    box.appendChild(b);
  });
}

function renderTray() {
  const tray = $('tray');
  tray.innerHTML = '';
  state.photos.forEach((img, i) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'thumb';
    thumb.title = `Use photo ${i + 1} in the selected panel`;
    const pic = document.createElement('img');
    pic.src = img.src;
    pic.alt = `Photo ${i + 1}`;
    thumb.appendChild(pic);
    thumb.addEventListener('click', () => {
      const slot = state.slots[selectedCell];
      if (!slot) return;
      slot.photo = i;
      pushHistory();
      renderAll();
      setStatus(`Panel ${selectedCell + 1} now shows photo ${i + 1}.`);
    });
    tray.appendChild(thumb);
  });
  if (!state.photos.length) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'No photos yet — add your own or load the samples.';
    tray.appendChild(empty);
  }
}

function syncControls() {
  buildButtons(
    'layoutBtns',
    Object.entries(LAYOUTS).map(([id, l]) => [id, l.name]),
    state.layout,
    (id) => {
      state.layout = id;
      state.slots = slotsFor(id, state.slots);
      selectedCell = 0;
      pushHistory();
      renderAll();
    },
  );
  buildButtons(
    'gradeBtns',
    Object.entries(GRADES).map(([id, g]) => [id, g.name]),
    state.grade,
    (id) => {
      state.grade = id;
      pushHistory();
      renderAll();
    },
  );
  buildButtons(
    'presetBtns',
    Object.entries(PRESETS).map(([id, p]) => [id, p.name]),
    null,
    (id) => {
      applyPreset(state, PRESETS[id]);
      selectedCell = 0;
      pushHistory();
      renderAll();
      setStatus(`Applied the ${PRESETS[id].name} preset.`);
    },
  );
  buildButtons(
    'sizeBtns',
    EXPORT_SIZES.map((s) => [s.id, s.label]),
    state.size,
    (id) => {
      state.size = id;
      renderAll();
    },
  );
  const layout = LAYOUTS[state.layout] || LAYOUTS.heroStrip;
  $('slotLabel').textContent = `Panel ${selectedCell + 1} of ${layout.cells.length}`;
  const slot = state.slots[selectedCell] || { zoom: 100 };
  $('zoom').value = slot.zoom;
  $('zoomVal').textContent = `${slot.zoom}%`;
  $('titleInput').value = state.title;
  $('subtitleInput').value = state.subtitle;
  $('taglineInput').value = state.tagline;
  $('titleSize').value = state.titleSize;
  $('titleSizeVal').textContent = `${state.titleSize}%`;
  $('titleColor').value = state.titleColor;
  $('titlePos').value = state.titlePos;
  $('outlineChk').checked = state.outline;
  $('shadowChk').checked = state.shadow;
  $('frameChk').checked = state.frame;
  $('halftoneChk').checked = state.halftone;
  $('grainChk').checked = state.grain;
  $('vignetteChk').checked = state.vignette;
  $('sunChk').checked = state.sun;
  $('palmsChk').checked = state.palms;
  $('skylineChk').checked = state.skyline;
  renderTray();
}

function renderAll() {
  syncControls();
  redraw();
}

// ---- canvas dragging -----------------------------------------------------

let drag = null;

canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const layout = LAYOUTS[state.layout] || LAYOUTS.heroStrip;
  const idx = layout.cells.findIndex(
    (c) => x >= c.x && x < c.x + c.w && y >= c.y && y < c.y + c.h,
  );
  if (idx < 0) return;
  selectedCell = idx;
  canvas.setPointerCapture(e.pointerId);
  drag = {
    startX: e.clientX,
    startY: e.clientY,
    cell: layout.cells[idx],
    slot: state.slots[idx],
    rect,
  };
  syncControls();
  redraw();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const cellW = drag.cell.w * drag.rect.width;
  const cellH = drag.cell.h * drag.rect.height;
  drag.slot.panX = clamp(drag.slot.panX + (e.clientX - drag.startX) / cellW, -0.6, 0.6);
  drag.slot.panY = clamp(drag.slot.panY + (e.clientY - drag.startY) / cellH, -0.6, 0.6);
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  redraw();
});

function endDrag() {
  if (!drag) return;
  drag = null;
  pushHistory();
}

canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

// ---- share links ---------------------------------------------------------

function shareState() {
  return {
    layout: state.layout,
    grade: state.grade,
    title: state.title,
    subtitle: state.subtitle,
    tagline: state.tagline,
    titlePos: state.titlePos,
    titleColor: state.titleColor,
    titleSize: state.titleSize,
    outline: state.outline,
    shadow: state.shadow,
    frame: state.frame,
    halftone: state.halftone,
    grain: state.grain,
    vignette: state.vignette,
    sun: state.sun,
    palms: state.palms,
    skyline: state.skyline,
    slots: state.slots.map((s) => ({
      photo: s.photo,
      zoom: s.zoom,
      panX: Math.round(s.panX * 1000) / 1000,
      panY: Math.round(s.panY * 1000) / 1000,
    })),
  };
}

function encodeShare() {
  const json = JSON.stringify(shareState());
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
  return `${location.origin}${location.pathname}#cover=${b64}`;
}

function loadFromHash() {
  const m = location.hash.match(/#cover=([A-Za-z0-9\-_]+)/);
  if (!m) return false;
  try {
    const json = decodeURIComponent(
      escape(atob(m[1].replaceAll('-', '+').replaceAll('_', '/'))),
    );
    const data = JSON.parse(json);
    state.layout = data.layout || state.layout;
    state.grade = data.grade || state.grade;
    state.title = data.title ?? state.title;
    state.subtitle = data.subtitle ?? state.subtitle;
    state.tagline = data.tagline ?? state.tagline;
    state.titlePos = data.titlePos || state.titlePos;
    state.titleColor = data.titleColor || state.titleColor;
    state.titleSize = data.titleSize || state.titleSize;
    state.outline = data.outline !== false;
    state.shadow = data.shadow !== false;
    state.frame = data.frame !== false;
    state.halftone = data.halftone !== false;
    state.grain = data.grain !== false;
    state.vignette = data.vignette !== false;
    state.sun = data.sun !== false;
    state.palms = data.palms !== false;
    state.skyline = data.skyline !== false;
    state.slots = slotsFor(state.layout, data.slots || []);
    return true;
  } catch (e) {
    return false;
  }
}

async function copyShareLink() {
  const url = encodeShare();
  try {
    await navigator.clipboard.writeText(url);
    setStatus('Share link copied — it restores this exact cover.');
  } catch (e) {
    const box = document.createElement('textarea');
    box.value = url;
    document.body.appendChild(box);
    box.select();
    document.execCommand('copy');
    box.remove();
    setStatus('Share link copied — it restores this exact cover.');
  }
}

// ---- export --------------------------------------------------------------

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function exportSize(size) {
  const out = renderCover(state, size.w, size.h);
  out.toBlob((blob) => {
    if (!blob) {
      setStatus('Export failed — the browser refused the image.');
      return;
    }
    downloadBlob(blob, `vice-coast-${size.id}-${size.w}x${size.h}.png`);
    setStatus(`Exported ${size.label}.`);
  }, 'image/png');
}

function exportAll() {
  EXPORT_SIZES.forEach((s, i) => {
    setTimeout(() => exportSize(s), i * 400);
  });
  setStatus('Exporting all four sizes…');
}

// ---- wiring --------------------------------------------------------------

function wireControls() {
  $('photoInput').addEventListener('change', (e) => {
    loadFiles(e.target.files);
    e.target.value = '';
  });
  $('loadSamples').addEventListener('click', loadSamples);
  $('fillAll').addEventListener('click', fillAllPanels);
  $('zoom').addEventListener('input', () => {
    const slot = state.slots[selectedCell];
    if (!slot) return;
    slot.zoom = Number($('zoom').value);
    $('zoomVal').textContent = `${slot.zoom}%`;
    redraw();
  });
  $('zoom').addEventListener('change', pushHistory);
  $('resetCrop').addEventListener('click', () => {
    const slot = state.slots[selectedCell];
    if (!slot) return;
    slot.zoom = 100;
    slot.panX = 0;
    slot.panY = 0;
    pushHistory();
    renderAll();
    setStatus('Crop reset for this panel.');
  });
  $('titleInput').addEventListener('input', () => {
    state.title = $('titleInput').value.toUpperCase();
    redraw();
  });
  $('titleInput').addEventListener('change', pushHistory);
  $('subtitleInput').addEventListener('input', () => {
    state.subtitle = $('subtitleInput').value;
    redraw();
  });
  $('subtitleInput').addEventListener('change', pushHistory);
  $('taglineInput').addEventListener('input', () => {
    state.tagline = $('taglineInput').value;
    redraw();
  });
  $('taglineInput').addEventListener('change', pushHistory);
  $('titleSize').addEventListener('input', () => {
    state.titleSize = Number($('titleSize').value);
    $('titleSizeVal').textContent = `${state.titleSize}%`;
    redraw();
  });
  $('titleSize').addEventListener('change', pushHistory);
  $('titleColor').addEventListener('input', () => {
    state.titleColor = $('titleColor').value;
    redraw();
  });
  $('titleColor').addEventListener('change', pushHistory);
  $('titlePos').addEventListener('change', () => {
    state.titlePos = $('titlePos').value;
    pushHistory();
    redraw();
  });
  const bindCheck = (id, key) => {
    $(id).addEventListener('change', () => {
      state[key] = $(id).checked;
      pushHistory();
      redraw();
    });
  };
  bindCheck('outlineChk', 'outline');
  bindCheck('shadowChk', 'shadow');
  bindCheck('frameChk', 'frame');
  bindCheck('halftoneChk', 'halftone');
  bindCheck('grainChk', 'grain');
  bindCheck('vignetteChk', 'vignette');
  bindCheck('sunChk', 'sun');
  bindCheck('palmsChk', 'palms');
  bindCheck('skylineChk', 'skyline');
  $('randomize').addEventListener('click', () => {
    const layoutIds = Object.keys(LAYOUTS);
    const gradeIds = Object.keys(GRADES);
    state.layout = layoutIds[Math.floor(Math.random() * layoutIds.length)];
    state.grade = gradeIds[Math.floor(Math.random() * gradeIds.length)];
    state.slots = slotsFor(state.layout, state.slots);
    selectedCell = 0;
    pushHistory();
    renderAll();
    setStatus('Surprise! A random layout and grade.');
  });
  $('undo').addEventListener('click', undo);
  $('redo').addEventListener('click', redo);
  $('shareLink').addEventListener('click', copyShareLink);
  $('exportAll').addEventListener('click', exportAll);
  $('exportOne').addEventListener('click', () => {
    const size = EXPORT_SIZES.find((s) => s.id === state.size) || EXPORT_SIZES[0];
    exportSize(size);
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files.length) loadFiles(e.dataTransfer.files);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y'
      || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
    }
  });
}

// ---- start ---------------------------------------------------------------

function init() {
  wireControls();
  const params = new URLSearchParams(location.search);
  const scene = params.get('shot');
  const finish = () => {
    ensureFonts().then(() => redraw());
    renderAll();
  };
  if (scene) {
    loadSamples().then(() => {
      if (applyScene(state, scene)) setStatus(`Scene “${scene}” ready for a screenshot.`);
      finish();
    });
  } else if (location.hash.includes('cover=')) {
    loadSamples().then(() => {
      if (loadFromHash()) setStatus('Restored a cover from its share link.');
      finish();
    });
  } else {
    finish();
  }
}

init();
