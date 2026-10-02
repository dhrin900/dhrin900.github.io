/**
 * clips.js — Act 07, the rest of her clips. Fetched only when tapped.
 *
 * All seven total ~2.7 MB. Putting them in the initial payload would triple the
 * page weight for content most visitors never open, so each button carries only
 * a poster and swaps in a <video> on activation.
 */

import { CONFIG } from './config.js';

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

function buildClip(name) {
  const btn = document.createElement('button');
  btn.className = 'clip';
  btn.type = 'button';
  btn.dataset.clip = name;
  // The accessible name says what happens, not what the control looks like.
  btn.setAttribute('aria-label', `Play clip ${name.replace('clip-', '#')}`);
  btn.innerHTML =
    `<img src="./assets/video/${name}-640.webp" alt="" width="640" height="360" ` +
    `loading="lazy" decoding="async">` +
    `<span class="clip__play">${PLAY_ICON}</span>`;
  return btn;
}

export function initClips() {
  const grid = document.querySelector('[data-clips]');
  if (!grid) return;

  const frag = document.createDocumentFragment();
  for (const name of CONFIG.videoClips) frag.appendChild(buildClip(name));
  grid.appendChild(frag);

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.clip');
    if (!btn || btn.dataset.loading) return;

    const name = btn.dataset.clip;
    btn.dataset.loading = '1';

    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = `./assets/video/${name}-640.webp`;
    video.setAttribute('aria-label', `Clip ${name.replace('clip-', '#')}`);
    video.src = `./assets/video/${name}.mp4`;

    // Swap the poster button for the player in place, preserving grid flow.
    btn.replaceWith(video);
    video.play().catch(() => { /* autoplay refused; controls are right there */ });
  });
}
