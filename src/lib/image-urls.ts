import { urlFor } from "@/lib/sanity";

type ImageSource = Parameters<typeof urlFor>[0];

/**
 * Shared Sanity image URLs for the article cards and heroes.
 *
 * These live in one place so a route's `<link rel="preload" as="image">` and the
 * `<img src>` it is meant to warm up produce the BYTE-IDENTICAL URL. A single
 * differing query param (a stray `q=`, a different width) makes the browser
 * treat them as two images and downloads both — the preload then costs
 * bandwidth instead of saving time.
 */

/** Homepage inspiration carousel card — 260–300 CSS px wide, 4:5. */
export function inspirationCardImageUrl(source: ImageSource): string {
  return urlFor(source).width(600).height(750).fit("crop").auto("format").quality(75).url();
}

/** /trips grid card — 16:10. */
export function tripCardImageUrl(source: ImageSource): string {
  return urlFor(source).width(800).height(500).fit("crop").auto("format").url();
}

/** /trips header backdrop (faded behind a gradient, so quality can be low). */
export function tripsHeaderImageUrl(source: ImageSource): string {
  return urlFor(source).width(1920).height(720).fit("crop").auto("format").url();
}

/** Full-bleed article hero on /trips/$slug. */
export function articleHeroImageUrl(source: ImageSource): string {
  return urlFor(source).width(1600).height(900).fit("crop").auto("format").url();
}

/** Header backdrop on destination / transport pages. */
export function pageHeroImageUrl(source: ImageSource): string {
  return urlFor(source).width(1600).height(520).fit("crop").auto("format").url();
}
