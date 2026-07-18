// Free-tier daily generation caps.
//
// The two caps are deliberately asymmetric so that creating an account BUYS more
// planning, not less — signing in is the primary conversion goal:
//   - Signed-out visitors get a low cap; hitting it opens the signup wall.
//   - Signed-in users get a higher cap; hitting THAT surfaces the Pro-demand
//     probe (a sensor, not a hard paywall).
// Both caps are checked client-side and fail open (a determined user can bypass
// them) — we only want the signal, not a lock. One number each, one place.
export const ANON_GENERATION_LIMIT = 2;
export const DAILY_GENERATION_LIMIT = 5;
