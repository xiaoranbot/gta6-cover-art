// Vice Coast Cover Studio — screenshot scenes.
//
// The app draws its own screenshots, so the maker never has to fake one:
//   ?shot=cover   paints one exported cover full-frame, using the same
//                 paintCover and exportPng the Export buttons use (the title
//                 records the export size, proving the PNG path end to end).
//   ?shot=editor  opens the editor with the sample photos loaded and the
//                 caption set, ready for a screenshot of the app at work.
//
// Query knobs: photo (a sample key), caption, sub, frame, tone.

import {
  freshCover, paintCover, exportPng, loadSamples, fontsReady,
} from './engine.js';

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot === 'cover') {
  paintCoverScene();
} else if (shot === 'editor') {
  openEditorScene();
}

async function paintCoverScene() {
  document.body.classList.add('shot-cover');
  document.title = 'cover-loading';
  const cover = freshCover();
  cover.headline = params.get('caption') || 'Sunset Heist';
  cover.tagline = params.get('sub') || 'chasing the neon sunset';
  cover.frame = params.get('frame') || 'hero';
  cover.tone = params.get('tone') || 'sunset';
  const photo = params.get('photo') || 'pier';
  const order = ['boulevard', 'neon-street', 'pier', 'sunset-beach'];
  const start = Math.max(0, order.indexOf(photo));
  for (let i = 0; i < 4; i++) cover.slots[i].photo = `sample:${order[(start + i) % order.length]}`;

  const canvas = document.createElement('canvas');
  canvas.id = 'shotCanvas';
  document.body.appendChild(canvas);

  const photos = await loadSamples();
  await fontsReady();
  const W = window.innerWidth || 1280;
  const H = window.innerHeight || 720;
  paintCover(canvas, cover, photos, W, H);

  // Prove the export path too: draw a real 1080 x 1080 PNG and report its size.
  try {
    const blob = await exportPng(cover, photos, 1080, 1080);
    document.title = `cover-ready export-1080:${blob.size}`;
  } catch {
    document.title = 'cover-ready export-failed';
  }
}

async function openEditorScene() {
  document.title = 'editor-loading';
  const api = window.__viceCoast;
  if (!api) return;
  const cover = api.cover;
  cover.headline = params.get('caption') || 'Boulevard Queen';
  cover.tagline = params.get('sub') || 'chasing the neon sunset';
  cover.frame = params.get('frame') || 'quad';
  cover.tone = params.get('tone') || 'neon';
  const headlineInput = document.getElementById('headlineInput');
  const taglineInput = document.getElementById('taglineInput');
  if (headlineInput) headlineInput.value = cover.headline;
  if (taglineInput) taglineInput.value = cover.tagline;

  // Wait until the sample photos are in before the screenshot is taken.
  const deadline = Date.now() + 8000;
  while (api.photos.size < 4 && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await api.fillSamples();
  await fontsReady();
  api.syncAll();
  api.repaint();
  // Let the queued animation frame paint before the scene reports ready, or the
  // screenshot would catch the previous frame.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  document.title = 'editor-ready';
}
