// Vice Coast Cover Studio — the entry program for gta6-cover-art-01.
// Node 22, standard library only.
//
// It hands the app in: it copies this repository's app/ (the offline cover
// maker) and screenshots/ (the cover and the editor at work) into the output
// directory and writes /output/dossier.json with buildDossier from the vendored
// make.fun library, so the sealed scorer can rebuild the same dossier byte for
// byte from the same files.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Serve the app locally first with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The app is plain static files under app/: index.html, its style and modules,
// the vendored Anton and Pacifico fonts and the four sample photos. Nothing is
// built or fetched at run time.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

// Screenshots are the maker's own captures: the first by name is the exported
// cover, the rest show the editor with photos loaded and covers in the other
// post sizes. The gate wants 3 or 4 of them, so refuse anything else early.
mkdirSync(join(out, 'screenshots'), { recursive: true });
const shotsDir = join(here, 'screenshots');
if (existsSync(shotsDir)) {
  const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
  if (shots.length < 3 || shots.length > 4) {
    throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
  }
  for (const name of shots) {
    if (!statSync(join(shotsDir, name)).isFile()) throw new Error(`screenshot ${name} is not a file`);
  }
  cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });
}

// The caps are the competition's own gate limits (reference/gate.json): the
// dossier text is capped at 160 KiB, at most 4 screenshots of at most 256 KiB
// each, app/ at most 993 files and 48 MiB in all, and no path under app/ over
// 1000 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);

console.log(`wrote ${out}/dossier.json`);
