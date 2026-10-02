# tools/

Build pipeline for the site. **Nothing here ships** — the deployable output is
the repo root itself (`index.html`, `assets/`, `.nojekyll`), which is what
GitHub Pages publishes. These scripts are what produced it, so the whole
pipeline is reproducible from the original media.

## Layout

The site and the repo are the same tree. GitHub Pages publishes the root of
`main` for a `<user>.github.io` repo, so `index.html`, `assets/` and
`.nojekyll` sit at the top level and the root URL *is* the site — there is no
subfolder to deploy and no subpath URL to keep alive.

Two folders are deliberately not part of the deploy:

- `tools/` — everything in this document. Build diagnostics are written to
  `tools/build/`, never to the site root: those PNGs are contact sheets and
  crops of real photographs, and the site root is a public URL.
- `pictures and video/` — the raw camera originals, plus `hbd.mpeg`, the audio
  source moved here when the 2025 site was deleted. Gitignored, so all of it
  stays on disk and off the internet.

## Requirements

- Node 18+
- `ffmpeg` 9.x on PATH (winget: `winget install Gyan.FFmpeg`)
- `sharp` and `postcss` — `npm install` in this folder

## Order matters

Run in this sequence. Each step reads the output of the one before.

| Script | Does |
|---|---|
| `p0-classify.mjs` | Sorts the raw camera roll into portraits / moments / rejects before anything is cropped |
| `p0-hero-rotate.mjs` | Crops the hero out of its baked-in pillarbox bars, emits 640/960/1315/1920/2400 WebP + an inline LQIP, and rotates the three sideways photos **270° CCW** |
| `p0-gallery.mjs` | Gallery images to responsive WebP. Bar detection requires a **≥90%-dark full-height run** — a dark photo edge is not a bar |
| `p0-video-orient.mjs` | Probes every clip and fixes rotation metadata before any encode, so nothing downstream has to guess |
| `p0-video.mjs` | First video pass: probe, compress to 720p H.264 CRF 28, extract posters |
| `p0-video2.mjs` | Second pass over the clips the first pass rejected on size or duration |
| `p3-inset-grid.mjs` | Draws a coordinate grid over a call screenshot so the caller-inset bounds can be read off precisely |
| `p3-crops.mjs` | Crops his tile and her half out of the call frames for Act 03 |
| `p4-hero.mjs` | Re-derives the hero, **detecting** bars per source rather than assuming a fixed crop |
| `p0-og.mjs` | 1200×630 share image, no baked-in text |
| `p0-posters.mjs` | Re-extracts video posters from already-rotated files (no second transpose) |
| `p0-finish.mjs` | `message-main` UI-strip crop, audio to AAC, favicon, OG image |
| `p1-fonts.mjs` | Self-hosts Cormorant Garamond + Fredoka + Caveat + Inter, **latin and latin-ext only**, and rewrites the font preload hints in `index.html` |
| `p6-integrity.mjs` | **Run this after any asset change** |
| `p6-focus-check.mjs` | Resolves the focus-ring cascade, and re-checks every contrast ratio claimed in `tokens.css` |

## Verification

`p6-integrity.mjs` is the one that matters. It checks that every JS module
parses, every CSS file parses under postcss, every `src` / `href` / `poster` /
`data-src` path resolves to a real file, and — since the pink revision — that
every family named by a `--font-*` token actually has an `@font-face`.

That last one earns its place. A font that is named but not hosted throws no
error anywhere: the browser substitutes and the page quietly stops looking like
the design. Nothing else in the pipeline would have noticed.

`p6-integrity.mjs` has earned its place in general: it caught a live 404 on the
Act 05 video poster that Lighthouse and the browser console both missed, and it
has produced false alarms of its own. Treat a green run as a reason to keep
going, not as proof.

## Notes

- **Never truncate a build script's output** with `Select-Object -First`. It
  terminates the upstream process — that is how `moments-eye.webp` went missing
  once, because the truncation landed between two log lines and the files after
  it were never written.
- **`p1-fonts.mjs` owns the font preload hints.** Google's woff2 filenames are
  content hashes that move when Google re-cuts a face, so the script writes the
  `<link rel="preload">` lines between the `<!-- fonts:start -->` and
  `<!-- fonts:end -->` markers in `index.html`. Do not hand-edit those hashes;
  they will be overwritten, and a stale one is a wasted request plus a console
  error rather than a warm font.
- The script deliberately does **not** clear the fonts directory before it
  starts. An earlier version did, and a fetch that failed halfway left
  `fonts.css` pointing at files that had just been deleted. Orphans are swept at
  the end, after the new stylesheet and hints are on disk.
- `receiver.mjs` is a throwaway dev server used to pull a canvas render out of
  the browser for inspection. Not part of the site, not part of the build.
- The `_*.html` harnesses are responsive / degradation test pages. They live in
  this folder and reference `../index.html`; serve the repo root and open them
  from there.
