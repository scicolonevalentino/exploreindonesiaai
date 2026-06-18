// GET /og.jpg — dynamic social preview card.
//
// Renders a 1200x630 image on demand so link previews on WhatsApp / Instagram /
// Facebook / X mirror the LIVE homepage hero instead of a frozen screenshot.
//
//   /og.jpg                      -> faithful replica of the homepage hero
//                                   (poster backdrop + the exact headline/
//                                   subtitle from src/data/hero.ts).
//   /og.jpg?title=..&subtitle=.. -> same brand backdrop with a custom headline
//                                   (used by destination pages, etc.).
//   /og.jpg?..&image=<url>       -> swap the backdrop for a specific photo.
//
// The home copy comes from src/data/hero.ts, the SAME module the live <Hero/>
// renders from, so the card can't drift from the page. Fonts (Playfair Display
// for the serif headline, Inter for the rest) and the backdrop are fetched from
// this site's own /public at render time, then edge-cached. @vercel/og (Satori +
// resvg) produces a PNG; we re-encode to JPEG with sharp because a photographic
// PNG is ~1.6MB (too heavy for WhatsApp's preview fetch) while the JPEG is
// ~120KB. Runs as a Nitro Node server function on Vercel. If anything fails to
// load we still return a valid text-only image rather than a broken preview.

import type { ReactElement } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ImageResponse } from "@vercel/og";
import { Jimp } from "jimp";
import { HERO } from "@/data/hero";

const WIDTH = 1200;
const HEIGHT = 630;

// Brand palette — keep in sync with src/styles.css.
const NAVY_DEEP = "#062d2a";
const TEAL = "#14b8a6";
const CREAM = "#f7f5ee";

// The teal "highlighter" bar behind key words — matches the hero exactly
// (linear-gradient(transparent 60%, var(--blue-bright) 60%)).
const HIGHLIGHT = `linear-gradient(transparent 58%, ${TEAL} 58%)`;

// Scrims layered over the backdrop for legibility — mirrors the hero's desktop
// overlays (src/routes/index.tsx).
const BASE_WASH =
  "linear-gradient(180deg, rgba(6,45,42,0.55) 0%, rgba(6,45,42,0.45) 50%, rgba(6,45,42,0.72) 100%)";
const FOCAL_SCRIM =
  "radial-gradient(ellipse 75% 65% at 50% 52%, rgba(6,45,42,0.78) 0%, rgba(6,45,42,0.45) 60%, rgba(6,45,42,0.05) 100%)";

type FontSpec = { file: string; name: string; weight: 400 | 600; style: "normal" | "italic" };
const FONT_FILES: FontSpec[] = [
  { file: "Inter-400.ttf", name: "Inter", weight: 400, style: "normal" },
  { file: "Inter-600.ttf", name: "Inter", weight: 600, style: "normal" },
  { file: "PlayfairDisplay-600.ttf", name: "Playfair Display", weight: 600, style: "normal" },
  {
    file: "PlayfairDisplay-Italic-400.ttf",
    name: "Playfair Display",
    weight: 400,
    style: "italic",
  },
];

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: "normal" | "italic";
};
// Warm invocations reuse the fetched fonts; null until the first successful load.
let fontCache: LoadedFont[] | null = null;

async function loadFonts(origin: string): Promise<LoadedFont[]> {
  if (fontCache) return fontCache;
  const loaded = await Promise.all(
    FONT_FILES.map(async (f) => {
      const res = await fetch(`${origin}/fonts/${f.file}`);
      if (!res.ok) throw new Error(`font ${f.file}: ${res.status}`);
      return { name: f.name, data: await res.arrayBuffer(), weight: f.weight, style: f.style };
    }),
  );
  fontCache = loaded;
  return loaded;
}

// Drop the brand suffix from a page <title> ("Foo | exploreindonesia.ai" -> "Foo").
function cleanTitle(raw: string): string {
  const base = raw.split(/\s+[|–-]\s+exploreindonesia\.ai/i)[0].trim() || raw.trim();
  return base.length > 90 ? `${base.slice(0, 87).trimEnd()}…` : base;
}

