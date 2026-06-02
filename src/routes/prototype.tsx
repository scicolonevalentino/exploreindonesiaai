import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { FeedbackDialog } from "@/components/FeedbackDialog";

export const Route = createFileRoute("/prototype")({
  head: () => ({
    meta: [
      { title: "Interactive Prototype — exploreindonesia.ai" },
      {
        name: "description",
        content:
          "Try the exploreindonesia.ai interactive prototype: paste an Indonesia itinerary and see how we turn it into a bookable, day-by-day trip.",
      },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: "exploreindonesia.ai — interactive prototype" },
      {
        property: "og:description",
        content: "Try the prototype and send us feedback.",
      },
    ],
  }),
  component: PrototypePage,
});

function PrototypePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9f5" }}>
      {/* Hello bar — feedback CTA wired to the same contact backend as the footer */}
      <div
        role="region"
        aria-label="Prototype feedback bar"
        className="sticky top-0 z-50 w-full text-white text-xs sm:text-sm"
        style={{
          backgroundColor: "var(--blue-bright)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 1px 12px rgba(20,184,166,0.35)",
        }}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-medium text-white/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1"
            aria-label="Back to homepage"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Back to site</span>
          </Link>

          <p className="text-center leading-snug font-medium flex-1 px-2">
            <span className="hidden sm:inline">
              You're trying the prototype. Tell us what you think.{" "}
            </span>
            <span className="sm:hidden">Prototype — share your thoughts.</span>
          </p>

          <FeedbackDialog
            trigger={
              <button
                type="button"
                aria-label="Give us feedback on the prototype"
                className="inline-flex items-center gap-1.5 font-bold text-white bg-white/15 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white transition-colors px-3 py-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--blue-bright)] whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Give us feedback</span>
              </button>
            }
            title="Feedback on the prototype"
            description="What worked, what didn't, what's missing? It goes straight to the founder."
          />
        </div>
      </div>

      {/* The standalone prototype is served as a static asset from /public */}
      <iframe
        title="exploreindonesia.ai interactive prototype"
        src="/prototype.html"
        className="flex-1 w-full border-0"
        style={{ minHeight: "calc(100vh - 44px)" }}
      />
    </div>
  );
}
