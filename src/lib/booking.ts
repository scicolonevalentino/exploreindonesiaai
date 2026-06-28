// Booking.com affiliate deep links via the CJ Affiliate (Commission Junction)
// tracking wrapper. Isomorphic — safe in both client and server bundles, since
// the CJ click URL carries NO secrets (the PID/AID are public identifiers that
// appear in the link itself). Keep it that way: no env reads, no server imports.
//
// WHY a wrapper and not Booking's own ?aid= link:
// Per the Booking.com CJ Affiliate Welcome Pack (2026), CJ's automatic deep-link
// generator does NOT support Booking.com (their URL structure differentiates
// markets with suffix indicators, e.g. booking.com/index.fr). The documented
// method (Welcome Pack p.14) is to take the Evergreen CJ click URL and append
// the destination URL via `url=<ENCODED_BOOKING_URL>`, with an optional
// `sid=<ShopperID>` for our own granular tracking:
//
//   https://www.jdoqocy.com/click-101767380-11891539?sid=<SID>&url=<ENCODED_BOOKING_URL>
//
// The Welcome Pack FAQ (p.22) also confirms the Demand API (live hotel
// search/prices) is NOT available via CJ — invite-only on the direct program.
// So destination/search deep links are the supported monetization model here,
// which is exactly what these helpers build.

/* ----------------------------- constants -------------------------------- */

// The Evergreen CJ click URL for our Booking.com partnership.
//   click-101767380-11891539  =  click-{PID}-{AID}
//   PID 101767380 = our publisher website ID
//   AID 11891539  = the Booking.com advertiser/branding link ID
// Public values (visible in every outbound link), safe to hardcode.
export const CJ_CLICK_BASE = "https://www.jdoqocy.com/click-101767380-11891539";

// Root of every Shopper ID (SID). Full SID format: exploreindonesia_<dest>_<context>.
export const BOOKING_SID_ROOT = "exploreindonesia";

const BOOKING_SEARCH_BASE = "https://www.booking.com/searchresults.html";

// The four+ CJ redirect domains (links are tracked through several servers).
// Used to recognise links that are ALREADY CJ-wrapped when normalising.
const CJ_HOSTS = [
  "jdoqocy.com",
  "tkqlhce.com",
  "kqzyfj.com",
  "dpbolvw.com",
  "anrdoezrs.net",
  "emjcd.com",
  "ftjcfx.com",
  "awltovhc.com",
  "qksrv.net",
];

/* ------------------------------- types ---------------------------------- */

export type BookingDestType =
  | "city"
  | "region"
  | "country"
  | "district"
  | "landmark"
  | "hotel"
  | "airport";

// A destination can be a free-text place name ("Ubud"), a numeric Booking.com
// dest_id, or an explicit object for full control.
export type BookingDestination =
  | string
  | number
  | {
      // Search string shown in Booking's search box. Resolves server-side on
      // Booking.com even without a dest_id, so this alone yields a working link.
      ss?: string;
      // Booking.com's internal destination id, when known (most precise).
      destId?: string | number;
      destType?: BookingDestType;
      // Human name, used for the SID slug and as an `ss` fallback.
      name?: string;
    };

export type BookingLinkParams = {
  checkIn?: string; // "YYYY-MM-DD" -> &checkin=
  checkOut?: string; // "YYYY-MM-DD" -> &checkout=
  adults?: number; // -> &group_adults= (default 2)
  children?: number; // -> &group_children= (default 0)
  childrenAges?: number[]; // -> repeated &age= (Booking requires an age per child)
  rooms?: number; // -> &no_rooms= (default 1)
  currency?: string; // -> &selected_currency= e.g. "USD"
  // SID context segment for granular click tracking, e.g. "article",
  // "trip-planner", "travel-costs", "day-3".
  context?: string;
  // Full SID override. When set, skips the exploreindonesia_<dest>_<context>
  // auto-format and uses this verbatim.
  sid?: string;
};

/* ------------------------------ slug utils ------------------------------ */

