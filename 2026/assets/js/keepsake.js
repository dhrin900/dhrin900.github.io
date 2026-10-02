/**
 * keepsake.js — Act 07. Renders a card to a canvas, in the page, and lets her
 * save it.
 *
 * Design decision: the card is DRAWN INTO THE PAGE, not hidden behind a download
 * button. She sees the object first, and can long-press to save it the way she
 * would save any photo — which is how people actually keep things. "Save it" is
 * the extra route, not the only one.
 *
 * The canvas is authored at 1200x1600 (3:4) and CSS-scales it down, so it is
 * retina-sharp on any display and costs one raster rather than a download.
 */

import { CONFIG } from './config.js';

/* Sampled from her photographs — see tokens.css for provenance. Kept literal
   here because canvas cannot read custom properties. */
const INK = '#1C1714';
const PAPER = '#F7F3EC';
const BRASS = '#B8863B';
const MUTED = '#6B5D4E';

const W = 1200;
const H = 1600;

/** The one line pulled from the letter. Keep it short enough for the measure. */
const KEEPSAKE_LINE = 'Two time zones, one call, and a whole year of this.';

export function initKeepsake() {
  const canvas = document.querySelector('[data-keepsake]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const draw = () => {
    /* --- paper ------------------------------------------------------- */
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);

    /* a whisper of warmth in the top-left, like light falling across a card */
    const glow = ctx.createRadialGradient(W * 0.18, H * 0.12, 0, W * 0.18, H * 0.12, W * 0.9);
    glow.addColorStop(0, 'rgba(184,134,59,0.07)');
    glow.addColorStop(1, 'rgba(184,134,59,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    /* --- double rule border ------------------------------------------ */
    ctx.strokeStyle = BRASS;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    ctx.strokeRect(64, 64, W - 128, H - 128);
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 80, W - 160, H - 160);
    ctx.globalAlpha = 1;

    const cx = W / 2;
    ctx.textAlign = 'center';

    /* Vertical rhythm. The first pass left a ~400px void between the line and
       the seal, which read as an accident rather than as space. These values
       keep roughly even gaps: border->date 188, line->seal 306, seal->footer
       230, footer->border 160. */
    const Y_DATE = 268;
    const Y_NAME = 600;
    const Y_RULE = 692;
    const Y_LINE = 824;
    const Y_SEAL = 1130;
    const Y_FROM = 1360;

    /* --- date, small caps -------------------------------------------- */
    ctx.fillStyle = BRASS;
    ctx.font = '500 26px Inter, sans-serif';
    const date = CONFIG.herBirthday.toUpperCase();
    // manual tracking: canvas has no letter-spacing in older engines
    drawTracked(ctx, date, cx, Y_DATE, 9);

    /* --- her name ---------------------------------------------------- */
    ctx.fillStyle = INK;
    ctx.font = '300 190px "Cormorant Garamond", Georgia, serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(CONFIG.herName, cx, Y_NAME);

    /* --- rule -------------------------------------------------------- */
    ctx.strokeStyle = BRASS;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 70, Y_RULE);
    ctx.lineTo(cx + 70, Y_RULE);
    ctx.stroke();
    ctx.globalAlpha = 1;

    /* --- the line from the letter ------------------------------------ */
    ctx.fillStyle = MUTED;
    ctx.font = 'italic 300 46px "Cormorant Garamond", Georgia, serif';
    wrapText(ctx, KEEPSAKE_LINE, cx, Y_LINE, W - 300, 66);

    /* --- the small mark, echoing the wax seal ----------------------- */
    ctx.save();
    ctx.translate(cx, Y_SEAL);
    ctx.fillStyle = 'rgba(90,63,22,0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(217,190,140,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 33, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#D9BE8C';
    fourPointStar(ctx, 0, 0, 15);
    ctx.fill();
    ctx.restore();

    /* --- from -------------------------------------------------------- */
    ctx.fillStyle = MUTED;
    ctx.font = '500 24px Inter, sans-serif';
    drawTracked(ctx, `FROM ${CONFIG.hisName.toUpperCase()} · ${CONFIG.hisPlace.toUpperCase()}`, cx, Y_FROM, 7);
  };

  const paint = async () => {
    // Canvas needs the faces resident or it falls back to Georgia and the card
    // looks like a different design.
    if (document.fonts) {
      try {
        await Promise.all([
          document.fonts.load('300 190px "Cormorant Garamond"'),
          document.fonts.load('italic 300 46px "Cormorant Garamond"'),
          document.fonts.load('500 26px Inter'),
        ]);
        await document.fonts.ready;
      } catch { /* fall through to whatever is resident */ }
    }
    draw();
  };

  paint();

  document.querySelector('[data-keep-redraw]')?.addEventListener('click', paint);

  /* --- save ---------------------------------------------------------- */
  document.querySelector('[data-keep-save]')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const done = (msg) => { const o = btn.textContent; btn.textContent = msg; setTimeout(() => { btn.textContent = o; }, 2200); };

    const finish = (href, revoke) => {
      const a = document.createElement('a');
      a.href = href;
      a.download = `${CONFIG.herName.toLowerCase()}-${CONFIG.herBirthday.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (revoke) setTimeout(() => URL.revokeObjectURL(href), 4000);
      done('Saved');
    };

    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (blob) finish(URL.createObjectURL(blob), true);
        else finish(canvas.toDataURL('image/png'), false);
      }, 'image/png');
    } else {
      // older Safari: data URL instead of an object URL
      finish(canvas.toDataURL('image/png'), false);
    }
  });
}

/* ------------------------------------------------------------------ helpers */

/** Letter-spaced text, centred. Canvas letterSpacing is not universally supported. */
function drawTracked(ctx, text, cx, y, tracking) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
  let x = cx - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + tracking; });
  ctx.textAlign = prev;
}

function wrapText(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function fourPointStar(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + r * 0.16, cy - r * 0.16, cx + r, cy);
  ctx.quadraticCurveTo(cx + r * 0.16, cy + r * 0.16, cx, cy + r);
  ctx.quadraticCurveTo(cx - r * 0.16, cy + r * 0.16, cx - r, cy);
  ctx.quadraticCurveTo(cx - r * 0.16, cy - r * 0.16, cx, cy - r);
  ctx.closePath();
}
