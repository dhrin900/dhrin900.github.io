/**
 * keepsake.js — Act 12. Renders a card to a canvas, in the page, and lets her
 * save it.
 *
 * Design decision: the card is DRAWN INTO THE PAGE, not hidden behind a download
 * button. She sees the object first, and can long-press to save it the way she
 * would save any photo — which is how people actually keep things. "Save it" is
 * the extra route, not the only one.
 *
 * The canvas is authored at 1200x1600 (3:4) and CSS-scales it down, so it is
 * retina-sharp on any display and costs one raster rather than a download.
 *
 * The palette is duplicated from tokens.css as literals because a canvas
 * cannot read custom properties. If tokens.css changes, this file changes too —
 * that duplication is the price of drawing to a bitmap, and it is paid in
 * exactly one place.
 */

import { CONFIG } from './config.js';

const MILK  = '#FFF7F9';
const BLUSH = '#FFE9F0';
const PETAL = '#FFD6E3';
const ROSE  = '#F7A8C4';
const ROSED = '#E0729B';
const BERRY = '#8C3A61';
const PLUM  = '#4A2038';

const W = 1200;
const H = 1600;

/** The one line pulled from the letter. Keep it short enough for the measure. */
const KEEPSAKE_LINE = 'Two time zones, one call, and sixteen months of this.';

export function initKeepsake() {
  const canvas = document.querySelector('[data-keepsake]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const draw = () => {
    /* --- paper ------------------------------------------------------- */
    ctx.fillStyle = MILK;
    ctx.fillRect(0, 0, W, H);

    /* A soft blush bloom in the upper left, like light coming in across the
       card, and a second in the lower right so the two corners agree. */
    const bloom = (x, y, r, colour) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, colour);
      g.addColorStop(1, 'rgba(255,247,249,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };
    bloom(W * 0.16, H * 0.1, W * 0.95, 'rgba(247,168,196,0.32)');
    bloom(W * 0.92, H * 0.94, W * 0.8, 'rgba(243,217,177,0.28)');

    /* --- the rose band along the top edge, echoing the note cards ----- */
    const band = ctx.createLinearGradient(0, 0, W, 0);
    band.addColorStop(0, ROSE);
    band.addColorStop(0.5, ROSED);
    band.addColorStop(1, ROSE);
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, W, 12);

    /* --- double rule border ------------------------------------------ */
    ctx.strokeStyle = ROSED;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 66, W - 132, H - 132);
    ctx.globalAlpha = 0.26;
    ctx.lineWidth = 1;
    ctx.strokeRect(82, 82, W - 164, H - 164);
    ctx.globalAlpha = 1;

    const cx = W / 2;
    ctx.textAlign = 'center';

    /* Vertical rhythm. The first pass left a ~400px void between the line and
       the seal, which read as an accident rather than as space. These values
       keep roughly even gaps: border->date 188, line->seal 306, seal->footer
       230, footer->border 160. */
    const Y_DATE = 268;
    const Y_NAME = 588;
    const Y_RULE = 676;
    const Y_LINE = 800;
    const Y_SEAL = 1128;
    const Y_FROM = 1360;

    /* --- date -------------------------------------------------------- */
    ctx.fillStyle = BERRY;
    ctx.font = '500 26px Fredoka, "Trebuchet MS", system-ui, sans-serif';
    // Tracked caps, which is the one place the page allows them: this is a
    // printed object, and a stamped date is what print does. On the page
    // itself the eyebrow is a numbered chip instead.
    drawTracked(ctx, CONFIG.herBirthday.toUpperCase(), cx, Y_DATE, 10);

    /* --- her name ---------------------------------------------------- */
    ctx.fillStyle = PLUM;
    // Same fallback stack as --font-display in tokens.css. Without it the card
    // silently renders in Georgia, which is a different design.
    ctx.font = '500 186px Fredoka, "Trebuchet MS", system-ui, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(CONFIG.herName, cx, Y_NAME);

    /* --- rule, with a heart sitting on it ---------------------------- */
    ctx.strokeStyle = ROSE;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 150, Y_RULE);
    ctx.lineTo(cx - 24, Y_RULE);
    ctx.moveTo(cx + 24, Y_RULE);
    ctx.lineTo(cx + 150, Y_RULE);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = ROSED;
    heartPath(ctx, cx, Y_RULE - 13, 44, 40);
    ctx.fill();

    /* --- the line from the letter ------------------------------------ */
    ctx.fillStyle = BERRY;
    ctx.font = 'italic 400 46px "Cormorant Garamond", Georgia, serif';
    wrapText(ctx, KEEPSAKE_LINE, cx, Y_LINE, W - 300, 64);

    /* --- the seal, the same object that closed the gate -------------- */
    ctx.save();
    ctx.translate(cx, Y_SEAL);
    const wax = ctx.createRadialGradient(-16, -18, 4, 0, 0, 52);
    wax.addColorStop(0, ROSE);
    wax.addColorStop(0.6, ROSED);
    wax.addColorStop(1, BERRY);
    ctx.fillStyle = wax;
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(243,217,177,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 37, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#F3D9B1';
    heartPath(ctx, 0, -2, 38, 34);
    ctx.fill();
    ctx.restore();

    /* --- from -------------------------------------------------------- */
    ctx.fillStyle = BERRY;
    ctx.font = '500 24px Fredoka, "Trebuchet MS", system-ui, sans-serif';
    drawTracked(ctx, `FROM ${CONFIG.hisName.toUpperCase()} · ${CONFIG.hisPlace.toUpperCase()}`, cx, Y_FROM, 8);
  };

  const paint = async () => {
    // Canvas needs the faces resident or it falls back to Georgia and the card
    // looks like a different design.
    if (document.fonts) {
      try {
        await Promise.all([
          document.fonts.load('500 186px "Fredoka"'),
          document.fonts.load('italic 400 46px "Cormorant Garamond"'),
          document.fonts.load('500 26px "Fredoka"'),
        ]);
        await document.fonts.ready;
      } catch { /* fall through to whatever is resident */ }
    }
    draw();
  };

  // The canvas is only worth drawing once it is on screen — Act 12 sits near
  // the end of a fourteen-act page, and the font loads above are not free.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      paint();
    }, { rootMargin: '200px' });
    io.observe(canvas);
  } else {
    paint();
  }

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

/** A heart, centred on (cx, cy), occupying w x h. */
function heartPath(ctx, cx, cy, w, h) {
  const top = cy - h / 2;
  const lobe = h * 0.3;
  ctx.beginPath();
  ctx.moveTo(cx, top + lobe);
  ctx.bezierCurveTo(cx, top, cx - w / 2, top, cx - w / 2, top + lobe);
  ctx.bezierCurveTo(cx - w / 2, top + (h + lobe) / 2, cx, top + (h + lobe) / 2, cx, top + h);
  ctx.bezierCurveTo(cx, top + (h + lobe) / 2, cx + w / 2, top + (h + lobe) / 2, cx + w / 2, top + lobe);
  ctx.bezierCurveTo(cx + w / 2, top, cx, top, cx, top + lobe);
  ctx.closePath();
}
