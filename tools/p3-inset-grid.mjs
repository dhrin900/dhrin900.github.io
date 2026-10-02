// P3 — locate the caller's video inset inside the call screenshots.
// Draws a labelled 50px grid over call-3-laugh so the inset bounds can be read
// off precisely, rather than eyeballed from a downscaled render.
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve('..');
const SRC = path.join(ROOT,'assets', 'img', 'call-3-laugh-640.webp');
const OUT = path.join(ROOT, 'tools', 'build','inset-grid.png');

const STEP = 50;
const m = await sharp(SRC).metadata();
const W = m.width, H = m.height;
console.log(`source ${W}x${H}  (grid every ${STEP}px, labels are the SOURCE coords / 640*W)`);

let lines = '';
for (let x = 0; x <= W; x += STEP) {
  const major = x % 200 === 0;
  lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${major ? '#ff2d55' : '#00e5ff'}" stroke-width="${major ? 1.6 : 0.7}" opacity="${major ? 0.85 : 0.5}"/>`;
  if (x < W) lines += `<text x="${x + 3}" y="16" fill="#ff2d55" font-size="15" font-family="monospace">${x}</text>`;
}
for (let y = 0; y <= H; y += STEP) {
  const major = y % 200 === 0;
  lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${major ? '#ff2d55' : '#00e5ff'}" stroke-width="${major ? 1.6 : 0.7}" opacity="${major ? 0.85 : 0.5}"/>`;
  if (y < H) lines += `<text x="4" y="${y + 16}" fill="#ff2d55" font-size="15" font-family="monospace">${y}</text>`;
}

const svg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${lines}</svg>`
);
await sharp(SRC).composite([{ input: svg, left: 0, top: 0 }]).png().toFile(OUT);
console.log(`wrote ${OUT}`);
console.log(`NOTE: this is the 640w derivative. multiply coords by ${(1600 / W).toFixed(3)} for the 1600w original.`);
