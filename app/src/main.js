// Vice Coast Cover Studio — editor wiring, rebuilt.
// Photos, layouts, grades, presets, undo/redo, share links, export and
// screenshot scenes. Runs fully offline: every asset is a file under app/.
import { LAYOUTS, GRADES, EXPORT_SIZES, PRESETS, defaultState, drawCover, renderCover, ensureFonts } from './cover.js';
import { runShot, SAMPLES } from './shots.js';

const $ = (id) => document.getElementById(id);
const on = (id, event, fn) => $(id).addEventListener(event, fn);
const canvas = $('cover');
const statusEl = $('status');
const state = defaultState();
const photos = [null, null, null, null];
let selectedSlot = 0;
let activePhoto = 0;
let exportSize = EXPORT_SIZES[0];
let drag = null;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function setStatus(msg) {
  statusEl.textContent = msg;
  clearTimeout(setStatus.t);
  setStatus.t = setTimeout(() => { statusEl.textContent = ''; }, 4000);
}

// ---- history (undo / redo) ----

class History {
  constructor() {
    this.items = [];
    this.index = -1;
  }

  snapshot() {
    return JSON.stringify(state);
  }

  push() {
    this.items.length = this.index + 1;
    this.items.push(this.snapshot());
    if (this.items.length > 40) this.items.shift();
    this.index = this.items.length - 1;
    this.syncButtons();
  }

  apply(json) {
    const saved = JSON.parse(json);
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, saved);
    syncControls();
    render();
  }

  undo() {
    if (this.index <= 0) return;
    this.index -= 1;
    this.apply(this.items[this.index]);
    setStatus('Undid that change');
  }

  redo() {
    if (this.index >= this.items.length - 1) return;
    this.index += 1;
    this.apply(this.items[this.index]);
    setStatus('Redid that change');
  }

  syncButtons() {
    $('undo').disabled = this.index <= 0;
    $('redo').disabled = this.index >= this.items.length - 1;
  }
}

const history = new History();
const pushHistory = () => history.push();
const undo = () => history.undo();
const redo = () => history.redo();

// ---- preview ----

function previewSize() {
  const maxSide = 860;
  const scale = Math.min(1, maxSide / Math.max(exportSize.w, exportSize.h));
  return { w: Math.round(exportSize.w * scale), h: Math.round(exportSize.h * scale) };
}

function render() {
  const size = previewSize();
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas, state, photos);
  drawSelection();
  updateSlotPanel();
}

function cells() {
  return (LAYOUTS[state.layout] || LAYOUTS.heroStrip).cells;
}

function pickCell(fx, fy) {
  const list = cells();
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (fx >= c.x && fx < c.x + c.w && fy >= c.y && fy < c.y + c.h) return i;
  }
  return list.length - 1;
}

