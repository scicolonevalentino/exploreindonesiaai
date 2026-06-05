// Renders a JSON-LD <script> in the React tree (not via route head()).
//
// Why not head(): TanStack Start emits head() meta/scripts on the server AND
// again on client hydration, and React 19 does not reconcile
// <script type="application/ld+json"> the way it does <title>/<meta>, so head()
// JSON-LD ends up duplicated in the live DOM. Rendered here in the component
// tree, React hydrates the existing server-rendered node in place — exactly one
// copy. Search engines and AI crawlers read JSON-LD anywhere in the document.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
