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
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/lib/sanity-queries";

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

const SOCIAL_PREVIEW_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/096bd6df-91ae-4bf6-931c-6e8eb153d19a/id-preview-1c2a3c7f--387722e6-bf1b-4e7c-8da5-c1e42c7445e7.lovable.app-1780312241769.png";

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
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { name: "author", content: "Lovable" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: SOCIAL_PREVIEW_IMAGE },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@ExploreIndonesiaAI" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: SOCIAL_PREVIEW_IMAGE },
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
        // Travelpayouts Drive affiliate loader is NOT injected here — it sets
        // persistent cookies, so it's loaded by analytics-consent.ts only after
        // the visitor grants marketing consent (see loadAffiliate()).
        // Organization JSON-LD
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ExploreIndonesia.ai",
            url: "https://exploreindonesia.ai",
            logo: "https://exploreindonesia.ai/favicon.ico",
            description:
              "AI-powered Indonesia trip planner with bookable itineraries for Bali, Java, Komodo, Raja Ampat and beyond.",
          }),
        },
        // WebSite JSON-LD with SearchAction (enables Google sitelinks search box)
        {
          type: "application/ld+json",
          children: JSON.stringify({
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
          }),
        },
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
      <HelloBar />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <SiteFooter />
      <Toaster />
    </QueryClientProvider>
  );
}
