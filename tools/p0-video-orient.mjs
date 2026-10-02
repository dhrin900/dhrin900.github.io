// P0 / step 3b — per-video orientation + poster-timestamp diagnostics
// Extracts one frame per video AS-IS, tiles them at true aspect with index
// labels, so each video can be classified individually before re-encoding.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const FFMPEG = 'C:/Users/Admin/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
const ROOT = path.resolve('..');
const TMP = path.join(ROOT, 'tools', 'build','frames');
await mkdir(TMP, { recursive: true });

const NAMES = ['message-main', 'clip-1', 'clip-2', 'clip-3', 'clip-4',
               'clip-5', 'clip-long', 'clip-6', 'clip-7'];

const TILE_W = 300, TILE_H = 420, COLS = 5;
const tiles = [];

for (const n of NAMES) {
  const src = path.join(ROOT,'assets', 'video', `${n}.mp4`);
  const { stdout } = await run(FFPROBE, ['-v', 'quiet', '-print_format', 'json', '-show_format', src]);
  const dur = parseFloat(JSON.parse(stdout).format.duration);

  // three candidate timestamps so a good frame can be chosen, not just 15%
  for (const [tag, frac] of [['a', 0.30], ['b', 0.55], ['c', 0.75]]) {
    const out = path.join(TMP, `${n}-${tag}.png`);
    await run(FFMPEG, ['-y', '-ss', (dur * frac).toFixed(2), '-i', src,
      '-frames:v', '1', '-vf', 'scale=280:-2', out], { maxBuffer: 1 << 28 });
  }

  const imgs = [];
  for (const tag of ['a', 'b', 'c']) {
    const b = await sharp(path.join(TMP, `${n}-${tag}.png`)).toBuffer();
    imgs.push(b);
  }
  const m = await sharp(imgs[0]).metadata();
  tiles.push({ n, dur, imgs, w: m.width, h: m.height });
  console.log(`${n.padEnd(13)} ${dur.toFixed(1)}s  frame ${m.width}x${m.height}`);
}

// one row per video: 3 candidate frames, true aspect, on a dark ground
const sheet = await sharp({
  create: {
    width: COLS * (TILE_W * 3 + 16),
    height: tiles.length * (TILE_H + 12),
    channels: 3, background: '#141414',
  },
});
const comp = [];
for (let r = 0; r < tiles.length; r++) {
  for (let c = 0; c < 3; c++) {
    const cell = TILE_W * 3 + 16;
    const buf = await sharp(tiles[r].imgs[c])
      .resize(TILE_W, TILE_H, { fit: 'contain', background: '#141414' })
      .toBuffer();
    comp.push({ input: buf, left: c * cell + 8, top: r * (TILE_H + 12) + 6 });
  }
}
await sheet.composite(comp).png().toFile(path.join(ROOT, 'tools', 'build','video-orientation.png'));
console.log('\nwrote tools/build/video-orientation.png');
console.log('rows top->bottom: ' + tiles.map((t) => t.n).join(', '));
console.log('cols left->right : frame @30%, @55%, @75%');
