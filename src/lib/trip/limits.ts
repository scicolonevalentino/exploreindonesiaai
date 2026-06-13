// Free-tier daily generation cap for SIGNED-IN users.
//
// This is a Pro-demand SENSOR, not a paywall: signed-out generation stays
// unlimited, and the cap is checked client-side (a determined user can bypass
// it — that's fine, we only want to learn who *wants* more). Start high so
// normal single-trip planners (who easily make 4-5 variations of one trip)
// don't hit it; tune DOWN toward the heavy-user tail once the `generations`
// table shows the real per-user/day distribution. One number, one place.
export const DAILY_GENERATION_LIMIT = 5;
