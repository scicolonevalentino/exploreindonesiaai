# Registro: /destinations/java, "java itinerary" (2026-11-09)

> **STATO: APPLICATO il 2026-11-09** dal generatore delle 8:05, PARTE 1 e PARTE 3 sulla stessa pagina, in `src/data/destinations.ts`, voce `java`. Commento datato nel codice.

## Perché questa pagina

Raccomandazione del report GSC delle 7:30 di oggi: RINFORZA `/destinations/java` su "java itinerary", segnale debole, "se l'H2 esiste già, nessun rinforzo". Controllato: l'hub ha già giorni, ordine e treno, ma nessun H2 con la formulazione "java itinerary" e nessuna rotta giorno per giorno. Per questo ho applicato un intervento minimo.

GSC 2026-10-10 → 2026-11-06: "java itinerary" 15 impression, posizione 64,4, 0 click; "day trips from yogyakarta to jakarta" 11 impression, posizione 26,9. Gli altri candidati della lista B erano chiusi o in prova: bali-nearby-islands (cluster chiuso), /visa-guide (SERP istituzionale), bali-gili (fino al 13/11), bali-lombok-gili (11/11), sulawesi (20/11), gili diving (il report dice di lasciarlo salire da solo).

**Perché non ranka.** La SERP controllata oggi è fatta di blog (dreambigtravelfarblog, beckyexploring, 22places), forum Tripadvisor e rumore di programmazione. I primi risultati danno piani giorno per giorno; l'hub no. Resta però soprattutto un limite di autorità: posizione 64 dopo i rinforzi del 17/08 e del 09/10. Il title con "East Java" del 09/10 è letto come fallito: l'hub è sparito da "east java".

## PARTE 1, valori vecchi esatti

| Campo | Vecchio | Nuovo |
| --- | --- | --- |
| `metaTitle` | `Java Itineraries: Yogyakarta, East Java, Bromo and Ijen` (55) | `Java Itinerary: 5, 7, 10 or 14 Days, in the Right Order` (55) |

`metaDescription` e `h1` ("Java Itineraries") non toccati. Per annullare: rimettere il vecchio valore in `src/data/destinations.ts`.

## PARTE 3, cosa è stato aggiunto

1. Nuova H2 **"What does a 7-day Java itinerary look like, day by day?"**, subito dopo "How many days do you need in Java?", con risposta autoconclusiva di 49 parole, tabella di 7 righe e link a `/trips/7-days-yogyakarta-east-java`. Tutti i fatti vengono da quell'articolo pubblicato: nessun fatto nuovo.
2. Link entrante nuovo da `/trips/2-days-kawah-ijen-blue-fire`, l'unico articolo Java live senza link all'hub (`scripts/patch-inbound-links-2026-11-09.mjs`), àncora "Java itinerary guide".

Validazione: zero trattini lunghi, zero frasi bandite, title entro 60. `bun run typecheck` e `bun run build` passati, eslint pulito sui file toccati (`bun run lint` fallisce su file preesistenti).

## Baseline e verifica

Baseline: "java itinerary" 15 impression, posizione 64,4, 0 click.
**Rileggere il 2026-12-07.** Metrica: posizione di "java itinerary" e impression dell'hub. Se resta oltre 50, questo cluster va trattato come bloccato da autorità e non va più rinforzato: sarebbe il terzo giro senza effetto.
