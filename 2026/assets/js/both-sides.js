/**
 * both-sides.js — Act 03. The two rooms sliding together.
 *
 * The stage is a CSS `position: sticky` runway; this file only scrubs the
 * transform. That is deliberate: GSAP's `pin` injects a spacer element and
 * reflows the page, whereas sticky does the same job with no layout shift and
 * no dependency on GSAP having loaded.
 *
 * Progressive enhancement: if GSAP is missing or motion is reduced, the CSS
 * already renders both halves side by side with the caption showing. Nothing
 * here is required to read the act.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initBothSides() {
  const section = document.querySelector('[data-both-sides]');
  if (!section) return;

  // Already correct without JS — leave it alone.
  if (REDUCED || !window.gsap || !window.ScrollTrigger) {
    section.classList.add('is-static');
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const his = section.querySelector('.bs-side--his');
  const her = section.querySelector('.bs-side--her');
  const tile = section.querySelector('.bs-tile');
  const seamLine = section.querySelector('.bs-seam__line');
  const seamText = section.querySelector('.bs-seam__text');

  // Each side is 50% of the stage, so a percentage string on `x` resolves
  // against the side's own width. Moving each by 16% opens a 16%-of-stage gap
  // between them (8% from each side) — and stays correct on resize for free,
  // because GSAP re-resolves percentages on every refresh.
  const GAP_PCT = 16;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.55,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(his, { x: `${-GAP_PCT}%` }, { x: '0%', ease: 'none' }, 0)
    .fromTo(her, { x: `${GAP_PCT}%` }, { x: '0%', ease: 'none' }, 0)
    // the tile grows slightly as it travels, as if he is leaning in
    .fromTo(tile, { scale: 0.9 }, { scale: 1.06, ease: 'none' }, 0)
    // the place tags are children of the sides, so they already travel with
    // them. An earlier version faded them from 0.35, which was too dim to read.
    // the seam draws, then speaks — only in the last third
    .to(seamLine, { height: 54, ease: 'none' }, 0.62)
    .fromTo(seamText, { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: 'none' }, 0.72);

  // Fonts land after first paint and change the measured height of every act.
  // Without this the scrubbed end position is computed against the wrong layout.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