function drawSelection() {
  const list = cells();
  const c = list[selectedSlot];
  if (!c) return;
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = '#ff5e8a';
  ctx.lineWidth = Math.max(2, canvas.width * 0.004);
  ctx.setLineDash([12, 8]);
  ctx.strokeRect(c.x * canvas.width + 2, c.y * canvas.height + 2, c.w * canvas.width - 4, c.h * canvas.height - 4);
  ctx.setLineDash([]);
  ctx.fillStyle = '#ff5e8a';
  ctx.font = `700 ${Math.max(13, canvas.width * 0.018)}px system-ui, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`PANEL ${selectedSlot + 1}`, c.x * canvas.width + 10, c.y * canvas.height + 26);
  ctx.restore();
}

// ---- photo tray ----

function renderTray() {
  const tray = $('tray');
  tray.innerHTML = '';
  photos.forEach((img, i) => {
    const slot = document.createElement('div');
    slot.className = 'thumb' + (i === activePhoto ? ' active' : '');
    slot.title = img ? `Photo ${i + 1} — click to use in the selected panel` : `Photo ${i + 1} — empty`;
    if (img) {
      const t = document.createElement('img');
      t.src = img.src;
      t.alt = `Photo ${i + 1}`;
      slot.appendChild(t);
    } else {
      const plus = document.createElement('span');
      plus.className = 'thumb-empty';
      plus.textContent = `+ Photo ${i + 1}`;
      slot.appendChild(plus);
    }
    slot.addEventListener('click', () => {
      activePhoto = i;
      if (photos[i]) {
        state.slots[selectedSlot].photo = i;
        pushHistory();
        render();
        setStatus(`Panel ${selectedSlot + 1} now uses photo ${i + 1}`);
      } else {
        renderTray();
        setStatus('That slot is empty — pick a file or load the samples');
      }
    });
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'thumb-clear';
    clear.textContent = '×';
    clear.title = 'Remove this photo';
    clear.addEventListener('click', (e) => {
      e.stopPropagation();
      photos[i] = null;
      pushHistory();
      renderTray();
      render();
    });
    slot.appendChild(clear);
    tray.appendChild(slot);
  });
}

async function addFiles(files) {
  const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
  if (!list.length) {
    setStatus('No image files in that drop');
    return;
  }
  let placed = 0;
  for (const file of list.slice(0, 4)) {
    let target = photos.indexOf(null);
    if (target === -1) target = activePhoto;
    try {
      photos[target] = await loadImage(URL.createObjectURL(file));
      placed += 1;
    } catch (e) { /* skip unreadable file */ }
  }
  pushHistory();
  renderTray();
  render();
  setStatus(placed === 1 ? 'Photo loaded' : `${placed} photos loaded`);
}

async function loadSamples() {
  for (let i = 0; i < SAMPLES.length; i++) {
    try {
      photos[i] = await loadImage(`samples/${SAMPLES[i]}.jpg`);
    } catch (e) { /* keep whatever loaded */ }
  }
  state.slots.forEach((s, i) => { s.photo = i % 4; });
  pushHistory();
  renderTray();
  render();
  setStatus('Sample photos loaded — all four panels filled');
}

// ---- controls ----

function buildButtons(containerId, items, current, onPick) {
  const box = $(containerId);
  box.innerHTML = '';
  items.forEach(([id, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (id === current ? ' on' : '');
    b.textContent = label;
    b.addEventListener('click', () => { onPick(id); });
    box.appendChild(b);
  });
}

function syncControls() {
  buildButtons('layoutBtns', Object.entries(LAYOUTS).map(([id, l]) => [id, l.name]), state.layout, (id) => {
    state.layout = id;
    selectedSlot = 0;
    pushHistory();
    syncControls();
    render();
  });
  buildButtons('gradeBtns', Object.entries(GRADES).map(([id, g]) => [id, g.name]), state.grade, (id) => {
    state.grade = id;
    pushHistory();
    syncControls();
    render();
  });
  buildButtons('presetBtns', Object.entries(PRESETS).map(([id, p]) => [id, p.name]), null, (id) => {
    applyPreset(id);
  });
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
  buildButtons('sizeBtns', EXPORT_SIZES.map((s) => [s.id, s.label]), exportSize.id, (id) => {
    exportSize = EXPORT_SIZES.find((s) => s.id === id);
    syncControls();
    render();
  });
  updateSlotPanel();
}

function updateSlotPanel() {
  const slot = state.slots[selectedSlot] || state.slots[0];
  $('slotLabel').textContent = `Panel ${selectedSlot + 1} of ${cells().length}`;
  $('zoom').value = Math.round(slot.scale * 100);
  $('zoomVal').textContent = `${Math.round(slot.scale * 100)}%`;
  $('panHint').textContent = photos[slot.photo]
    ? `Photo ${slot.photo + 1} — drag on the cover to move it`
    : 'Empty panel — load a photo first';
}

function applyPreset(id) {
  const p = PRESETS[id];
  if (!p) return;
  Object.assign(state, {
    layout: p.layout, grade: p.grade, title: p.title, subtitle: p.subtitle,
    tagline: p.tagline, titlePos: p.titlePos, titleColor: p.titleColor,
    frame: p.frame, halftone: p.halftone,
  });
  selectedSlot = 0;
  pushHistory();
  syncControls();
  render();
  setStatus(`Preset applied: ${p.name}`);
}

function randomize() {
  const layoutIds = Object.keys(LAYOUTS);
  const gradeIds = Object.keys(GRADES);
  const titles = ['VICE COAST', 'NEON RUN', 'PALM ROW', 'GOLDEN HOUR', 'BOULEVARD', 'AFTER DARK'];
  const subs = ['Sunset Heist', 'Queen of the Coast', 'After Midnight', 'Three Ways Down', 'Chase the Light', 'No Sleep'];
  state.layout = layoutIds[Math.floor(Math.random() * layoutIds.length)];
  state.grade = gradeIds[Math.floor(Math.random() * gradeIds.length)];
  state.title = titles[Math.floor(Math.random() * titles.length)];
  state.subtitle = subs[Math.floor(Math.random() * subs.length)];
  state.titlePos = Math.random() < 0.5 ? 'top' : 'bottom';
  selectedSlot = 0;
  pushHistory();
  syncControls();
  render();
  setStatus('Surprise me — new layout, grade and title');
}

// ---- share link: the whole cover state lives in the URL hash ----

function encodeState() {
  const json = JSON.stringify(state);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeState(hash) {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function restoreFromHash() {
  const m = location.hash.match(/^#s=(.+)$/);
  if (!m) return false;
  const parsed = decodeState(m[1]);
  if (!parsed) return false;
  const known = ['layout', 'grade', 'title', 'subtitle', 'tagline', 'titlePos', 'titleSize',
    'titleColor', 'outline', 'shadow', 'frame', 'halftone', 'grain', 'vignette', 'sun', 'palms', 'skyline'];
  for (const key of known) {
    if (parsed[key] !== undefined) state[key] = parsed[key];
  }
  if (!LAYOUTS[state.layout]) state.layout = 'heroStrip';
  if (!GRADES[state.grade]) state.grade = 'sunset';
  // a crafted link could carry an out-of-range title size; clamp it
  // (the slider itself only offers 60–150)
  const TITLE_SIZE_MIN = 60;
  const TITLE_SIZE_MAX = 150;
  if (typeof state.titleSize === 'number') {
    state.titleSize = Math.max(TITLE_SIZE_MIN, Math.min(TITLE_SIZE_MAX, Math.round(state.titleSize)));
  }
  if (Array.isArray(parsed.slots) && parsed.slots.length === state.slots.length) {
    state.slots = parsed.slots.map((s, i) => ({
      photo: Number.isInteger(s.photo) ? s.photo : state.slots[i].photo,
      scale: typeof s.scale === 'number' ? s.scale : 1,
      dx: typeof s.dx === 'number' ? s.dx : 0,
      dy: typeof s.dy === 'number' ? s.dy : 0,
    }));
  }
  return true;
}

async function shareLink() {
  const url = `${location.origin}${location.pathname}#s=${encodeState()}`;
  try {
    await navigator.clipboard.writeText(url);
    setStatus('Share link copied — it opens this exact cover');
  } catch (e) {
    history.replaceState(null, '', `#s=${encodeState()}`);
    setStatus('Share link is in the address bar — copy it from there');
  }
}

