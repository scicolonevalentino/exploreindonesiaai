import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/SiteFooter";
import { HelloBar } from "@/components/HelloBar";
import { initCookiebotConsent } from "@/lib/analytics-consent";
import { sanityClient } from "@/lib/sanity";
import { JsonLd } from "@/components/JsonLd";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/lib/sanity-queries";
import { ogImageUrl } from "@/lib/og";

// Site-wide JSON-LD. Rendered in the component tree (not head()) so it appears
// exactly once in the hydrated DOM. See src/components/JsonLd.tsx.
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ExploreIndonesia.ai",
  url: "https://exploreindonesia.ai",
  logo: "https://exploreindonesia.ai/favicon.ico",
  description:
    "AI-powered Indonesia trip planner with bookable itineraries for Bali, Java, Komodo, Raja Ampat and beyond.",
};
const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ExploreIndonesia.ai",
  url: "https://exploreindonesia.ai",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://exploreindonesia.ai/trips?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const SITE_SETTINGS_QUERY_KEY = ["sanity", "siteSettings"] as const;

// Cookiebot Domain Group ID — public (it's rendered in the client-side script
// tag for every visitor), so it lives in source. Override per-environment with
// VITE_COOKIEBOT_CBID if ever needed.
const COOKIEBOT_CBID =
  import.meta.env.VITE_COOKIEBOT_CBID || "85727754-80fa-46b9-93a6-faad898e0465";

const FALLBACK_SETTINGS: Required<Pick<SiteSettings, "siteTitle" | "defaultMetaDescription">> = {
  siteTitle: "Exploreindonesia.ai",
  defaultMetaDescription:
    "Indonesia Trip Planner turns your existing travel plans into bookable itineraries.",
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => {
    const settings = await context.queryClient.ensureQueryData({
      queryKey: SITE_SETTINGS_QUERY_KEY,
      queryFn: () => sanityClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
      staleTime: 5 * 60_000,
    });
    return { settings };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.settings?.siteTitle?.trim() || FALLBACK_SETTINGS.siteTitle;
    const description =
      loaderData?.settings?.defaultMetaDescription?.trim() ||
      FALLBACK_SETTINGS.defaultMetaDescription;
    // Site-wide social card, generated on demand from the live title/description
    // (see src/routes/og[.]png.tsx). Pages with their own image (e.g. itinerary
    // articles) override og:image in their own head(); this is the default for
    // the homepage and every page that doesn't set its own.
    const socialImage = ogImageUrl({ title, subtitle: description });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { name: "author", content: "ExploreIndonesia.ai" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: socialImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@ExploreIndonesiaAI" },
        // twitter:title / twitter:description intentionally omitted — X/Twitter
        // falls back to og:title / og:description, which are page-specific and
        // richer than the generic site title. Keep card/site/image here.
        { name: "twitter:image", content: socialImage },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "preconnect", href: "https://www.googletagmanager.com" },
      ],
      scripts: [
        // Google Consent Mode defaults — denied until Cookiebot reports the
        // visitor's choice. MUST run before the Cookiebot loader and any tag.
        // analytics-consent.ts pushes the matching consent 'update' once
        // Cookiebot fires its consent events.
        {
          children:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
        },
        // Cookiebot CMP (Usercentrics) — manual blocking mode. Renders the
        // consent banner on first visit and stores the choice. Injected only
        // when a real Domain Group ID (VITE_COOKIEBOT_CBID) is configured, so a
        // missing/placeholder value doesn't fire a broken request in dev.
        ...(COOKIEBOT_CBID
          ? [
              {
                children: `(function(){var s=document.createElement('script');s.id='Cookiebot';s.src='https://consent.cookiebot.com/uc.js';s.setAttribute('data-cbid','${COOKIEBOT_CBID}');s.setAttribute('data-blockingmode','manual');s.async=true;document.head.appendChild(s);})();`,
              },
            ]
          : []),
        // Ask Komo widget (Camille white-label). Injects the chat launcher;
        // skipped on the trip builder (/p1) and legal pages. Functional and sets
        // no cookies, so it is not consent-gated.
        {
          children:
            "(function(){var p=location.pathname;if(p==='/p1'||p==='/p1-home'||p.indexOf('/privacy')===0||p.indexOf('/terms')===0)return;var s=document.createElement('script');s.src='https://www.camille.travel/embed.js';s.async=true;s.setAttribute('data-expert','exploreindonesia');(document.body||document.head).appendChild(s);})();",
        },
        // Travelpayouts Drive affiliate loader is NOT injected here — it sets
        // persistent cookies, so it's loaded by analytics-consent.ts only after
        // the visitor grants marketing consent (see loadAffiliate()).
        // (Organization + WebSite JSON-LD moved to the `meta` array above as
        // script:ld+json so the router dedupes them and they aren't re-injected
        // on hydration.)
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MNZHRZ79"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    initCookiebotConsent();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <JsonLd data={ORGANIZATION_JSONLD} />
      <JsonLd data={WEBSITE_JSONLD} />
      {/* Keyboard skip link: first focusable element, hidden until focused, lets
          keyboard/screen-reader users jump past the sticky bar straight to the
          page content. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--navy-deep)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-bright)]"
      >
        Skip to main content
      </a>
      <HelloBar />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </div>
      <SiteFooter />
      <Toaster />
    </QueryClientProvider>
  );
}
