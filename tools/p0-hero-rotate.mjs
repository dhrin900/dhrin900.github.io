// P0 / step 1 — hero crop (remove baked-in pillarbox) + rotate the sideways images
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('..');
const SRC = path.join(ROOT, 'pictures and video');
const OUT = path.join(ROOT, '2026', 'assets', 'img');
const HERO_SRC = path.join(ROOT, 'WhatsApp Image 2026-10-02 at 11.54.24 (1).jpeg');

await mkdir(OUT, { recursive: true });

const log = (...a) => console.log(...a);

/* ---------------------------------------------------------------- HERO
   Source is 1600x739 with pure-black bars: 142px left, 143px right.
   Usable region = x 142..1456 => 1315x739, exactly 16:9.               */
log('--- HERO ---');
const meta = await sharp(HERO_SRC).metadata();
log(`source        ${meta.width}x${meta.height}`);

const CROP = { left: 142, top: 0, width: 1315, height: 739 };
const hero = sharp(HERO_SRC).extract(CROP);
const hm = await hero.metadata();
log(`after crop    ${hm.width}x${hm.height}  ratio ${(hm.width / hm.height).toFixed(3)}`);

for (const w of [640, 960, 1315]) {
  const buf = await hero.clone().resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 }).toBuffer();
  await writeFile(path.join(OUT, `hero-${w}.webp`), buf);
  log(`  hero-${w}.webp`.padEnd(22) + `${(buf.length / 1024).toFixed(1)} KB`);
}

// LQIP: 20px wide, inlined as base64, blurred by the browser via CSS
const lqip = await hero.clone().resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
await writeFile(path.join(OUT, 'hero-lqip.txt'), `data:image/webp;base64,${lqip.toString('base64')}`);
log(`  hero-lqip (inline)     ${lqip.length} bytes`);

/* ------------------------------------------------- SIDEWAYS IMAGES
   #11 #12 #13 have their content rotated 90 degrees AND WhatsApp stripped
   the EXIF orientation tag, so no browser will fix them. Rotate the pixels.
   Direction verified visually in step 2.                                */
log('\n--- ROTATIONS ---');
// Direction confirmed empirically against a side-by-side contact sheet
// (2026/build/rot-test.png): 270 is upright, 90 is upside down.
const ROTATE = [
  { file: 'WhatsApp Image 2026-10-02 at 12.19.54.jpeg',     out: 'moments-eye.webp',    deg: 270 },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.55.jpeg',     out: 'moments-heart.webp',  deg: 270 },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.55 (1).jpeg', out: 'moments-peace.webp',  deg: 270 },
];

for (const r of ROTATE) {
  const p = path.join(SRC, r.file);
  const m = await sharp(p).metadata();
  const buf = await sharp(p).rotate(r.deg).webp({ quality: 82, effort: 6 }).toBuffer();
  const om = await sharp(buf).metadata();
  await writeFile(path.join(OUT, r.out), buf);
  log(`  ${r.file}`);
  log(`    ${m.width}x${m.height} -> ${om.width}x${om.height}  ${(buf.length / 1024).toFixed(1)} KB  -> ${r.out}`);
}

log('\ndone.');
