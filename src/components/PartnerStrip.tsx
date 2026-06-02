import { useRef } from "react";
import { useMarqueeDrag } from "@/hooks/useMarqueeDrag";

export type Partner = { name: string; color: string };

const DEFAULT_PARTNERS: Partner[] = [
  { name: "Viator", color: "#1f9e87" },
  { name: "Klook", color: "#ef7a23" },
  { name: "Booking.com", color: "#1b3aa0" },
  { name: "GetYourGuide", color: "#e0533a" },
  { name: "12Go", color: "#0d9488" },
  { name: "Agoda", color: "#d72f7a" },
  { name: "Hostelworld", color: "#f15a2b" },
  { name: "Airbnb", color: "#ff5a5f" },
  { name: "Skyscanner", color: "#0770e3" },
  { name: "Kiwi.com", color: "#00a991" },
  { name: "Rentalcars.com", color: "#f76707" },
  { name: "QEEQ", color: "#2a6df4" },
  { name: "Musement", color: "#ff5a36" },
  { name: "Tiqets", color: "#ff5b9a" },
  { name: "World Nomads", color: "#1a1a1a" },
  { name: "Airalo", color: "#f76b1c" },
  { name: "Welcome Pickups", color: "#ffcc33" },
  { name: "Intrepid Travel", color: "#c8102e" },
];

export function PartnerStrip({
  partners = DEFAULT_PARTNERS,
  caption = "We search across leading travel platforms",
  footnote = "Behind these names sit thousands of vetted local operators across Indonesia.",
  background = "var(--cream)",
}: {
  partners?: Partner[];
  caption?: string;
  footnote?: string;
  background?: string;
}) {
  const loop = [...partners, ...partners];
  const trackRef = useRef<HTMLDivElement>(null);
  useMarqueeDrag(trackRef, { step: 180 });

  return (
    <section className="w-full pb-16 pt-4" style={{ backgroundColor: background }}>
      {caption && (
        <div className="mx-auto max-w-6xl px-6">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-center mb-8 max-w-3xl mx-auto"
            style={{ color: "var(--slate-muted)" }}
          >
            {caption}
          </p>
        </div>
      )}

      <div
        className="relative w-full overflow-hidden marquee-pause marquee-reduced-scroll mb-8"
        data-partner-strip="true"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 w-max animate-marquee focus:outline-none"
          data-partner-track="true"
          role="region"
          aria-roledescription="carousel"
          aria-label="Trusted travel partner brands."
        >
          {loop.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="bg-white rounded-xl px-5 py-3 sm:px-7 sm:py-4 border shrink-0"
              data-partner-logo={p.name}
              style={{ borderColor: "var(--border-cream)" }}
            >
              <span
                className="font-bold text-base sm:text-lg whitespace-nowrap"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {footnote && (
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-base" style={{ color: "var(--text-dark)" }}>
            {footnote}
          </p>
        </div>
      )}
    </section>
  );
}
