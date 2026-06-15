import { cn } from "@/lib/utils";

// Shared brand lockup: Komo mascot + "exploreindonesia.ai" wordmark (the ".ai"
// in ice blue). Used in the homepage header and the footer so they never drift.
// Pass `className` to override the text size for a given context.
export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-sans font-bold tracking-tight",
        className ?? "text-base sm:text-lg",
      )}
    >
      <img
        src="/komo-mascot.png"
        alt="Komo, the Explore Indonesia mascot"
        width={128}
        height={128}
        decoding="async"
        className="h-9 w-9 sm:h-10 sm:w-10 object-contain -translate-y-1"
      />
      <span>
        <span className="text-white">exploreindonesia</span>
        <span style={{ color: "var(--blue-ice)" }}>.ai</span>
      </span>
    </div>
  );
}
