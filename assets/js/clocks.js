/**
 * clocks.js — Act 02. Two live clocks, and the real gap between them.
 *
 * Nepal is UTC+5:45 and Thailand is UTC+7, so the difference is 1h15m. That is
 * computed from the IANA zones rather than hardcoded, so it stays correct if
 * either place changes its offset.
 */

import { CONFIG } from './config.js';

const fmt = (tz) => new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz,
});

/** Offset of a zone from UTC, in minutes, at the current instant. */
function offsetMinutes(tz, date = new Date()) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

function describeGap(mins) {
  const a = Math.abs(mins);
  const h = Math.floor(a / 60);
  const m = a % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(' ') || '0m';
}

export function initClocks() {
  const hisEl = document.querySelector('[data-clock-his]');
  const herEl = document.querySelector('[data-clock-her]');
  const gapEl = document.querySelector('[data-clock-gap]');
  if (!hisEl || !herEl) return;

  const fHis = fmt(CONFIG.tzHis);
  const fHer = fmt(CONFIG.tzHer);

  const paint = () => {
    const now = new Date();
    hisEl.textContent = fHis.format(now);
    herEl.textContent = fHer.format(now);

    if (gapEl) {
      // normalise into -720..+720 so a 19h date-line wrap never prints "19h 15m"
      let diff = offsetMinutes(CONFIG.tzHer, now) - offsetMinutes(CONFIG.tzHis, now);
      if (diff > 720) diff -= 1440;
      if (diff < -720) diff += 1440;
      // "behind" was ambiguous between the two clocks sitting either side of
      // it. "apart" is true regardless of which one is ahead.
      gapEl.textContent = `${describeGap(diff)} apart`;
    }
  };

  paint();
  // align to the next minute boundary so the seconds do not visibly lag
  const toNextMinute = 60000 - (Date.now() % 60000);
  setTimeout(() => {
    paint();
    setInterval(paint, 30000);
  }, toNextMinute);

  // the initial server-rendered value, so the no-JS page is not blank
  document.querySelectorAll('[data-clock-static]').forEach((el) => {
    el.textContent = fHis.format(new Date());
  });
}
