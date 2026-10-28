# Registro di rinforzo: /trips/21-days-indonesia-beyond-bali (2026-10-28)

> **STATO: APPLICATO il 2026-10-28** dal generatore delle 8:05 (PARTE 1 + PARTE 3,
> stessa pagina). Script: `scripts/reinforce-21-days-indonesia-beyond-bali-2026-10-28.mjs`.
> **Rileggere il 2026-11-25** (28 giorni). Fino ad allora, non ritoccare questa pagina.

Sanity `_id`: `b25f6ba3-1c47-4486-8468-250efe048e49` (UUID, non `itinerary-<slug>`).
Corpo e meta originali salvati in `docs/reinforce-21-days-indonesia-beyond-bali-2026-10-28.body.json`.

## 1. Baseline GSC (2026-09-28 → 2026-10-25, 28 giorni)

| query | impression | click | posizione |
| --- | ---: | ---: | ---: |
| indonesia beyond bali | 32 | 0 | 19,8 |
| 21 days | 1 | 0 | 22,0 |

Una sola query reale, in striking distance (lista C). Scelta fatta fuori dalla
lista B perché tutti i candidati B erano esclusi dalle regole: cluster
"islands near bali" chiuso; `/visa-guide` con SERP governativa;
`10-days-bali-gili-islands` (16/10), `10-days-sulawesi-toraja-bunaken` (23/10) e
`10-days-bali-lombok-gili-islands` (14/10) ancora dentro i 28 giorni;
`7-days-gili-islands-learn-to-dive` ha già "Gili Islands Diving Holiday" nel
metaTitle; `/transport` è passata da 42 impression a pos 56,7 a 215 a pos 12,7
dopo il title del 21/09, quindi non va toccata.

SERP verificata il 2026-10-28 per "indonesia beyond bali": Remote Lands,
Fodor's, Yahoo Lifestyle, Substack, Selective Asia. Tutto editoriale, nessun
sito governativo o aggregatore: vincibile.

## 2. Perché non rankava

1. Il metaTitle (`Beyond Bali: 21-Day Off-the-Beaten-Path Trip`) non conteneva
   "Indonesia" e conteneva una frase bandita ("off the beaten path").
2. Nessuna sezione rispondeva alle due domande che la SERP soddisfa: dove andare
   oltre Bali, e quanti giorni servono.
3. Quattro span con artefatti di generazione visibili ai lettori: "as a working
   guide the article puts", "As the article is honest about", "The article
   suggests", "as the article notes".
4. Un solo link interno entrante (da `30-days-indonesia-ultimate`).
5. `bestSeason` con un trattino medio ("April–October").

## 3. Cosa è cambiato

**PARTE 1 (meta):**

| campo | prima | dopo |
| --- | --- | --- |
| metaTitle | `Beyond Bali: 21-Day Off-the-Beaten-Path Trip` | `Indonesia Beyond Bali: 21 Days from Java to Sumatra` |
| metaDescription | `A practical 21-day Indonesia beyond Bali itinerary: Yogyakarta, Bromo, Ijen, Komodo, Lombok, the Gilis and Sumatra, with day-by-day booking logic.` | `Indonesia beyond Bali in 21 days: Yogyakarta, Bromo and Ijen, Komodo, Lombok and the Gilis, then Sumatra's orangutans, with the flights and what to cut.` |

`title` (H1) **non toccato**.

**PARTE 3 (corpo, 103 → 111 blocchi, ~2.909 → ~3.105 parole):**

- Nuova H2 in apertura, **"Where should you go in Indonesia beyond Bali?"**, con
  risposta autoconclusiva di 54 parole, tabella comparativa delle quattro regioni
  (cosa offre, giorni sulla rotta, come si arriva, quando saltarla) e un
  paragrafo con 3 link interni verso gli itinerari regionali
  (`7-days-yogyakarta-east-java`, `10-days-komodo-flores`,
  `7-days-bukit-lawang-lake-toba-orangutans`).
- Nuova H2 prima di "What to book early", **"How many days do you need to see
  Indonesia beyond Bali?"**, risposta di 57 parole, tabella 10/14/21 giorni
  (cosa tenere, cosa tagliare, piano già pronto) e link a
  `14-days-indonesia-bali-java-komodo`.
- Quattro artefatti "the article" riscritti (span `kn`, `k12`, `k19`, `k74`).
- `bestSeason`: `April–October` → `April to October`.
- **Link entrante nuovo** da `14-days-indonesia-bali-java-komodo` (blocco
  `bb28-inb`, script `patch-inbound-links-2026-10-28.mjs`).

## 4. Come annullare

Ripristinare `metaTitle`, `metaDescription`, `bestSeason` e `body` dal file
`.body.json` con una patch `set` sull'`_id` sopra. Per il link entrante,
togliere il blocco `bb28-inb` dal body di `14-days-indonesia-bali-java-komodo`
(riscrivendo l'array intero).

## 5. Cosa aspettarsi, verifica il 2026-11-25

- "indonesia beyond bali": da posizione 19,8 a sotto 12, e il primo click.
- Pagina: impression in crescita su varianti "where to go in indonesia besides
  bali", "how many days indonesia" (oggi assenti).
- Se a fine novembre la posizione è ancora sopra 15, il limite non è on-page:
  la pagina va lasciata lavorare e non riscritta di nuovo.
