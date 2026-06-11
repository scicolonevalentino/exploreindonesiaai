import { createFileRoute } from "@tanstack/react-router";
import { BrowseByDestination, Hero, HowItWorks, Inspiration, Trust } from "./index";
import { P1Page } from "./p1";

// Hidden preview page: the real homepage layout, but with the LIVE trip builder
// embedded in the "try it" slot where the public homepage shows the illustrative
// demo. noindex + preview-branch only (never production) — lets us see the real
// P1 product running inside the real homepage context for the first time.
export const Route = createFileRoute("/p1-home")({
  head: () => ({
    meta: [
      { title: "exploreindonesia.ai — preview (real builder)" },
      {
        name: "description",
        content: "Internal preview: the homepage with the live AI trip builder embedded.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: P1HomePreview,
});

function P1HomePreview() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      {/* The real trip builder, in place of the demo (EmbeddedPrototype). */}
      <section id="try-it" className="w-full scroll-mt-14" style={{ backgroundColor: "#faf9f5" }}>
        <P1Page embedded />
      </section>
      <Trust />
      <Inspiration />
      <BrowseByDestination />
    </main>
  );
}
