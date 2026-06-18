// GET /og.jpg — dynamic social preview card.
//
// Renders a 1200x630 image on demand so link previews on WhatsApp / Instagram /
// Facebook / X reflect the live brand instead of a frozen screenshot.
//
//   /og.jpg                 -> homepage card (clean, readable, on-brand)
//   /og.jpg?style=dark      -> alternate look (navy/teal gradient, no photo)
//   /og.jpg?title=..&sub=..  -> custom headline for other pages (destinations)
//
// Copy + backdrop come from src/data/hero.ts (the SAME module the live <Hero/>
// renders from) so the card can't drift from the page. @vercel/og (Satori +
// resvg) produces a PNG; we re-encode to JPEG with jimp (pure JS, no native
// binary) because a photographic PNG is too heavy for WhatsApp's preview fetch.
// Fonts (Playfair Display + Inter) and images are fetched from this site's own
// /public at render time, then edge-cached. If anything fails we still return a
// valid text-only image rather than a broken preview.

import type { ReactElement } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ImageResponse } from "@vercel/og";
import { Jimp } from "jimp";
import { HERO } from "@/data/hero";

const WIDTH = 1200;
const HEIGHT = 630;

// Brand palette — keep in sync with src/styles.css.
const CREAM = "#f7f5ee";
const NAVY_DEEP = "#062d2a";
const NAVY_MID = "#0a3d3a";
const TEAL = "#14b8a6";
const TEAL_ICE = "#5eead4";
const INK = "#0b2a27"; // body text on cream

// Teal "highlighter" bar behind key words, like the hero.
const highlight = (light: boolean) =>
  `linear-gradient(transparent 60%, ${light ? TEAL_ICE : TEAL} 60%)`;

type FontSpec = { file: string; name: string; weight: 400 | 600 | 700; style: "normal" | "italic" };
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
  weight: 400 | 600 | 700;
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

function cleanTitle(raw: string): string {
  const base = raw.split(/\s+[|–-]\s+exploreindonesia\.ai/i)[0].trim() || raw.trim();
  return base.length > 80 ? `${base.slice(0, 77).trimEnd()}…` : base;
}

function clamp(raw: string | null, max: number): string {
  const s = (raw ?? "").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

// Rasterize the React element to PNG (Satori + resvg), then re-encode to JPEG.
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
  const out = await image.getBuffer("image/jpeg", { quality: 86 });
  // The Node Buffer is a valid Response body at runtime; the cast only sidesteps
  // the TS 5.7 Uint8Array<ArrayBufferLike> vs BodyInit generic mismatch.
  return new Uint8Array(out) as unknown as BodyInit;
}

// Brand lockup: Komo mascot + "exploreindonesia.ai" wordmark.
function Logo({ origin, dark, size = 46 }: { origin: string; dark: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={`${origin}/komo-mascot.png`}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain", marginRight: 12 }}
      />
      <div
        style={{
          display: "flex",
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 27,
          letterSpacing: -0.3,
        }}
      >
        <span style={{ color: dark ? "#ffffff" : NAVY_DEEP }}>exploreindonesia</span>
        <span style={{ color: dark ? TEAL_ICE : TEAL }}>.ai</span>
      </div>
    </div>
  );
}

// Headline lines with the hero's two-line / teal-highlight treatment.
function Headline({ size, color, light }: { size: number; color: string; light: boolean }) {
  const word = (text: string) => (
    <span style={{ display: "flex", backgroundImage: highlight(light), padding: "0 3px" }}>
      {text}
    </span>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", color }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          fontFamily: "Playfair Display",
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.12,
        }}
      >
        <span style={{ display: "flex", marginRight: size * 0.24 }}>
          {HERO.title.lead.trimEnd()}
        </span>
        {word(HERO.title.highlight1)}
        <span style={{ display: "flex" }}>{HERO.title.q}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          fontFamily: "Playfair Display",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: size,
          lineHeight: 1.2,
          marginTop: 4,
        }}
      >
        <span style={{ display: "flex", marginRight: size * 0.24 }}>
          {HERO.title.line2Lead.trimEnd()}
        </span>
        {word(HERO.title.highlight2)}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/og.jpg")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const origin = url.origin;
        const style = url.searchParams.get("style") || "dark";
        const titleParam = url.searchParams.get("title");
        const isHome = !titleParam;
        const photo = url.searchParams.get("image") || `${origin}${HERO.poster}`;
        const tagline = HERO.subtitle.lead;

        let card: ReactElement;

        if (isHome && style === "dark") {
          // DARK: brand gradient, logo top, headline centered, no body copy.
          card = (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                padding: "60px 80px",
                backgroundColor: NAVY_DEEP,
                backgroundImage: `radial-gradient(1150px 760px at 102% -5%, ${TEAL} 0%, rgba(20,184,166,0) 52%), linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 62%)`,
              }}
            >
              <Logo origin={origin} dark />
              <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
                <Headline size={68} color={CREAM} light={false} />
              </div>
            </div>
          );
        } else if (isHome) {
          // SPLIT: cream text panel + photo. Text sits on a solid panel so it's
          // always legible, the photo shows the destination on the right.
          card = (
            <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: CREAM }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 690,
                  height: "100%",
                  padding: "62px 56px",
                  justifyContent: "space-between",
                }}
              >
                <Logo origin={origin} dark={false} />
                <Headline size={52} color={NAVY_DEEP} light={false} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "Inter",
                      fontSize: 23,
                      color: INK,
                      lineHeight: 1.35,
                      maxWidth: 560,
                    }}
                  >
                    {tagline}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 22,
                      backgroundColor: TEAL,
                      color: NAVY_DEEP,
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: 22,
                      padding: "10px 22px",
                      borderRadius: 999,
                    }}
                  >
                    Plan it. Book it.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", position: "relative", width: 510, height: "100%" }}>
                <img
                  src={photo}
                  width={510}
                  height={HEIGHT}
                  style={{ width: 510, height: "100%", objectFit: "cover" }}
                />
                {/* soft cream feather where the photo meets the panel */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    backgroundImage: `linear-gradient(90deg, ${CREAM} 0%, rgba(247,245,238,0) 12%)`,
                  }}
                />
              </div>
            </div>
          );
        } else {
          // Generic card for other pages: dark gradient + custom serif title.
          const title = cleanTitle(titleParam);
          const sub = clamp(url.searchParams.get("subtitle"), 140);
          card = (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                padding: "66px 80px",
                backgroundColor: NAVY_DEEP,
                backgroundImage: `radial-gradient(1100px 700px at 100% 0%, ${TEAL} 0%, rgba(20,184,166,0) 55%), linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 60%)`,
                justifyContent: "space-between",
              }}
            >
              <Logo origin={origin} dark />
              <div
                style={{
                  display: "flex",
                  fontFamily: "Playfair Display",
                  fontWeight: 600,
                  fontSize: title.length > 36 ? 58 : 70,
                  lineHeight: 1.1,
                  color: CREAM,
                  maxWidth: 1000,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontSize: 27,
                  color: "rgba(247,245,238,0.85)",
                  maxWidth: 920,
                  lineHeight: 1.3,
                }}
              >
                {sub || tagline}
              </div>
            </div>
          );
        }

        try {
          const fonts = await loadFonts(origin);
          const jpeg = await renderJpeg(card, fonts);
          return new Response(jpeg, {
            headers: { "content-type": "image/jpeg", "cache-control": CACHE_CONTROL },
          });
        } catch (err) {
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
