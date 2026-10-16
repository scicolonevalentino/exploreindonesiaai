import { QueryClient, dehydrate, hydrate, type DehydratedState } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// The dehydrated query cache is plain JSON at runtime (Sanity documents), but
// its TYPE is full of `unknown` (queryKey, state.data), which the router's
// serializable-input check rejects. Registering it through the router's own
// extension point tells that check the payload is fine, with no casts.
declare module "@tanstack/router-core" {
  interface SerializableExtensions {
    DehydratedQueryState: DehydratedState;
  }
}

// Carry the React Query cache across the SSR boundary.
//
// WHY: route loaders warm the cache with `queryClient.ensureQueryData(...)` and
// the components then read it back with `useQuery` / `useSuspenseQuery` (site
// settings in SiteFooter, the article lists on /, /trips and /destinations/*,
// the article + related lookups on /trips/$slug). The router dehydrates LOADER
// DATA on its own, but the query cache is a separate store: without this the
// client started with an EMPTY cache, so the first client render of those
// components saw `data: undefined` while the server HTML had the real content.
// React threw hydration error #418 ("server rendered text didn't match") on
// every page — the footer line is in the shell, so every route was affected —
// then discarded the server markup for that subtree and re-rendered it on the
// client, which delays interactivity and re-fetches Sanity from the browser for
// data that was already in the HTML.
//
// `hydrate` runs inside the router's own hydration, which StartClient awaits
// BEFORE React hydrates the DOM, so the cache is populated in time for the
// first render. `dehydrate()` only serializes successful queries by default, so
// nothing pending or errored is shipped.
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    dehydrate: () => ({ queryState: dehydrate(queryClient) }),
    hydrate: ({ queryState }) => {
      hydrate(queryClient, queryState);
    },
  });

  return router;
};
