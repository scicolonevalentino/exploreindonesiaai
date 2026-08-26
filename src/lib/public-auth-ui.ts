// TEMPORARY kill-switch for the PUBLIC login UI.
//
// While the site runs affiliate-only and the Supabase project is paused to cut
// compute cost, every *visible* invitation to log in / sign up is hidden. This
// is a UI-only change and is fully reversible: flip this constant back to true.
//
// Deliberately NOT touched (so nothing is lost):
//   - Supabase Auth, the users, the database, RLS
//   - the /login, /auth/callback and /account routes (still reachable by URL)
//   - AuthStatus / AuthSaveModal / useUser and the whole src/lib/supabase layer
//
// While this is false the trip builder must FAIL OPEN: no signup wall on the
// daily cap and no auth gate in front of the PDF download, otherwise a paused
// Auth backend would leave visitors at a dead end on the affiliate money path.
export const PUBLIC_AUTH_UI = false;
