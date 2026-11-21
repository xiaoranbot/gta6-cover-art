// Vice Coast Cover Studio — the editor.
//
// Wires the controls in index.html to the cover engine in cover.js: loading photos,
// picking layouts and grades, editing the caption, dragging panels to crop them, and
// exporting the finished cover as a PNG. Everything runs in the browser; no photo is
// ever uploaded anywhere.

import {
  SAMPLE_PHOTOS, LAYOUTS, GRADES, TITLE_COLORS, EXPORT_SIZES,
  defaultState, layoutById, gradeById, activePanelCount,
  renderCover, exportCover, loadPhotoImage, loadSampleImages, waitForCoverFonts,
} from './cover.js';

const PREVIEW_SIZE = 900;

const state = defaultState();
const images = new Map(); // photo key -> loaded <img>
const uploadSrcs = new Map(); // upload key -> object URL (for thumbnails)
let selectedPanel = 0;
let samplesLoaded = false;

const $ = (id) => document.getElementById(id);
const canvas = $('coverCanvas');
const ctx = canvas.getContext('2d');

// ---------------------------------------------------------------- state helpers

function photoLabel(key) {
  if (key.startsWith('sample:')) {
    return SAMPLE_PHOTOS.find((p) => `sample:${p.id}` === key)?.label ?? 'Photo';
  }
  return key.split(':').slice(2).join(':') || 'Uploaded photo';
}

function photoThumbSrc(key) {
  if (key.startsWith('sample:')) {
    const id = key.slice('sample:'.length);
    return `samples/${id}.jpg`;
  }
  return uploadSrcs.get(key) ?? '';
}

function selectedSlot() {
  return state.panels[selectedPanel];
}

// ------------------------------------------------------------- preview rendering

let renderQueued = false;
function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderCover(canvas, state, images, PREVIEW_SIZE, PREVIEW_SIZE);
    $('previewSize').textContent = `${PREVIEW_SIZE} × ${PREVIEW_SIZE} preview`;
  });
}

function refreshPanelStatus() {
  const count = activePanelCount(state);
  $('panelStatus').textContent =
    `Panel ${selectedPanel + 1} of ${count} · ${photoLabel(selectedSlot().key)} · ` +
    `zoom ${selectedSlot().zoom.toFixed(2)}×`;
}

// ------------------------------------------------------------------- control UI

function buildLayoutPicker() {
  const picker = $('layoutPicker');
  picker.innerHTML = '';
  for (const layout of LAYOUTS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice' + (state.layout === layout.id ? ' active' : '');
    btn.dataset.layout = layout.id;
    btn.innerHTML = `${layout.name}<small>${layout.panels.length} panel${layout.panels.length > 1 ? 's' : ''}</small>`;
    btn.addEventListener('click', () => {
      state.layout = layout.id;
      selectedPanel = Math.min(selectedPanel, activePanelCount(state) - 1);
      $('layoutBlurb').textContent = layout.blurb;
      buildLayoutPicker();
      buildPanelList();
      refreshPanelStatus();
      scheduleRender();
    });
    picker.appendChild(btn);
  }
  $('layoutBlurb').textContent = layoutById(state.layout).blurb;
}

function buildGradePicker() {
  const picker = $('gradePicker');
  picker.innerHTML = '';
  for (const grade of GRADES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice' + (state.grade === grade.id ? ' active' : '');
    btn.innerHTML = `<span class="swatch" style="background:${grade.swatch}"></span><span class="swatch-name">${grade.name}</span>`;
    btn.addEventListener('click', () => {
      state.grade = grade.id;
      buildGradePicker();
      scheduleRender();
    });
    picker.appendChild(btn);
  }
}

function buildTitleColorPicker() {
  const row = $('titleColorPicker');
  row.innerHTML = '';
  for (const color of TITLE_COLORS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-dot' + (state.titleColor === color.id ? ' active' : '');
    btn.title = color.name;
    btn.setAttribute('aria-label', `Title colour ${color.name}`);
    btn.style.background = `linear-gradient(135deg, ${color.stops.join(', ')})`;
    btn.addEventListener('click', () => {
      state.titleColor = color.id;
      buildTitleColorPicker();
      scheduleRender();
    });
    row.appendChild(btn);
  }
}

