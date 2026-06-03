// Build a clean, short title from a full article title.
//
// Rules, applied in order:
// 1. Strip trailing parenthetical / bracketed asides like "(Borobudur, Bromo & Ijen)"
//    or "[Featured]" — even if multiple stacked at the end.
// 2. Cut at the first major separator: ":", em dash, en dash, " | ", " / ", " - ".
// 3. Strip dangling connectors so we never end on "and", "or", "with",
//    "featuring", "&", or a trailing comma/semicolon.
export function shortTitle(title: string | undefined | null): string {
  if (!title) return "";
  let t = title.trim();

  // 1. Strip trailing parens / brackets / braces, repeatedly.
  // Handles "Title (a) [b]" → "Title".
  const trailingBracketRe = /\s*[\(\[\{][^\)\]\}]*[\)\]\}]\s*$/;
  while (trailingBracketRe.test(t)) {
    t = t.replace(trailingBracketRe, "").trim();
  }

  // 2. Cut at the first major separator.
  const separators = [":", " — ", " – ", " | ", " / ", " - "];
  for (const s of separators) {
    const i = t.indexOf(s);
    if (i > 0) {
      t = t.slice(0, i).trim();
      break;
    }
  }

  // 3. Strip dangling connectors, repeatedly to handle stacks like "Java, and".
  const danglingRe = /[\s,;:\-–—]+(?:and|or|with|featuring|feat\.?|incl(?:uding)?|plus|&)\s*$/i;
  let prev: string;
  do {
    prev = t;
    t = t.replace(danglingRe, "").trim();
  } while (t !== prev);
  t = t.replace(/[,;:\-–—\s]+$/g, "").trim();

  return t;
}
