// Supporting guide pages: /destinations/<destination>/<slug>
//
// Standalone editorial guides (best-time, where-to-stay, things-to-do, decision
// guides) that turn a destination hub into a topical-authority cluster. The
// destination hub is the pillar; each guide is a spoke that links back up (via
// breadcrumb), sideways to sibling guides, and out to the itineraries + transport
// routes it references.
//
// The file segment is `$destination_` (trailing underscore) so this route is
// UN-NESTED from the destination hub (`destinations.$destination.tsx`, which has
// no <Outlet/>): the guide renders as its own full page at the nested URL.
//
// Pattern follows transport.$route.tsx: everything is resolved in the loader so
// internal links land in the server HTML (crawlers + AI engines that don't run
// JS can see them). Sanity is the source of the guide body; related lookups are
// wrapped so an outage degrades gracefully instead of blanking the page.

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import groq from "groq";

import { sanityClient, urlFor } from "@/lib/sanity";
import { JsonLd } from "@/components/JsonLd";
import {
  GUIDE_BY_SLUG_QUERY,
  RELATED_GUIDES_QUERY,
  GUIDE_RELATED_TRIPS_QUERY,
  GUIDE_TYPES,
  TRIP_LENGTHS,
  DESTINATIONS,
  labelFor,
  type Guide,
  type GuideListItem,
  type ArticleListItem,
} from "@/lib/sanity-queries";
import { findDestinationBySlug, type DestinationContent } from "@/data/destinations";
import { findRouteBySlug, type TransportRoute } from "@/data/routes";
import { setCdnCache } from "@/lib/cdn-cache";

const SITE = "https://exploreindonesia.ai";

type LoaderData = {
  guide: Guide;
  dest: DestinationContent;
  relatedTrips: ArticleListItem[];
  relatedGuides: GuideListItem[];
  relatedRoutes: TransportRoute[];
};

