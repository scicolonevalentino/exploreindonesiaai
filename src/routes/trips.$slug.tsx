import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityClient, urlFor } from "@/lib/sanity";
import { JsonLd } from "@/components/JsonLd";

import {
  ARTICLE_BY_SLUG_QUERY,
  RELATED_ARTICLES_QUERY,
  GUIDES_BY_DESTINATION_QUERY,
  DESTINATIONS,
  TRIP_LENGTHS,
  TRAVEL_STYLES,
  VIBES,
  GUIDE_TYPES,
  labelFor,
  type Article,
  type ArticleListItem,
  type AffiliateLink,
  type FaqItem,
  type GuideListItem,
} from "@/lib/sanity-queries";
import { findDestinationByValue } from "@/data/destinations";

const articleQO = (slug: string) =>
  queryOptions({
    queryKey: ["sanity", "article", slug],
    queryFn: async () => {
      const a = await sanityClient.fetch<Article | null>(ARTICLE_BY_SLUG_QUERY, { slug });
      if (!a) throw notFound();
      return a;
    },
    staleTime: 60_000,
  });

const relatedQO = (
  slug: string,
  destinationPrimary?: string,
  travelStylePrimary?: string,
  tripLengthBucket?: string,
) =>
  queryOptions({
    queryKey: ["sanity", "related", slug, destinationPrimary, travelStylePrimary, tripLengthBucket],
    queryFn: () =>
      sanityClient.fetch<ArticleListItem[]>(RELATED_ARTICLES_QUERY, {
        slug,
        destinationPrimary: destinationPrimary ?? "",
        travelStylePrimary: travelStylePrimary ?? "",
        tripLengthBucket: tripLengthBucket ?? "",
      }),
    staleTime: 5 * 60_000,
  });

// Supporting guides for this trip's destination cluster (best-time, where-to-stay,
// etc.). Surfaced as cross-links so an itinerary reader can go deeper on the
// destination. Resolved in the loader so the links render in the server HTML.
const guidesForDestQO = (destinationPrimary?: string) =>
  queryOptions({
    queryKey: ["sanity", "guidesForDest", destinationPrimary],
    queryFn: () =>
      destinationPrimary
        ? sanityClient.fetch<GuideListItem[]>(GUIDES_BY_DESTINATION_QUERY, {
            destination: destinationPrimary,
          })
        : Promise.resolve([]),
    staleTime: 5 * 60_000,
  });

// Pull H2 headings out of the Portable Text body (shared by reading-time,
// the on-page TOC, and the TouristTrip itinerary schema).
function extractH2Headings(body: Article["body"]): string[] {
  if (!body) return [];
  const out: string[] = [];
  for (const block of body) {
    const b = block as { _type?: string; style?: string; children?: Array<{ text?: string }> };
    if (b._type === "block" && b.style === "h2" && Array.isArray(b.children)) {
      const text = b.children
        .map((c) => c.text ?? "")
        .join("")
        .trim();
      if (text) out.push(text);
    }
  }
  return out;
}

// Of those H2s, the ones that describe an itinerary day ("Day 1: …", "Days 3–13: …").
function extractDayHeadings(body: Article["body"]): string[] {
  return extractH2Headings(body).filter((t) => /^days?\s*\d/i.test(t));
}

