/**
 * main.js — behaviour layer for Act 00 and Act 01.
 *
 * Everything here is additive. If this file never runs, the page is still a
 * complete, readable, scrollable document. Nothing in it is load-bearing.
 *
 * No GSAP yet: it is used from P3 onward, for the scrubbed Act 03. Loading a
 * 72 KB library to fade a hero would be a waste on a phone.
 */

import { CONFIG } from './config.js';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------- 1. content
   Names and dates come from config.js so they are corrected in one place. */
function hydrate() {
  const set = (sel, text) => {
    document.querySelectorAll(sel).forEach((el) => { el.textContent = text; });
  };
  set('[data-her-name]', CONFIG.herName);
  set('[data-her-full-name]', CONFIG.herFullName);
  set('[data-his-name]', CONFIG.hisName);
  set('[data-her-birthday]', CONFIG.herBirthday);
  set('[data-her-birthday-long]', CONFIG.herBirthdayLong);
  set('[data-his-place]', CONFIG.hisPlace);
  set('[data-her-place]', CONFIG.herPlace);
  set('[data-months]', CONFIG.monthsTogether);
  document.title = `Happy Birthday, ${CONFIG.herName}`;
}

/* --------------------------------------------------------------- 2. the seal
   Opens on click, Enter, Space or Escape — and also on the first scroll
   gesture, so a visitor who never taps is never trapped behind the gate. */
function initSeal() {
  const veil = document.querySelector('[data-veil]');
  if (!veil) return;

  const open = () => {
    if (root.classList.contains('is-open')) return;
    veil.classList.add('is-dismissing');
    root.classList.add('is-open');

    // Focus was on the gate, which is about to be display:none. Left alone it
    // falls back to <body> and a keyboard user loses their place entirely, so
    // hand focus to the content the gate was standing in front of.
    const target = document.getElementById('letter') || document.querySelector('main');
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }

    setTimeout(() => { veil.hidden = true; }, reduced ? 0 : 620);
  };

  veil.addEventListener('click', open);
  veil.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); open(); }
  });
  window.addEventListener('scroll', open, { once: true, passive: true });
  window.addEventListener('touchmove', open, { once: true, passive: true });
}

/* ------------------------------------------------------------------ 3. audio
   Autoplay was a deliberate decision, so it is attempted first. Browsers block
   unmuted autoplay without a gesture — every iOS browser does. When that
   happens a small control appears and draws attention once, rather than a modal
   in her face. */
function initAudio() {
  const audio = document.querySelector('[data-audio]');
  const toggle = document.querySelector('[data-mute]');
  if (!audio) return;

  const setState = (playing) => {
    if (!toggle) return;
    // The label is the stable word "Sound"; state lives in aria-pressed and in
    // the crossed-speaker glyph. Never rewrite the accessible name.
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.hidden = false;
    toggle.classList.toggle('is-waiting', !playing);
  };

  const tryPlay = () => {
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setState(true)).catch(() => {
        setState(false);
        // blocked: bring it to her attention without stealing focus
        toggle?.focus?.({ preventScroll: true });
        if (toggle && !reduced) {
          toggle.classList.add('is-nudging');
          toggle.addEventListener('animationend', () => toggle.classList.remove('is-nudging'), { once: true });
        }
      });
    }
  };

  tryPlay();
  audio.addEventListener('play', () => setState(true));
  audio.addEventListener('pause', () => setState(false));

  toggle?.addEventListener('click', () => {
    toggle.classList.remove('is-waiting', 'is-nudging');
    if (audio.paused) { audio.play().then(() => setState(true)).catch(() => {}); }
    else { audio.pause(); }
  });
}

/* ---------------------------------------------------------------- 4. reveals
   IntersectionObserver rather than a scroll library: it is native, free, and
   does not run work on every scroll frame. */
function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  items.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------ 5. read again
   A genuine restart, not a scroll-to-top. Re-arms the seal and un-blurs the
   hero, so the whole sequence plays again the way it did the first time. */
function initAgain() {
  const btn = document.querySelector('[data-again]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });

    const veil = document.querySelector('[data-veil]');
    root.classList.remove('is-open');
    if (veil) {
      veil.hidden = false;
      veil.classList.remove('is-dismissing');
    }
    // let the smooth scroll land before re-blurring, or the hero smears
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), reduced ? 0 : 700);
  });
}

/* ------------------------------------------------------------------- boot */
import { initClocks } from './clocks.js';
import { initBothSides } from './both-sides.js';
import { initClips } from './clips.js';
import { initKeepsake } from './keepsake.js';

hydrate();
initSeal();
initAudio();
initReveals();
initClocks();
initClips();
initKeepsake();
initAgain();

// GSAP is a deferred classic script, so it may not have executed yet when this
// module runs. both-sides.js already falls back to the static layout when
// window.gsap is missing, but waiting for load lets the scrub actually run.
if (document.readyState === 'complete') initBothSides();
else window.addEventListener('load', initBothSides, { once: true });

// signal to CSS that JS is alive (inverted from 2025, which hid everything)
root.classList.add('js');
