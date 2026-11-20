// Fixed scenes for screenshots: ?shot=editor shows the editor with sample
// photos loaded; ?shot=cover shows the cover alone, full frame.
// Query params: photo (sample name), caption (subtitle), title, layout, grade.
// window.__shotReady is set once the scene has painted.
import { PRESETS } from './cover.js';

export const SAMPLES = ['boulevard', 'pier', 'sunset-beach', 'neon-street'];

export async function runShot(shot, query, setup) {
  const layout = query.get('layout') || 'heroStrip';
  const grade = query.get('grade') || 'sunset';
  const photo = query.get('photo') || 'pier';
  const title = query.get('title') || 'VICE COAST';
  const caption = query.get('caption') || 'Sunset Heist';
  const preset = PRESETS[query.get('preset')] || null;
  if (shot === 'cover') document.body.classList.add('shot-cover');
  if (shot === 'editor') document.body.classList.add('shot-editor');
  const chosen = SAMPLES.includes(photo) ? photo : 'pier';
  await setup({
    shot,
    layout: preset ? preset.layout : layout,
    grade: preset ? preset.grade : grade,
    title: preset ? preset.title : title,
    subtitle: preset ? preset.subtitle : caption,
    tagline: preset ? preset.tagline : undefined,
    titlePos: preset ? preset.titlePos : undefined,
    sample: chosen,
  });
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
