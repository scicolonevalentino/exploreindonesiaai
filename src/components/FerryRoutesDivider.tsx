import { Link } from "@tanstack/react-router";

// Decorative divider shown at the foot of the homepage, just above the footer.
// A brand-teal wave (the sea motif) plus a discreet entry point into the
// transport hub. Brand-styled and low-prominence by design: the wave uses
// --blue-bright, the link uses the site's standard --teal-link, the eyebrow
// matches the site eyebrow style (--slate-muted, uppercase, tracked).
export function FerryRoutesDivider() {
  return (
    <section className="w-full px-6 py-12 sm:py-16" style={{ backgroundColor: "var(--cream)" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-8">
        {/* Sea-wave rule. Stroke stays a constant width while the wave stretches
            to fill the row (non-scaling-stroke + preserveAspectRatio=none). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 28"
          preserveAspectRatio="none"
          className="h-7 w-full flex-1"
          style={{ color: "var(--blue-bright)" }}
        >
          <path
            d="M0 14 Q 40 4 80 14 T 160 14 T 240 14 T 320 14 T 400 14 T 480 14 T 560 14 T 640 14 T 720 14 T 800 14 T 880 14 T 960 14 T 1040 14 T 1120 14 T 1200 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated glint travelling left -> right toward the CTA. */}
          <path
            className="ferry-flow-line"
            d="M0 14 Q 40 4 80 14 T 160 14 T 240 14 T 320 14 T 400 14 T 480 14 T 560 14 T 640 14 T 720 14 T 800 14 T 880 14 T 960 14 T 1040 14 T 1120 14 T 1200 14"
            pathLength={1}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.85}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="shrink-0 text-left sm:text-right">
          <p
            className="font-sans text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--slate-muted)" }}
          >
            Getting around Indonesia
          </p>
          <Link
            to="/transport"
            aria-label="Explore Indonesia ferry and transport routes"
            className="group mt-2.5 inline-flex items-center gap-2 rounded-full border border-[rgba(13,148,136,0.35)] px-5 py-2.5 font-sans text-base font-semibold text-[var(--teal-link)] transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--teal-link)] hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-link)] focus-visible:ring-offset-2"
          >
            Explore ferry routes
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
