import { useState } from "react";
import { Link } from "@tanstack/react-router";
import mapAsset from "@/assets/indonesia-map.jpg.asset.json";
import { DESTINATION_CONTENT } from "@/data/destinations";

// Pin coordinates as percentages of the underlying illustration (1536x1024).
// Tuned visually to sit on top of the matching island in the artwork.
const PIN_COORDS: Record<string, { x: number; y: number }> = {
  sumatra: { x: 16, y: 42 },
  java: { x: 38, y: 70 },
  bali: { x: 50, y: 72 },
  "bali-nearby-islands": { x: 53, y: 76 },
  "lombok-gili": { x: 57, y: 72 },
  "komodo-flores": { x: 65, y: 76 },
  "raja-ampat": { x: 80, y: 44 },
  "wild-indonesia": { x: 60, y: 46 },
};

export function IndonesiaMap() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border shadow-sm"
      style={{
        aspectRatio: "1536 / 1024",
        borderColor: "var(--border-cream)",
        backgroundColor: "var(--cream)",
      }}
      onMouseLeave={() => setActiveSlug(null)}
    >
      <img
        src={mapAsset.url}
        alt="Illustrated map of Indonesia"
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
        draggable={false}
      />

      {DESTINATION_CONTENT.map((d) => {
        const coords = PIN_COORDS[d.slug];
        if (!coords) return null;
        const isActive = activeSlug === d.slug;
        const flipLeft = coords.x > 70;

        return (
          <div
            key={d.slug}
            className="absolute"
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Link
              to="/destinations/$destination"
              params={{ destination: d.slug }}
              aria-label={`Browse trips in ${d.name}`}
              aria-describedby={isActive ? `map-tip-${d.slug}` : undefined}
              onMouseEnter={() => setActiveSlug(d.slug)}
              onFocus={() => setActiveSlug(d.slug)}
              onBlur={() => setActiveSlug((s) => (s === d.slug ? null : s))}
              className="group relative flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={
                {
                  // @ts-expect-error css var
                  "--tw-ring-color": "var(--blue-bright)",
                  "--tw-ring-offset-color": "var(--cream)",
                } as React.CSSProperties
              }
            >
              {/* Pulsing ring */}
              <span
                aria-hidden="true"
                className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                style={{ backgroundColor: "var(--blue-bright)" }}
              />
              {/* Solid core */}
              <span
                aria-hidden="true"
                className="relative inline-flex h-3 w-3 rounded-full border-2 border-white shadow-md transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125"
                style={{ backgroundColor: "var(--blue-bright)" }}
              />
            </Link>

            {/* Hover/focus preview card */}
            {isActive && (
              <div
                id={`map-tip-${d.slug}`}
                role="tooltip"
                className="pointer-events-none absolute z-20 w-48 animate-fade-in"
                style={{
                  bottom: "calc(100% + 10px)",
                  left: flipLeft ? "auto" : "50%",
                  right: flipLeft ? "50%" : "auto",
                  transform: flipLeft ? "translateX(0)" : "translateX(-50%)",
                }}
              >
                <div
                  className="rounded-lg border bg-white px-3 py-2 shadow-lg"
                  style={{ borderColor: "var(--border-cream)" }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--teal-link)" }}
                  >
                    Destination
                  </p>
                  <p
                    className="font-serif text-sm font-semibold leading-snug"
                    style={{ color: "var(--navy-deep)" }}
                  >
                    {d.name}
                  </p>
                  <p
                    className="mt-0.5 text-[11px] leading-snug line-clamp-2"
                    style={{ color: "var(--slate-muted)" }}
                  >
                    {d.highlights.slice(0, 3).join(" · ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
