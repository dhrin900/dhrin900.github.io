/**
 * notes.js — Act 08, the love-note deck.
 *
 * The notes are authored in index.html, in a plain <ul>, in order. This module
 * never invents a note and never owns the text — it only adds a way to deal
 * them one at a time. With JavaScript off, notes.css leaves that <ul> visible
 * as a long readable wall and the deck hidden, so the act loses the toy and
 * keeps every word. Same inversion as the seal in Act 00.
 *
 * If this file fails, the wall stays. Nothing here is load-bearing.
 */

export function initNotes() {
  const root = document.querySelector('[data-notes]');
  if (!root) return;

  const list   = root.querySelector('.notes__all');
  const card   = root.querySelector('[data-note-card]');
  const textEl = root.querySelector('[data-note-text]');
  const count  = root.querySelector('[data-note-count]');
  const button = root.querySelector('[data-note-next]');
  if (!list || !card || !textEl || !button) return;

  const notes = [...list.querySelectorAll('li')]
    .map((li) => li.textContent.trim())
    .filter(Boolean);
  if (!notes.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const opened = new Set();
  let last = -1;

  const deal = () => {
    // Deal from the ones she has not seen yet, so the deck cannot repeat
    // itself before it has shown everything. Once every note has been opened
    // it starts over, but still never twice in a row.
    let pool = notes.map((_, i) => i).filter((i) => !opened.has(i));
    if (!pool.length) pool = notes.map((_, i) => i);
    if (pool.length > 1) pool = pool.filter((i) => i !== last);

    const pick = pool[Math.floor(Math.random() * pool.length)];
    last = pick;
    opened.add(pick);

    textEl.textContent = notes[pick];

    if (count) {
      count.textContent = opened.size === notes.length
        ? `that is all ${notes.length} of them, and every one is true`
        : `${opened.size} of ${notes.length} opened`;
      count.classList.toggle('is-complete', opened.size === notes.length);
    }

    if (!reduced) {
      card.classList.remove('is-dealing');
      // Reading offsetWidth forces a reflow between removing and re-adding the
      // class. Without it the browser coalesces both changes into one style
      // recalculation and the keyframes never restart on the second tap.
      void card.offsetWidth;
      card.classList.add('is-dealing');
    }
  };

  button.addEventListener('click', deal);
  deal();   // open on the first note rather than on an empty card

  // Only now does the wall fold away. If anything above bailed out, this line
  // never runs and every note stays on the page as plain text.
  root.classList.add('is-deck');
}