// ---- export ----

function downloadCanvas(c, filename) {
  return new Promise((resolve) => {
    c.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      resolve(blob ? blob.size : 0);
    }, 'image/png');
  });
}

async function exportOne(size) {
  const c = renderCover(size.w, size.h, state, photos);
  const bytes = await downloadCanvas(c, `vice-coast-${size.w}x${size.h}.png`);
  setStatus(`Exported ${size.w} x ${size.h} PNG (${Math.round(bytes / 1024)} KB)`);
  return bytes;
}

async function exportAll() {
  setStatus('Exporting all four sizes…');
  for (const size of EXPORT_SIZES) {
    await exportOne(size);
    await new Promise((r) => setTimeout(r, 150));
  }
  setStatus('All four sizes exported');
}

// ---- events ----

function wireEvents() {
  on('photoInput', 'change', (e) => { addFiles(e.target.files); e.target.value = ''; });
  on('loadSamples', 'click', loadSamples);
  on('fillAll', 'click', () => {
    if (!photos[activePhoto]) {
      setStatus('Pick a loaded photo in the tray first');
      return;
    }
    state.slots.forEach((s) => { s.photo = activePhoto; });
    pushHistory();
    render();
    setStatus(`All panels now use photo ${activePhoto + 1}`);
  });
  on('titleInput', 'input', (e) => { state.title = e.target.value; render(); });
  on('titleInput', 'change', pushHistory);
  on('subtitleInput', 'input', (e) => { state.subtitle = e.target.value; render(); });
  on('subtitleInput', 'change', pushHistory);
  on('taglineInput', 'input', (e) => { state.tagline = e.target.value; render(); });
  on('taglineInput', 'change', pushHistory);
  on('titleSize', 'input', (e) => {
    state.titleSize = Number(e.target.value);
    $('titleSizeVal').textContent = `${state.titleSize}%`;
    render();
  });
  on('titleSize', 'change', pushHistory);
  on('titleColor', 'input', (e) => { state.titleColor = e.target.value; render(); });
  on('titleColor', 'change', pushHistory);
  on('titlePos', 'change', (e) => { state.titlePos = e.target.value; pushHistory(); render(); });
  [['outlineChk', 'outline'], ['shadowChk', 'shadow'], ['frameChk', 'frame'],
    ['halftoneChk', 'halftone'], ['grainChk', 'grain'], ['vignetteChk', 'vignette'],
    ['sunChk', 'sun'], ['palmsChk', 'palms'], ['skylineChk', 'skyline']].forEach(([id, key]) => {
    on(id, 'change', (e) => { state[key] = e.target.checked; pushHistory(); render(); });
  });
  on('zoom', 'input', (e) => {
    state.slots[selectedSlot].scale = Number(e.target.value) / 100;
    $('zoomVal').textContent = `${e.target.value}%`;
    render();
  });
  on('zoom', 'change', pushHistory);
  on('resetCrop', 'click', () => {
    Object.assign(state.slots[selectedSlot], { scale: 1, dx: 0, dy: 0 });
    pushHistory();
    render();
    setStatus('Crop reset for this panel');
  });
  on('randomize', 'click', randomize);
  on('shareLink', 'click', shareLink);
  on('undo', 'click', undo);
  on('redo', 'click', redo);
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
    }
  });
  on('exportAll', 'click', exportAll);
  EXPORT_SIZES.forEach((size) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'export-btn';
    b.textContent = `PNG ${size.w} x ${size.h}`;
    b.addEventListener('click', () => exportOne(size));
    $('exportBtns').appendChild(b);
  });

  // drag to pan the selected panel; click a panel to select it
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    const idx = pickCell(fx, fy);
    if (idx !== selectedSlot) {
      selectedSlot = idx;
      render();
    }
    drag = { x: e.clientX, y: e.clientY, moved: false };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const rect = canvas.getBoundingClientRect();
    const list = cells();
    const c = list[selectedSlot];
    if (!c) return;
    const dx = (e.clientX - drag.x) / rect.width / c.w;
    const dy = (e.clientY - drag.y) / rect.height / c.h;
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) drag.moved = true;
    const slot = state.slots[selectedSlot];
    slot.dx = Math.max(-0.6, Math.min(0.6, slot.dx + dx));
    slot.dy = Math.max(-0.6, Math.min(0.6, slot.dy + dy));
    drag.x = e.clientX;
    drag.y = e.clientY;
    render();
  });
  const endDrag = () => {
    if (drag && drag.moved) pushHistory();
    drag = null;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  // drag & drop files anywhere on the page
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });
}

