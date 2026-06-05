# Sanity schema additions (for review)

These are the **content-model changes** that pair with the code already on the
`geo-seo-foundations` branch. The website code reads all of these as **optional**
— so you can add the fields now and the site keeps working unchanged until you
start filling them in. Nothing here is applied to your Sanity project yet; this
is for you to review and add in your Studio.

Project: `u4ah1ore` · dataset `production`. (The Studio schema lives in your
Sanity Studio project, not in this website repo, so paste these there.)

---

## 1. `faq` — array of Q&A on the `article` document

Powers the on-page FAQ accordion **and** the `FAQPage` JSON-LD (the single
biggest GEO win). Add this field to your `article` schema.

```ts
// inside the `article` document's fields: []
defineField({
  name: "faq",
  title: "FAQ",
  description:
    "5–8 natural-language questions a traveller would ask about this trip. " +
    "Powers the on-page FAQ and FAQPage structured data. Keep answers " +
    "self-contained (40–60 words) and lead with the direct answer.",
  type: "array",
  of: [
    defineArrayMember({
      type: "object",
      name: "faqItem",
      fields: [
        defineField({
          name: "question",
          type: "string",
          validation: (r) => r.required().max(120),
        }),
        defineField({
          name: "answer",
          type: "text",
          rows: 3,
          validation: (r) => r.required().max(600),
        }),
      ],
      preview: { select: { title: "question" } },
    }),
  ],
  validation: (r) => r.max(8),
}),
```

> The website renders `answer` as plain text. If you later want links/bold
> inside answers, change `type: "text"` to a small Portable Text `array` and
> tell me — I'll update the renderer and the JSON-LD to flatten it to text.

---

## 2. `author` — named human author (E-E-A-T)

AI engines and Google reward demonstrable human expertise. Create an `author`
**document type**, then reference it from `article`. The website emits
`author` as `Person` in the Article schema and shows a "By {name}, {role}"
byline when set; until then it falls back to the Organization (no breakage).

```ts
// New document type: author.ts
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "role",
      title: "Role / credential",
      type: "string",
      description: 'e.g. "Indonesia travel specialist" — shown in the byline and as jobTitle.',
    }),
    defineField({ name: "bio", type: "text", rows: 4 }),
    defineField({
      name: "image",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string" })],
    }),
    defineField({
      name: "sameAs",
      title: "Profile links (sameAs)",
      description: "LinkedIn, X, Instagram, personal site — strengthens the entity.",
      type: "array",
      of: [{ type: "url" }],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
```

```ts
// Add to the `article` document's fields: []
defineField({
  name: "author",
  title: "Author",
  type: "reference",
  to: [{ type: "author" }],
}),
```

> Decision for you: who is the named author? It should be a real person who can
> stand behind the content (you, a team member, or a contributing travel writer
> with a genuine bio). **Don't invent a fake persona** — that backfires on
> E-E-A-T. One author across all 20 trips is fine to start.

---

## 3. `practicalInfo.visa` — fill the site-wide visa gap

No page currently covers "do I need a visa for Indonesia," which is a top
traveller/AI query. Add a `visa` field to your existing `practicalInfo` object.

```ts
// inside the practicalInfo object's fields: []
defineField({
  name: "visa",
  title: "Visa & entry",
  type: "text",
  rows: 3,
  description:
    "Visa-on-arrival / e-VOA rules, cost, validity and extension. " +
    "Cite the official source (immigration.go.id) in the body where possible.",
}),
```

The website already renders any populated `practicalInfo` rows, so once you add
this field and fill it, a "Visa & entry" row appears in the Practical info box
automatically. (The code change to label it is on the branch.)

---

## 4. Optional, recommended next: `sources`

To capture the +40% GEO "cite sources" lever cleanly, consider a small
`sources` array (label + url) per article, rendered as a "Sources" list and
usable in `citation` schema. Say the word and I'll add the field + renderer.

---

## How to roll this out (suggested order)

1. Add fields **1–3** in the Studio (5 minutes; non-breaking).
2. Approve the FAQ drafts (separate doc) → paste into the `faq` field per trip.
3. Create one real `author` document and assign it to all 20 trips.
4. Fill `visa` (one paragraph, reused/edited per trip).
5. Deploy the `geo-seo-foundations` branch. Re-test with Google Rich Results Test.
