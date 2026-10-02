// P0 / step 3c — final video pass: rotate (transpose=2, verified), compress, poster
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, stat, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const FFMPEG = 'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');

const ROOT = path.resolve('..');
const OUT = path.join(ROOT,'assets', 'video');
await mkdir(OUT, { recursive: true });

// direction verified in tools/build/rotvid/compare.png -> transpose=2 is upright
const ROT = 'transpose=2';

// poster timestamp as a fraction of duration, chosen per clip to avoid
// intro black frames and the beauty-app's filter-picker UI bar
const POSTER = {
  'message-main': 0.42,
  'clip-1': 0.55, 'clip-2': 0.60, 'clip-3': 0.50, 'clip-4': 0.50,
  'clip-5': 0.50, 'clip-long': 0.30, 'clip-6': 0.75, 'clip-7': 0.35,
};
// clip-long is 71s and dominates the budget; ship a lighter encode of it
const LITE_CRF = 34;

const NAMES = Object.keys(POSTER);
const rows = [];
let total = 0, totalLite = 0;

console.log('name'.padEnd(13), 'dur'.padEnd(7), 'new dims'.padEnd(11), 'size'.padEnd(10), 'poster'.padEnd(10), 'lite');
console.log('-'.repeat(70));

for (const n of NAMES) {
  const src = path.join(ROOT,'assets', 'video', `${n}.mp4`);
  const { stdout } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json', '-show_format', src]);
  const dur = parseFloat(JSON.parse(stdout).format.duration);

  const encode = async (dst, crf) => {
    await run(FFMPEG, ['-y', '-v', 'error', '-i', src,
      '-vf', `${ROT},scale='min(720,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
      '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-preset', 'slow',
      '-crf', String(crf), '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '96k', '-ac', '2', '-movflags', '+faststart', dst],
      { maxBuffer: 1 << 28 });
    return (await stat(dst)).size / 1024;
  };

  const tmp = path.join(OUT, `${n}.rot.mp4`);
  const kb = await encode(tmp, 28);
  await writeFile(path.join(OUT, `${n}.mp4`), await (await import('node:fs/promises')).readFile(tmp));
  const { unlink } = await import('node:fs/promises');
  await unlink(tmp);

  let lite = '';
  if (n === 'clip-long') {
    const tmp2 = path.join(OUT, `${n}.lite.tmp.mp4`);
    const lkb = await encode(tmp2, LITE_CRF);
    await writeFile(path.join(OUT, `${n}-lite.mp4`), await (await import('node:fs/promises')).readFile(tmp2));
    await unlink(tmp2);
    lite = `${(lkb / 1024).toFixed(2)} MB`;
    totalLite += lkb;
  }

  // poster from the ROTATED master, so the frame is upright
  const posterJpg = path.join(OUT, `${n}.jpg`);
  await run(FFMPEG, ['-y', '-v', 'error', '-ss', (dur * POSTER[n]).toFixed(2), '-i', src,
    '-frames:v', '1', '-vf', `${ROT},scale='min(900,iw)':-2`, '-q:v', '3', posterJpg],
    { maxBuffer: 1 << 28 });
  const full = await sharp(posterJpg).webp({ quality: 80 }).toBuffer();
  await writeFile(path.join(OUT, `${n}.webp`), full);
  await sharp(posterJpg).resize({ width: 640 }).webp({ quality: 78 }).toBuffer()
    .then((b) => writeFile(path.join(OUT, `${n}-640.webp`), b));
  await unlink(posterJpg);

  const { stdout: o } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json', '-show_streams', path.join(OUT, `${n}.mp4`)]);
  const vs = JSON.parse(o).streams.find((s) => s.codec_type === 'video');

  rows.push({ n, kb });
  total += kb;
  console.log(n.padEnd(13), `${dur.toFixed(1)}s`.padEnd(7), `${vs.width}x${vs.height}`.padEnd(11),
    `${kb.toFixed(0)} KB`.padEnd(10), `${(full.length / 1024).toFixed(0)} KB`.padEnd(10), lite);
}

console.log('-'.repeat(70));
const shipped = total - rows.find((r) => r.n === 'clip-long').kb;
console.log(`all 9 clips            ${(total / 1024).toFixed(2)} MB`);
console.log(`excluding clip-long    ${(shipped / 1024).toFixed(2)} MB   ${shipped / 1024 <= 4 ? 'WITHIN 4 MB budget' : 'OVER'}`);
console.log(`clip-long-lite (CRF${LITE_CRF})  ${(totalLite / 1024).toFixed(2)} MB`);

// verification sheet of the new upright posters
const TW = 240, TH = 400, COLS = 5;
await sharp({ create: { width: COLS * TW, height: Math.ceil(rows.length / COLS) * TH, channels: 3, background: '#141414' } })
  .composite(await Promise.all(rows.map(async (r, i) => ({
    input: await sharp(path.join(OUT, `${r.n}.webp`)).resize(TW - 8, TH - 8, { fit: 'cover' }).toBuffer(),
    left: (i % COLS) * TW + 4, top: Math.floor(i / COLS) * TH + 4,
  }))))
  .png().toFile(path.join(ROOT, 'tools', 'build','posters-final.png'));
console.log('\nverification sheet -> tools/build/posters-final.png');
console.log('order: ' + rows.map((r) => r.n).join(', '));
