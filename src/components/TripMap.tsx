// Trip map — a static, brand-styled map of Indonesia with the trip's stops
// pinned in route order. No maps API, no API key, no runtime network call: the
// coastline ships as a bundled topology and the projection auto-frames to
// whatever stops the trip contains (Bali-only zooms to Bali; Bali + Lombok
// frames both; a cross-archipelago trip zooms out). Identical on mobile and
// desktop because everything scales with the SVG viewBox.
//
// Interactivity: land + route line are SVG underneath; pins are HTML buttons on
// an overlay so hover/tap reveals a popup of that location's BOOKABLE
// experiences, each linking back to its day. Heavy bits (d3-geo + the ~190KB
// topology) live in this module so it can be lazy-loaded — it only downloads
// when a visitor opens the Map tab.

import { useLayoutEffect, useRef, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Feature, Geometry } from "geojson";
import topoData from "@/data/indonesia-topo.json";
import type { Stop, StopExperience } from "@/lib/trip/places";

// Decode the Indonesia coastline once, at module load — pure data, no per-render
// cost. Provinces are all filled the same colour, so we treat them as one mass.
const TOPO = topoData as unknown as Topology;
const LAND: Array<Feature<Geometry>> = feature(
  TOPO,
  TOPO.objects.idn as GeometryCollection,
).features;

const W = 880;
const H = 480;
const PAD_X = 30;
const PAD_TOP = 30;
const PAD_BOTTOM = 36;

// Light-only palette — the trip view sits on a cream background.
const C = {
  sea: "#eaf2ee",
  land: "#cadfd6",
  coast: "#a7c6bb",
  ink: "#062d2a", // route + pins (brand --navy-deep)
  pinText: "#f7f5ee", // --cream
};

function priceLabel(e: StopExperience): string | null {
  if (e.price == null) return null;
  const cur = e.currency === "USD" || !e.currency ? "$" : `${e.currency} `;
  return `${cur}${Math.round(e.price)}`;
}

