// Kill-switch for the PUBLIC login UI.
//
// Flipping this to false hides every *visible* invitation to log in or sign up
// (the HelloBar account nav, the footer "My account" link, the /p1 AuthStatus
// chip) and makes the two auth GATES fail open — no signup wall on the daily
// generation cap, and "Save & Download" hands a signed-out visitor the PDF
// directly instead of opening AuthSaveModal. That combination is what lets the
// site run affiliate-only with the Supabase project paused, without leaving
// visitors at a dead end on the page that produces the affiliate clicks.
//
// It is UI-only in both positions: Supabase Auth, the users, the database, RLS
// and the /login, /auth/callback and /account routes are never touched.
//
// History: switched off on 2026-08-26 while the Supabase project was moved to a
// Free org and paused; switched back on the same day once the project was
// resumed, because the MCP connector's OAuth delegates to the Supabase email
// OTP login and must stay reachable.
export const PUBLIC_AUTH_UI = true;
