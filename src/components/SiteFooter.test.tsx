import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock Sanity client so the component doesn't make real network calls
vi.mock("@/lib/sanity", () => ({
  sanityClient: {
    fetch: vi.fn().mockResolvedValue({
      siteTitle: "ExploreIndonesia.ai",
      tagline: "Plan your Indonesia trip. Book it in minutes.",
      footerText: "© 2026 ExploreIndonesia.ai · Affiliate disclosure.",
      defaultMetaDescription: "Test description",
    }),
  },
}));

// Mock server functions (they use TanStack Start runtime not available in tests)
vi.mock("@tanstack/react-start", () => ({
  useServerFn: () => vi.fn(),
}));
vi.mock("@/lib/waitlist.functions", () => ({ joinWaitlist: vi.fn() }));
vi.mock("@/lib/contact.functions", () => ({ sendContactMessage: vi.fn() }));

// SiteFooter reads the current path via useRouterState; there's no Router context
// in this test, so stub it to a content page (/trips) where the waitlist shows.
vi.mock("@tanstack/react-router", () => ({
  useRouterState: (opts?: { select?: (s: { location: { pathname: string } }) => unknown }) => {
    const state = { location: { pathname: "/trips" } };
    return opts?.select ? opts.select(state) : state;
  },
}));

import { SiteFooter } from "./SiteFooter";

function renderWithClient(ui: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("SiteFooter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the waitlist email-capture block", () => {
    renderWithClient(<SiteFooter />);
    // The CTA is styled like a heading but rendered as a <p> (kept out of the
    // article heading outline), so match its text rather than a heading role.
    expect(screen.getByText(/be the first to book your/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your best email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get early access/i })).toBeInTheDocument();
  });

  it("renders the contact/support button", () => {
    renderWithClient(<SiteFooter />);
    expect(screen.getByRole("button", { name: /^contact$/i })).toBeInTheDocument();
  });

  it("uses footerText from Sanity siteSettings when available", async () => {
    renderWithClient(<SiteFooter />);
    expect(await screen.findByText(/affiliate disclosure/i)).toBeInTheDocument();
  });

  it("renders the tagline from Sanity siteSettings", async () => {
    renderWithClient(<SiteFooter />);
    expect(
      await screen.findByText(/plan your indonesia trip\. book it in minutes/i),
    ).toBeInTheDocument();
  });
});