export const Route = createFileRoute("/destinations/$destination_/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const dest = findDestinationBySlug(params.destination);
    if (!dest) throw notFound();

    const guide = await sanityClient.fetch<Guide | null>(GUIDE_BY_SLUG_QUERY, {
      slug: params.slug,
      destination: dest.value,
    });
    if (!guide) throw notFound();

    let relatedTrips: ArticleListItem[] = [];
    let relatedGuides: GuideListItem[] = [];
    try {
      [relatedTrips, relatedGuides] = await Promise.all([
        guide.relatedTripSlugs?.length
          ? sanityClient.fetch<ArticleListItem[]>(GUIDE_RELATED_TRIPS_QUERY, {
              slugs: guide.relatedTripSlugs,
            })
          : Promise.resolve([]),
        sanityClient.fetch<GuideListItem[]>(RELATED_GUIDES_QUERY, {
          destination: dest.value,
          slug: params.slug,
        }),
      ]);
    } catch {
      // A Sanity outage on the related lookups must not blank the guide body.
      relatedTrips = [];
      relatedGuides = [];
    }

    const relatedRoutes = (guide.relatedRouteSlugs ?? [])
      .map((s) => findRouteBySlug(s))
      .filter((r): r is TransportRoute => !!r && r.status !== "todo");

    await setCdnCache();
    return { guide, dest, relatedTrips, relatedGuides, relatedRoutes };
  },

  head: ({ params, loaderData }) => {
    const data = loaderData as LoaderData | undefined;
    if (!data) return {};
    const { guide, dest } = data;
    const url = `${SITE}/destinations/${dest.slug}/${guide.slug.current}`;
    const title = guide.metaTitle || guide.title;
    const description = guide.metaDescription;
    const img = guide.heroImage?.asset
      ? urlFor(guide.heroImage).width(1200).height(630).fit("crop").auto("format").url()
      : undefined;
    return {
      meta: [
        { title: guide.metaTitle || `${guide.title}, ExploreIndonesia.ai` },
        ...(description ? [{ name: "description", content: description }] : []),
        { property: "og:title", content: title },
        ...(description ? [{ property: "og:description", content: description }] : []),
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "ExploreIndonesia.ai" },
        { property: "og:url", content: url },
        ...(img ? [{ property: "og:image", content: img }] : []),
        { name: "twitter:card", content: img ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        ...(description ? [{ name: "twitter:description", content: description }] : []),
        ...(img ? [{ name: "twitter:image", content: img }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },

  component: GuidePage,
  notFoundComponent: () => (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <div>
        <h1 className="font-serif text-3xl mb-3" style={{ color: "var(--navy-deep)" }}>
          Guide not found
        </h1>
        <Link to="/trips" className="underline" style={{ color: "var(--teal-link)" }}>
          Browse all trips
        </Link>
      </div>
    </div>
  ),
});

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

function calcReadingTime(body: Guide["body"]): number {
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

const guideComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        id={slugifyHeading(extractText(children))}
        className="font-serif text-2xl sm:text-3xl font-semibold mt-14 mb-4 scroll-mt-24"
        style={{ color: "var(--navy-deep)" }}
      >
        {children}
      </h2>
    ),
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
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 ml-5 list-disc space-y-2" style={{ color: "var(--text-dark)" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 ml-5 list-decimal space-y-2" style={{ color: "var(--text-dark)" }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    externalLink: ({ value, children }) => {
      const href: string = value?.href ?? "";
      const internal = href.startsWith("/") || href.startsWith("#");
      return (
        <a
          href={href}
          target={internal ? undefined : "_blank"}
          rel={internal ? undefined : "noopener noreferrer"}
          className="font-medium underline underline-offset-2"
          style={{ color: "var(--teal-link)" }}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).auto("format").url();
      return (
        <figure className="my-10">
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

function GuidePage() {
  const { guide, dest, relatedTrips, relatedGuides, relatedRoutes } =
    Route.useLoaderData() as LoaderData;

  const url = `${SITE}/destinations/${dest.slug}/${guide.slug.current}`;
  const destUrl = `${SITE}/destinations/${dest.slug}`;
  const eyebrow = labelFor(GUIDE_TYPES, guide.guideType) || "Guide";
  const readingMinutes = calcReadingTime(guide.body);
  const datePublished = guide._createdAt;
  const dateModified = guide._updatedAt || datePublished;

  // Reuse a related itinerary's hero as the header backdrop (matches transport
  // pages); fall back to the plain gradient.
  const heroImage = guide.heroImage ?? relatedTrips.find((t) => t.heroImage)?.heroImage;
  const heroUrl = heroImage
    ? urlFor(heroImage).width(1600).height(520).fit("crop").auto("format").url()
    : null;

  const authorLd = guide.author?.name
    ? guide.author.schemaType === "Organization"
      ? {
          "@type": "Organization",
          name: guide.author.name,
          ...(guide.author.sameAs?.length ? { sameAs: guide.author.sameAs } : {}),
        }
      : {
          "@type": "Person",
          name: guide.author.name,
          ...(guide.author.role ? { jobTitle: guide.author.role } : {}),
          ...(guide.author.sameAs?.length ? { sameAs: guide.author.sameAs } : {}),
        }
    : { "@type": "Organization", name: "ExploreIndonesia.ai" };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    ...(guide.metaDescription ? { description: guide.metaDescription } : {}),
    ...(heroUrl ? { image: [heroUrl] } : {}),
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    timeRequired: `PT${readingMinutes}M`,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: authorLd,
    publisher: {
      "@type": "Organization",
      name: "ExploreIndonesia.ai",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/favicon.ico` },
    },
    about: dest.name,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE}/destinations` },
      { "@type": "ListItem", position: 3, name: dest.name, item: destUrl },
      { "@type": "ListItem", position: 4, name: guide.title, item: url },
    ],
  };

  const faqItems = (guide.faq ?? []).filter((f) => f.question && f.answer);
  const faqLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff" }}>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}

      {/* Hero with visible breadcrumb — the uplink to the destination pillar */}
      <header
        className="w-full bg-cover bg-center px-6 py-12 sm:py-16"
        style={
          heroUrl
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(8,52,51,0.86) 0%, rgba(11,34,52,0.92) 100%), url(${heroUrl})`,
              }
            : { background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)" }
        }
      >
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link to="/destinations" className="hover:text-white">
                  Destinations
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link
                  to="/destinations/$destination"
                  params={{ destination: dest.slug }}
                  className="hover:text-white"
                >
                  {dest.shortName}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="text-white/90" aria-current="page">
                {eyebrow}
              </li>
            </ol>
          </nav>
          <p
            className="mt-5 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--blue-soft)" }}
          >
            {dest.name} guide
          </p>
          <h1 className="mt-2 font-serif text-white text-4xl sm:text-5xl font-semibold leading-tight">
            {guide.title}
          </h1>
          {guide.intro && (
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed">{guide.intro}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {(() => {
          const updated = formatDate(guide._updatedAt || guide._createdAt);
          if (!guide.author?.name && !updated) return null;
          return (
            <p className="text-sm mb-8" style={{ color: "var(--slate-muted)" }}>
              {guide.author?.name && (
                <span>
                  By{" "}
                  <span style={{ color: "var(--navy-mid)", fontWeight: 600 }}>
                    {guide.author.name}
                  </span>
                  {guide.author.role ? `, ${guide.author.role}` : ""}
                </span>
              )}
              {guide.author?.name && updated ? " · " : ""}
              {updated && <span>Last updated {updated}</span>}
            </p>
          );
        })()}

        <article className="guide-body">
          {guide.body && <PortableText value={guide.body as never} components={guideComponents} />}
        </article>

        {/* FAQ */}
        {faqItems.length > 0 && (
          <section
            className="mt-16 pt-10 border-t"
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
              {faqItems.map((f, i) => (
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
        )}

        {/* Related itineraries — the link into the product */}
        {relatedTrips.length > 0 && (
          <section
            className="mt-16 pt-10 border-t"
            style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
            aria-label="Related itineraries"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--teal-link)" }}
            >
              Plan the trip
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold mb-8"
              style={{ color: "var(--navy-deep)" }}
            >
              Itineraries for {dest.shortName}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedTrips.map((t) => {
                const slug = t.slug?.current;
                if (!slug) return null;
                const img = t.heroImage?.asset
                  ? urlFor(t.heroImage).width(600).height(400).fit("crop").auto("format").url()
                  : null;
                return (
                  <li key={t._id}>
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
                            alt={t.heroImage?.alt ?? t.title}
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
                          {labelFor(TRIP_LENGTHS, t.tripLengthBucket)}
                          {t.destinationPrimary
                            ? ` · ${labelFor(DESTINATIONS, t.destinationPrimary)}`
                            : ""}
                        </p>
                        <h3
                          className="font-serif text-lg font-semibold leading-snug mb-2"
                          style={{ color: "var(--navy-deep)" }}
                        >
                          {t.title}
                        </h3>
                        {t.metaDescription && (
                          <p
                            className="text-sm leading-relaxed line-clamp-3"
                            style={{ color: "var(--text-dark)" }}
                          >
                            {t.metaDescription}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Sibling guides — lateral links within the cluster */}
        {relatedGuides.length > 0 && (
          <section
            className="mt-16 pt-10 border-t"
            style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
            aria-label="More guides"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--teal-link)" }}
            >
              Keep reading
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: "var(--navy-deep)" }}
            >
              More {dest.shortName} guides
            </h2>
            <ul className="flex flex-col gap-3">
              {relatedGuides.map((g) => (
                <li key={g._id}>
                  <Link
                    to="/destinations/$destination/$slug"
                    params={{ destination: dest.slug, slug: g.slug.current }}
                    className="inline-flex items-center font-medium underline underline-offset-2"
                    style={{ color: "var(--teal-link)" }}
                  >
                    {g.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Getting around — link to transport routes for this destination */}
        {relatedRoutes.length > 0 && (
          <section
            className="mt-16 pt-10 border-t"
            style={{ borderColor: "var(--border-cream, #e6dfd2)" }}
            aria-label="Getting around"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--teal-link)" }}
            >
              Getting around
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: "var(--navy-deep)" }}
            >
              How to get there
            </h2>
            <ul className="flex flex-col gap-3">
              {relatedRoutes.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/transport/$route"
                    params={{ route: r.slug }}
                    className="inline-flex items-center font-medium underline underline-offset-2"
                    style={{ color: "var(--teal-link)" }}
                  >
                    {r.fromName} to {r.toName} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-16">
          <Link
            to="/destinations/$destination"
            params={{ destination: dest.slug }}
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: "var(--teal-link)" }}
          >
            ← All {dest.shortName} itineraries &amp; guides
          </Link>
        </div>
      </main>
    </div>
  );
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long" });
}
