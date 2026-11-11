# Registro: /transport/bali-to-gili-islands, "how far is gili islands from bali" (2026-11-11)

> **STATO: APPLICATO il 2026-11-11** dal generatore, PARTE 1 e PARTE 3 sulla stessa pagina, in `src/data/routes.ts`. Commento datato nel codice.

## Perché questa pagina

GSC 2026-10-12 → 2026-11-08. La pagina ha **zero impression** nella finestra, pur essendo indicizzata (URL Inspection: "Submitted and indexed", ultimo crawl 2026-10-25). Prima del ritocco del 07/10 stava a posizione 3,8 su "bali to the gili islands". Il title "Bali (Uluwatu, Sanur) to Gili Islands: Fast Boats" va letto come test fallito: la finestra di 28 giorni è scaduta il 04/11.

Intanto la domanda di trasporto atterra sulla pagina sbagliata, `/trips/10-days-bali-gili-islands` (in prova fino al 13/11, non toccata):

| Query | Impression | Posizione |
| --- | ---: | ---: |
| how far is gili islands from bali | 30 | 56,3 |
| travel to gili islands from bali | 11 | 57,9 |
| day trip to gili islands from bali | 4 | 68,8 |
| gili islands from bali | 4 | 61,2 |

Altri candidati della lista B scartati: bali-nearby-islands (cluster chiuso), /visa-guide (SERP istituzionale), bali-gili (prova fino al 13/11), 5-days-bali (16/11), sulawesi 10 giorni (20/11), belitung (04/12), java (07/12), lombok-gili (02/12).

**SERP controllata oggi** per "how far is gili islands from bali": Direct Ferries, 12Go, Gecko Routes. Aggregatori di traghetti e blog, nessun sito istituzionale. Non è una SERP facile, ma è la stessa classe di risultati in cui la pagina stava in posizione 3,8 un mese fa.

**Perché non ranka:** il title non conteneva più la forma base in testa né la distanza, e nessuna sezione rispondeva a "how far".

## PARTE 1, valori vecchi esatti

| Campo | Vecchio | Nuovo |
| --- | --- | --- |
| `metaTitle` | `Bali (Uluwatu, Sanur) to Gili Islands: Fast Boats` | `Bali to Gili Islands: Distance, Fast Boat Times, Prices` (55) |
| `metaDescription` | `How to get from Uluwatu, Sanur or anywhere in Bali to the Gili Islands. Fast boat ports, journey times, working prices and the return trip.` | `How far the Gili Islands are from Bali and how to cross: fast boat ports, sea times, working prices, the Uluwatu transfer and the return trip.` (142) |

H1 non toccato (il template lo genera da `fromName`/`toName`). Per annullare: rimettere i valori vecchi in `src/data/routes.ts`.

## PARTE 3, cosa è stato aggiunto

Il template delle pagine trasporto non ha sezioni H2 libere né tabelle: le domande vivono nelle FAQ (con schema FAQPage) e il confronto è già la griglia delle opzioni. Quindi:

1. Due FAQ nuove in testa alla lista: **"How far are the Gili Islands from Bali?"** (55 parole, distanze con fonte: Direct Ferries 42 km / 23 miglia nautiche, 12Go 63 km sulla rotta del traghetto) e **"Can you visit the Gili Islands as a day trip from Bali?"** (50 parole, nessuna cifra nuova).
2. Le due FAQ del 07/10 (Uluwatu, ritorno) restano.
3. Link entrante nuovo da `/trips/4-days-gili-islands-trawangan-meno-air`, che non linkava la pagina (`scripts/patch-inbound-links-2026-11-11.mjs`), àncora "Bali to Gili Islands transport guide".
4. `PAGE_DATES.transport` portato a 2026-11-11.

## Baseline e verifica

Baseline: 0 impression sulla pagina; "how far is gili islands from bali" 30 impression a posizione 56,3 sull'articolo da 10 giorni.
**Rileggere il 2026-12-09.** Metrica: impression della pagina e quale URL Google mostra per "how far is gili islands from bali" e "bali to gili islands". Se la pagina resta a zero impression, il problema non è il title: controllare canonical, link interni e se l'articolo da 10 giorni la cannibalizza.