function clamp(raw: string | null, max: number): string {
  const s = (raw ?? "").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

// Rasterize the React element to PNG (Satori + resvg), then re-encode to JPEG
// with Jimp (pure JS — no native binary, so it behaves identically locally and
// on Vercel's linux runtime).
async function renderJpeg(
  element: ReactElement,
  fonts: LoadedFont[] | undefined,
): Promise<BodyInit> {
  const png = await new ImageResponse(element, {
    width: WIDTH,
    height: HEIGHT,
    ...(fonts ? { fonts: fonts.map((f) => ({ ...f })) } : {}),
  }).arrayBuffer();
  const image = await Jimp.read(Buffer.from(png));
  const out = await image.getBuffer("image/jpeg", { quality: 82 });
  // The Node Buffer is a valid Response body at runtime; the cast only sidesteps
  // the TS 5.7 Uint8Array<ArrayBufferLike> vs BodyInit generic mismatch.
  return new Uint8Array(out) as unknown as BodyInit;
}

const Eyebrow = () => (
  <div
    style={{
      display: "flex",
      fontFamily: "Inter",
      fontSize: 23,
      fontWeight: 600,
      letterSpacing: 5,
      textTransform: "uppercase",
      color: CREAM,
      marginBottom: 30,
    }}
  >
    {HERO.eyebrow}
  </div>
);

const Subtitle = ({ text }: { text: string }) =>
  text ? (
    <div
      style={{
        display: "flex",
        fontFamily: "Inter",
        fontSize: 26,
        fontWeight: 400,
        color: "rgba(247,245,238,0.92)",
        lineHeight: 1.35,
        marginTop: 28,
        maxWidth: 840,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  ) : null;

export const Route = createFileRoute("/og.jpg")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const origin = url.origin;
        const titleParam = url.searchParams.get("title");
        const isHome = !titleParam;
        const bg = url.searchParams.get("image") || `${origin}${HERO.poster}`;

        const serif = (weight: 400 | 600, italic = false) => ({
          fontFamily: "Playfair Display",
          fontWeight: weight,
          fontStyle: italic ? ("italic" as const) : ("normal" as const),
        });

        // Headline: hero replica (two styled lines + teal highlights) or a single
        // serif title for other pages.
        const headline = isHome ? (
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", color: CREAM }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
                fontSize: 62,
                lineHeight: 1.14,
                ...serif(600),
              }}
            >
              <span style={{ display: "flex", marginRight: 16 }}>{HERO.title.lead.trimEnd()}</span>
              <span style={{ display: "flex", backgroundImage: HIGHLIGHT, padding: "0 2px" }}>
                {HERO.title.highlight1}
              </span>
              <span style={{ display: "flex" }}>{HERO.title.q}</span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
                fontSize: 62,
                lineHeight: 1.18,
                ...serif(400, true),
              }}
            >
              <span style={{ display: "flex", marginRight: 16 }}>
                {HERO.title.line2Lead.trimEnd()}
              </span>
              <span style={{ display: "flex", backgroundImage: HIGHLIGHT, padding: "0 2px" }}>
                {HERO.title.highlight2}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              fontSize: cleanTitle(titleParam).length > 40 ? 56 : 66,
              lineHeight: 1.12,
              color: CREAM,
              maxWidth: 1000,
              ...serif(600),
            }}
          >
            {cleanTitle(titleParam)}
          </div>
        );

        const subtitle = isHome
          ? `${HERO.subtitle.lead} ${HERO.subtitle.main}`
          : clamp(url.searchParams.get("subtitle"), 150);

        const card = (
          <div style={{ position: "relative", display: "flex", width: "100%", height: "100%" }}>
            <img
              src={bg}
              width={WIDTH}
              height={HEIGHT}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                backgroundImage: BASE_WASH,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                backgroundImage: FOCAL_SCRIM,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "60px 72px",
                textAlign: "center",
              }}
            >
              <Eyebrow />
              {headline}
              <Subtitle text={subtitle} />
            </div>
          </div>
        );

        try {
          const fonts = await loadFonts(origin);
          const jpeg = await renderJpeg(card, fonts);
          return new Response(jpeg, {
            headers: { "content-type": "image/jpeg", "cache-control": CACHE_CONTROL },
          });
        } catch (err) {
          // Never serve a broken preview: fall back to a text-only card with the
          // bundled font and no external fetches.
          console.error("og.jpg render failed, using fallback:", err);
          const fallback = (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: 80,
                backgroundColor: NAVY_DEEP,
                color: CREAM,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  letterSpacing: 4,
                  color: TEAL,
                  marginBottom: 24,
                }}
              >
                EXPLOREINDONESIA.AI
              </div>
              <div style={{ display: "flex", fontSize: 60, lineHeight: 1.15 }}>
                {isHome ? "AI Indonesia Trip Planner" : cleanTitle(titleParam)}
              </div>
            </div>
          );
          try {
            const jpeg = await renderJpeg(fallback, undefined);
            return new Response(jpeg, {
              headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=300" },
            });
          } catch {
            return new Response("og render failed", { status: 500 });
          }
        }
      },
    },
  },
});
