// Fixed scenes for screenshots: ?shot=editor shows the editor with sample
// photos loaded; ?shot=cover shows the cover alone, full frame.
// Query params: photo (sample name), caption (subtitle), title, layout,
// grade, preset, skyline (0/1).
// window.__shotReady is set once the scene has painted.
import { PRESETS } from './cover.js';

export const SAMPLES = ['boulevard', 'pier', 'sunset-beach', 'neon-street'];

function pickParam(query, key, fallback) {
  const v = query.get(key);
  return v === null || v === '' ? fallback : v;
}

export async function runShot(shot, query, setup) {
  const preset = PRESETS[query.get('preset')] || null;
  const layout = preset ? preset.layout : pickParam(query, 'layout', 'heroStrip');
  const grade = preset ? preset.grade : pickParam(query, 'grade', 'sunset');
  const photo = pickParam(query, 'photo', 'pier');
  const title = preset ? preset.title : pickParam(query, 'title', 'VICE COAST');
  const caption = preset ? preset.subtitle : pickParam(query, 'caption', 'Sunset Heist');
  const skyline = query.get('skyline') === '0' ? false : query.get('skyline') === '1' ? true : undefined;
  if (shot === 'cover') document.body.classList.add('shot-cover');
  if (shot === 'editor') document.body.classList.add('shot-editor');
  const chosen = SAMPLES.includes(photo) ? photo : 'pier';
  await setup({
    shot,
    layout,
    grade,
    title,
    subtitle: caption,
    tagline: preset ? preset.tagline : undefined,
    titlePos: preset ? preset.titlePos : undefined,
    skyline,
    sample: chosen,
  });
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
