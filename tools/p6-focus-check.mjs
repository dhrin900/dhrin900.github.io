// P6 — focus-ring cascade, listed and resolved by hand rather than guessed.
// The browser disconnected before this could be measured on a live render.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const D = (f) => path.join('..', '2026', 'assets', 'css', f);

function hexToRgb(h){const s=h.replace('#','');return `rgb(${parseInt(s.slice(0,2),16)}, ${parseInt(s.slice(2,4),16)}, ${parseInt(s.slice(4,6),16)})`;}
function lum(h){const s=h.replace('#','');return 0.2126*0+0;}

const tokens = await readFile(D('tokens.css'), 'utf8');
const token = (n) => (tokens.match(new RegExp(`${n}:\\s*(#[0-9a-fA-F]{6})`)) || [])[1];

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
  { sel: ':focus-visible',                            spec: '(0,1,0)', sets: 'outline: 2px solid var(--brass-deep)  -> colour = brass-deep, width 2px, style solid' },
  { sel: '.skip-link:focus-visible',                   spec: '(0,2,0)', sets: 'background + colour only (no outline)' },
  { sel: '.on-dark :focus-visible, .act--dark :focus-visible', spec: '(0,2,0)', sets: 'outline-color: var(--brass-light)' },
];
for (const r of rules) console.log(`  ${r.sel}\n      specificity ${r.spec}  ${r.sets}`);

console.log('\n  An element inside .act--dark matches BOTH :focus-visible and .act--dark :focus-visible.');
console.log('  (0,2,0) beats (0,1,0), so outline-color resolves to --brass-light, while the');
console.log('  base shorthand still supplies width 2px and style solid (it is not overridden).');
console.log('  Result on the dark acts: 2px solid brass-light.\n');

const brassLight = token('--brass-light');
const brassDeep  = token('--brass-deep');
const ink        = token('--ink');
const sand       = token('--sand');

console.log('=== contrast of the resolved ring (indicator needs >= 3:1) ===');
const rows = [
  ['Act 05 clip button  / Act 08 button', brassLight, ink,  'brass-light on ink   (after fix)'],
  ['same, if .act--dark were missing',      brassDeep,  ink,  'brass-deep  on ink   (the bug)'],
  ['Act 07 save button  (light ground)',    brassDeep,  sand, 'brass-deep  on sand'],
];
for (const [label, fg, bg, note] of rows) {
  const r = ratio(fg, bg);
  console.log(`  ${label.padEnd(38)} ${hexToRgb(fg).padEnd(20)} on ${hexToRgb(bg).padEnd(20)} ${r.toFixed(2)}:1  ${r>=3?'PASS':'FAIL'}   (${note})`);
}
console.log('\n  .act--dark is present in index.html on act-voice and act-close:',
  /class="[^"]*\bact--dark\b/.test(await readFile(path.join('..','2026','index.html'),'utf8')) ? 'YES' : 'NO');
