/**
 * hearts.js — the drifting heart layer (Act 00 and after).
 *
 * Two behaviours, deliberately different in kind:
 *
 *   burst()   ANSWERS a touch. It fires once, when she opens the gate, and it
 *             is the only celebratory moment on the page.
 *   trickle() is AMBIENT. It is kept slow and sparse on purpose — one heart
 *             every few seconds, hard-capped — because ambient motion that is
 *             always happening stops being charming and becomes a screensaver.
 *
 * The layer is display:none without JS and under reduced motion (see acts.css),
 * so a heart can never be left frozen mid-screen with no way to clear it.
 */

const MAX_LIVE = 14;

export function initHearts() {
  const layer = document.querySelector('[data-hearts]');
  if (!layer) return null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  const spawn = (opts = {}) => {
    if (layer.childElementCount >= MAX_LIVE) return;

    const heart = document.createElement('i');
    const size = opts.size ?? 0.6 + Math.random() * 0.9;

    heart.style.left = `${opts.left ?? Math.random() * 100}%`;
    heart.style.width = `${size}rem`;
    heart.style.height = `${size}rem`;
    heart.style.animationDuration = `${opts.duration ?? 9 + Math.random() * 7}s`;
    heart.style.opacity = '';

    // self-cleaning: nothing accumulates in the DOM over a long visit
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    layer.appendChild(heart);
  };

  return {
    /** The one-shot celebration. Wide spread, staggered, over ~1.2s. */
    burst(count = 16) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawn({
          size: 0.7 + Math.random() * 1.1,
          duration: 7 + Math.random() * 6,
        }), i * 70);
      }
    },

    /** The ambient trickle. Paused while the tab is hidden. */
    start() {
      setInterval(() => {
        if (document.visibilityState === 'visible') spawn();
      }, 4200);
    },
  };
}