function buildSampleTray() {
  const tray = $('sampleTray');
  tray.innerHTML = '';
  for (const photo of SAMPLE_PHOTOS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sample-thumb';
    btn.title = `${photo.label} — click to put it in the selected panel`;
    btn.innerHTML = `<img src="${photo.file}" alt="${photo.label} sample photo"><span>${photo.label}</span>`;
    btn.addEventListener('click', () => {
      selectedSlot().key = `sample:${photo.id}`;
      buildPanelList();
      refreshPanelStatus();
      scheduleRender();
    });
    tray.appendChild(btn);
  }
}

function buildPanelList() {
  const list = $('panelList');
  list.innerHTML = '';
  const count = activePanelCount(state);
  for (let i = 0; i < count; i++) {
    const slot = state.panels[i];
    const row = document.createElement('div');
    row.className = 'panel-row' + (i === selectedPanel ? ' selected' : '');
    row.innerHTML =
      `<img src="${photoThumbSrc(slot.key)}" alt="">` +
      `<span class="panel-name">Panel ${i + 1} · ${photoLabel(slot.key)}` +
      `<small>drag in preview to move · scroll to zoom</small></span>`;
    const replace = document.createElement('button');
    replace.type = 'button';
    replace.className = 'mini-btn';
    replace.textContent = 'Replace…';
    replace.addEventListener('click', (event) => {
      event.stopPropagation();
      selectedPanel = i;
      $('uploadInput').click();
    });
    row.appendChild(replace);
    row.addEventListener('click', () => {
      selectedPanel = i;
      buildPanelList();
      refreshPanelStatus();
    });
    list.appendChild(row);
  }
}

function buildExportButtons() {
  const grid = $('exportButtons');
  grid.innerHTML = '';
  for (const size of EXPORT_SIZES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn primary';
    btn.textContent = size.label;
    btn.addEventListener('click', () => exportPng(size));
    grid.appendChild(btn);
  }
}

async function exportPng(size) {
  const status = $('exportStatus');
  status.textContent = `Drawing ${size.w} × ${size.h}…`;
  try {
    await waitForCoverFonts();
    const blob = await exportCover(state, images, size.w, size.h);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vice-coast-${size.w}x${size.h}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    status.textContent = `Saved vice-coast-${size.w}x${size.h}.png ✓ (${(blob.size / 1024).toFixed(0)} KiB)`;
  } catch (error) {
    status.textContent = `Export failed: ${error.message}`;
  }
}

// Rebuild every control from the current state, so a scene (shots.js) that sets the
// state from the URL can make the buttons and inputs agree with it.
function syncControls() {
  buildLayoutPicker();
  buildGradePicker();
  buildTitleColorPicker();
  buildPanelList();
  $('titleInput').value = state.title;
  $('subtitleInput').value = state.subtitle;
  $('titleSizeSlider').value = String(Math.round(state.titleSize * 100));
  $('titleSizeOut').textContent = `${Math.round(state.titleSize * 100)}%`;
  $('grainSlider').value = String(Math.round(state.grain * 100));
  $('grainOut').textContent = `${Math.round(state.grain * 100)}%`;
  refreshPanelStatus();
}

async function loadSamplesIntoPanels() {
  if (!samplesLoaded) {
    const loaded = await loadSampleImages();
    for (const [key, img] of loaded) images.set(key, img);
    samplesLoaded = true;
  }
  state.panels[0].key = 'sample:boulevard';
  state.panels[1].key = 'sample:neon-street';
  state.panels[2].key = 'sample:pier';
  state.panels[3].key = 'sample:sunset-beach';
  buildPanelList();
  refreshPanelStatus();
  scheduleRender();
}

async function handleUploadFiles(files) {
  const list = [...files].filter((f) => f.type.startsWith('image/')).slice(0, 4);
  if (!list.length) return;
  let target = selectedPanel;
  for (const file of list) {
    const url = URL.createObjectURL(file);
    const key = `upload:${Date.now()}:${file.name}`;
    try {
      const img = await loadPhotoImage(url);
      images.set(key, img);
      uploadSrcs.set(key, url);
      state.panels[target % 4].key = key;
      target += 1;
    } catch {
      URL.revokeObjectURL(url);
    }
  }
  selectedPanel = Math.min(target - 1, activePanelCount(state) - 1);
  buildPanelList();
  refreshPanelStatus();
  scheduleRender();
}

// ------------------------------------------------------- canvas drag / zoom

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PREVIEW_SIZE,
    y: ((event.clientY - rect.top) / rect.height) * PREVIEW_SIZE,
  };
}

