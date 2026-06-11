// Client-side itinerary PDF generator — polished + on-brand, but lightweight.
//
// Uses jsPDF vector drawing (NOT a page screenshot) so the file stays small and,
// crucially, every "Book now" is a REAL clickable link annotation — the affiliate
// tracking survives the download. A canvas/html2pdf approach would rasterize the
// page and kill the links, breaking monetization.

import { jsPDF } from "jspdf";
import type { Insight, ItineraryItem, Trip } from "@/lib/trip/types";

const NAVY: [number, number, number] = [6, 45, 42];
const TEAL: [number, number, number] = [20, 184, 166];
const GOLD: [number, number, number] = [181, 138, 58];
const INK: [number, number, number] = [40, 56, 52];
const MUTED: [number, number, number] = [120, 130, 126];
const CREAM: [number, number, number] = [251, 242, 221];
const HAIRLINE: [number, number, number] = [230, 223, 208];

const PARTNER_NAME: Record<string, string> = {
  viator: "Viator",
  getyourguide: "GetYourGuide",
  klook: "Klook",
  booking: "Booking.com",
  "12go": "12Go",
  airalo: "Airalo",
  welcomepickups: "Welcome Pickups",
};
const PARTNER_RGB: Record<string, [number, number, number]> = {
  viator: [31, 158, 135],
  getyourguide: [224, 83, 58],
  klook: [239, 122, 35],
  booking: [27, 58, 160],
  "12go": [193, 138, 20],
  airalo: [216, 50, 110],
  welcomepickups: [22, 163, 74],
};

// jsPDF built-in fonts are Latin-1 only — replace/strip what they can't render.
function t(s: string): string {
  return (s ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/°/g, " deg")
    .replace(/[★☆✔✓]/g, "")
    .replace(/[^ -ÿ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function downloadItineraryPdf(trip: Trip, added: Set<string>, insights: Insight[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;
  let y = 0;

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Wrapped paragraph helper.
  const para = (
    text: string,
    opts: {
      size: number;
      style?: "normal" | "bold";
      color?: [number, number, number];
      gap?: number;
      x?: number;
      maxW?: number;
    },
  ) => {
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(opts.size);
    doc.setTextColor(...(opts.color ?? INK));
    const x = opts.x ?? margin;
    const lines = doc.splitTextToSize(t(text), opts.maxW ?? contentW) as string[];
    for (const line of lines) {
      ensure(opts.size + 4);
      doc.text(line, x, y);
      y += opts.size + 4;
    }
    y += opts.gap ?? 0;
  };

  /* ----------------------------- header band ----------------------------- */
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 96, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(94, 234, 212);
  doc.text("EXPLOREINDONESIA.AI", margin, 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(t(trip.title), contentW) as string[];
  let ty = 56;
  for (const line of titleLines.slice(0, 2)) {
    doc.text(line, margin, ty);
    ty += 22;
  }
  y = 116;

  para(trip.summary, { size: 9.5, color: MUTED, gap: 6 });

  // Stat line
  const bookable = trip.items.filter((i) => i.type === "bookable" && !i.suggested).length;
  const recommended = trip.items.filter((i) => i.suggested).length;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...TEAL);
  ensure(16);
  doc.text(
    t(
      `${trip.days} days   |   ${bookable} bookable   |   ${recommended} recommended   |   ${insights.length} local insights`,
    ),
    margin,
    y,
  );
  y += 18;

  /* -------------------------------- days --------------------------------- */
  const byDay = new Map<number, ItineraryItem[]>();
  for (const item of trip.items) byDay.set(item.day, [...(byDay.get(item.day) ?? []), item]);

  for (const day of [...byDay.keys()].sort((a, b) => a - b)) {
    const items = byDay.get(day)!;
    ensure(40);
    // Day chip
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y - 11, 52, 18, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`DAY ${day}`, margin + 8, y + 1.5);
    doc.setTextColor(...NAVY);
    doc.setFontSize(12);
    doc.text(t(items[0]?.location ?? `Day ${day}`), margin + 64, y + 2);
    y += 16;
    doc.setDrawColor(...HAIRLINE);
    doc.line(margin, y, pageW - margin, y);
    y += 14;

    for (const item of items) {
      const idx = items.indexOf(item);
      const isAdded = added.has(`${day}-${idx}`);
      const slot = item.time ? `${item.time}  -  ` : "";
      const rec = item.suggested ? "[Recommended]  " : "";
      const check = isAdded ? "[Added]  " : "";
      ensure(30);
      para(`${check}${rec}${slot}${item.title}`, {
        size: 10.5,
        style: "bold",
        color: NAVY,
        gap: 1,
      });
      para(item.description, { size: 9, color: MUTED, gap: 1 });
      para(item.location, { size: 8, color: MUTED, gap: 3 });

      if (item.matchStatus === "matched" && item.deepLink) {
        // Partner-colored "Book now" button with a real clickable link.
        const rgb = item.partner ? (PARTNER_RGB[item.partner] ?? TEAL) : TEAL;
        const name = item.partner ? (PARTNER_NAME[item.partner] ?? item.partner) : "partner";
        const price =
          item.price !== undefined ? `  from ${item.currency ?? "USD"} ${item.price}` : "";
        const verb = item.category === "esim" ? "Buy" : "Book"; // eSIM is bought
        const label = t(`${verb} now on ${name}${price}`);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        const w = Math.min(doc.getTextWidth(label) + 22, contentW);
        const h = 18;
        ensure(h + 6);
        doc.setFillColor(...rgb);
        doc.roundedRect(margin, y - 2, w, h, 9, 9, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(label, margin + 11, y + 10);
        // Clickable area over the whole button.
        doc.link(margin, y - 2, w, h, { url: item.deepLink });
        y += h + 8;
      } else if (item.type === "bookable" && item.noMatchReason) {
        para(item.noMatchReason, { size: 8, color: [160, 160, 160], gap: 6 });
      } else {
        y += 6;
      }
    }

    // Local insights for the day — gold-tinted box.
    for (const ins of insights.filter((i) => i.day === day)) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const head = t(`Local insight - ${ins.destination}`);
      const body = doc.splitTextToSize(t(ins.tip), contentW - 20) as string[];
      const boxH = 16 + body.length * 11 + 8;
      ensure(boxH + 6);
      doc.setFillColor(...CREAM);
      doc.roundedRect(margin, y - 2, contentW, boxH, 5, 5, "F");
      doc.setTextColor(...GOLD);
      doc.text(head, margin + 10, y + 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...INK);
      let iy = y + 24;
      for (const line of body) {
        doc.text(line, margin + 10, iy);
        iy += 11;
      }
      y += boxH + 8;
    }
    y += 6;
  }

  ensure(18);
  doc.setDrawColor(...HAIRLINE);
  doc.line(margin, y, pageW - margin, y);
  y += 12;
  para("Built with exploreindonesia.ai  -  prices are live at time of booking.", {
    size: 8,
    color: MUTED,
  });

  doc.save("exploreindonesia-itinerary.pdf");
}
