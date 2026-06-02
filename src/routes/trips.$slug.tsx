import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityClient, urlFor } from "@/lib/sanity";

import {
  ARTICLE_BY_SLUG_QUERY,
  DESTINATIONS,
  TRIP_LENGTHS,
  TRAVEL_STYLES,
  VIBES,
  labelFor,
  type Article,
  type AffiliateLink,
} from "@/lib/sanity-queries";

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

export const Route = createFileRoute("/trips/$slug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(articleQO(params.slug)),
  head: ({ loaderData }) => {
    const a = loaderData as Article | undefined;
    if (!a) return {};
    const img = a.heroImage?.asset
      ? urlFor(a.heroImage).width(1200).height(630).fit("crop").auto("format").url()
      : undefined;
    return {
      meta: [
        { title: a.metaTitle || `${a.title} — ExploreIndonesia.ai` },
        ...(a.metaDescription ? [{ name: "description", content: a.metaDescription }] : []),
        { property: "og:title", content: a.metaTitle || a.title },
        ...(a.metaDescription
          ? [{ property: "og:description", content: a.metaDescription }]
          : []),
        ...(img ? [{ property: "og:image", content: img }] : []),
        ...(img ? [{ name: "twitter:image", content: img }] : []),
      ],
    };
  },
  component: ArticlePage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl mb-2">Couldn't load this trip</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Link to="/trips" className="mt-4 inline-block underline">Back to all trips</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => {
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
            404 — Trip not found
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl font-semibold mb-4"
            style={{ color: "var(--navy-deep, #0b1f3a)" }}
          >
            We couldn't find that itinerary
          </h1>
          <p
            className="text-base mb-2"
            style={{ color: "var(--navy-mid, #1e3a5f)" }}
          >
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
          <p
            className="text-sm mb-8"
            style={{ color: "var(--slate-muted, #64748b)" }}
          >
            Browse our full collection of hand-picked Indonesia itineraries
            instead.
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
  },
});

function ArticlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ArticleInner />
    </Suspense>
  );
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
  if (children && typeof children === "object" && "props" in (children as Record<string, unknown>)) {
    return extractText((children as { props: { children?: unknown } }).props?.children);
  }
  return "";
}

function ArticleInner() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQO(slug));

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
        const text = (b.children ?? []).map((c) => c.text ?? "").join("").trim();
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
      { rootMargin: `-${SCROLL_OFFSET}px 0px -70% 0px`, threshold: [0, 1] }
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
      const nextLink = document.querySelector<HTMLAnchorElement>(
        `[data-toc-index="${next}"]`
      );
      nextLink?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      document.querySelector<HTMLAnchorElement>(`[data-toc-index="0"]`)?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      document
        .querySelector<HTMLAnchorElement>(`[data-toc-index="${toc.length - 1}"]`)
        ?.focus();
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
      externalLink: ({ value, children }) => (
        <a
          href={value?.href}
          target={value?.blank === false ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "var(--teal-link)" }}
        >
          {children}
        </a>
      ),
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
    ["Currency & money tips", pi?.currency],
    ["SIM card / connectivity", pi?.simCard],
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff" }}>
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
              {a.destinationPrimary
                ? ` · ${labelFor(DESTINATIONS, a.destinationPrimary)}`
                : ""}
            </p>
            <h1
              className="font-serif text-white text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
            >
              {a.title}
            </h1>
            {a.route && (
              <p className="mt-6 text-white/90 text-base sm:text-lg font-light italic">
                {a.route}
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
                            borderColor: isActive
                              ? "var(--teal-link, #0f766e)"
                              : "transparent",
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