function panelAt(point) {
  const layout = layoutById(state.layout);
  for (let i = 0; i < layout.panels.length; i++) {
    const r = layout.panels[i];
    if (point.x >= r.x * PREVIEW_SIZE && point.x < (r.x + r.w) * PREVIEW_SIZE &&
        point.y >= r.y * PREVIEW_SIZE && point.y < (r.y + r.h) * PREVIEW_SIZE) {
      return i;
    }
  }
  return -1;
}

let drag = null;

canvas.addEventListener('pointerdown', (event) => {
  const point = canvasPoint(event);
  const hit = panelAt(point);
  if (hit === -1) return;
  selectedPanel = hit;
  buildPanelList();
  const slot = selectedSlot();
  const layout = layoutById(state.layout);
  const r = layout.panels[hit];
  const img = images.get(slot.key);
  let slackX = 0;
  let slackY = 0;
  if (img) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const w = r.w * PREVIEW_SIZE;
    const h = r.h * PREVIEW_SIZE;
    const s = Math.max(w / iw, h / ih) * slot.zoom;
    slackX = Math.max(0, (iw * s - w) / 2);
    slackY = Math.max(0, (ih * s - h) / 2);
  }
  drag = { x: point.x, y: point.y, ox: slot.ox, oy: slot.oy, slackX, slackY };
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add('dragging');
});

canvas.addEventListener('pointermove', (event) => {
  if (!drag) return;
  const point = canvasPoint(event);
  const slot = selectedSlot();
  if (drag.slackX > 0) slot.ox = Math.max(-1, Math.min(1, drag.ox + (point.x - drag.x) / drag.slackX));
  if (drag.slackY > 0) slot.oy = Math.max(-1, Math.min(1, drag.oy + (point.y - drag.y) / drag.slackY));
  refreshPanelStatus();
  scheduleRender();
});

function endDrag() {
  drag = null;
  canvas.classList.remove('dragging');
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  const point = canvasPoint(event);
  const hit = panelAt(point);
  if (hit === -1) return;
  selectedPanel = hit;
  const slot = selectedSlot();
  slot.zoom = Math.max(1, Math.min(3, slot.zoom * Math.exp(-event.deltaY * 0.0012)));
  buildPanelList();
  refreshPanelStatus();
  scheduleRender();
}, { passive: false });

// ------------------------------------------------------------------ init

function init() {
  buildLayoutPicker();
  buildGradePicker();
  buildTitleColorPicker();
  buildSampleTray();
  buildPanelList();
  buildExportButtons();
  refreshPanelStatus();

  $('loadSamplesBtn').addEventListener('click', loadSamplesIntoPanels);
  $('uploadBtn').addEventListener('click', () => $('uploadInput').click());
  $('uploadInput').addEventListener('change', (event) => {
    handleUploadFiles(event.target.files);
    event.target.value = '';
  });

  $('titleInput').addEventListener('input', (event) => {
    state.title = event.target.value;
    scheduleRender();
  });
  $('subtitleInput').addEventListener('input', (event) => {
    state.subtitle = event.target.value;
    scheduleRender();
  });
  $('titleSizeSlider').addEventListener('input', (event) => {
    state.titleSize = Number(event.target.value) / 100;
    $('titleSizeOut').textContent = `${event.target.value}%`;
    scheduleRender();
  });
  $('grainSlider').addEventListener('input', (event) => {
    state.grain = Number(event.target.value) / 100;
    $('grainOut').textContent = `${event.target.value}%`;
    scheduleRender();
  });

  $('resetPanelBtn').addEventListener('click', () => {
    Object.assign(selectedSlot(), { zoom: 1.12, ox: 0, oy: 0 });
    refreshPanelStatus();
    scheduleRender();
  });
  $('shuffleBtn').addEventListener('click', () => {
    const keys = [...images.keys()].filter((k) => k.startsWith('sample:'));
    if (!keys.length) return;
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    const count = activePanelCount(state);
    for (let i = 0; i < count; i++) state.panels[i].key = keys[i % keys.length];
    buildPanelList();
    refreshPanelStatus();
    scheduleRender();
  });

  // First paint: load the samples and the fonts, then draw.
  waitForCoverFonts().then(() => {
    loadSamplesIntoPanels().catch(() => scheduleRender());
    scheduleRender();
  });
  loadSampleImages().then((loaded) => {
    for (const [key, img] of loaded) images.set(key, img);
    samplesLoaded = true;
    scheduleRender();
  });
  scheduleRender();
}

// The shot scenes (shots.js) and the console can reach the live editor through this.
window.__viceCoast = { state, images, scheduleRender, syncControls, loadSamplesIntoPanels, exportCover };

init();
