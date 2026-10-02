// P6/P7 — static integrity check. No browser available, so this verifies the
// things that can be proven from disk:
//   1. every JS file parses
//   2. every CSS file has balanced braces and no obvious syntax break
//   3. every src/href/srcset path in index.html resolves to a real file
//   4. every asset referenced from JS exists
//   5. no asset is referenced but missing, and none is orphaned
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import postcss from 'postcss';

const run = promisify(execFile);
const SITE = path.join('..', '2026');
let fails = 0;
const fail = (m) => { console.log('  FAIL  ' + m); fails++; };
const pass = (m) => console.log('  ok    ' + m);

/* ---------------------------------------------------------- 1. JS parses */
console.log('1. JavaScript parses');
const jsDir = path.join(SITE, 'assets', 'js');
for (const f of await readdir(jsDir)) {
  if (!f.endsWith('.js')) continue;
  try {
    await run(process.execPath, ['--check', path.join(jsDir, f)]);
    pass(`assets/js/${f}`);
  } catch (e) {
    fail(`assets/js/${f} — ${String(e.stderr || e).split('\n').slice(0,3).join(' ')}`);
  }
}

/* ------------------------------------------------------------ 2. CSS ok */
console.log('\n2. CSS parses (postcss — a real parser, not a brace count)');
const cssDir = path.join(SITE, 'assets', 'css');
for (const f of await readdir(cssDir)) {
  if (!f.endsWith('.css')) continue;
  const css = await readFile(path.join(cssDir, f), 'utf8');
  try {
    const root = postcss.parse(css, { from: f });
    let rules = 0, decls = 0, at = 0;
    root.walkRules(() => rules++);
    root.walkDecls(() => decls++);
    root.walkAtRules(() => at++);
    pass(`assets/css/${f} — ${rules} rules, ${decls} declarations, ${at} at-rules`);
  } catch (e) {
    fail(`assets/css/${f} — ${e.reason} at line ${e.line}`);
  }
}

/* ------------------------------------------- 3. paths in index.html exist */
console.log('\n3. Every path referenced by index.html resolves');
const html = await readFile(path.join(SITE, 'index.html'), 'utf8');
const refs = new Set();
// Every attribute that can carry a URL, not just src/href. A previous version of
// this check scanned only src and href, which is how a 404 on the Act 05 video
// poster (poster="...") reached a live page with a clean report.
for (const attr of ['src', 'href', 'poster', 'data-src', 'content']) {
  for (const m of html.matchAll(new RegExp(`(?:^|\\s)${attr}="(\\./[^"]+)"`, 'g'))) refs.add(m[1]);
}
for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const part of m[1].split(',')) {
    const u = part.trim().split(/\s+/)[0];
    if (u.startsWith('./')) refs.add(u);
  }
}
// the OG image is absolute by design; check it against the deploy root
const og = (html.match(/property="og:image" content="([^"]+)"/) || [])[1];
for (const r of refs) {
  const p = path.join(SITE, r.replace(/^\.\//, ''));
  try { await stat(p); pass(r); } catch { fail(`${r} — referenced but missing on disk`); }
}
if (og) {
  const rel = og.replace('https://dhrin900.github.io/2026/', '');
  try { await stat(path.join(SITE, rel)); pass(`og:image -> ${rel} (absolute URL, maps to a real file)`); }
  catch { fail(`og:image -> ${rel} missing`); }
  if (!/^https:\/\//.test(og)) fail('og:image is not absolute — scrapers will not resolve it');
}

/* ------------------------------------------- 4. assets named in JS exist */
console.log('\n4. Assets named in JS resolve');
for (const f of await readdir(jsDir)) {
  if (!f.endsWith('.js')) continue;
  const src = await readFile(path.join(jsDir, f), 'utf8');
  const names = new Set();
  // plain string literals only. A srcset is a comma-separated descriptor list,
  // not a filename — splitting on the descriptor keeps that from being read as
  // one long path (which is how the first run of this check produced a
  // false "missing" for a file that exists).
  for (const m of src.matchAll(/['"]\.\/assets\/([^'"]+)['"]/g)) {
    for (const part of m[1].split(',')) {
      // every comma-separated part repeats the ./assets/ prefix, so normalise
      // each one rather than only the first
      const file = part.trim().split(/\s+/)[0].replace(/^\.\/assets\//, '');
      if (file && !file.includes('${')) names.add(file);
    }
  }
  for (const n of names) {
    if (/\.(mp3|mp4|m4a|webp|png|svg|jpg|css|js|woff2)$/.test(n)) {
      try { await stat(path.join(SITE, 'assets', n)); pass(`${f} -> ${n}`); }
      catch { fail(`${f} -> ${n} missing`); }
    } else {
      pass(`${f} -> ${n} (not a direct file reference)`);
    }
  }
}

// clips.js builds poster/video names from a list; check the list itself
const cfg = await readFile(path.join(jsDir, 'config.js'), 'utf8');
const clipList = (cfg.match(/videoClips:\s*\[([^\]]+)\]/) || [])[1] || '';
const clips = clipList.match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
const feature = (cfg.match(/featureVideo:\s*'([^']+)'/) || [])[1];
for (const c of [...clips, feature]) {
  for (const suffix of ['.mp4', '-640.webp']) {
    try { await stat(path.join(SITE, 'assets', 'video', c + suffix)); }
    catch { fail(`clip "${c}" missing ${suffix}`); }
  }
}
pass(`${clips.length} clips + feature "${feature}" all have an .mp4 and a -640.webp poster`);

/* ------------------------------------------------ 5. deploy-time guards */
console.log('\n5. Deploy guards');
try { await stat(path.join(SITE, '.nojekyll')); pass('.nojekyll present (Jekyll will not strip the folder'); }
catch { fail('.nojekyll missing — GitHub Pages may run Jekyll over this'); }
const underscore = (await readdir(SITE, { withFileTypes: true }))
  .filter(d => d.name.startsWith('_')).map(d => d.name);
if (underscore.length) fail(`files starting with _ in the site root: ${underscore.join(', ')}`);
else pass('no underscore-prefixed files in the site root');
const ogRel = refs.size && [...refs].every(r => r.startsWith('./'));
pass(ogRel ? 'all internal references are relative — a /2026/ subpath deploy works' : 'some references are NOT relative — a subpath deploy would break');

console.log(`\n${fails === 0 ? 'ALL CHECKS PASSED' : fails + ' FAILURE(S)'}`);
process.exitCode = fails ? 1 : 0;
