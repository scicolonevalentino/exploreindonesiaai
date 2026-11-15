import { createFileRoute } from "@tanstack/react-router";
import { BrowseByDestination, Hero, HowItWorks, Inspiration, Trust } from "./index";
import { P1Page } from "./p1";

// Hidden preview page: the real homepage layout, but with the LIVE trip builder
// embedded in the "try it" slot where the public homepage shows the illustrative
// demo. The route is reachable in production (it answers 200) but is noindex and
// not linked from anywhere, so it only serves as a way to see the real P1 product
// running inside the real homepage context.
export const Route = createFileRoute("/p1-home")({
  head: () => ({
    meta: [
      { title: "exploreindonesia.ai, preview (real builder)" },
      {
        name: "description",
        content: "Internal preview: the homepage with the live AI trip builder embedded.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "https://exploreindonesia.ai/p1-home" }],
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
