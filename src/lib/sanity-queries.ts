import groq from "groq";

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
  affiliateLinks,
  footerBanners,
  metaTitle,
  metaDescription,
  focusKeyword
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
  { value: "short_escape", label: "Short escape (3–5 days)" },
  { value: "one_week", label: "One week (6–8 days)" },
  { value: "ten_days", label: "10 days (9–11 days)" },
  { value: "two_weeks", label: "Two weeks (12–16 days)" },
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

export type Article = ArticleListItem & {
  intro?: string;
  body?: Array<Record<string, unknown>>;
  practicalInfo?: {
    bestTimeToVisit?: string;
    gettingThere?: string;
    gettingAround?: string;
    currency?: string;
    simCard?: string;
  };
  affiliateLinks?: AffiliateLink[];
  footerBanners?: string[];
  metaTitle?: string;
  focusKeyword?: string;
};
