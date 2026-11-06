# Registro: /trips/6-days-belitung-granite-beaches-island-hopping (2026-11-06)

> **STATO: APPLICATO il 2026-11-06** dal generatore delle 8:05, PARTE 1 e PARTE 3 sulla stessa pagina.
> Script: `scripts/reinforce-belitung-2026-11-06.py` (transazione `PGboDYWtBTu3njFleoe35Z`).

## Perché questa pagina

GSC 2026-10-07 → 2026-11-03: **"belitung itinerary" 27 impression, posizione 26,7, 0 click**, tutte su questa pagina (query nuova del periodo). È appena dentro la soglia di 30 della lista B, ma è il miglior candidato disponibile:

- tutto il resto della lista B è il cluster chiuso `bali-nearby-islands`, `/visa-guide` (SERP istituzionale), oppure pagine ancora in prova: `10-days-bali-gili-islands` (fino al 13/11), `10-days-bali-lombok-gili-islands` (11/11), `10-days-sulawesi-toraja-bunaken` (20/11);
- l'hub Java ("java itinerary" 13 @ 60) e `/transport` ("transport indonesia" 17 @ 47) hanno già la query nel title: il ritocco di meta non è la leva.

**Perché non ranka.** La SERP reale (controllata oggi) è fatta di blog editoriali (tripcanvas, blog di tiket.com, thegonegoat) e pacchetti tour, e quasi ogni risultato è un piano da **2 a 4 giorni**. Il nostro articolo offriva solo 6 giorni, sia nel title sia nel corpo ("Three days covers only..."). Disallineamento di intento, non di contenuto né di cannibalizzazione (nessun'altra nostra pagina compare sulla query).

## PARTE 1, valori vecchi esatti

| Campo | Vecchio | Nuovo |
| --- | --- | --- |
| `metaTitle` | `Belitung Itinerary: 6 Days of Beaches and Islands` (49) | `Belitung Itinerary: 3, 4 or 6 Days from Jakarta` (47) |
| `metaDescription` | `A relaxed 6-day Belitung itinerary from Jakarta: granite beaches, Lengkuas island hopping and a family pace, with flights, boat costs and when to go.` | `A Belitung itinerary for 3, 4 or 6 days from Jakarta: granite beaches, Lengkuas island hopping and Danau Kaolin, with flights, boat costs and timing.` (149) |

`title` (H1) **non toccato**. Per annullare: patch Sanity su `itinerary-6-days-belitung-granite-beaches-island-hopping` con i due valori vecchi. I valori vecchi sono anche nel campo `seoNote` del documento.

## PARTE 3, cosa è stato aggiunto

1. Nuova H2 **"What does a 3-day or 4-day Belitung itinerary look like?"** prima di "How do you get to Belitung from Jakarta?", con risposta autoconclusiva di 54 parole, tabella comparativa 3 / 4 / 6 giorni e un paragrafo sul compromesso (il primo a sparire è il margine meteo per la barca). Costruita solo sui giorni già presenti nell'articolo: nessun fatto nuovo.
2. Nuova FAQ "Can you see Belitung in 3 days?" (7 → 8).
3. Due link in "Related itineraries": `/trips/7-days-kei-islands-maluku-beaches` (pubblicato oggi) e `/trips/6-days-tanjung-bira-south-sulawesi-beaches`.
4. Link entrante nuovo da `/trips/4-days-jakarta-old-batavia-thousand-islands` (blocco in fondo al corpo, `scripts/patch-inbound-links-2026-11-06.mjs`). I link entranti già esistenti erano da Karimunjawa, Tanjung Bira e Kei.

Body 73 → 79 blocchi. Validazione: zero trattini lunghi, zero frasi bandite, `_key` unici, meta nei limiti; documento riletto dopo la scrittura.

## Baseline e verifica

Baseline: "belitung itinerary" 27 impression, posizione 26,7, 0 click; pagina creata il 2026-10-12, quindi ancora in maturazione (tenerne conto nel leggere il risultato).
**Rileggere il 2026-12-04.** Metrica: posizione e CTR di "belitung itinerary", più eventuali nuove query "belitung 3 days" / "belitung 4 days" sulla pagina.

## Nota a margine: esito del test Java del 2026-10-09

Rilettura dovuta oggi. Su GSC 2026-10-07 → 11-03 l'hub `/destinations/java` **non compare più** per "east java" (che sopravvive con 2-3 impression su altre pagine), e "java itinerary" resta a posizione 60. Il title con "East Java" non ha prodotto segnale positivo. Non l'ho annullato in questa run (una sola pagina per run): candidato per una run futura.
