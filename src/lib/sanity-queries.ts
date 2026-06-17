import groq from "groq";

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0] {
  siteTitle,
  tagline,
  footerText,
  defaultMetaDescription
}`;

export type SiteSettings = {
  siteTitle?: string;
  tagline?: string;
  footerText?: string;
  defaultMetaDescription?: string;
};

export const ARTICLES_LIST_QUERY = groq`*[_type == "article" && contentStatus == "live"] | order(articleCreatedDate desc) {
  _id,
  title,
  slug,
  heroImage,
  route,
  tripLengthBucket,
  tripLengthDays,
  destinationPrimary,
  destinationSecondary,
  travelStylePrimary,
  travelStyleSecondary,
  travellerTypes,
  vibe,
  experienceTags,
  bestSeason,
  metaDescription,
  articleCommercialTier
}`;

export const ARTICLE_BY_SLUG_QUERY = groq`*[_type == "article" && slug.current == $slug][0] {
  _id,
  _createdAt,
  _updatedAt,
  articleCreatedDate,
  title,
  slug,
  heroImage,
  intro,
  body,
  route,
  tripLengthBucket,
  tripLengthDays,
  destinationPrimary,
  destinationSecondary,
  travelStylePrimary,
  travelStyleSecondary,
  travellerTypes,
  vibe,
  experienceTags,
  bestSeason,
  practicalInfo,
  faq[]{ question, answer },
  author->{ name, role, bio, sameAs, image, schemaType },
  affiliateLinks,
  footerBanners,
  metaTitle,
  metaDescription,
  focusKeyword
}`;

export const RELATED_ARTICLES_QUERY = groq`*[
  _type == "article"
  && contentStatus == "live"
  && slug.current != $slug
  && (
    destinationPrimary == $destinationPrimary
    || travelStylePrimary == $travelStylePrimary
    || tripLengthBucket == $tripLengthBucket
  )
] | order(
  select(destinationPrimary == $destinationPrimary => 0, 1) asc,
  articleCreatedDate desc
)[0...3] {
  _id, title, slug, heroImage, route, tripLengthBucket,
  destinationPrimary, travelStylePrimary, metaDescription
}`;

// ── Supporting guides ────────────────────────────────────────
// Standalone editorial pages (best-time, where-to-stay, things-to-do, decision
// guides) that sit under a destination at /destinations/<dest>/<slug>. Separate
// `guide` doc type — NOT articles — so itinerary listings/queries stay clean.
//
// No contentStatus filter on the single-guide fetch so a draft can be previewed
// by direct URL (mirrors ARTICLE_BY_SLUG_QUERY); hub/sitemap queries below filter
// to "live". `destination` matches the DESTINATIONS enum value (e.g. "bali").
export const GUIDE_BY_SLUG_QUERY = groq`*[
  _type == "guide" && slug.current == $slug && destination == $destination
][0] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  slug,
  guideType,
  destination,
  subArea,
  heroImage,
  intro,
  body,
  faq[]{ question, answer },
  author->{ name, role, bio, sameAs, image, schemaType },
  relatedTripSlugs,
  relatedRouteSlugs,
  metaTitle,
  metaDescription,
  focusKeyword,
  contentStatus
}`;

// Live guides for a destination hub (and trip-page cross-links).
export const GUIDES_BY_DESTINATION_QUERY = groq`*[
  _type == "guide" && contentStatus == "live" && destination == $destination
] | order(guideType asc, title asc) {
  _id, title, slug, guideType, destination, subArea, intro, metaDescription, heroImage
}`;

// Sibling guides for the "More <destination> guides" block (same cluster, not self).
export const RELATED_GUIDES_QUERY = groq`*[
  _type == "guide" && contentStatus == "live" && destination == $destination && slug.current != $slug
] | order(guideType asc, title asc)[0...6] {
  _id, title, slug, guideType, subArea, metaDescription
}`;

// Itineraries a guide links to, by explicit slug list (live only).
export const GUIDE_RELATED_TRIPS_QUERY = groq`*[
  _type == "article" && contentStatus == "live" && slug.current in $slugs
] {
  _id, title, slug, heroImage, route, tripLengthBucket, destinationPrimary, metaDescription
}`;

// Guides referenced by an explicit slug list (e.g. from a transport route),
// live only. Returns `destination` so the URL (/destinations/<dest>/<slug>) can
// be built client-side.
export const GUIDES_BY_SLUGS_QUERY = groq`*[
  _type == "guide" && contentStatus == "live" && slug.current in $slugs
] {
  _id, title, slug, guideType, destination
}`;

// Live guides for the sitemap.
export const SITEMAP_GUIDES_QUERY = groq`*[
  _type == "guide" && contentStatus == "live" && defined(slug.current) && defined(destination)
] {
  "slug": slug.current, destination, _updatedAt
}`;

// ── Taxonomy label maps ──────────────────────────────────────
export const DESTINATIONS = [
  { value: "bali", label: "Bali" },
  { value: "bali_nearby_islands", label: "Bali + Nearby Islands" },
  { value: "java", label: "Java" },
  { value: "komodo_flores", label: "Komodo & Flores" },
  { value: "lombok_gili", label: "Lombok & Gili Islands" },
  { value: "sumatra", label: "Sumatra" },
  { value: "raja_ampat", label: "Raja Ampat" },
  { value: "wild_indonesia", label: "Wild Indonesia" },
] as const;

export const TRIP_LENGTHS = [
  { value: "short_escape", label: "Short escape (3-5 days)" },
  { value: "one_week", label: "One week (6-8 days)" },
  { value: "ten_days", label: "10 days (9-11 days)" },
  { value: "two_weeks", label: "Two weeks (12-16 days)" },
  { value: "three_weeks_plus", label: "Three weeks+ (17+ days)" },
] as const;

export const TRAVEL_STYLES = [
  { value: "first_time_indonesia", label: "First time in Indonesia" },
  { value: "beach_islands", label: "Beach & Islands" },
  { value: "culture_temples", label: "Culture & Temples" },
  { value: "adventure_volcanoes", label: "Adventure & Volcanoes" },
  { value: "wildlife_nature", label: "Wildlife & Nature" },
  { value: "diving_snorkeling", label: "Diving & Snorkeling" },
  { value: "romantic_escape", label: "Romantic Escape" },
  { value: "remote_offbeat", label: "Remote & Offbeat" },
] as const;

export const TRAVELLER_TYPES = [
  { value: "solo_travellers", label: "Solo travellers" },
  { value: "couples", label: "Couples" },
  { value: "honeymooners", label: "Honeymooners" },
  { value: "friends", label: "Friends" },
  { value: "families", label: "Families" },
  { value: "divers", label: "Divers" },
  { value: "repeat_travellers", label: "Repeat travellers" },
] as const;

export const VIBES = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "active", label: "Active" },
  { value: "remote", label: "Remote" },
] as const;

export function labelFor(
  list: ReadonlyArray<{ value: string; label: string }>,
  value: string | undefined | null,
): string {
  if (!value) return "";
  return list.find((l) => l.value === value)?.label ?? value;
}

// ── Article type ─────────────────────────────────────────────
export type SanitySlug = { current: string };

export type SanityImage = {
  _type?: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
};

export type AffiliateLink = {
  _key?: string;
  placeholderId?: string;
  day?: string;
  anchorText?: string;
  partner?: string;
  experienceCategory?: string;
  publicUrl?: string;
  affiliateUrl?: string;
  priority?: string;
  linkStatus?: string;
  notes?: string;
};

export type ArticleListItem = {
  _id: string;
  title: string;
  slug: SanitySlug;
  heroImage?: SanityImage;
  route?: string;
  tripLengthBucket?: string;
  tripLengthDays?: number;
  destinationPrimary?: string;
  destinationSecondary?: string[];
  travelStylePrimary?: string;
  travelStyleSecondary?: string[];
  travellerTypes?: string[];
  vibe?: string;
  experienceTags?: string[];
  bestSeason?: string;
  metaDescription?: string;
  articleCommercialTier?: string;
};

export type FaqItem = {
  question?: string;
  answer?: string;
};

export type ArticleAuthor = {
  name?: string;
  role?: string;
  bio?: string;
  sameAs?: string[];
  image?: SanityImage;
  schemaType?: "Person" | "Organization";
};

export type Article = ArticleListItem & {
  _createdAt?: string;
  _updatedAt?: string;
  articleCreatedDate?: string;
  intro?: string;
  body?: Array<Record<string, unknown>>;
  practicalInfo?: {
    bestTimeToVisit?: string;
    gettingThere?: string;
    gettingAround?: string;
    currency?: string;
    simCard?: string;
    visa?: string;
  };
  faq?: FaqItem[];
  author?: ArticleAuthor;
  affiliateLinks?: AffiliateLink[];
  footerBanners?: string[];
  metaTitle?: string;
  focusKeyword?: string;
};

// ── Supporting guide types & labels ──────────────────────────
export const GUIDE_TYPES = [
  { value: "best_time", label: "Best time to visit" },
  { value: "where_to_stay", label: "Where to stay" },
  { value: "things_to_do", label: "Things to do" },
  { value: "decision_guide", label: "Decision guide" },
  { value: "comparison", label: "Comparison" },
  { value: "activity_guide", label: "Activity guide" },
  { value: "cost_guide", label: "Cost guide" },
  { value: "logistics", label: "Getting there" },
  { value: "itinerary_guide", label: "Itinerary" },
] as const;

export type GuideListItem = {
  _id: string;
  title: string;
  slug: SanitySlug;
  guideType?: string;
  destination?: string;
  subArea?: string;
  intro?: string;
  metaDescription?: string;
  heroImage?: SanityImage;
};

export type Guide = GuideListItem & {
  _createdAt?: string;
  _updatedAt?: string;
  body?: Array<Record<string, unknown>>;
  faq?: FaqItem[];
  author?: ArticleAuthor;
  relatedTripSlugs?: string[];
  relatedRouteSlugs?: string[];
  metaTitle?: string;
  focusKeyword?: string;
  contentStatus?: string;
};
