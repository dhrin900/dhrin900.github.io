// P0 / step 2 — gallery images: strip any baked-in bars, emit responsive WebP
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('..');
const SRC = path.join(ROOT, 'pictures and video');
const OUT = path.join(ROOT, '2026', 'assets', 'img');
await mkdir(OUT, { recursive: true });

const kb = (b) => `${(b.length / 1024).toFixed(1)} KB`;

/** Detect a real pillarbox/letterbox bar.
 *  A genuine bar is near-black down the FULL height (or width), so require
 *  >=90% of sampled scanlines to be dark. A dark photo edge fails this test
 *  and is correctly left alone. */
async function detectBars(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const dark = (x, y) => { const i = (y * W + x) * C; return data[i] < 14 && data[i + 1] < 14 && data[i + 2] < 14; };

  const ROWS = 200;
  const rows = [];
  for (let k = 0; k < ROWS; k++) rows.push(Math.floor((k + 0.5) * H / ROWS));

  // fraction of sampled rows that are dark, per column
  const colDark = new Float64Array(W);
  for (let x = 0; x < W; x++) { let n = 0; for (const y of rows) if (dark(x, y)) n++; colDark[x] = n / ROWS; }

  // longest contiguous run of columns that are >=90% dark
  const runAt = (arr, n, from, to, test) => {
    let best = 0, run = 0;
    for (let i = from; i < to; i++) { if (test(arr[i])) { run++; if (run > best) best = run; } else run = 0; }
    return best;
  };
  const COLS = 200;
  const cols = [];
  for (let k = 0; k < COLS; k++) cols.push(Math.floor((k + 0.5) * W / COLS));
  const rowDark = new Float64Array(H);
  for (let y = 0; y < H; y++) { let n = 0; for (const x of cols) if (dark(x, y)) n++; rowDark[y] = n / COLS; }

  const MIN = 0.9;
  return {
    left:  runAt(colDark, W, 0, W >> 1, (v) => v >= MIN),
    right: runAt(colDark, W, W >> 1, W, (v) => v >= MIN),
    top:   runAt(rowDark, H, 0, H >> 1, (v) => v >= MIN),
    bot:   runAt(rowDark, H, H >> 1, H, (v) => v >= MIN),
    W, H,
  };
}

const JOBS = [
  { file: 'WhatsApp Image 2026-10-02 at 12.20.01.jpeg',     out: 'duo-game',    role: 'gaming duo (both of you)' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.49.jpeg',     out: 'friends-booth', role: 'photo booth, friends' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.51.jpeg',     out: 'brass-spoon', role: 'brass gallery — GALLERY HERO' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.51 (1).jpeg', out: 'star-cheek',  role: 'star stickers, balcony' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.51 (2).jpeg', out: 'office-candid', role: 'unposed, glasses' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.52.jpeg',     out: 'call-1',      role: 'video call — both' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.53.jpeg',     out: 'call-2',      role: 'video call — both' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.53 (1).jpeg', out: 'call-3-laugh', role: 'video call — BOTH LAUGHING (Act 03 hero)' },
  { file: 'WhatsApp Image 2026-10-02 at 12.19.53 (2).jpeg', out: 'call-4',      role: 'video call — both' },
];

let total = 0;
console.log('file'.padEnd(34), 'source'.padEnd(11), 'bars(LRTB)'.padEnd(12), 'output'.padEnd(11), 'sizes');
console.log('-'.repeat(96));

for (const j of JOBS) {
  const p = path.join(SRC, j.file);
  const b = await detectBars(p);
  const barStr = `${b.left}/${b.right}/${b.top}/${b.bot}`;
  const hasBars = b.left > 8 || b.right > 8 || b.top > 8 || b.bot > 8;

  let pipe = sharp(p);
  let srcLabel = `${b.W}x${b.H}`;
  if (hasBars) {
    pipe = pipe.extract({
      left: b.left, top: b.top,
      width: b.W - b.left - b.right,
      height: b.H - b.top - b.bot,
    });
    srcLabel += '*';
  }

  const m = await pipe.clone().metadata();
  const widths = m.width >= 1200 ? [640, 1200] : [640];
  const sizes = [];
  for (const w of widths) {
    const buf = await pipe.clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 }).toBuffer();
    const name = widths.length > 1 ? `${j.out}-${w}.webp` : `${j.out}-${w}.webp`;
    await writeFile(path.join(OUT, name), buf);
    sizes.push(`${name} ${kb(buf)}`);
    total += buf.length;
  }
  console.log(j.file.replace('WhatsApp Image 2026-10-02 at ', '').padEnd(34),
              srcLabel.padEnd(11), barStr.padEnd(12), `${m.width}x${m.height}`.padEnd(11),
              sizes.join('  '));
  console.log(' '.repeat(34), `-> ${j.role}`);
}
console.log('-'.repeat(96));
console.log(`gallery total (all widths): ${(total / 1024).toFixed(0)} KB`);
console.log('* = bars were stripped');
