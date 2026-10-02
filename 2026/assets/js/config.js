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

  /** IANA timezones, used by Act 02 for the dual clock. */
  tzHis: 'Asia/Kathmandu',
  tzHer: 'Asia/Bangkok',

  /** Months together — Act 02 / Act 13 wording depends on this. */
  monthsTogether: '4+',

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
