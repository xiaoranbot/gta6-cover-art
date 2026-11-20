// Vice Coast Cover Studio — screenshot scenes.
//
// When the page URL carries a scene parameter, this sets the cover up for a
// screenshot: one scene per name, each one a preset plus a chosen layout.
// The main script loads the sample photos first, then asks this module to
// arrange the state. Nothing here touches the network or the file system.

import { PRESETS, applyPreset } from './cover.js';

// The scenes the page knows by name.
export const SCENES = ['cover', 'editor', 'neon'];

// Arrange a scene on a state object. Returns true when the name is known.
export function applyScene(state, name) {
  if (name === 'cover') {
    applyPreset(state, PRESETS.sunsetHeist);
    return true;
  }
  if (name === 'editor') {
    applyPreset(state, PRESETS.boulevardQueen);
    return true;
  }
  if (name === 'neon') {
    applyPreset(state, PRESETS.neonRun);
    return true;
  }
  return false;
}
