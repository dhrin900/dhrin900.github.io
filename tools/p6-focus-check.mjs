// P6 — focus-ring cascade, listed and resolved by hand rather than guessed.
// The browser disconnected before this could be measured on a live render.
//
// Re-derived for the 2026 pink system. The ring is now 3px (was 2px) because
// the pages it has to sit on are petal and blush, not paper — a 2px ring at
// 3:1 was legal but hard to find against a soft pink field.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The site is the repo root, so every path here is one level up from tools/.
const D = (f) => path.join('..', 'assets', 'css', f);

const tokens = await readFile(D('tokens.css'), 'utf8');
const token = (n) => (tokens.match(new RegExp(`${n}:\\s*(#[0-9a-fA-F]{6})`)) || [])[1];

function hexToRgb(h){const s=h.replace('#','');return `rgb(${parseInt(s.slice(0,2),16)}, ${parseInt(s.slice(2,4),16)}, ${parseInt(s.slice(4,6),16)})`;}
function chan(h){const s=h.replace('#','');return [0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255);}
function L(h){const c=chan(h).map(v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4));
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
function ratio(a,b){let x=L(a),y=L(b);if(x<y){const t=x;x=y;y=t;}return (x+0.05)/(y+0.05);}

console.log('=== every rule that sets outline or outline-color ===\n');
for (const f of ['base.css','acts.css']) {
  const css = (await readFile(D(f),'utf8')).replace(/\/\*[\s\S]*?\*\//g,'');
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(css))) {
    const body = m[2];
    const line = (body.match(/(^|;)\s*outline(-color|-width|-style)?:\s*([^;]+)/g) || [])
      .map(s => s.replace(/^\s*;?\s*/,'').trim()).join(' | ');
    if (line) console.log(`  ${f.padEnd(9)} ${m[1].trim().padEnd(46)} ${line}`);
  }
}

console.log('\n=== cascade resolution ===');
const rules = [
  { sel: ':focus-visible',                             spec: '(0,1,0)', sets: 'outline: 3px solid var(--berry)  -> colour = berry, width 3px, style solid' },
  { sel: '.skip-link:focus-visible',                   spec: '(0,2,0)', sets: 'background + colour only (no outline)' },
  { sel: '.act--dark :focus-visible',                  spec: '(0,2,0)', sets: 'outline-color: var(--rose)' },
];
for (const r of rules) console.log(`  ${r.sel}\n      specificity ${r.spec}  ${r.sets}`);

console.log('\n  An element inside .act--dark matches BOTH :focus-visible and .act--dark :focus-visible.');
console.log('  (0,2,0) beats (0,1,0), so outline-color resolves to --rose, while the');
console.log('  base shorthand still supplies width 3px and style solid (it is not overridden).');
console.log('  Result on the dark acts: 3px solid rose.\n');

const milk  = token('--milk');
const blush = token('--blush');
const petal = token('--petal');
const night = token('--night');
const plum  = token('--plum');
const berry = token('--berry');
const rose  = token('--rose');
const roseD = token('--rose-deep');
const roseI = token('--rose-ink');
const gold  = token('--rosegold');
const goldI = token('--rosegold-ink');
const champ = token('--champagne');

console.log('=== contrast of the resolved ring (WCAG 2.2 non-text indicator needs >= 3:1) ===');
const rows = [
  ['Act 01/06/11  on milk',   berry, milk],
  ['Act 02/05/10/12 on blush', berry, blush],
  ['Act 08 note card on petal', berry, petal],
  ['Act 07/13 close on night', rose,  night],
  ['same, if .act--dark were missing', berry, night],
];
for (const [label, fg, bg] of rows) {
  const r = ratio(fg, bg);
  console.log(`  ${label.padEnd(34)} ${hexToRgb(fg).padEnd(18)} on ${hexToRgb(bg).padEnd(18)} ${r.toFixed(2)}:1  ${r>=3?'PASS':'FAIL'}`);
}
console.log('\n  .act--dark is present in index.html on act-voice and act-close:',
  /class="[^"]*\bact--dark\b/.test(await readFile(path.join('..','index.html'),'utf8')) ? 'YES' : 'NO');

/* ---------------------------------------------------------------------------
   Every ratio written in the tokens.css comments, checked rather than trusted.
   The rule the palette is built on is simple enough to state in one line and
   easy to break with one careless usage, so it is cheaper to assert it here
   than to re-derive it by hand every time a colour moves.

   `small` = 4.5:1 (body text), `large` = 3:1 (>=24px, or >=18.66px bold), and
   `stroke` = 3:1 for a UI boundary that carries meaning.
--------------------------------------------------------------------------- */
const CHECKS = [
  // token            ground   need     where it is actually used
  [plum,  milk,   4.5, 'body text everywhere'],
  [plum,  blush,  4.5, 'Act 02 body, Act 10 letter on blush'],
  [berry, milk,   4.5, 'secondary text, stat values, .act-head .lede'],
  [berry, blush,  4.5, 'little/stat/promise card copy'],
  [berry, petal,  4.5, '.label chip text'],
  [champ, night,  4.5, '.act--dark .label, .hand, .btn'],
  [rose,  night,  4.5, 'Act 13 closing line, .bs-tag--his'],
  // .bs-tag--her is the same token on the other side of the seam, and that side
  // is a berry->plum gradient, not night. At 160deg the bottom-right corner —
  // where the tag sits — is the plum end, so plum is the ground that has to
  // hold, not night. Same token, two grounds, two rows.
  [rose,  plum,   4.5, '.bs-tag--her, over the plum end of her gradient'],
  [goldI, milk,   4.5, '.stat__unit, .note-card__from, .letter__sign-from'],
  [goldI, blush,  4.5, 'sound toggle on a blush act'],
  // a pink that is allowed to set a letterform is allowed only because it
  // clears 3:1 — this is the one exception to "the pink never touches the ink"
  [roseI, milk,   3.0, 'Act 01 name gradient, final stop'],
];

/* Decorative only. Printed so the next person can see at a glance that these
   are NOT text-safe and must never be reached for as a text colour. */
const NOTES = [
  [rose,  milk,  'hearts, sparkles, fills, stickers'],
  [roseD, milk,  'hairlines, rules, ::before masks'],
  [gold,  milk,  'rose-gold leaf: strokes and borders'],
];

console.log('\n=== every contrast ratio claimed in tokens.css ===');
let failed = 0;
for (const [fg, bg, need, where] of CHECKS) {
  const r = ratio(fg, bg);
  const ok = r >= need;
  if (!ok) failed++;
  console.log(`  ${ok?'PASS':'FAIL'}  ${String(need).padEnd(4)} actual ${r.toFixed(2).padStart(5)}:1  ${hexToRgb(fg).padEnd(18)} on ${hexToRgb(bg).padEnd(18)} ${where}`);
}
console.log('\n  decorative — never text:');
for (const [fg, bg, where] of NOTES) {
  console.log(`        ${''.padEnd(4)} actual ${ratio(fg, bg).toFixed(2).padStart(5)}:1  ${hexToRgb(fg).padEnd(18)} on ${hexToRgb(bg).padEnd(18)} ${where}`);
}
console.log(failed ? `\n${failed} claim(s) do not hold — fix the token or the claim.` : '\nall claims hold.');
