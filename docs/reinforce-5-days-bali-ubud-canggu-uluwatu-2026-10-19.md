# Rinforzo applicato: `/trips/5-days-bali-ubud-canggu-uluwatu` (2026-10-19)

> **STATO: APPLICATO** dal task schedulato `exploreindonesia-itinerary-generator`
> del 2026-10-19, transazione Sanity `SrGXuP6wxmHI2XEBW6Kd8L`, verificato con
> rilettura (body da 85 a 95 blocchi, 10 blocchi con prefisso `r1019-`, seoNote
> presente). Script: `scripts/patch-5-days-bali-ubud-uluwatu-2026-10-19.py`
> (idempotente).
>
> **Rileggere il 2026-11-16.** Fino ad allora non toccare title, meta o contenuto
> di questa pagina.

## Perché questa pagina

Il report GSC del lunedì delle 7:30 (19/10) chiudeva con: *RINFORZA
`/trips/5-days-bali-ubud-canggu-uluwatu` sul cluster di confronto "ubud vs
uluwatu / canggu or uluwatu / ubud vs canggu"*. Seguita.

La lista B in senso stretto (pagina esistente oltre posizione 30) non aveva un
candidato utilizzabile: `bali gili islands` e `gili island to bali` sono su
pagine rinforzate il 16/10 e il 07/10 (in prova), `visa arrival indonesia` ha
una SERP di siti governativi, il cluster "islands near bali" è chiuso fino a
novembre. Il cluster Ubud/Uluwatu invece è una SERP di blog (aperitif.com,
citycost.org, ttbeach.club, baliholidaysecrets.com), quindi vincibile.

L'ultima modifica precedente alla pagina era del 2026-08-26 (meta) e 2026-08-29
(sezioni): oltre i 28 giorni di prova.

## Baseline GSC (2026-09-19 → 2026-10-16, 28 giorni)

Pagina: **621 impression, 5 click, posizione 8,0.**

| Query | Impr | Click | Pos |
| --- | ---: | ---: | ---: |
| uluwatu vs ubud | 15 | 0 | 9,7 |
| uluwatu to ubud | 9 | 0 | 28,6 |
| ubud vs uluwatu | 8 | 0 | 7,8 |
| uluwatu to do | 7 | 0 | 24,3 |
| uluwatu and ubud | 4 | 0 | 8,5 |
| canggu or uluwatu | 4 | 0 | 16,2 |
| ubud or uluwatu | 3 | 0 | 11,7 |
| ubud vs canggu | 3 | 0 | 19,3 |
| ubud or canggu | 3 | 0 | 23,0 |
| uluwatu what to do | 2 | 0 | 23,0 |
| uluwatu to ubud travel time | 2 | 0 | 10,0 |

## Perché non prendeva click

1. **Il title non usava la forma "vs"** che domina le query reali ("uluwatu vs
   ubud", "ubud vs uluwatu", "ubud vs canggu", "canggu vs ubud").
2. **Mancava un H2 Ubud contro Uluwatu.** La pagina aveva "Ubud or Canggu" e una
   tabella a tre colonne, ma nessuna sezione che rispondesse alla coppia più
   cercata.
3. **Nessuna risposta a "uluwatu to ubud"** (pos. 28,6) né a "uluwatu to do"
   (pos. 24,3): la pagina parlava solo della direzione Ubud → sud.

## Cosa è stato cambiato

### PARTE 1, meta (solo `metaTitle` e `metaDescription`; `title` NON toccato)

| Campo | Vecchio (esatto) | Nuovo |
| --- | --- | --- |
| metaTitle | `Ubud, Canggu or Uluwatu? Do All Three in 5 Days` | `Ubud vs Uluwatu vs Canggu: Where to Stay in 5 Days` (50) |
| metaDescription | `Which base suits you, and how to fit all three in five days: 2 nights Ubud, 1 Canggu, 1 Uluwatu, north to south, with real drive times and costs.` | `Ubud for temples and rice terraces, Uluwatu for cliffs and surf, Canggu for cafes. How to split 5 days across all three, with real drive times.` (143) |

### PARTE 3, contenuto

- **H2 nuovo** "Ubud or Uluwatu: which is better for your stay?" (prima di "Is
  Uluwatu worth a night"), risposta autoconclusiva di 55 parole, paragrafo di
  approfondimento e **tabella comparativa** Ubud/Uluwatu (ambiente, spiaggia,
  serata tipo, distanza dall'aeroporto, prezzo relativo, quando saltarla). Solo
  tempi e fatti già presenti nella pagina.
- **H2 nuovo** "What is there to do in Uluwatu with one night?" (prima di "How
  far apart are..."), 56 parole autoconclusive.
- **H2 nuovo** "How do you get from Uluwatu to Ubud?" (prima di "Which one should
  you cut..."), 60 parole, link affiliato al charter privato Klook già presente
  nella pagina (`KLOOK_UBUD_CANGGU_TRANSFER`).
- **FAQ sostituita:** tolta "Can I skip the early Mount Batur start?" (risposta:
  *"Yes. The Batur sunrise means a roughly 2am pickup, so if that is not for you,
  swap in a Balinese cooking class and a slower Ubud morning before moving to
  Canggu. The route stays intact either way."*), già coperta dalla sezione "What
  to cut". Al suo posto "Is Ubud or Uluwatu better for a first trip to Bali?".
  Restano 8 FAQ.
- **seoNote** sul documento Sanity con baseline e data di lettura.
- **Link interno entrante** da `/trips/7-days-bali-couples` (blocco `r1019-inb`
  in fondo al body, ancora "Ubud or Uluwatu comparison").

## Come annullare

Rimettere i due valori vecchi della tabella sopra, togliere i blocchi con `_key`
che inizia per `r1019-` da `body` di questo documento e di `7-days-bali-couples`,
e rimettere la FAQ vecchia al posto di `r1019-faq-ubud-uluwatu`. Riscrivere
sempre l'array intero, mai patch per `_key`.

## Cosa ci aspettiamo, lettura del 2026-11-16

- Gruppo "ubud vs uluwatu / uluwatu vs ubud / ubud or uluwatu" sotto posizione 7
  e almeno 1 click.
- "uluwatu to ubud" da 28,6 sotto 15.
- CTR della pagina sopra lo 0,8% (oggi 5/621).