// ---- shot scenes ----

async function setupShot(scene) {
  if (scene.title) state.title = scene.title;
  if (scene.subtitle !== undefined) state.subtitle = scene.subtitle;
  if (scene.tagline) state.tagline = scene.tagline;
  if (scene.titlePos) state.titlePos = scene.titlePos;
  if (scene.skyline !== undefined) state.skyline = scene.skyline;
  state.layout = scene.layout;
  state.grade = scene.grade;
  await loadSamples();
  // put the requested sample first so single-photo layouts show it
  const first = SAMPLES.indexOf(scene.sample);
  if (first > 0) {
    const img = photos[first];
    photos[first] = photos[0];
    photos[0] = img;
  }
  state.slots.forEach((s, i) => { s.photo = i % 4; });
  await ensureFonts();
  if (scene.shot === 'cover') {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCover(canvas, state, photos);
  } else {
    syncControls();
    render();
  }
}

// ---- boot ----

async function boot() {
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  const shared = restoreFromHash();
  wireEvents();
  syncControls();
  renderTray();
  if (shot) {
    await runShot(shot, params, setupShot);
  } else {
    await ensureFonts();
    pushHistory();
    render();
    if (shared) setStatus('Opened a shared cover from its link');
    await loadSamplesIfEmpty();
  }
  // headless self-test hook: ?exporttest=1 renders, exports and reports into #testlog
  if (params.get('exporttest') === '1') {
    const c = renderCover(1080, 1080, state, photos);
    const size = await new Promise((resolve) => {
      c.toBlob((blob) => resolve(blob ? blob.size : 0), 'image/png');
    });
    const urls = performance.getEntriesByType('resource').map((r) => r.name);
    const external = urls.filter((u) => /^(https?:)?\/\//.test(u) && !u.includes('localhost') && !u.includes('127.0.0.1'));
    const log = $('testlog');
    log.textContent = JSON.stringify({ exportedBytes: size, resources: urls.length, external: external.length, photosLoaded: photos.filter(Boolean).length });
  }
}

async function loadSamplesIfEmpty() {
  if (photos.some(Boolean)) return;
  await loadSamples();
}

boot();
