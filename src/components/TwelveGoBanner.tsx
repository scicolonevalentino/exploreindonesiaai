import { Train, Bus, Ship, Car, Plane } from "lucide-react";

// 12Go affiliate banner — rebuilt in HTML/CSS (responsive + sharp) rather than a
// raster image. Used on transport route pages to monetize transport intent.
// Affiliate link: 12Go via Travelpayouts (z=16022946).
const ICONS = [Train, Bus, Ship, Car, Plane];

export function TwelveGoBanner() {
  return (
    <a
      href="https://12go.asia/?z=16022946"
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label="Book trains, buses, ferries, transfers and flights on 12Go"
      className="group my-10 block overflow-hidden rounded-xl"
      style={{ backgroundColor: "#16263a" }}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-3.5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">
              <span style={{ color: "#6cc04a" }}>12</span>
              <span className="text-white">GO</span>
            </span>
            <span className="text-lg font-extrabold text-white sm:text-xl">Places</span>
          </div>
          <p className="mt-1 truncate text-[11px] text-white/70 sm:text-xs">
            Instantly book trains, buses, ferries, transfers &amp; flights
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {ICONS.map((Icon, i) => (
            <span
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          ))}
        </div>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold transition-transform group-hover:translate-x-0.5"
          style={{ backgroundColor: "#6cc04a", color: "#16263a" }}
          aria-hidden
        >
          →
        </span>
      </div>
    </a>
  );
}