// Lowercase, strip diacritics, collapse to a-z0-9 separated by single hyphens.
function slug(input?: string | number | null): string {
  if (input === undefined || input === null || input === "") return "";
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Compact lookup key for the registry: slug with hyphens removed, so
// "Labuan Bajo", "labuan-bajo" and "labuan_bajo" all collapse to "labuanbajo".
function normKey(input?: string | number | null): string {
  return slug(input).replace(/-/g, "");
}

/* -------------------------- destination registry ------------------------ */
//
// Curated `ss` strings for the destinations this site covers, so a bare place
// name from an article or the trip planner resolves to the RIGHT Indonesian
// place (e.g. "Java" -> "Java, Indonesia", not Java the programming term, and
// "Komodo" -> "Labuan Bajo" where the bookable stays actually are).
//
// `ss` is intentionally the primary mechanism: Booking.com resolves it
// server-side, so links work today with zero maintenance and no risk of a
// stale/wrong dest_id. To pin a destination exactly, add `destId`/`destType`
// from your Booking.com affiliate dashboard — the builder will include them.

type RegistryEntry = { ss: string; destId?: string | number; destType?: BookingDestType };

const DESTINATION_REGISTRY: Record<string, RegistryEntry> = {
  // --- Bali & nearby islands ---
  bali: { ss: "Bali, Indonesia" },
  balinearbyislands: { ss: "Bali, Indonesia" },
  ubud: { ss: "Ubud, Bali, Indonesia" },
  canggu: { ss: "Canggu, Bali, Indonesia" },
  seminyak: { ss: "Seminyak, Bali, Indonesia" },
  uluwatu: { ss: "Uluwatu, Bali, Indonesia" },
  kuta: { ss: "Kuta, Bali, Indonesia" },
  sanur: { ss: "Sanur, Bali, Indonesia" },
  denpasar: { ss: "Denpasar, Bali, Indonesia" },
  jimbaran: { ss: "Jimbaran, Bali, Indonesia" },
  nusadua: { ss: "Nusa Dua, Bali, Indonesia" },
  amed: { ss: "Amed, Bali, Indonesia" },
  munduk: { ss: "Munduk, Bali, Indonesia" },
  nusapenida: { ss: "Nusa Penida, Indonesia" },
  nusalembongan: { ss: "Nusa Lembongan, Indonesia" },

  // --- Gili & Lombok ---
  gili: { ss: "Gili Islands, Indonesia" },
  giliislands: { ss: "Gili Islands, Indonesia" },
  gilitrawangan: { ss: "Gili Trawangan, Indonesia" },
  giliair: { ss: "Gili Air, Indonesia" },
  gilimeno: { ss: "Gili Meno, Indonesia" },
  lombok: { ss: "Lombok, Indonesia" },
  lombokgili: { ss: "Lombok, Indonesia" },
  kutalombok: { ss: "Kuta Lombok, Indonesia" },
  senggigi: { ss: "Senggigi, Lombok, Indonesia" },

  // --- Java ---
  java: { ss: "Java, Indonesia" },
  jakarta: { ss: "Jakarta, Indonesia" },
  yogyakarta: { ss: "Yogyakarta, Indonesia" },
  jogja: { ss: "Yogyakarta, Indonesia" },
  borobudur: { ss: "Borobudur, Indonesia" },
  bromo: { ss: "Mount Bromo, Indonesia" },
  ijen: { ss: "Ijen, Banyuwangi, Indonesia" },
  banyuwangi: { ss: "Banyuwangi, Indonesia" },
  malang: { ss: "Malang, Indonesia" },
  surabaya: { ss: "Surabaya, Indonesia" },
  bandung: { ss: "Bandung, Indonesia" },

  // --- Komodo & Flores ---
  komodo: { ss: "Labuan Bajo, Indonesia" },
  komodoflores: { ss: "Labuan Bajo, Indonesia" },
  flores: { ss: "Flores, Indonesia" },
  labuanbajo: { ss: "Labuan Bajo, Indonesia" },
  kelimutu: { ss: "Moni, Flores, Indonesia" },
  ende: { ss: "Ende, Flores, Indonesia" },

  // --- Sumatra ---
  sumatra: { ss: "Sumatra, Indonesia" },
  bukitlawang: { ss: "Bukit Lawang, Indonesia" },
  laketoba: { ss: "Lake Toba, Indonesia" },
  medan: { ss: "Medan, Indonesia" },
  mentawai: { ss: "Mentawai Islands, Indonesia" },
  bandaaceh: { ss: "Banda Aceh, Indonesia" },
  padang: { ss: "Padang, Indonesia" },

  // --- Raja Ampat & the wild east ---
  rajaampat: { ss: "Raja Ampat, Indonesia" },
  sorong: { ss: "Sorong, Indonesia" },
  waisai: { ss: "Waisai, Raja Ampat, Indonesia" },
  wildindonesia: { ss: "Indonesia" },
  sulawesi: { ss: "Sulawesi, Indonesia" },
  makassar: { ss: "Makassar, Indonesia" },
  toraja: { ss: "Toraja, Indonesia" },
  bunaken: { ss: "Bunaken, Indonesia" },
  maluku: { ss: "Maluku, Indonesia" },
  banda: { ss: "Banda Islands, Indonesia" },
  papua: { ss: "Papua, Indonesia" },

  // --- whole country (generic CTAs) ---
  indonesia: { ss: "Indonesia" },
};

// Bias a free-text place toward Indonesia so Booking's resolver lands on the
// right country (e.g. "Java", "Padang" exist elsewhere too).
function ensureIndonesia(s: string): string {
  return /indonesia/i.test(s) ? s : `${s.trim()}, Indonesia`;
}

type ResolvedDestination = {
  ss?: string;
  destId?: string | number;
  destType?: BookingDestType;
  // slug used as the SID's <destination> segment
  sidSlug: string;
};

function resolveDestination(dest: BookingDestination): ResolvedDestination {
  if (typeof dest === "number") {
    return { destId: dest, destType: "city", sidSlug: `dest-${dest}` };
  }
  if (typeof dest === "string") {
    const hit = DESTINATION_REGISTRY[normKey(dest)];
    if (hit) return { ...hit, sidSlug: slug(dest) };
    return { ss: ensureIndonesia(dest), sidSlug: slug(dest) };
  }
  // object form
  const name = dest.name ?? dest.ss ?? (dest.destId != null ? `dest-${dest.destId}` : "");
  const hit = dest.ss ? undefined : DESTINATION_REGISTRY[normKey(name)];
  return {
    ss: dest.ss ?? hit?.ss ?? (name ? ensureIndonesia(name) : undefined),
    destId: dest.destId ?? hit?.destId,
    destType: dest.destType ?? hit?.destType,
    sidSlug: slug(name),
  };
}

/* ------------------------------ builders -------------------------------- */

// Build the Booking.com search/landing URL (the inner `url=` target). Uses
// Booking.com's documented search-results parameters.
export function buildBookingSearchUrl(
  dest: BookingDestination,
  params: BookingLinkParams = {},
): string {
  const r = resolveDestination(dest);
  const u = new URL(BOOKING_SEARCH_BASE);
  const q = u.searchParams;

  if (r.ss) q.set("ss", r.ss);
  if (r.destId != null && String(r.destId) !== "") {
    q.set("dest_id", String(r.destId));
    q.set("dest_type", r.destType ?? "city");
  }

  if (params.checkIn) q.set("checkin", params.checkIn);
  if (params.checkOut) q.set("checkout", params.checkOut);

  // Occupancy — always emit sensible defaults so the lander has a valid search.
  q.set("group_adults", String(params.adults ?? 2));
  const children = params.children ?? 0;
  q.set("group_children", String(children));
  if (children > 0) {
    // Booking.com requires an `age` per child; default to 8 when unspecified.
    const ages = params.childrenAges ?? Array.from({ length: children }, () => 8);
    ages.slice(0, children).forEach((age) => q.append("age", String(age)));
  }
  q.set("no_rooms", String(params.rooms ?? 1));

  if (params.currency) q.set("selected_currency", params.currency);

  return u.toString();
}

// Build the SID: exploreindonesia_<destination>_<context>. Empty segments are
// dropped, so a missing destination/context collapses cleanly.
export function bookingSid(destination?: string | number | null, context?: string | null): string {
  return [BOOKING_SID_ROOT, slug(destination), slug(context)].filter(Boolean).join("_");
}

// Wrap an arbitrary Booking.com URL in the CJ click URL with a SID. This is the
// low-level primitive; `buildBookingLink` is the high-level entry point.
export function wrapCjBookingUrl(bookingUrl: string, sid?: string): string {
  const sidPart = sid ? `sid=${encodeURIComponent(sid)}&` : "";
  return `${CJ_CLICK_BASE}?${sidPart}url=${encodeURIComponent(bookingUrl)}`;
}

// PRIMARY ENTRY POINT.
// Build a CJ-tracked Booking.com deep link for a destination.
//
//   buildBookingLink("Ubud", { checkIn: "2026-08-01", checkOut: "2026-08-05",
//                              adults: 2, context: "trip-planner" })
//   -> https://www.jdoqocy.com/click-101767380-11891539
//        ?sid=exploreindonesia_ubud_trip-planner
//        &url=<encoded https://www.booking.com/searchresults.html?ss=Ubud%2C+Bali...>
export function buildBookingLink(dest: BookingDestination, params: BookingLinkParams = {}): string {
  const r = resolveDestination(dest);
  const bookingUrl = buildBookingSearchUrl(dest, params);
  const sid = params.sid ?? bookingSid(r.sidSlug, params.context);
  return wrapCjBookingUrl(bookingUrl, sid);
}

/* ----------------------------- normalisation ---------------------------- */

function bareHost(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function isBookingHost(host: string | null): boolean {
  return !!host && (host === "booking.com" || host.endsWith(".booking.com"));
}

function isCjHost(host: string | null): boolean {
  return !!host && CJ_HOSTS.some((d) => host === d || host.endsWith("." + d));
}

// True for a Booking.com link that points at the bare homepage (no destination),
// e.g. https://www.booking.com/ or .../index.en-gb.html with no ss/dest_id.
function isBareBookingHome(bookingUrl: string): boolean {
  let u: URL;
  try {
    u = new URL(bookingUrl);
  } catch {
    return false;
  }
  if (u.searchParams.has("ss") || u.searchParams.has("dest_id")) return false;
  return u.pathname === "/" || /^\/index\.[\w-]+\.html$/.test(u.pathname);
}

// Pull a destination slug out of an existing Booking.com URL (its ss or the
// first path segment), for the SID when no explicit hint is given.
function destSlugFromBookingUrl(bookingUrl: string): string {
  try {
    const u = new URL(bookingUrl);
    const ss = u.searchParams.get("ss");
    if (ss) return slug(ss.replace(/,?\s*indonesia/i, "")) || slug(ss);
    const seg = u.pathname.split("/").filter(Boolean)[0];
    return seg ? slug(seg) : "";
  } catch {
    return "";
  }
}

// Detect whether an href is a Booking.com link (direct or already CJ-wrapped).
export function isBookingLink(href: string): boolean {
  const host = bareHost(href);
  if (isBookingHost(host)) return true;
  if (isCjHost(host)) {
    try {
      const inner = new URL(href).searchParams.get("url");
      return !!inner && isBookingHost(bareHost(decodeURIComponent(inner)));
    } catch {
      return false;
    }
  }
  return false;
}

export type NormalizeOptions = {
  // Place name to use when the existing link is a bare homepage doorway and for
  // the SID's <destination> segment. e.g. the article's primary destination.
  destinationHint?: BookingDestination;
  // SID context segment, e.g. "article", "trip-planner".
  context?: string;
};

// Retrofit any Booking.com href (a bare static homepage link, a direct
// destination link, or an already-CJ-wrapped link) into our canonical
// CJ-tracked deep link with a proper SID. Returns null when `href` is not a
// Booking.com link at all — callers leave non-Booking links untouched.
//
// This is what guarantees that EVERY Booking.com link on the site (current
// CMS content and future content alike) flows through the CJ wrapper, without
// needing a Sanity data migration.
export function normalizeBookingHref(href: string, opts: NormalizeOptions = {}): string | null {
  if (!href) return null;
  const host = bareHost(href);

  let inner: string;
  if (isBookingHost(host)) {
    inner = href;
  } else if (isCjHost(host)) {
    let raw: string | null;
    try {
      raw = new URL(href).searchParams.get("url");
    } catch {
      return null;
    }
    if (!raw) return null;
    let decoded: string;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      decoded = raw;
    }
    if (!isBookingHost(bareHost(decoded))) return null; // CJ link to another advertiser
    inner = decoded;
  } else {
    return null; // not a Booking.com link
  }

  // Upgrade a bare homepage doorway into a real destination search when we know
  // where the article/day is about.
  let sidSlug: string;
  if (opts.destinationHint && isBareBookingHome(inner)) {
    inner = buildBookingSearchUrl(opts.destinationHint, {});
    sidSlug = resolveDestination(opts.destinationHint).sidSlug;
  } else if (opts.destinationHint) {
    sidSlug = resolveDestination(opts.destinationHint).sidSlug;
  } else {
    sidSlug = destSlugFromBookingUrl(inner);
  }

  return wrapCjBookingUrl(inner, bookingSid(sidSlug, opts.context));
}
