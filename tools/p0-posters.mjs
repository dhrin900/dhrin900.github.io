// P0 / step 3d — posters only.
// The .mp4 files in assets/video are ALREADY rotated (transpose=2, applied once
// during encode). Extract posters from them with NO further rotation.
// Also verifies each final video really is upright.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { stat, writeFile, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const FFMPEG = 'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
const ROOT = path.resolve('..');
const OUT = path.join(ROOT,'assets', 'video');

// timestamps chosen to skip intro black frames and the beauty-app UI bar
const POSTER = {
  'message-main': 0.42, 'clip-1': 0.55, 'clip-2': 0.60, 'clip-3': 0.50,
  'clip-4': 0.50, 'clip-5': 0.50, 'clip-long': 0.30, 'clip-6': 0.75, 'clip-7': 0.35,
};

const rows = [];
for (const [n, frac] of Object.entries(POSTER)) {
  const src = path.join(OUT, `${n}.mp4`);
  const { stdout } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json', '-show_format', src]);
  const dur = parseFloat(JSON.parse(stdout).format.duration);

  // NO transpose here — the file is already upright
  const jpg = path.join(OUT, `${n}.jpg`);
  await run(FFMPEG, ['-y', '-v', 'error', '-ss', (dur * frac).toFixed(2), '-i', src,
    '-frames:v', '1', '-vf', "scale='min(1000,iw)':-2", '-q:v', '3', jpg], { maxBuffer: 1 << 28 });

  const full = await sharp(jpg).webp({ quality: 80 }).toBuffer();
  await writeFile(path.join(OUT, `${n}.webp`), full);
  await sharp(jpg).resize({ width: 640 }).webp({ quality: 78 }).toBuffer()
    .then((b) => writeFile(path.join(OUT, `${n}-640.webp`), b));
  const m = await sharp(jpg).metadata();
  await unlink(jpg);

  rows.push({ n, poster: path.join(OUT, `${n}.webp`), w: m.width, h: m.height,
              kb: (await stat(src)).size / 1024, dur });
  console.log(`${n.padEnd(13)} ${dur.toFixed(1).padStart(5)}s  ${(m.width + 'x' + m.height).padEnd(10)} poster ${(full.length / 1024).toFixed(0)} KB`);
}

// landscape tiles this time — the videos are 720x406 after rotation
const TW = 330, TH = 200, COLS = 3;
await sharp({ create: { width: COLS * TW, height: Math.ceil(rows.length / COLS) * TH, channels: 3, background: '#141414' } })
  .composite(await Promise.all(rows.map(async (r, i) => ({
    input: await sharp(r.poster).resize(TW - 8, TH - 8, { fit: 'contain', background: '#141414' }).toBuffer(),
    left: (i % COLS) * TW + 4, top: Math.floor(i / COLS) * TH + 4,
  }))))
  .png().toFile(path.join(ROOT, 'tools', 'build','posters-verify.png'));
console.log('\nverification -> tools/build/posters-verify.png');
console.log('order: ' + rows.map((r) => r.n).join(', '));
