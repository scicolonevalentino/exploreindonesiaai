// Builds the absolute URL for a dynamically-generated social preview card.
//
// The card itself is rendered on demand by the /og.jpg server route (see
// src/routes/og[.]jpg.tsx) from these query params, so the preview always
// reflects whatever the page currently says — no more hand-maintained
// screenshots. og:image URLs MUST be absolute for crawlers, hence the origin.
//
// `v` is a template version key: bump it when the card DESIGN changes so that
// already-cached previews (WhatsApp/Meta cache per og:image URL) get a fresh URL
// and re-render. It does NOT need bumping for content changes.

const OG_ORIGIN = "https://exploreindonesia.ai";
const OG_TEMPLATE_VERSION = "2";

export type OgCardParams = {
  /** Main headline. A trailing " | exploreindonesia.ai" / " - …" is stripped. */
  title: string;
  /** Optional supporting line under the headline. */
  subtitle?: string;
  /** Optional full-bleed background image (e.g. a Sanity hero URL). */
  image?: string;
};

/** Generic card: a custom serif headline over the brand backdrop. */
export function ogImageUrl({ title, subtitle, image }: OgCardParams): string {
  const params = new URLSearchParams();
  params.set("title", title);
  if (subtitle) params.set("subtitle", subtitle);
  if (image) params.set("image", image);
  params.set("v", OG_TEMPLATE_VERSION);
  return `${OG_ORIGIN}/og.jpg?${params.toString()}`;
}

/** Homepage card: a faithful replica of the live hero (no params = hero copy). */
export function ogHomeImageUrl(): string {
  return `${OG_ORIGIN}/og.jpg?v=${OG_TEMPLATE_VERSION}`;
}
