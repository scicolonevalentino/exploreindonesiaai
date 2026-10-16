# Rinforzo, secondo giro: /trips/10-days-bali-gili-islands (2026-10-16)

> **STATO: APPLICATO il 2026-10-16** dalla run schedulata del generatore (PARTE 1 + PARTE 3).
> Script: `scripts/patch-bali-gili-2026-10-16.py`, transazione Sanity `qMBxia03h4sjtXqNKhq7UA`.
> Il primo giro è in `docs/reinforce-10-days-bali-gili-islands.md` (applicato il 2026-09-05,
> quindi oltre i 28 giorni di prova: la pagina era ritoccabile).
> **Rileggere il 2026-11-13.** Non ritoccare title, meta o contenuto prima di quella data.

\_id Sanity: `5f2db4e8-efa0-4b1b-9fe3-657193995076`. Nota datata nel campo `seoNote` del documento.

## 1. Baseline GSC (2026-09-16 → 2026-10-13, 28 giorni)

Pagina intera: **650 impression, 7 click, posizione 10,2**.

| Query                                | Impression | Posizione |
| ------------------------------------ | ---------: | --------: |
| uluwatu to gili islands              |         25 |      12,2 |
| bali and gili islands                |         23 |      40,1 |
| bali gili islands                    |         14 |      29,9 |
| bali to the gili islands             |         11 |       3,8 |
| gili island to bali                  |          9 |      39,1 |
| day trips from bali to other islands |          9 |      26,1 |
| 10 day itinerary bali and gili islands |        3 |       7,0 |

## 2. Perché non ranka su "bali and gili islands"

- **Intento della SERP:** i primi risultati sono itinerari e tour pacchettizzati (Intrepid 10 giorni,
  kimkim 12 giorni, Rough Guides 13 giorni da 1.550 USD), più blog. Nessun sito governativo o
  aggregatore: query vincibile.
- **Il metaTitle non diceva "itinerary".** Era impostato come "How to Combine Them", cioè un
  articolo-guida, mentre la SERP premia la forma "Bali and Gili Islands itinerary".
- **Mancavano le due domande che la SERP pone implicitamente:** si aggiunge Lombok? Tour o fai-da-te?
- **Non è cannibalizzazione:** "uluwatu to gili islands" e "gili island to bali" appartengono alla
  rotta `/transport/bali-to-gili-islands` (ritoccata il 2026-10-07, in prova fino al 2026-11-04).
  Non le ho inseguite qui apposta. `/trips/10-days-bali-lombok-gili-islands` è in prova fino al
  2026-11-11 e non è stata toccata.

## 3. PARTE 1, valori vecchi e nuovi

| Campo           | Vecchio (per annullare)                                                                                                                       | Nuovo |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| metaTitle       | `Bali and the Gili Islands: How to Combine Them in 10 Days`                                                                                   | `Bali and Gili Islands Itinerary: 10 Days, Route and Boats` (57) |
| metaDescription | `Bali and the Gili Islands work as one trip if you get the boat right. Ubud, Canggu, Gili Trawangan, then Uluwatu, with honest transfer days.` | `A 10-day Bali and Gili Islands itinerary: Ubud, Canggu, three nights on Gili Trawangan, then Uluwatu by the airport, with the fast boat days planned.` (149) |

Il campo `title` (H1) **non** è stato toccato.

Per annullare: patch `set` di `metaTitle` e `metaDescription` ai valori vecchi sull'\_id sopra.

## 4. PARTE 3, cosa è stato aggiunto (blocchi con \_key `r1016-*`)

Inseriti prima di "Where should you stay on a Bali and Gili trip?" (corpo da 119 a 126 blocchi):

1. **H2 "Should you add Lombok to a Bali and Gili Islands trip?"**, risposta autoconclusiva: no su dieci
   giorni, si sostituisce una base di Bali (Canggu) invece di aggiungere una tappa. Link interni a
   `/trips/10-days-bali-lombok-gili-islands` e `/transport/lombok-to-gili-islands`. Tempo di
   traversata Bangsal-Gili 15-30 minuti, preso da `src/data/routes.ts`.
2. **H2 "Should you book a Bali and Gili Islands tour, or do it on your own?"** con **tabella
   comparativa** fai-da-te vs tour di gruppo (6 righe). Cifra con fonte: un operatore lista un
   13 giorni Bali e Gili da circa 1.550 USD a persona, voli esclusi (Rough Guides, letto il 2026-10-16).
   Link interno a `/indonesia-travel-costs`.
3. **FAQ** nuova: "Can you add Lombok to a 10-day Bali and Gili Islands trip?" (da 6 a 7).

I link in entrata alla pagina erano già sufficienti (hub lombok-gili, bali, 7-days-bali-first-timers,
10-days-bali-lombok-gili-islands): nessuno aggiunto.

## 5. Cosa misurare il 2026-11-13

- Posizione di **"bali and gili islands"** (baseline 40,1) e **"bali gili islands"** (29,9): obiettivo sotto 25.
- CTR della pagina (baseline 7 click su 650 impression, 1,1%).
- Che "uluwatu to gili islands" resti sulla pagina trasporti e non scivoli qui.
