# Rinforzo: /trips/30-days-indonesia-ultimate (2026-10-12)

> **STATO: APPLICATO il 2026-10-12** dal task schedulato (PARTE 1 + PARTE 3 nella
> stessa run). Transazione Sanity `71MFNdPZqN73n9slXGlagI`, scritta con
> `ifRevisionID` sulla revisione letta prima. Script:
> `scripts/patch-30-days-itinerary-length-2026-10-12.py`. Verificato rileggendo il
> documento (`itinerary-30-days-indonesia-ultimate-v2`): meta nuovi, 5 blocchi
> `r30-*`, body da 121 a 126 blocchi.

## Perché questa pagina

Raccomandazione del report GSC del lunedì 12/10 (7:30): "RINFORZA
/trips/30-days-indonesia-ultimate sul cluster generico `indonesia itinerary` /
`indonesia trip itinerary`", con una sezione comparativa sulla durata.

**Baseline GSC, 2026-09-12 → 2026-10-09, query sulla pagina:**

| Query | Impression | Click | Posizione |
|---|---:|---:|---:|
| indonesia itinerary | 15 | 0 | 44,7 |
| indonesia trip itinerary | 13 | 0 | 20,0 |
| indonesia travel itinerary | 7 | 0 | 53,0 |
| indonesia itinerary 14 days | 7 | 0 | 11,7 |
| itinerary indonesia | 3 | 0 | 50,7 |
| indonesia 20 day itinerary | 4 | 0 | 10,0 |

Pagina intera: 361 impression, 8 click, posizione 10,3.

**SERP controllata** (`indonesia itinerary`): Rough Guides, 22places, Mad Monkey,
Accor/Mercure local guide, tour operator. Contenuto editoriale, niente siti
governativi: vincibile. Rough Guides vince con una pagina che organizza gli
itinerari **per durata**, che è esattamente la lacuna della nostra.

**Perché non rankava:** la pagina rispondeva solo a "30 giorni". Chi cerca
`indonesia itinerary` non ha ancora scelto la durata, e la pagina non aveva un
blocco che rispondesse a "quanto deve durare". In più nessun articolo del sito la
linkava nel corpo (solo `/visa-guide` e `/indonesia-travel-costs` dal codice).

**Relazione con /trips.** Il 2026-09-14 `indonesia itinerary` era stato assegnato
all'hub `/trips` (nuovo title "Indonesia Itineraries: 60+ Routes..."). Lettura del
12/10: l'hub resta intorno alla posizione 35 con circa 7 impression a settimana,
mentre Google continua a servire la 30-days per la query. Il rinforzo va dove
Google già guarda; la nuova sezione linka `/trips` così i due non si contendono la
query alla cieca.

## PARTE 1, valori vecchi e nuovi

| Campo | Vecchio | Nuovo |
|---|---|---|
| metaTitle | `30-Day Indonesia Itinerary: The Ultimate Route` | `Indonesia Itinerary for 30 Days: 7 Regions in One Route` (55) |
| metaDescription | `30 days across 7 Indonesian regions: Bali, Java, Komodo, Lombok, Sumatra, Sulawesi and Raja Ampat. A decision-led route, not a Bali trip with add-ons.` | `A 30-day Indonesia itinerary across Bali, Java, Komodo, Lombok, Sumatra, Sulawesi and Raja Ampat, plus how to cut it to 2 or 3 weeks.` (133) |

`title` (H1) **non toccato**, come da regola.

## PARTE 3, cosa è stato aggiunto

Inserita dopo "Why the route runs in this order" e prima di "Before you fly":

- **H2** `How long should an Indonesia itinerary be?` (nessun H2 esistente rinominato,
  rispettando il vincolo del report sulle pagine in top 10)
- **Lead di 58 parole**, autoconclusivo: due settimane per due o tre regioni, tre
  settimane per aggiungere Lombok e le Gili, un mese per Sumatra, Sulawesi e Raja Ampat.
- **Paragrafo sulla regola** (4-5 giorni per regione più un giorno per volo lungo;
  circa sette voli qui contro tre nella 20 giorni, cifre prese dalle FAQ delle due pagine).
- **comparisonTable** a 5 righe: 10 giorni, 2 settimane, 3 settimane, 3 settimane
  senza Bali, 30 giorni.
- **5 link interni** in uscita: 10-days-indonesia-bali-yogyakarta-komodo,
  14-days-indonesia-bali-java-komodo, 20-days-across-indonesia,
  21-days-indonesia-beyond-bali, `/trips`.

**Non fatto (una pagina per run):** link entranti verso la 30-days da altri articoli.
Candidato naturale per una run futura: la sezione "Related itineraries" della
20-days e della 21-days, con àncora "30-day Indonesia itinerary".

## Come annullare

Rimettere i due valori vecchi qui sopra e togliere dal `body` i blocchi con `_key`
che inizia per `r30-`. Campo non renderizzato `seoNote` aggiunto con data e
baseline.

## Verifica

**Lunedì 2026-11-09.** Metriche: posizione di `indonesia itinerary` (oggi 44,7) e
`indonesia trip itinerary` (oggi 20) sulla pagina, impression del cluster (oggi
circa 45 in 28 giorni). Successo: `indonesia itinerary` sotto 30 e cluster sopra
80 impression. Non ritoccare la pagina prima di quella data.
