import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { DESTINATION_CONTENT } from "@/data/destinations";

// Pin coordinates as percentages of the SVG viewBox (1000 x 650).
// Tuned to sit on top of the matching stylised island shape.
const PIN_COORDS: Record<string, { x: number; y: number }> = {
  sumatra: { x: 17, y: 38 },
  java: { x: 49, y: 79 },
  bali: { x: 50, y: 90 },
  "bali-nearby-islands": { x: 55, y: 90 },
  "lombok-gili": { x: 60, y: 90 },
  "komodo-flores": { x: 65, y: 90 },
  "wild-indonesia": { x: 71, y: 45 },
  "raja-ampat": { x: 83, y: 50 },
};

const ISLAND = "var(--teal-link)";
const DOT = "#d9c89a"; // warm sand, matches reference

export function IndonesiaMap() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <div
      className="relative w-full overflow-visible"
      style={{ aspectRatio: "1000 / 650" }}
      onMouseLeave={() => setActiveSlug(null)}
    >
      {/* Stylised archipelago — abstract blob shapes, inspired by the brand mark */}
      <svg
        viewBox="0 0 1000 650"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="islandFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={ISLAND} stopOpacity="0.95" />
            <stop offset="100%" stopColor={ISLAND} stopOpacity="0.75" />
          </linearGradient>
        </defs>

        <g fill="url(#islandFill)">
          {/* Sumatra — tilted capsule, top-left */}
          <ellipse cx="170" cy="245" rx="38" ry="115" transform="rotate(-22 170 245)" />

          {/* Borneo — large soft blob, top-center */}
          <path d="M 360 180 C 460 150, 560 170, 575 260 C 590 340, 510 380, 420 365 C 340 350, 305 260, 360 180 Z" />

          {/* Sulawesi — four-arm K-shape, center-right */}
          <path d="
            M 700 180
            C 715 220, 695 260, 715 295
            C 745 280, 780 250, 800 215
            C 780 245, 775 285, 790 320
            C 760 325, 720 320, 705 305
            C 690 340, 660 375, 640 395
            C 660 360, 670 320, 680 305
            C 645 320, 615 305, 595 290
            C 625 280, 660 285, 685 280
            C 670 250, 670 215, 700 180 Z" />

          {/* Papua — horizontal blob with a small head on the left */}
          <ellipse cx="870" cy="335" rx="105" ry="48" />
          <ellipse cx="800" cy="320" rx="22" ry="20" />

          {/* Java — long thin ellipse, bottom-center */}
          <ellipse cx="490" cy="510" rx="160" ry="26" />

          {/* Lesser Sunda — four small islands */}
          <ellipse cx="510" cy="585" rx="14" ry="9" />
          <ellipse cx="555" cy="588" rx="13" ry="8" />
          <ellipse cx="600" cy="588" rx="13" ry="8" />
          <ellipse cx="645" cy="585" rx="14" ry="9" />
        </g>

        {/* Connector dots between island clusters */}
        <g fill={DOT}>
          {/* Sumatra → Borneo */}
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={`sb-${i}`} cx={225 + i * 18} cy={278 - i * 1.5} r="4" />
          ))}
          {/* Borneo → Sulawesi */}
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={`bs-${i}`} cx={595 + i * 16} cy={280 + i * 1} r="4" />
          ))}
          {/* Sulawesi → Papua */}
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={`sp-${i}`} cx={760 + i * 14} cy={330} r="4" />
          ))}
        </g>
      </svg>

      {/* Pins overlay */}
      {DESTINATION_CONTENT.map((d) => {
        const coords = PIN_COORDS[d.slug];
        if (!coords) return null;
        const isActive = activeSlug === d.slug;
        const flipLeft = coords.x > 72;
        const flipDown = coords.y < 25;

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
              aria-haspopup="dialog"
              aria-expanded={isActive}
              aria-controls={`map-tip-${d.slug}`}
              aria-describedby={isActive ? `map-tip-${d.slug}` : undefined}
              onMouseEnter={() => setActiveSlug(d.slug)}
              onFocus={() => setActiveSlug(d.slug)}
              onBlur={() => setActiveSlug((s) => (s === d.slug ? null : s))}
              className="group relative flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream)]"
            >
              <span
                aria-hidden="true"
                className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white shadow-md transition-transform duration-200 group-hover:scale-150 group-focus-visible:scale-150"
                style={{ backgroundColor: "var(--blue-bright)" }}
              />
            </Link>

            <div
              id={`map-tip-${d.slug}`}
              role="tooltip"
              aria-hidden={!isActive}
              className={`pointer-events-none absolute z-30 w-48 transition-opacity duration-150 ${
                isActive ? "opacity-100 animate-fade-in" : "opacity-0"
              }`}
              style={{
                ...(flipDown
                  ? { top: "calc(50% + 6px)" }
                  : { bottom: "calc(50% + 6px)" }),
                left: flipLeft ? "auto" : "50%",
                right: flipLeft ? "50%" : "auto",
                transform: flipLeft ? "translateX(8px)" : "translateX(-50%)",
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
          </div>
        );
      })}
    </div>
  );
}
