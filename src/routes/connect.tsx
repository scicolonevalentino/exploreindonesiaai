import { type ReactNode, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { JsonLd } from "@/components/JsonLd";
import { OpenAIIcon, ClaudeIcon } from "@/components/BrandIcons";
import { setCdnCache } from "@/lib/cdn-cache";
import { trackEvent } from "@/lib/analytics-events";

const MCP_URL = "https://exploreindonesia.ai/api/mcp";

const TITLE = "Connect ExploreIndonesia to ChatGPT & Claude (MCP Connector)";
const DESCRIPTION =
  "Plan Indonesia trips inside ChatGPT or Claude and get real, bookable itinerary links back. Add the ExploreIndonesia MCP connector in a couple of clicks. Here's how.";
const URL = "https://exploreindonesia.ai/connect";

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "What is the ExploreIndonesia connector?",
    answer:
      "It is a remote MCP (Model Context Protocol) server that lets AI assistants like Claude and ChatGPT search our curated Indonesia itineraries and return real, bookable links for stays, tours, transfers and eSIMs, directly inside your chat.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. Connecting and using the tools is free. Some links we return are affiliate links to our travel partners, which is how the project is funded, and you never pay more.",
  },
  {
    question: "Does it work with ChatGPT?",
    answer:
      "The connector follows the open MCP standard that both Claude and ChatGPT support. ChatGPT's remote-connector support is rolling out via developer mode; if you don't see the option yet, use Claude in the meantime.",
  },
  {
    question: "What data can it see?",
    answer:
      "Only the public, read-only trip content on exploreindonesia.ai. The tools cannot change anything, read your files, or access your account. Sign-in exists only to authorize the connection.",
  },
];

export const Route = createFileRoute("/connect")({
  loader: async () => {
    await setCdnCache();
    return null;
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ConnectPage,
});

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function CopyUrl() {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="flex items-center gap-2 rounded-xl border p-2 pl-4"
      style={{ backgroundColor: "#fff", borderColor: "var(--border-cream)" }}
    >
      <code
        className="flex-1 overflow-x-auto whitespace-nowrap text-sm sm:text-base"
        style={{ color: "var(--navy-deep)" }}
      >
        {MCP_URL}
      </code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(MCP_URL);
          setCopied(true);
          trackEvent("connect_url_copy");
          window.setTimeout(() => setCopied(false), 1800);
        }}
        className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: "var(--blue-bright)" }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: "var(--navy-deep)" }}
      >
        {n}
      </span>
      <div className="pt-1">
        <p className="font-semibold" style={{ color: "var(--navy-deep)" }}>
          {title}
        </p>
        <div className="mt-1 text-sm sm:text-base leading-relaxed" style={{ color: "var(--slate-muted)" }}>
          {children}
        </div>
      </div>
    </li>
  );
}

