// Client-side itinerary PDF generator. Uses jsPDF with real link annotations
// (textWithLink) so every "Book now" stays CLICKABLE in the PDF — the affiliate
// tracking survives the download. (A canvas/html2pdf approach would rasterize
// the page and kill the links, which would break monetization.)

import { jsPDF } from "jspdf";
import type { Insight, ItineraryItem, Trip } from "@/lib/trip/types";

const PARTNER_NAME: Record<string, string> = {
  viator: "Viator",
  getyourguide: "GetYourGuide",
  klook: "Klook",
  booking: "Booking.com",
  "12go": "12Go",
  airalo: "Airalo",
  welcomepickups: "Welcome Pickups",
};

// jsPDF's built-in fonts are Latin-1 only — strip/replace anything they can't
// render (em dashes, curly quotes, arrows, emoji, stars) so text stays clean.
function t(s: string): string {
  return (
    (s ?? "")
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/→/g, "->")
      .replace(/°/g, " deg")
      .replace(/[★☆✔✓]/g, "")
      // Drop anything outside printable Latin-1 (emoji, non-Latin scripts).
      .replace(/[^ -ÿ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function downloadItineraryPdf(trip: Trip, added: Set<string>, insights: Insight[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const para = (
    text: string,
    opts: {
      size: number;
      style?: "normal" | "bold";
      color?: [number, number, number];
      gap?: number;
    },
  ) => {
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(opts.size);
    doc.setTextColor(...(opts.color ?? [6, 45, 42]));
    const lines = doc.splitTextToSize(t(text), contentW) as string[];
    for (const line of lines) {
      ensure(opts.size + 4);
      doc.text(line, margin, y);
      y += opts.size + 4;
    }
    y += opts.gap ?? 0;
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 118, 110);
  ensure(14);
  doc.text("EXPLOREINDONESIA.AI  -  YOUR TRIP", margin, y);
  y += 18;
  para(trip.title, { size: 20, style: "bold", gap: 4 });
  para(trip.summary, { size: 9.5, color: [91, 107, 102], gap: 10 });

  // Group items by day
  const byDay = new Map<number, ItineraryItem[]>();
  for (const item of trip.items) byDay.set(item.day, [...(byDay.get(item.day) ?? []), item]);

  for (const day of [...byDay.keys()].sort((a, b) => a - b)) {
    ensure(36);
    doc.setDrawColor(230, 223, 208);
    doc.line(margin, y, pageW - margin, y);
    y += 16;
    para(`Day ${day}`, { size: 14, style: "bold", gap: 4 });

    for (const item of byDay.get(day)!) {
      const key = `${day}-${byDay.get(day)!.indexOf(item)}`;
      const star = added.has(key) ? "* " : "";
      const slot = item.time ? `${item.time} - ` : "";
      const rec = item.suggested ? "[Recommended] " : "";
      ensure(28);
      para(`${star}${rec}${slot}${item.title}`, { size: 10.5, style: "bold", gap: 1 });
      para(item.description, { size: 9, color: [91, 107, 102], gap: 1 });
      para(`Location: ${item.location}`, { size: 8, color: [120, 130, 126], gap: 2 });

      // Clickable booking link (the conversion — must survive in the PDF).
      if (item.matchStatus === "matched" && item.deepLink) {
        const partner = item.partner ? (PARTNER_NAME[item.partner] ?? item.partner) : "partner";
        const price =
          item.price !== undefined ? `  (from ${item.currency ?? "USD"} ${item.price})` : "";
        const label = t(`>> Book now on ${partner}${price}`);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 118, 110);
        ensure(16);
        doc.textWithLink(label, margin, y, { url: item.deepLink });
        y += 16;
      } else if (item.type === "bookable" && item.noMatchReason) {
        para(item.noMatchReason, { size: 8, color: [150, 150, 150], gap: 2 });
      } else {
        y += 4;
      }
    }

    // Local insights for this day
    for (const ins of insights.filter((i) => i.day === day)) {
      ensure(20);
      para(`Local insight - ${ins.destination}: ${ins.tip}`, {
        size: 8.5,
        color: [150, 110, 40],
        gap: 4,
      });
    }
    y += 6;
  }

  ensure(20);
  para(
    "*  = added to your trip   |   Built with exploreindonesia.ai - prices are live at time of booking.",
    { size: 8, color: [120, 130, 126] },
  );

  doc.save("exploreindonesia-itinerary.pdf");
}
