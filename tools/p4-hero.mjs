// P4 — regenerate the hero from the current source, detecting the pillarbox
// bars instead of assuming 142px.
//
// The source file changed during the session (1600x739 -> 6400x2956), so the
// hardcoded CROP from P0 no longer lines up: extracting 142px from a 6400px-wide
// frame takes a sliver of the empty left wall and produces a 3KB near-blank
// WebP. Bars are detected per-source instead.
import sharp from 'sharp';
import { writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('..');
const SRC = path.join(ROOT, 'WhatsApp Image 2026-10-02 at 11.54.24 (1).jpeg');
const OUT = path.join(ROOT,'assets', 'img');

const kb = (b) => `${(b.length / 1024).toFixed(1)} KB`;

/** Same >=90%-dark-full-height test used for the gallery, so the two agree. */
async function detectBars(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const dark = (x, y) => { const i = (y * W + x) * C; return data[i] < 14 && data[i + 1] < 14 && data[i + 2] < 14; };

  const ROWS = 240, MIN = 0.9;
  const rows = [];
  for (let k = 0; k < ROWS; k++) rows.push(Math.floor((k + 0.5) * H / ROWS));

  const colDark = new Float64Array(W);
  for (let x = 0; x < W; x++) { let n = 0; for (const y of rows) if (dark(x, y)) n++; colDark[x] = n / ROWS; }

  const runAt = (arr, from, to) => { let best = 0, run = 0; for (let i = from; i < to; i++) { if (arr[i] >= MIN) { run++; if (run > best) best = run; } else run = 0; } return best; };

  return { left: runAt(colDark, 0, W >> 1), right: runAt(colDark, W >> 1, W), W, H };
}

const meta = await sharp(SRC).metadata();
const before = (await stat(SRC)).size / 1024;
console.log(`source        ${meta.width}x${meta.height}  ${before.toFixed(0)} KB`);

const b = await detectBars(SRC);
console.log(`bars detected L=${b.left}  R=${b.right}`);
if (b.left === 0 && b.right === 0) console.log('  (no bars — the source may have been re-exported already cropped)');

const crop = {
  left: b.left, top: 0,
  width: b.W - b.left - b.right,
  height: meta.height,
};
console.log(`usable        ${crop.width}x${crop.height}  ratio ${(crop.width / crop.height).toFixed(3)}`);

const hero = sharp(SRC).extract(crop);

// Emit the widths the <img srcset> actually asks for, plus a 2x-capable set now
// that there is real detail to work with.
const WIDTHS = [640, 960, 1315, 1920, 2400];
for (const w of WIDTHS) {
  const buf = await hero.clone().resize({ width: w, withoutEnlargement: true })
    .webp({ quality: w > 1315 ? 74 : 80, effort: 6 }).toBuffer();
  await writeFile(path.join(OUT, `hero-${w}.webp`), buf);
  console.log(`  hero-${String(w).padEnd(4)}  ${kb(buf)}`);
}

const lqip = await hero.clone().resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
await writeFile(path.join(OUT, 'hero-lqip.txt'), `data:image/webp;base64,${lqip.toString('base64')}`);
console.log(`  lqip         ${lqip.length} bytes`);

// Regenerate the OG from the best available frame.
const OW = 1200, OH = 630;
const photo = await sharp(path.join(OUT, 'hero-1920.webp')).resize(OW, OH, { fit: 'cover', position: 'right' }).toBuffer();
const frame = Buffer.from(
  `<svg width="${OW}" height="${OH}" xmlns="http://www.w3.org/2000/svg">` +
  `<rect x="26" y="26" width="${OW - 52}" height="${OH - 52}" fill="none" ` +
  `stroke="#B8863B" stroke-width="1.5" opacity="0.55"/></svg>`);
const og = await sharp({ create: { width: OW, height: OH, channels: 3, background: '#F7F3EC' } })
  .composite([{ input: photo, left: 0, top: 0 }, { input: frame, left: 0, top: 0 }])
  .jpeg({ quality: 88, progressive: true }).toBuffer();
await writeFile(path.join(OUT, 'og.jpg'), og);
console.log(`  og.jpg       ${kb(og)}`);

// Verify the biggest output is not blank.
const check = await sharp(path.join(OUT, 'hero-1920.webp')).stats();
console.log(`\nverify hero-1920 channel stddev: ${check.channels.map(c => c.stdev.toFixed(1)).join(' / ')}`);
console.log(check.channels[0].stdev > 12 ? '  -> has real image content' : '  -> WARNING: looks blank');
