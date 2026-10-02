// P0 / step 3 — video transcode + poster frames
// Sources are 384-576px wide phone captures encoded at ~1000-1300 kbps,
// which is wildly over-encoded for their resolution. Re-encode at CRF 28.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const FFMPEG = 'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');

const ROOT = path.resolve('..');
const SRC_DIRS = [ROOT, path.join(ROOT, 'pictures and video')];
const OUT = path.join(ROOT,'assets', 'video');
await mkdir(OUT, { recursive: true });

// semantic names — 2025's video.mp4 is deliberately excluded (belongs to the old site)
const MAP = {
  'WhatsApp Video 2026-10-02 at 11.53.11.mp4': 'message-main',
  'WhatsApp Video 2026-10-02 at 12.18.47.mp4': 'clip-1',
  'WhatsApp Video 2026-10-02 at 12.18.48.mp4': 'clip-2',
  'WhatsApp Video 2026-10-02 at 12.19.50.mp4': 'clip-3',
  'WhatsApp Video 2026-10-02 at 12.19.52.mp4': 'clip-4',
  'WhatsApp Video 2026-10-02 at 12.19.55.mp4': 'clip-5',
  'WhatsApp Video 2026-10-02 at 12.19.56.mp4': 'clip-long',
  'WhatsApp Video 2026-10-02 at 12.19.58.mp4': 'clip-6',
  'WhatsApp Video 2026-10-02 at 12.20.00.mp4': 'clip-7',
};

async function findSource(name) {
  for (const d of SRC_DIRS) {
    const p = path.join(d, name);
    try { await stat(p); return p; } catch { /* next */ }
  }
  return null;
}

const CRF = 28;
const rows = [];
let before = 0, after = 0;

console.log('name'.padEnd(14), 'source'.padEnd(12), 'dur'.padEnd(7), 'before'.padEnd(10), 'after'.padEnd(10), 'saved'.padEnd(8), 'new dims');
console.log('-'.repeat(84));

for (const [file, name] of Object.entries(MAP)) {
  const src = await findSource(file);
  if (!src) { console.log(`${name}  !! source not found`); continue; }

  const { stdout } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json',
    '-show_streams', '-show_format', src]);
  const j = JSON.parse(stdout);
  const v = j.streams.find((s) => s.codec_type === 'video');
  const dur = parseFloat(j.format.duration);
  const srcKB = (await stat(src)).size / 1024;
  before += srcKB;

  const dst = path.join(OUT, `${name}.mp4`);
  // cap long edge at 720, H.264 high profile, yuv420p for universal playback,
  // +faststart so playback can begin before the whole file arrives
  await run(FFMPEG, ['-y', '-i', src,
    '-vf', "scale='min(720,iw)':'min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0', '-preset', 'slow',
    '-crf', String(CRF), '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2',
    '-movflags', '+faststart', dst], { maxBuffer: 1 << 28 });

  // poster frame at 15% in (avoids fade-in/black first frames)
  const at = (dur * 0.15).toFixed(2);
  const poster = path.join(OUT, `${name}.jpg`);
  await run(FFMPEG, ['-y', '-ss', at, '-i', src, '-frames:v', '1',
    '-vf', "scale='min(900,iw)':-2", '-q:v', '4', poster], { maxBuffer: 1 << 28 });
  const posterBuf = await sharp(poster).webp({ quality: 78 }).toBuffer();
  await writeFile(path.join(OUT, `${name}.webp`), posterBuf);
  await sharp(poster).resize({ width: 720 }).webp({ quality: 78 }).toBuffer()
    .then((b) => writeFile(path.join(OUT, `${name}-720.webp`), b));

  const outKB = (await stat(dst)).size / 1024;
  after += outKB;

  rows.push({ name, srcKB, outKB, dur, poster: path.join(OUT, `${name}.webp`) });
  const pct = (100 * (1 - outKB / srcKB)).toFixed(0);
  console.log(name.padEnd(14), `${v.width}x${v.height}`.padEnd(12),
    `${dur.toFixed(1)}s`.padEnd(7), `${srcKB.toFixed(0)} KB`.padEnd(10),
    `${outKB.toFixed(0)} KB`.padEnd(10), `${pct}%`.padEnd(8), 'CRF' + CRF);
}

console.log('-'.repeat(84));
console.log(`TOTAL  ${(before / 1024).toFixed(1)} MB  ->  ${(after / 1024).toFixed(2)} MB   (${(100 * (1 - after / before)).toFixed(0)}% smaller)`);
console.log(`budget was <= 4.00 MB  =>  ${after / 1024 <= 4 ? 'PASS' : 'OVER'}`);

// contact sheet of posters so the frames can be eyeballed in one go
const TW = 260, TH = 460, COLS = Math.min(5, rows.length);
const sheetW = COLS * TW, rowsN = Math.ceil(rows.length / COLS);
await sharp({ create: { width: sheetW, height: rowsN * TH, channels: 3, background: '#111111' } })
  .composite(await Promise.all(rows.map(async (r, i) => ({
    input: await sharp(r.poster).resize(TW - 8, TH - 8, { fit: 'cover' }).toBuffer(),
    left: (i % COLS) * TW + 4, top: Math.floor(i / COLS) * TH + 4,
  }))))
  .png().toFile(path.join(ROOT, 'tools', 'build','poster-sheet.png'));
console.log('poster contact sheet -> tools/build/poster-sheet.png');
