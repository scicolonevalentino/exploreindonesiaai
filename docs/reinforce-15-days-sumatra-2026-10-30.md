# Registro di rinforzo: /trips/15-days-sumatra (2026-10-30)

> **STATO: APPLICATO il 2026-10-30** dal generatore delle 8:05 (PARTE 1 + PARTE 3,
> stessa pagina). Script: `scripts/reinforce-15-days-sumatra-2026-10-30.mjs`
> (idempotente, valori vecchi in testa). Scritto con `ifRevisionID`, verificato
> rileggendo il documento. **Rileggere il 2026-11-27** (28 giorni). Fino ad
> allora non ritoccare title, meta o contenuto di questa pagina.

Sanity `_id`: `4aeb3acb-1f7b-41ef-bca3-334f4d2f7405` (UUID, non `itinerary-<slug>`).
Meta, corpo, FAQ e affiliateLinks originali salvati in
`docs/reinforce-15-days-sumatra-2026-10-30.body.json`. Nota datata nel campo `seoNote`.

## 1. Baseline GSC (2026-09-30 → 2026-10-27, 28 giorni, dimensione query + pagina)

| query | impression | click | posizione |
| --- | ---: | ---: | ---: |
| sumatra itinerary | 22 | 1 | 9,6 |
| sumatra road trip | 2 | 0 | 23,5 |
| sumatra travel itinerary | 1 | 0 | 9,0 |

Lista C (striking distance), non lista B. La lista B in senso stretto non aveva
un candidato utilizzabile: il cluster "islands near bali" è chiuso fino a
novembre; `/visa-guide` ha una SERP istituzionale; `10-days-bali-gili-islands`
(16/10), `10-days-bali-lombok-gili-islands` (14/10) e
`10-days-sulawesi-toraja-bunaken` (23/10) sono dentro i 28 giorni di prova;
`7-days-gili-islands-learn-to-dive` ha già "Gili Islands Diving Holiday" nel
metaTitle; `6-days-belitung...` ("belitung itinerary", 17 impr, pos 29,5) ha 18
giorni di vita e sta ancora assestandosi. La pagina scelta non era mai stata
ritoccata (ultima modifica 2026-08-29, nessun registro).

SERP verificata il 2026-10-30 per "sumatra itinerary": Southeast Asia Backpacker
("10-Day & 2-Week routes"), Lonely Planet, Bucketlist Bri ("10-Day North Sumatra
for First-Timers"), North Abroad, Museum of Wander, G Adventures, Rickshaw
Travel. Tutto editoriale, niente siti governativi o aggregatori: vincibile. Il
formato dominante mette **più durate a confronto**; la nostra pagina ne offriva una.

## 2. Perché prendeva impression ma non click

1. Il metaTitle (`Sumatra in 15 Days: Orangutans, Jungle & Lake Toba`) non
   conteneva la parola "itinerary", che è la query.
2. Nessuna sezione rispondeva a "quale itinerario Sumatra / quanti giorni", la
   domanda che la SERP soddisfa con tabelle 10 giorni / 2 settimane.
3. Nessuna panoramica dei trasferimenti, che è il blocco più citato negli AI
   answer su una rotta overland.
4. Un solo link affiliato (Airalo): zero trasporti, zero trek, zero camere.
5. `bestSeason` con un trattino medio ("May–September") e un artefatto di
   generazione nel corpo ("and the FAQ is right that").

## 3. Cosa è cambiato

**PARTE 1 (meta):**

| campo | prima | dopo |
| --- | --- | --- |
| metaTitle | `Sumatra in 15 Days: Orangutans, Jungle & Lake Toba` (51) | `Sumatra Itinerary: 15 Days from Orangutans to Lake Toba` (55) |
| metaDescription | `15 days across 5 stops in North Sumatra: Bukit Lawang orangutan treks from $30-60 a day, Berastagi volcanoes, Lake Toba and Samosir. Transfers explained.` | `A 15-day Sumatra itinerary from Medan: Bukit Lawang orangutans, Berastagi volcanoes, Lake Toba and Samosir, with transfers, costs and a 10-day version.` (151) |

`title` (H1) **non toccato**.

**PARTE 3 (corpo, 123 → 131 blocchi; FAQ 6 → 7; affiliateLinks 1 → 6):**

- Nuova H2 in apertura, **"Which Sumatra itinerary should you choose: 7, 10 or
  15 days?"**, risposta autoconclusiva di 57 parole, tabella comparativa su
  cinque durate (5, 7, 10, 15 giorni e la settimana in West Sumatra) e un
  paragrafo con 3 link interni: `7-days-bukit-lawang-lake-toba-orangutans`,
  `10-days-sumatra-first-timers` (pubblicato oggi), `7-days-west-sumatra-bukittinggi-harau-valley`.
- Nuova H2 prima di "What to book early", **"How do you get around Sumatra on
  this route?"**, risposta di 58 parole, tabella dei cinque trasferimenti con
  tempi e stime di costo (cifre già presenti negli articoli fratelli, nessun
  numero nuovo), e un paragrafo con i link affiliati nuovi: 12Go Medan→Parapat,
  Viator trek Bukit Lawang (`d4866-193061P1`, verificato live il 16/10),
  Booking Bukit Lawang / Berastagi / Tuk Tuk.
- FAQ nuova: "How many days do you need for Sumatra?".
- `bestSeason`: `May–September` → `May to September`.
- Artefatto rimosso nel blocco `k81`: ", and the FAQ is right that 15 days is
  about the ceiling" → ", and 15 days is about the ceiling".
- `seoNote` datato con baseline e data di rilettura.

## 4. Come annullare

Patch `set` sull'`_id` sopra con `metaTitle`, `metaDescription`, `bestSeason`,
`body`, `faq`, `affiliateLinks` presi da `.body.json`, e `unset` di `seoNote`.
Riscrivere gli array interi, mai con selettore per `_key`.

## 5. Cosa aspettarsi, verifica il 2026-11-27

- "sumatra itinerary": da posizione 9,6 a dentro la top 5, e CTR sopra zero
  (oggi 1 click su 22 impression).
- Pagina: impression nuove su "how many days in sumatra", "sumatra itinerary
  10 days", "sumatra 2 weeks" (oggi assenti), senza che la pagina perda
  "sumatra road trip".
- Rischio da sorvegliare: il nuovo `10-days-sumatra-first-timers` potrebbe
  prendere parte delle impression di "sumatra itinerary". È voluto solo se la
  somma cresce; se il 15-day scende sotto posizione 12 e il 10-day non entra in
  top 20, il metaTitle del 10-day va tenuto lontano dalla parola "itinerary".
- Se a fine novembre la posizione è ferma e la CTR resta zero, il problema non è
  on-page: lasciar lavorare la pagina e non riscriverla una terza volta.