function GuideCard({
  icon,
  name,
  badge,
  children,
}: {
  icon: ReactNode;
  name: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border p-6 sm:p-8"
      style={{ backgroundColor: "#fff", borderColor: "var(--border-cream)" }}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: "var(--navy-deep)", color: "#fff" }}
        >
          {icon}
        </span>
        <h2 className="font-serif text-xl sm:text-2xl font-semibold" style={{ color: "var(--navy-deep)" }}>
          {name}
        </h2>
        {badge && (
          <span
            className="ml-auto rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: "var(--cream)", color: "var(--slate-muted)" }}
          >
            {badge}
          </span>
        )}
      </div>
      <ol className="space-y-5">{children}</ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function ConnectPage() {
  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://exploreindonesia.ai" },
      { "@type": "ListItem", position: 2, name: "Connect", item: URL },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <JsonLd data={faqLD} />
      <JsonLd data={breadcrumbLD} />

      {/* Header */}
      <header
        className="w-full px-6 py-12 sm:py-16"
        style={{ background: "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy-mid) 100%)" }}
      >
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="text-sm text-white/70 hover:text-white">
            &larr; exploreindonesia.ai
          </Link>
          <p
            className="mt-4 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--blue-soft)" }}
          >
            Plan anywhere
          </p>
          <h1 className="mt-2 font-serif text-white text-4xl sm:text-5xl font-semibold leading-tight">
            Use ExploreIndonesia inside ChatGPT and Claude
          </h1>
          <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed">
            Add our connector once, then plan any Indonesia trip in the assistant you already use, and
            get real, bookable stays, tours, transfers and eSIMs back, not just suggestions.
          </p>
          <div className="mt-6 flex items-center gap-4 text-white/80">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
              <OpenAIIcon className="h-4 w-4" /> ChatGPT
            </span>
            <span className="text-white/40">·</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
              <ClaudeIcon className="h-4 w-4" /> Claude
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Connector URL */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--navy-deep)" }}>
            The connector URL
          </h2>
          <p className="mb-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--slate-muted)" }}>
            You'll paste this remote MCP server URL into ChatGPT or Claude. Copy it, then follow the
            steps below for your assistant.
          </p>
          <CopyUrl />
        </section>

        {/* Enable-all-tools note: the affiliate deep links only appear when the
            two booking tools can run, so tell people to leave every tool ON. */}
        <section
          className="mb-12 rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor: "#fff",
            borderColor: "var(--border-cream)",
            borderLeft: "4px solid var(--gold-warm)",
          }}
        >
          <h2 className="font-serif text-lg sm:text-xl font-semibold mb-2" style={{ color: "var(--navy-deep)" }}>
            Turn on all three tools
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--slate-muted)" }}>
            When you add the connector, keep <strong>every tool enabled</strong>. The booking links
            only appear when the assistant is allowed to run all three: one finds the trip, the other
            two turn it into real, bookable links.
          </p>
          <ul className="mt-4 space-y-2 text-sm sm:text-base" style={{ color: "var(--slate-muted)" }}>
            <li>
              <strong style={{ color: "var(--navy-deep)" }}>Search Indonesia itineraries</strong>:
              finds curated trips that match your plan.
            </li>
            <li>
              <strong style={{ color: "var(--navy-deep)" }}>Make an itinerary bookable</strong>:
              turns a whole plan into bookable stays, tours, transfers and eSIMs.
            </li>
            <li>
              <strong style={{ color: "var(--navy-deep)" }}>Get booking links for an activity</strong>:{" "}
              pulls the booking link for a single item.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--slate-muted)" }}>
            If your assistant asks whether to allow a tool, choose <strong>Allow</strong> (or “always
            allow”) so it doesn't stop halfway.
          </p>
        </section>

        {/* Claude guide */}
        <div className="space-y-8">
          <GuideCard icon={<ClaudeIcon className="h-5 w-5" />} name="Add it in Claude">
            <Step n={1} title="Open Connectors settings">
              In Claude (claude.ai or the desktop app), go to <strong>Settings → Connectors</strong>.
            </Step>
            <Step n={2} title="Add a custom connector">
              Click <strong>Add custom connector</strong>, then paste the URL:{" "}
              <code style={{ color: "var(--navy-deep)" }}>{MCP_URL}</code>
            </Step>
            <Step n={3} title="Sign in to authorize">
              Approve the connection and sign in with the 6-digit email code when prompted. This only
              authorizes access to public trip content.
            </Step>
            <Step n={4} title="Enable all three tools">
              Make sure all three tools are switched on (<strong>Search Indonesia itineraries</strong>,{" "}
              <strong>Make an itinerary bookable</strong> and{" "}
              <strong>Get booking links for an activity</strong>), so the booking links actually
              appear.
            </Step>
            <Step n={5} title="Start planning">
              In any chat, ask something like <em>"Plan 10 days in Bali and Komodo in July"</em> and
              Claude will pull real itineraries and booking links from ExploreIndonesia.
            </Step>
          </GuideCard>

          {/* ChatGPT guide */}
          <GuideCard
            icon={<OpenAIIcon className="h-5 w-5" />}
            name="Add it in ChatGPT"
            badge="Rolling out"
          >
            <Step n={1} title="Enable developer mode / connectors">
              In ChatGPT, open <strong>Settings → Connectors</strong> (available on paid plans; some
              features require enabling developer mode).
            </Step>
            <Step n={2} title="Add the MCP server">
              Choose <strong>Add / Create connector</strong> and paste the URL:{" "}
              <code style={{ color: "var(--navy-deep)" }}>{MCP_URL}</code>
            </Step>
            <Step n={3} title="Authorize">
              Complete the sign-in prompt to authorize the read-only connection.
            </Step>
            <Step n={4} title="Enable all three tools">
              In the connector settings, make sure all three tools are on (
              <strong>Search Indonesia itineraries</strong>,{" "}
              <strong>Make an itinerary bookable</strong> and{" "}
              <strong>Get booking links for an activity</strong>), so the booking links appear.
            </Step>
            <Step n={5} title="Ask away">
              Turn the connector on in a chat and ask ChatGPT to plan or refine an Indonesia trip.
            </Step>
          </GuideCard>
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-6" style={{ color: "var(--navy-deep)" }}>
            Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.question}>
                <p className="font-semibold" style={{ color: "var(--navy-deep)" }}>
                  {f.question}
                </p>
                <p className="mt-1 text-sm sm:text-base leading-relaxed" style={{ color: "var(--slate-muted)" }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-16 text-center">
          <p className="text-sm sm:text-base" style={{ color: "var(--slate-muted)" }}>
            Prefer to plan right here?{" "}
            <Link
              to="/"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--teal-link)" }}
            >
              Use the trip builder on the homepage
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
