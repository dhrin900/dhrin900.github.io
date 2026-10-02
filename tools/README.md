# tools/

Build pipeline for the 2026 site. **Nothing here ships** — the deployable
output is `2026/` alone. These scripts are what produced it, so the whole
pipeline is reproducible from the original media.

## Requirements

- Node 18+
- `ffmpeg` 9.x on PATH (winget: `winget install Gyan.FFmpeg`)
- `sharp` and `postcss` — `npm install` in this folder

## Order matters

Run in this sequence. Each step reads the output of the one before.

| Script | Does |
|---|---|
| `p0-hero-rotate.mjs` | Crops the hero out of its baked-in pillarbox bars, emits 640/960/1315/1920/2400 WebP + an inline LQIP, and rotates the three sideways photos **270° CCW** |
| `p0-gallery.mjs` | Gallery images to responsive WebP. Bar detection requires a **≥90%-dark full-height run** — a dark photo edge is not a bar |
| `p0-video.mjs` | First video pass: probe, compress to 720p H.264 CRF 28, extract posters |
| `p3-inset-grid.mjs` | Draws a coordinate grid over a call screenshot so the caller-inset bounds can be read off precisely |
| `p3-crops.mjs` | Crops his tile and her half out of the call frames for Act 03 |
| `p4-hero.mjs` | Re-derives the hero, **detecting** bars per source rather than assuming a fixed crop |
| `p0-og.mjs` | 1200×630 share image, no baked-in text |
| `p0-posters.mjs` | Re-extracts video posters from already-rotated files (no second transpose) |
| `p0-finish.mjs` | `message-main` UI-strip crop, audio to AAC, favicon |
| `p1-fonts.mjs` | Self-hosts Cormorant Garamond + Inter, **latin and latin-ext only** |
| `p6-integrity.mjs` | **Run this after any asset change** |
| `p6-focus-check.mjs` | Resolves the focus-ring cascade and its contrast |

## Verification

`p6-integrity.mjs` is the one that matters. It checks that every JS module
parses, every CSS file parses under postcss, and every `src` / `href` /
`poster` / `data-src` path resolves to a real file.

It has earned its place: it caught a live 404 on the Act 05 video poster that
Lighthouse and the browser console both missed, and it has produced false alarms
of its own. Treat a green run as a reason to keep going, not as proof.

## Notes

- **Never truncate a build script's output** with `Select-Object -First`. It
  terminates the upstream process — that is how `moments-eye.webp` went missing
  once, because the truncation landed between two log lines and the files after
  it were never written.
- `receiver.mjs` is a throwaway dev server used to pull a canvas render out of
  the browser for inspection. Not part of the site, not part of the build.
- The `_*.html` harnesses are responsive / degradation test pages. Serve
  `2026/` and open them from there.
