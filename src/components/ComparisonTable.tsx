// Comparison table block for Portable Text bodies.
//
// Comparative content ("A vs B", seasons, transport options) is the format AI
// answer engines cite most, and until now the body could only express it as
// prose. Shared by the itinerary renderer and the guide renderer so both get the
// same markup and styling.
//
// Sanity shape (schemaless, written via the API like the rest of the content):
//   { _type: "comparisonTable", _key, caption?, columns: string[],
//     rows: [{ _key, cells: string[] }] }
//
// Rows are rendered as a real <table> with scoped headers so the semantics
// survive into the SSR HTML, which is what gets parsed and quoted. The wrapper
// scrolls on its own, so a wide table never makes the page scroll sideways.

export type ComparisonTableValue = {
  _type?: string;
  caption?: string;
  columns?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
};

export function ComparisonTable({ value }: { value?: ComparisonTableValue }) {
  const columns = value?.columns ?? [];
  const rows = (value?.rows ?? []).filter((r) => (r?.cells ?? []).length > 0);
  if (columns.length === 0 || rows.length === 0) return null;

  return (
    <figure className="my-8">
      <div
        className="overflow-x-auto rounded-xl border"
        style={{ borderColor: "var(--border-cream)" }}
      >
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr style={{ backgroundColor: "var(--cream)" }}>
              {columns.map((c, i) => (
                <th
                  key={i}
                  scope="col"
                  className="text-left font-semibold px-4 py-3 align-top whitespace-nowrap"
                  style={{ color: "var(--navy-deep)" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr
                key={r._key ?? ri}
                className="border-t"
                style={{ borderColor: "var(--border-cream)" }}
              >
                {columns.map((_, ci) => {
                  const text = r.cells?.[ci] ?? "";
                  // First column reads as the row's label, so mark it up as one.
                  return ci === 0 ? (
                    <th
                      key={ci}
                      scope="row"
                      className="text-left font-semibold px-4 py-3 align-top"
                      style={{ color: "var(--navy-deep)" }}
                    >
                      {text}
                    </th>
                  ) : (
                    <td
                      key={ci}
                      className="px-4 py-3 align-top leading-relaxed"
                      style={{ color: "var(--text-dark)" }}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value?.caption && (
        <figcaption className="mt-3 text-sm italic" style={{ color: "var(--slate-muted)" }}>
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
