// Vice Coast Cover Studio — screenshot scenes.
//
// The app draws its own screenshots, so the maker never has to fake one:
//   ?shot=cover   draws one exported cover full-frame, using the same renderCover and
//                 exportCover the Export buttons use (the title records the export size,
//                 proving the PNG path works end to end).
//   ?shot=editor  opens the editor with the sample photos loaded and the caption set,
//                 ready for a screenshot of the app at work.
//
// Query knobs: photo (a sample id), caption, sub, layout, grade.

import {
  defaultState, renderCover, exportCover, loadSampleImages, waitForCoverFonts,
} from './cover.js';

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (!shot) {
  // No scene requested: the editor in main.js runs the page.
} else if (shot === 'cover') {
  drawCoverScene();
} else if (shot === 'editor') {
  setupEditorScene();
}

async function drawCoverScene() {
  document.body.classList.add('shot-cover');
  document.title = 'cover-loading';
  const state = defaultState();
  state.title = params.get('caption') || 'Sunset Heist';
  state.subtitle = params.get('sub') || 'chasing the neon sunset';
  state.layout = params.get('layout') || 'hero';
  state.grade = params.get('grade') || 'sunset';
  const photo = params.get('photo') || 'pier';
  const order = ['boulevard', 'neon-street', 'pier', 'sunset-beach'];
  const start = Math.max(0, order.indexOf(photo));
  for (let i = 0; i < 4; i++) state.panels[i].key = `sample:${order[(start + i) % order.length]}`;

  const canvas = document.createElement('canvas');
  canvas.id = 'shotCanvas';
  document.body.appendChild(canvas);

  const images = await loadSampleImages();
  await waitForCoverFonts();
  const W = window.innerWidth || 1280;
  const H = window.innerHeight || 720;
  renderCover(canvas, state, images, W, H);

  // Prove the export path too: draw a real 1080 x 1080 PNG and report its size.
  try {
    const blob = await exportCover(state, images, 1080, 1080);
    document.title = `cover-ready export-1080:${blob.size}`;
  } catch {
    document.title = 'cover-ready export-failed';
  }
}

async function setupEditorScene() {
  document.title = 'editor-loading';
  const api = window.__viceCoast;
  if (!api) return;
  const state = api.state;
  state.title = params.get('caption') || 'Boulevard Queen';
  state.subtitle = params.get('sub') || 'chasing the neon sunset';
  state.layout = params.get('layout') || 'quad';
  state.grade = params.get('grade') || 'neon';
  const titleInput = document.getElementById('titleInput');
  const subtitleInput = document.getElementById('subtitleInput');
  if (titleInput) titleInput.value = state.title;
  if (subtitleInput) subtitleInput.value = state.subtitle;

  // Wait until the sample photos are in before the screenshot is taken.
  const deadline = Date.now() + 8000;
  while (api.images.size < 4 && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await api.loadSamplesIntoPanels();
  await waitForCoverFonts();
  api.syncControls();
  api.scheduleRender();
  // Let the queued animation frame paint before the scene reports ready, or the
  // screenshot would catch the previous layout.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  document.title = 'editor-ready';
}