// Estimate reading time in minutes from Portable Text body (~200 wpm).
function calcReadingTime(body: Article["body"]): number {
  if (!body) return 0;
  let words = 0;
  for (const block of body) {
    const b = block as { _type?: string; children?: Array<{ text?: string }> };
    if (b._type === "block" && Array.isArray(b.children)) {
      for (const c of b.children) {
        if (c?.text) words += c.text.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return Math.max(1, Math.round(words / 200));
}

// Build the trip's JSON-LD blocks. Rendered in the component tree via <JsonLd>
// (not route head()) so each appears exactly once in the hydrated DOM.
function buildTripJsonLd(a: Article, slug: string): Array<Record<string, unknown>> {
  const img = a.heroImage?.asset
    ? urlFor(a.heroImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;
  const url = `https://exploreindonesia.ai/trips/${slug}`;
  const description = a.metaDescription;
  const readingMinutes = calcReadingTime(a.body);
  const datePublished = a.articleCreatedDate || a._createdAt;
  const dateModified = a._updatedAt || datePublished;
  // Named human author for E-E-A-T when set in the CMS; otherwise the Organization.
  const authorLd = a.author?.name
    ? a.author.schemaType === "Organization"
      ? {
          "@type": "Organization",
          name: a.author.name,
          ...(a.author.sameAs?.length ? { sameAs: a.author.sameAs } : {}),
        }
      : {
          "@type": "Person",
          name: a.author.name,
          ...(a.author.role ? { jobTitle: a.author.role } : {}),
          ...(a.author.sameAs?.length ? { sameAs: a.author.sameAs } : {}),
        }
    : { "@type": "Organization", name: "ExploreIndonesia.ai" };
  const dayHeadings = extractDayHeadings(a.body);
  const faqItems = (a.faq ?? []).filter((f) => f.question && f.answer);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description,
      ...(img ? { image: [img] } : {}),
      url,
      mainEntityOfPage: url,
      inLanguage: "en",
      timeRequired: `PT${readingMinutes}M`,
      wordCount: readingMinutes * 200,
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
      author: authorLd,
      publisher: {
        "@type": "Organization",
        name: "ExploreIndonesia.ai",
        url: "https://exploreindonesia.ai",
        logo: { "@type": "ImageObject", url: "https://exploreindonesia.ai/favicon.ico" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://exploreindonesia.ai" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Trips",
          item: "https://exploreindonesia.ai/trips",
        },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: a.title,
      ...(description ? { description } : {}),
      ...(img ? { image: [img] } : {}),
      url,
      ...(typeof a.tripLengthDays === "number" && a.tripLengthDays > 0
        ? { duration: `P${a.tripLengthDays}D` }
        : {}),
      ...(dayHeadings.length
        ? {
            itinerary: {
              "@type": "ItemList",
              numberOfItems: dayHeadings.length,
              itemListElement: dayHeadings.map((name, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name,
              })),
            },
          }
        : {}),
      provider: {
        "@type": "Organization",
        name: "ExploreIndonesia.ai",
        url: "https://exploreindonesia.ai",
      },
    },
    ...(faqItems.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]
      : []),
  ];
}

export const Route = createFileRoute("/trips/$slug")({
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(articleQO(params.slug));
    // Resolve related articles in the loader so the internal links render in the
    // server HTML (crawlers and AI engines that don't execute JS can see them).
    await Promise.all([
      context.queryClient.ensureQueryData(
        relatedQO(params.slug, a.destinationPrimary, a.travelStylePrimary, a.tripLengthBucket),
      ),
      context.queryClient.ensureQueryData(guidesForDestQO(a.destinationPrimary)),
    ]);
    return a;
  },
  head: ({ loaderData, params }) => {
    const a = loaderData as Article | undefined;
    if (!a) return {};
    const img = a.heroImage?.asset
      ? urlFor(a.heroImage).width(1200).height(630).fit("crop").auto("format").url()
      : undefined;
    const url = `https://exploreindonesia.ai/trips/${params.slug}`;
    const title = a.metaTitle || a.title;
    const description = a.metaDescription;
    return {
      meta: [
        { title: a.metaTitle || `${a.title}, ExploreIndonesia.ai` },
        ...(description ? [{ name: "description", content: description }] : []),
        { property: "og:title", content: title },
        ...(description ? [{ property: "og:description", content: description }] : []),
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "ExploreIndonesia.ai" },
        { property: "og:url", content: url },
        ...(img ? [{ property: "og:image", content: img }] : []),
        ...(img ? [{ property: "og:image:width", content: "1200" }] : []),
        ...(img ? [{ property: "og:image:height", content: "630" }] : []),
        ...(img && a.heroImage?.alt
          ? [{ property: "og:image:alt", content: a.heroImage.alt }]
          : []),
        { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        ...(description ? [{ name: "twitter:description", content: description }] : []),
        ...(img ? [{ name: "twitter:image", content: img }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },

  component: ArticlePage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl mb-2">Couldn't load this trip</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Link to="/trips" className="mt-4 inline-block underline">
          Back to all trips
        </Link>
      </div>
    </div>
  ),
  notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
  const { slug } = Route.useParams();
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--cream, #f8f5ef)" }}
    >
      <div className="max-w-lg w-full text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
          style={{ color: "var(--teal-link, #0f766e)" }}
        >
          404, Trip not found
        </p>
        <h1
          className="font-serif text-3xl sm:text-4xl font-semibold mb-4"
          style={{ color: "var(--navy-deep, #0b1f3a)" }}
        >
          We couldn't find that itinerary
        </h1>
        <p className="text-base mb-2" style={{ color: "var(--navy-mid, #1e3a5f)" }}>
          The trip{" "}
          <code
            className="px-1.5 py-0.5 rounded text-sm"
            style={{
              backgroundColor: "var(--blue-soft, #e6eef7)",
              color: "var(--navy-deep, #0b1f3a)",
            }}
          >
            /{slug}
          </code>{" "}
          doesn't exist or may have been moved.
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--slate-muted, #64748b)" }}>
          Browse our full collection of hand-picked Indonesia itineraries instead.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/trips"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--navy-deep, #0b1f3a)",
              color: "#fff",
            }}
          >
            Browse all trips
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors hover:bg-black/5"
            style={{
              borderColor: "var(--border-cream, #e6dfd2)",
              color: "var(--navy-deep, #0b1f3a)",
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArticlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ArticleInner />
    </Suspense>
  );
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long" });
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractText(children: unknown): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in (children as Record<string, unknown>)
  ) {
    return extractText((children as { props: { children?: unknown } }).props?.children);
  }
  return "";
}

function ArticleInner() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQO(slug));
  const { data: related = [] } = useQuery(
    relatedQO(slug, a.destinationPrimary, a.travelStylePrimary, a.tripLengthBucket),
  );
  const { data: destGuides = [] } = useQuery(guidesForDestQO(a.destinationPrimary));
  const readingMinutes = useMemo(() => calcReadingTime(a.body), [a.body]);
  const jsonLd = useMemo(() => buildTripJsonLd(a, slug), [a, slug]);

  const linkMap = useMemo(() => {
    const m = new Map<string, AffiliateLink>();
    (a.affiliateLinks ?? []).forEach((l) => {
      if (l.placeholderId) m.set(l.placeholderId, l);
    });
    return m;
  }, [a.affiliateLinks]);

  const toc = useMemo(() => {
    const items: Array<{ id: string; text: string }> = [];
    (a.body ?? []).forEach((block) => {
      const b = block as { _type?: string; style?: string; children?: Array<{ text?: string }> };
      if (b._type === "block" && b.style === "h2") {
        const text = (b.children ?? [])
          .map((c) => c.text ?? "")
          .join("")
          .trim();
        if (text) items.push({ id: slugifyHeading(text), text });
      }
    });
    return items;
  }, [a.body]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);

  // Single source of truth: header offset used by both scroll-spy and smooth scroll
  const SCROLL_OFFSET = 96;

  useEffect(() => {
    if (toc.length === 0) return;
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => !!el);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -70% 0px`, threshold: [0, 1] },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    // Move focus for screen-reader/keyboard users without re-scrolling
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
  };

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setClickedId(id);
    setActiveId(id);
    scrollToHeading(id);
    window.setTimeout(() => setClickedId(null), 450);
  };

  const handleTocKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = (index + dir + toc.length) % toc.length;
      const nextLink = document.querySelector<HTMLAnchorElement>(`[data-toc-index="${next}"]`);
      nextLink?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      document.querySelector<HTMLAnchorElement>(`[data-toc-index="0"]`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      document.querySelector<HTMLAnchorElement>(`[data-toc-index="${toc.length - 1}"]`)?.focus();
    }
  };

  const heroImg = a.heroImage?.asset
    ? urlFor(a.heroImage).width(1600).height(900).fit("crop").auto("format").url()
    : null;

  const components: PortableTextComponents = {
    block: {
      h2: ({ children }) => {
        const id = slugifyHeading(extractText(children));
        return (
          <h2
            id={id}
            className="font-serif text-2xl sm:text-3xl font-semibold mt-14 mb-4 scroll-mt-24"
            style={{ color: "var(--navy-deep)" }}
          >
            {children}
          </h2>
        );
      },

      h3: ({ children }) => (
        <h3
          className="font-serif text-xl sm:text-2xl font-semibold mt-8 mb-3"
          style={{ color: "var(--navy-mid)" }}
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className="my-6 border-l-4 pl-4 italic"
          style={{ borderColor: "var(--blue-bright)", color: "var(--navy-mid)" }}
        >
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="my-4 leading-relaxed" style={{ color: "var(--text-dark)" }}>
          {children}
        </p>
      ),
    },
    marks: {
      affiliateLinkRef: ({ value, children }) => {
        const id = value?.placeholderId;
        const link = id ? linkMap.get(id) : undefined;
        const href = link?.affiliateUrl || link?.publicUrl;
        if (!href) return <span className="underline">{children}</span>;
        return (
          <a
            href={href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="font-medium underline underline-offset-2"
            style={{ color: "var(--teal-link)" }}
          >
            {children}
          </a>
        );
      },
      externalLink: ({ value, children }) => {
        const href: string = value?.href ?? "";
        const isAffiliate =
          /airalo\.tpx\.lu|affiliate\.klook\.com|12go\.asia\/\?z=|[?&]pid=P0030|gygaff\.com|stay22|tpx\.lu/.test(
            href,
          );
        return (
          <a
            href={href}
            target={value?.blank === false ? undefined : "_blank"}
            rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
            className={isAffiliate ? "font-medium underline underline-offset-2" : "underline"}
            style={{ color: "var(--teal-link)" }}
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null;
        const src = urlFor(value).width(1200).auto("format").url();
        return (
          <figure className="my-10 lg:-mx-16 xl:-mx-24">
            <img
              src={src}
              alt={value.alt ?? ""}
              className="w-full rounded-xl shadow-lg"
              loading="lazy"
            />
            {value.caption && (
              <figcaption
                className="mt-3 text-sm text-center italic"
                style={{ color: "var(--slate-muted)" }}
              >
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  const pi = a.practicalInfo;
  const piItems: Array<[string, string | undefined]> = [
    ["Best time to visit", pi?.bestTimeToVisit],
    ["Getting there", pi?.gettingThere],
    ["Getting around", pi?.gettingAround],
    ["Visa & entry", pi?.visa],
    ["Currency & money tips", pi?.currency],
    ["SIM card / connectivity", pi?.simCard],
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff" }}>
      {jsonLd.map((o, i) => (
        <JsonLd key={i} data={o} />
      ))}
      <section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: "var(--navy-deep, #0b1f3a)",
          backgroundImage:
            "radial-gradient(120% 80% at 20% 0%, rgba(56,189,248,0.22), transparent 60%), radial-gradient(120% 80% at 90% 100%, rgba(45,212,168,0.18), transparent 55%)",
        }}
      >
        {heroImg && (
          <img
            src={heroImg}
            alt={a.heroImage?.alt ?? a.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        )}
        {heroImg && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
        )}
        <div className="relative z-10 flex flex-col min-h-[60vh] sm:min-h-[72vh] p-6 sm:p-10">
          <Link to="/trips" className="text-sm text-white/80 hover:text-white">
            ← All trips
          </Link>
          <div className="mx-auto max-w-4xl w-full text-center my-auto py-12">
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.3em] mb-5 text-white/80">
              {labelFor(TRIP_LENGTHS, a.tripLengthBucket)}
              {a.destinationPrimary ? ` · ${labelFor(DESTINATIONS, a.destinationPrimary)}` : ""}
            </p>
            <h1
              className="font-serif text-white text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
            >
              {a.title}
            </h1>
            {a.route && (
              <p className="mt-6 text-white/90 text-base sm:text-lg font-light italic">{a.route}</p>
            )}
            {readingMinutes > 0 && (
              <p
                className="mt-4 inline-flex items-center gap-2 text-white/75 text-xs sm:text-sm font-medium tracking-wide"
                aria-label={`Estimated reading time: ${readingMinutes} minutes`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {readingMinutes} min read
              </p>
            )}
            <div
              className="mx-auto mt-8 h-px w-16"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:grid lg:grid-cols-12 lg:gap-12">
        <article className="lg:col-span-8 lg:col-start-2 max-w-3xl mx-auto lg:mx-0 w-full">
          {(() => {
            const updated = formatDate(a._updatedAt || a.articleCreatedDate || a._createdAt);
            if (!a.author?.name && !updated) return null;
            return (
              <p className="text-sm mb-8 -mt-2" style={{ color: "var(--slate-muted, #64748b)" }}>
                {a.author?.name && (
                  <span>
                    By{" "}
                    <span style={{ color: "var(--navy-mid)", fontWeight: 600 }}>
                      {a.author.name}
                    </span>
                    {a.author.role ? `, ${a.author.role}` : ""}
                  </span>
                )}
                {a.author?.name && updated ? " · " : ""}
                {updated && <span>Last updated {updated}</span>}
              </p>
            );
          })()}

          {a.intro && (
            <p
              className="font-serif text-lg sm:text-xl leading-relaxed mb-10"
              style={{ color: "var(--navy-mid)" }}
            >
              {a.intro}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-10">
            {labelFor(TRAVEL_STYLES, a.travelStylePrimary) && (
              <Tag>{labelFor(TRAVEL_STYLES, a.travelStylePrimary)}</Tag>
            )}
            {a.vibe && <Tag>{labelFor(VIBES, a.vibe)}</Tag>}
            {a.bestSeason && <Tag>Best: {a.bestSeason}</Tag>}
          </div>

          {a.body && <PortableText value={a.body as never} components={components} />}

          {piItems.some(([, v]) => v) && (
            <section
              className="mt-16 rounded-2xl p-6 sm:p-8 border"
              style={{ backgroundColor: "var(--cream)", borderColor: "var(--border-cream)" }}
            >
              <h2
                className="font-serif text-2xl font-semibold mb-5"
                style={{ color: "var(--navy-deep)" }}
              >
                Practical info
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {piItems
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt
                        className="text-xs font-semibold uppercase tracking-[0.15em] mb-1"
                        style={{ color: "var(--teal-link)" }}
                      >
                        {k}
                      </dt>
                      <dd className="text-sm" style={{ color: "var(--text-dark)" }}>
                        {v}
                      </dd>
                    </div>
                  ))}
              </dl>
            </section>
          )}

          <FaqSection items={a.faq ?? []} />

          <DestinationGuides guides={destGuides} destinationPrimary={a.destinationPrimary} />

          <RelatedItineraries items={related} />

          <ShareButtons title={a.title} slug={a.slug?.current ?? slug} />
        </article>

        {toc.length > 1 && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-4"
                style={{ color: "var(--teal-link)" }}
              >
                On this page
              </p>
              <nav
                aria-label="Table of contents"
                className="border-l"
                style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
              >
                <ul className="space-y-2.5">
                  {toc.map((item, index) => {
                    const isActive = activeId === item.id;
                    const isClicked = clickedId === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          data-toc-index={index}
                          onClick={(e) => handleTocClick(e, item.id)}
                          onKeyDown={(e) => handleTocKeyDown(e, index)}
                          aria-current={isActive ? "location" : undefined}
                          className={`block pl-4 -ml-px border-l text-sm leading-snug rounded-r-md outline-none motion-safe:transition-all motion-safe:duration-200 focus-visible:ring-2 focus-visible:ring-offset-1 motion-safe:hover:pl-5 ${
                            isClicked ? "motion-safe:scale-[0.98]" : ""
                          }`}
                          style={{
                            color: isActive
                              ? "var(--teal-link, #0f766e)"
                              : "var(--navy-mid, #1e3a5f)",
                            borderColor: isActive ? "var(--teal-link, #0f766e)" : "transparent",
                            fontWeight: isActive ? 600 : 400,
                            backgroundColor: isClicked
                              ? "color-mix(in oklab, var(--teal-link, #0f766e) 12%, transparent)"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (isActive) return;
                            e.currentTarget.style.color = "var(--teal-link, #0f766e)";
                            e.currentTarget.style.borderColor =
                              "color-mix(in oklab, var(--teal-link, #0f766e) 50%, transparent)";
                          }}
                          onMouseLeave={(e) => {
                            if (isActive) return;
                            e.currentTarget.style.color = "var(--navy-mid, #1e3a5f)";
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          {item.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: "var(--blue-soft)",
        color: "var(--navy-deep)",
      }}
    >
      {children}
    </span>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://exploreindonesia.ai/trips/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links: Array<{ label: string; href: string; icon: React.ReactNode }> = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.555-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448zM6.597 20.13a9.86 9.86 0 005.452 1.65h.005c5.448 0 9.886-4.434 9.889-9.885a9.86 9.86 0 00-2.892-6.994 9.825 9.825 0 00-6.993-2.901c-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.235.374-1 3.648zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <section
      className="mt-12 pt-8 border-t"
      style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
      aria-label="Share this itinerary"
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
        style={{ color: "var(--teal-link)" }}
      >
        Share this itinerary
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${l.label}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors hover:bg-black/5"
            style={{
              borderColor: "var(--border-cream, #e6dfd2)",
              color: "var(--navy-deep)",
            }}
          >
            {l.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-full border text-sm font-medium transition-colors hover:bg-black/5"
          style={{
            borderColor: "var(--border-cream, #e6dfd2)",
            color: "var(--navy-deep)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </section>
  );
}

function FaqSection({ items }: { items: FaqItem[] }) {
  const faqs = items.filter((f) => f.question && f.answer);
  if (faqs.length === 0) return null;
  return (
    <section
      id="faq"
      className="mt-16 pt-10 border-t scroll-mt-24"
      style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
      aria-labelledby="faq-heading"
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
        style={{ color: "var(--teal-link)" }}
      >
        Good to know
      </p>
      <h2
        id="faq-heading"
        className="font-serif text-2xl sm:text-3xl font-semibold mb-6"
        style={{ color: "var(--navy-deep)" }}
      >
        Frequently asked questions
      </h2>
      <div className="divide-y" style={{ borderColor: "var(--border-cream, #e6dfd2)" }}>
        {faqs.map((f, i) => (
          <details key={i} className="group py-4">
            <summary
              className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg font-semibold list-none"
              style={{ color: "var(--navy-deep)" }}
            >
              {f.question}
              <span
                className="shrink-0 transition-transform group-open:rotate-45"
                style={{ color: "var(--teal-link)" }}
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed" style={{ color: "var(--text-dark)" }}>
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function DestinationGuides({
  guides,
  destinationPrimary,
}: {
  guides: GuideListItem[];
  destinationPrimary?: string;
}) {
  const dest = destinationPrimary ? findDestinationByValue(destinationPrimary) : undefined;
  if (!dest || !guides || guides.length === 0) return null;
  return (
    <section
      className="mt-16 pt-10 border-t"
      style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
      aria-label="Destination guides"
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
        style={{ color: "var(--teal-link)" }}
      >
        Go deeper
      </p>
      <h2
        className="font-serif text-2xl sm:text-3xl font-semibold mb-6"
        style={{ color: "var(--navy-deep)" }}
      >
        {dest.shortName} guides
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guides.map((g) => (
          <li key={g._id}>
            <Link
              to="/destinations/$destination/$slug"
              params={{ destination: dest.slug, slug: g.slug.current }}
              className="group flex flex-col rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
              style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
                style={{ color: "var(--teal-link)" }}
              >
                {labelFor(GUIDE_TYPES, g.guideType) || "Guide"}
              </span>
              <span className="font-medium leading-snug" style={{ color: "var(--navy-deep)" }}>
                {g.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedItineraries({ items }: { items: ArticleListItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section
      className="mt-16 pt-10 border-t"
      style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
      aria-label="Related itineraries"
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
        style={{ color: "var(--teal-link)" }}
      >
        Keep exploring
      </p>
      <h2
        className="font-serif text-2xl sm:text-3xl font-semibold mb-8"
        style={{ color: "var(--navy-deep)" }}
      >
        Related itineraries
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const slug = item.slug?.current;
          if (!slug) return null;
          const img = item.heroImage?.asset
            ? urlFor(item.heroImage).width(600).height(400).fit("crop").auto("format").url()
            : null;
          return (
            <li key={item._id}>
              <Link
                to="/trips/$slug"
                params={{ slug }}
                className="group block rounded-xl overflow-hidden border h-full transition-shadow hover:shadow-lg"
                style={{
                  borderColor: "var(--border-cream, #e6dfd2)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  className="aspect-[3/2] w-full overflow-hidden"
                  style={{ backgroundColor: "var(--blue-soft, #e6eef7)" }}
                >
                  {img && (
                    <img
                      src={img}
                      alt={item.heroImage?.alt ?? item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2"
                    style={{ color: "var(--teal-link)" }}
                  >
                    {labelFor(TRIP_LENGTHS, item.tripLengthBucket)}
                    {item.destinationPrimary
                      ? ` · ${labelFor(DESTINATIONS, item.destinationPrimary)}`
                      : ""}
                  </p>
                  <h3
                    className="font-serif text-lg font-semibold leading-snug mb-2"
                    style={{ color: "var(--navy-deep)" }}
                  >
                    {item.title}
                  </h3>
                  {item.metaDescription && (
                    <p
                      className="text-sm leading-relaxed line-clamp-3"
                      style={{ color: "var(--text-dark)" }}
                    >
                      {item.metaDescription}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
