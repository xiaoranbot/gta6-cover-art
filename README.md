# Vice Coast Cover Studio

[![make.fun bounty](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/c/gta6-cover-art-01?referral=3gk6xaeb)
[![make.fun rank](https://make.fun/badge/gta6-cover-art-01/xiaoranbot/gta6-cover-art/rank.svg)](https://make.fun/c/gta6-cover-art-01?referral=3gk6xaeb)
[![make.fun reward](https://make.fun/badge/gta6-cover-art-01/xiaoranbot/gta6-cover-art/reward.svg)](https://make.fun/c/gta6-cover-art-01?referral=3gk6xaeb)

Turn your photos into GTA-style multi-panel cover art with a Vice City neon-sunset grade — free, offline, in your browser. Your photos never leave your machine.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080.

## How it works

1. **Photos** — load the four sample photos, or upload up to four of your own. Click a panel in the preview, drag it to move its photo, scroll to zoom, or replace it from the panel list.
2. **Layout** — five multi-panel layouts: Four Corners, Hero + Trio, Full Bleed, Sunset Split and Vice Columns.
3. **Grade** — five Vice City gradient-map grades (Sunset Gold, Neon Vice, Teal Orange, Noir, Palm Dusk), applied per panel on canvas.
4. **Caption** — an Anton title in a sunset gradient with a glowing Pacifico subtitle; change the words, the colour and the size.
5. **Export** — one click exports a PNG at 1080 × 1080, 1080 × 1350, 1920 × 1080 or 1080 × 1920.

The cover is drawn on a 2D canvas: gradient-mapped photos, a hand-drawn skyline with palm trees, a glowing sunset title band, film grain and a vignette, inside a poster frame. The live preview and the export run the same drawing code, so what you see is what you get.

## Screenshots

`?shot=cover` draws a full-frame cover (the app's own drawing, at screenshot size) and `?shot=editor` opens the editor with the samples loaded — that is how the screenshots in `screenshots/` were taken.

## Originality

Everything here is original: no Rockstar Games logo, artwork or font is used. The lettering is **Anton** and **Pacifico**, both vendored under `app/fonts/` with their SIL Open Font License texts beside them. The four sample photos were made with an image model for this project. The app makes no network request — every script, font and image is a file under `app/`.

## Layout

- `main.ts` — the entry program (Node 22, standard library only): copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `serve.ts` — a tiny static server for trying the app locally.
- `app/` — the offline web app: `index.html`, `style.css`, `src/cover.js` (the cover engine), `src/main.js` (the editor), `src/shots.js` (the screenshot scenes), `fonts/`, `samples/`.
- `screenshots/` — the cover and the editor at work.

## License

MIT — see [LICENSE](LICENSE).
