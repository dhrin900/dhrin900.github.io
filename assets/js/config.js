/**
 * config.js — the only place names, dates and asset paths are written down.
 *
 * Everything user-facing is injected from here, so a correction is a one-line
 * edit and a reload. Nothing else in the codebase hardcodes a name.
 */

export const CONFIG = {
  /** Her name. Set from "nam rin dahal" — CONFIRM THE SPELLING. */
  herName: 'Rin',
  herFullName: 'Rin Dahal',

  /** His name. */
  hisName: 'Ramesh',

  /** Her birthday. */
  herBirthday: '3rd October',
  herBirthdayLong: 'October 3rd',

  /** Where each of them is. */
  hisPlace: 'Nepal',
  herPlace: 'Thailand',

  /** The cities, for Act 03, which names the two rooms rather than the two
      countries. Separate from the above because "Nepal" and "Kathmandu" are
      different facts and the same page uses both. */
  hisCity: 'Kathmandu',
  herCity: 'Bangkok',

  /** IANA timezones, used by Act 02 for the dual clock. */
  tzHis: 'Asia/Kathmandu',
  tzHer: 'Asia/Bangkok',

  /** Together, as a bare number — the word "months" is authored next to it in
      index.html, so this must not carry a unit of its own. Sixteen at the 2026
      birthday: the 2025 site's "4+" was right for October 2025, and a year has
      passed since. Act 01's chip row, Act 06's stat and Act 02's copy all read
      from here — the prose that spells it out in words ("Sixteen months",
      "a year and four months") is in index.html and has to move with it. */
  monthsTogether: '16',

  /** Feature video for Act 05. */
  featureVideo: 'message-main',

  /**
   * Shipping video set. clip-long is 3.7 MB on its own and is deliberately
   * excluded — the rest totals 3.16 MB, inside the 4 MB budget.
   */
  videoClips: ['clip-1', 'clip-2', 'clip-3', 'clip-4', 'clip-5', 'clip-6', 'clip-7'],
};

/* An earlier revision exported an ASSETS block here mirroring the hero <img>
   srcset. It was never imported by anything, and it had already drifted out of
   sync with index.html (three widths against five). The HTML is the single
   source of truth for image sources — it has to be, for the preload hint and
   for the no-JS path — so a JS mirror of it can only rot. */
