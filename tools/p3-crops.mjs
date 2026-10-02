// P3 — crop the two halves out of the video-call screenshots.
// Act 03 is built from real frames, not an invented metaphor: his side is the
// caller's video tile, her side is her, both from the same moment.
//
// Inset bounds read off tools/build/inset-grid.png (640w derivative), then
// scaled to the 739x1600 originals by 739/640 = 1.1547.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('..');
const SRC = path.join(ROOT, 'pictures and video');
const OUT = path.join(ROOT,'assets', 'img');

const S = 739 / 640;               // 640-derivative -> 739-original
const px = (n) => Math.round(n * S);

// measured on the grid overlay
const INSET = { left: px(18), top: px(88), width: px(145), height: px(264) };
// her face + shoulders, same frame
const HER   = { left: px(196), top: px(520), width: px(400), height: px(600) };

console.log('inset (his):', JSON.stringify(INSET));
console.log('crop  (her):', JSON.stringify(HER));

const JOBS = [
  { file: 'WhatsApp Image 2026-10-02 at 12.19.53 (1).jpeg', tag: 'laugh',
    note: 'both laughing — Act 03 hero' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.53 (2).jpeg', tag: 'soft',
    note: 'same room, softer moment' },
];

for (const j of JOBS) {
  const src = path.join(SRC, j.file);

  // his tile — kept at native resolution. Enlarging a 167px video-call inset to
  // fill half a desktop screen would be a 4x upscale and look like mush, so the
  // layout treats it as a call tile rather than a hero image.
  const his = await sharp(src).extract(INSET).webp({ quality: 88, effort: 6 }).toBuffer();
  await writeFile(path.join(OUT, `his-${j.tag}.webp`), his);
  const hm = await sharp(his).metadata();

  // her half
  const her = await sharp(src).extract(HER).webp({ quality: 82, effort: 6 }).toBuffer();
  await writeFile(path.join(OUT, `her-${j.tag}.webp`), her);

  console.log(`\n${j.tag}  (${j.note})`);
  console.log(`  his-${j.tag}.webp  ${hm.width}x${hm.height}  ${(his.length / 1024).toFixed(1)} KB`);
  console.log(`  her-${j.tag}.webp  ${HER.width}x${HER.height}  ${(her.length / 1024).toFixed(1)} KB`);
}

// contact sheet so the crops can be eyeballed before Act 03 is built on them
const tiles = [
  ['his-laugh', 200, 300], ['her-laugh', 200, 300],
  ['his-soft', 200, 300], ['her-soft', 200, 300],
];
const comp = [];
for (let i = 0; i < tiles.length; i++) {
  const [name, w, h] = tiles[i];
  comp.push({
    input: await sharp(path.join(OUT, `${name}.webp`)).resize(w, h, { fit: 'cover' }).toBuffer(),
    left: (i % 4) * 210 + 5, top: 5,
  });
}
await sharp({ create: { width: 4 * 210, height: 310, channels: 3, background: '#F7F3EC' } })
  .composite(comp).png().toFile(path.join(ROOT, 'tools', 'build','act03-crops.png'));
console.log('\n-> tools/build/act03-crops.png  (his, her, his, her)');