// Spread pins that project too close together so the numbers stay legible (e.g.
// Seminyak / Kuta / Denpasar are only a few km apart). A few passes of pairwise
// repulsion, then clamp inside the frame. minDist is in viewBox units. Cheap:
// trips have a handful of pins.
function separate(input: Array<[number, number]>, minDist: number): Array<[number, number]> {
  const p = input.map((q) => [q[0], q[1]] as [number, number]);
  for (let iter = 0; iter < 80; iter++) {
    let moved = false;
    for (let a = 0; a < p.length; a++) {
      for (let b = a + 1; b < p.length; b++) {
        let dx = p[b][0] - p[a][0];
        let dy = p[b][1] - p[a][1];
        let d = Math.hypot(dx, dy);
        if (d === 0) {
          dx = 0.6;
          dy = -0.4;
          d = Math.hypot(dx, dy);
        }
        if (d < minDist) {
          const push = (minDist - d) / 2;
          const ux = dx / d;
          const uy = dy / d;
          p[a][0] -= ux * push;
          p[a][1] -= uy * push;
          p[b][0] += ux * push;
          p[b][1] += uy * push;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  for (const q of p) {
    q[0] = Math.max(PAD_X, Math.min(W - PAD_X, q[0]));
    q[1] = Math.max(PAD_TOP, Math.min(H - PAD_BOTTOM, q[1]));
  }
  return p;
}

export default function TripMap({
  stops,
  onJump,
  onBook,
}: {
  stops: Stop[];
  onJump?: (day: number) => void;
  onBook?: (exp: StopExperience) => void;
}) {
  // Which pin's popup is open. Hover drives it on desktop; tap (click) pins it
  // open on touch, where there is no hover.
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  // De-clustering works in viewBox units, but pins are a fixed 28px and the map
  // scales with its container — so we measure the rendered width and convert a
  // target pixel spacing into viewBox units. Keeps numbers legible at any size.
  const wrapRef = useRef<HTMLElement>(null);
  const [renderW, setRenderW] = useState(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setRenderW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (stops.length === 0) {
    return (
      <div
        className="rounded-2xl border h-72 flex items-center justify-center text-sm text-[var(--slate-muted)]"
        style={{ borderColor: "var(--border-cream)", background: C.sea }}
      >
        We&rsquo;ll map this trip once we recognise its stops.
      </div>
    );
  }

  // Frame = bounding box of the stops, padded. Fit to a MultiPoint of the padded
  // corners, NOT a Polygon: d3-geo reads polygons spherically, and a lng/lat
  // rectangle's winding makes it fit the whole globe (every pin collapses onto
  // one point). Corner points have no winding, so the bounds are exact.
  const lngs = stops.map((s) => s.lng);
  const lats = stops.map((s) => s.lat);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  const padLng = Math.max((maxLng - minLng) * 0.35, 0.55);
  const padLat = Math.max((maxLat - minLat) * 0.35, 0.45);
  minLng -= padLng;
  maxLng += padLng;
  minLat -= padLat;
  maxLat += padLat;

  const frame: Feature<Geometry> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPoint",
      coordinates: [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
    },
  };

  const projection = geoMercator().fitExtent(
    [
      [PAD_X, PAD_TOP],
      [W - PAD_X, H - PAD_BOTTOM],
    ],
    frame,
  );
  const path = geoPath(projection);
  const projected: Array<[number, number]> = stops.map(
    (s) => (projection([s.lng, s.lat]) as [number, number] | null) ?? [0, 0],
  );
  // Target ~42px between pin centres on screen (pins are 28px), converted to
  // viewBox units via the measured render width; clamped so it never collapses
  // or over-spreads. Pins use the de-clustered positions; the route follows them.
  const minSep = Math.min(120, Math.max(42, renderW > 0 ? (42 * W) / renderW : 52));
  const pts = separate(projected, minSep);
  const routeD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");

  return (
    <figure ref={wrapRef} className="relative m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="block h-auto rounded-2xl border"
        style={{ borderColor: "var(--border-cream)", background: C.sea }}
        role="img"
        aria-label={`Map of your trip with ${stops.length} stops: ${stops
          .map((s) => s.label)
          .join(", ")}.`}
      >
        <g>
          {LAND.map((f, i) => {
            const d = path(f);
            return d ? (
              <path
                key={i}
                d={d}
                fill={C.land}
                stroke={C.coast}
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            ) : null;
          })}
        </g>

        {pts.length > 1 && (
          <path
            d={routeD}
            fill="none"
            stroke={C.ink}
            strokeWidth={2}
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity={0.8}
          />
        )}
      </svg>

      {/* HTML overlay: pins + hover/tap popups, positioned by % so they track
          the SVG (same aspect ratio) on any screen size. */}
      <div className="pointer-events-none absolute inset-0">
        {stops.map((s, i) => {
          const xPct = (pts[i][0] / W) * 100;
          const yPct = (pts[i][1] / H) * 100;
          const open = hover === i || pinned === i;
          const placeBelow = yPct < 45;
          const halign = xPct < 24 ? "left" : xPct > 76 ? "right" : "center";
          const hx =
            halign === "left"
              ? "translateX(-16px)"
              : halign === "right"
                ? "translateX(calc(-100% + 16px))"
                : "translateX(-50%)";
          return (
            <div
              key={s.key}
              className="pointer-events-auto absolute"
              style={{ left: `${xPct}%`, top: `${yPct}%`, zIndex: open ? 20 : 10 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            >
              <button
                type="button"
                aria-label={`${s.label}, ${s.experiences.length} bookable ${
                  s.experiences.length === 1 ? "experience" : "experiences"
                }`}
                onClick={() => setPinned((p) => (p === i ? null : i))}
                className="grid place-items-center rounded-full font-medium transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2"
                style={{
                  width: 28,
                  height: 28,
                  transform: "translate(-50%, -50%)",
                  background: C.ink,
                  color: C.pinText,
                  border: `2px solid ${C.sea}`,
                  fontSize: 13,
                }}
              >
                {i + 1}
              </button>

              {open && (
                <div
                  className="absolute rounded-xl border bg-white p-2 shadow-md"
                  style={{
                    width: 232,
                    left: 0,
                    transform: hx,
                    borderColor: "var(--border-cream)",
                    ...(placeBelow ? { top: "16px" } : { bottom: "16px" }),
                  }}
                >
                  <div className="mb-1.5 px-1 text-[13px] font-medium text-[var(--navy-deep)]">
                    {s.label}
                  </div>
                  <div className="flex max-h-44 flex-col gap-1 overflow-y-auto overscroll-contain">
                    {s.experiences.map((e, j) => {
                      const price = priceLabel(e);
                      const rowClass =
                        "flex w-full items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-[var(--cream)]";
                      const inner = (
                        <>
                          {e.imageUrl ? (
                            <img
                              src={e.imageUrl}
                              alt=""
                              loading="lazy"
                              className="h-9 w-9 flex-shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div
                              className="h-9 w-9 flex-shrink-0 rounded-md"
                              style={{ background: C.land }}
                              aria-hidden
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12.5px] font-medium leading-tight text-[var(--navy-deep)]">
                              {e.title}
                            </div>
                            <div className="mt-0.5 text-[11px] text-[var(--slate-muted)]">
                              Day {e.day}
                              {e.time ? ` · ${e.time}` : ""}
                              {price ? ` · ${price}` : ""}
                            </div>
                          </div>
                          {e.deepLink && (
                            <span
                              className="self-center text-[13px] text-[var(--teal-link)]"
                              aria-hidden
                            >
                              ↗
                            </span>
                          )}
                        </>
                      );
                      // A bookable experience opens its affiliate link; one
                      // without a live link yet jumps to its day instead.
                      return e.deepLink ? (
                        <a
                          key={j}
                          href={e.deepLink}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          onClick={() => {
                            setPinned(null);
                            onBook?.(e);
                          }}
                          className={rowClass}
                        >
                          {inner}
                        </a>
                      ) : (
                        <button
                          key={j}
                          type="button"
                          onClick={() => {
                            setPinned(null);
                            onJump?.(e.day);
                          }}
                          className={rowClass}
                        >
                          {inner}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
