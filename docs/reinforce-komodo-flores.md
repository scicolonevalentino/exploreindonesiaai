# Piano di rinforzo: /destinations/komodo-flores

> **STATO: PARTE 1 APPLICATA il 2026-08-24**, commit `04635ae`, pushata su `main`.
> Sono in produzione solo `metaTitle`, `metaDescription` e il nuovo `h1`.
> **Le sezioni della sezione 4 e i link della sezione 5 NON sono applicati: decide il founder.**

Generato dal task schedulato del 2026-08-24.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/destinations/komodo-flores`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `komodo-flores`, riga ~588) e viene renderizzato da
`src/routes/destinations.$destination.tsx`.

Cluster GSC, 28 giorni (2026-07-25 → 2026-08-21, dimensioni page+query):
**43 impression, 0 click, posizione media 34,2** su 16 query.

| Query                                 | Impr | Pos      |
| ------------------------------------- | ---: | -------: |
| flores komodo dragon                  |   10 | **16,2** |
| komodo dragon flores island           |    4 |     55,0 |
| komodo dragons on flores              |    4 |     30,5 |
| flores island komodo dragons          |    4 | **21,8** |
| dragon dive komodo                    |    3 |     50,3 |
| komodo dragons on flores island       |    3 |     33,7 |
| flores indonesia komodo dragons       |    2 |     33,0 |
| flores island indonesia komodo dragon |    2 |     22,0 |
| flores island komodo                  |    2 |     21,5 |
| komodo national park flores           |    2 |     72,0 |
| bali flores komodo                    |    2 |     66,5 |
| flores and komodo national park       |    1 |     22,0 |
| komodo flores                         |    1 |     28,0 |
| explore komodo                        |    1 |     46,0 |
| _(altre 2, incluso 1 site: operator)_ |    2 |    76-87 |

Il cluster è **monotematico**: dodici query su sedici chiedono la stessa cosa,
cioè **se e dove si vedono i draghi di Komodo su Flores**. Non è una ricerca di
itinerario, è una domanda informativa che precede la prenotazione.

## 2. Perché non ranka

**a) Il titolo non conteneva la query.** Il vecchio `metaTitle` era
`Komodo & Flores itineraries, boats, dragons, dives`: un elenco di sostantivi
che non corrisponde a nessuna delle sedici query. La parola "dragons" c'era, ma
staccata da "Flores" e senza la relazione che l'utente sta cercando.

**b) Il vecchio H1 era "Komodo & Flores"**, cioè l'etichetta di navigazione, non
una frase che qualcuno scriverebbe. Entrambi corretti nella PARTE 1.

**c) Manca completamente la risposta.** La pagina oggi ha `intro` più
`highlights` e poi la lista degli itinerari. Non ha nemmeno una riga che dica
dove vivono i draghi. L'intro li nomina di sfuggita ("and the dragons
themselves") in una frase che parla di paesaggi. Chi arriva dalla SERP con la
domanda "vivono su Flores?" non trova la risposta e torna indietro: questo
spiega gli 0 click a posizione 16-22 su tre query.

**d) Non è cannibalizzazione.** Sedici query su sedici puntano a questa sola
URL. Le guide `best-time-to-visit-komodo`, `things-to-do-in-labuan-bajo` e
`diving-in-komodo` non competono su questo cluster.

**e) La SERP è vincibile.** Davanti ci sono un'ONG di conservazione
(komododragon.org, Komodo Survival Program), Mandai Nature, blog di viaggio
(jackandjilltravel.com) e operatori locali (komodocruisestour.com,
flores-indonesia.com), più un vecchio pezzo CNBC. Nessun sito governativo o
grande aggregatore. È esattamente il profilo su cui il pattern comparativo del
sito ha già funzionato: `/destinations/java/borobudur-vs-prambanan` sta a
posizione 7,9.

## 3. Title e meta (GIÀ APPLICATI il 2026-08-24)

Registrati qui per poter annullare in dieci secondi.

| Campo             | Valore VECCHIO (testo esatto)                                                                                                     | Valore NUOVO (in produzione)                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `h1`              | _(campo assente, ripiegava su `name`)_ → renderizzava **Komodo & Flores**                                                          | `Komodo Dragons and Flores` (25 car.)                                                                                                        |
| `metaTitle`       | `Komodo & Flores itineraries, boats, dragons, dives` (50 car.)                                                                     | `Komodo Dragons on Flores: Where to See Them, Day by Day` (56 car.)                                                                          |
| `metaDescription` | `Multi-day Komodo boat trips, Flores overland routes, and dive itineraries. Every plan is structured day by day and ready to book.` (129 car.) | `Komodo dragons live on Komodo, Rinca and parts of Flores. Where to see them from Labuan Bajo, plus day-by-day Komodo and Flores itineraries.` (140 car.) |

**Per annullare:** `git revert 04635ae`, oppure rimettere a mano i tre valori
della colonna centrale in `src/data/destinations.ts` e togliere la riga `h1:`.

## 4. Le sezioni da aggiungere (NON applicate)

Vanno nell'array `sections` della voce `komodo-flores`. Il template
`DestinationSection` accetta `heading`, `body` (array di paragrafi), `table`
opzionale, `subsections` opzionali e **un solo `link` per sezione**.

Regola GEO: il **primo paragrafo di ogni sezione deve rispondere da solo in
40-60 parole**. Sotto, il testo esatto proposto.

### H2 1 — "Do Komodo dragons live on Flores?"

> Yes, but not everywhere. Komodo dragons live wild on Komodo, Rinca, Nusa Kode
> and Gili Motang inside Komodo National Park, and in a few pockets on the west
> and north coasts of Flores itself. Nearly every traveller sees them inside the
> park, on Rinca or Komodo, not on Flores.

Secondo paragrafo: spiegare che Flores è l'isola grande accanto al parco e che
Labuan Bajo, il porto d'imbarco, sta sulla punta ovest di Flores, il che è
esattamente la ragione della confusione nella query.

**Link della sezione:** `/destinations/komodo-flores/things-to-do-in-labuan-bajo`,
anchor "what there is to do in Labuan Bajo".

### H2 2 — "Where do you actually see the dragons, Komodo or Rinca?"

> Rinca, for most people. Loh Buaya on Rinca is closer to Labuan Bajo, the
> walking trails are shorter and drier, and the dragon density is higher: the
> park estimates well over a thousand animals there. Komodo Island has the name
> and the longer boat ride, and fits a two-day trip better than a day trip.

**Tabella comparativa obbligatoria**, è il formato più citato dagli AI:

| Island        | Boat time from Labuan Bajo | Terrain          | Chance of seeing dragons             | Best for                    |
| ------------- | -------------------------- | ---------------- | ------------------------------------ | --------------------------- |
| Rinca         | About 1 to 2 hours         | Short dry trails | Highest, the densest population      | Day trips, first visit      |
| Komodo Island | About 3 to 4 hours         | Longer trails    | High, but a bigger island to cover   | Overnight and boat trips    |
| Flores coast  | On the island itself       | Scattered pockets | Low, no organised viewing            | Not a plan, an accident     |
| Padar         | About 3 hours              | Steep viewpoint  | None, no resident dragons            | The photograph, not the animal |

⚠️ **Da verificare prima di pubblicare:** i tempi di navigazione vanno allineati
a quelli già pubblicati negli articoli `5-days-labuan-bajo-komodo` e
`10-days-komodo-flores` e nella guida `liveaboard-vs-day-trip-labuan-bajo`. Se
divergono, vince il valore già in produzione, come nel caso Lombok del 2026-08-19.

**Link della sezione:** `/destinations/komodo-flores/liveaboard-vs-day-trip-labuan-bajo`,
anchor "liveaboard or a day boat".

### H2 3 — "How much does it cost to enter Komodo National Park?"

> Budget around IDR 250,000 per person per day as the marine park entry for
> foreign visitors, plus a ranger fee of roughly IDR 200,000 per group of up to
> five on the Komodo and Rinca trails. Operators often sell a bundled ticket
> instead. Fees change, so check the current official guidance.

⚠️ **Numeri da riverificare alla fonte ufficiale prima di pubblicare.** Le cifre
qui sopra vengono da operatori di Labuan Bajo, non dal sito del parco: nel 2026
circolano anche biglietti consolidati intorno a IDR 650.000 (rotta Komodo) e
IDR 900.000 (rotta Rinca), oltre a un **tetto giornaliero di visitatori e a un
sistema di prenotazione anticipata** introdotti nel corso del 2026. Il tetto è
la parte editorialmente più preziosa, perché nessuno dei blog davanti a noi lo
spiega bene, ma va confermato prima di scriverlo come fatto.

**Link della sezione:** `/trips/5-days-labuan-bajo-komodo`, anchor
"a five-day Labuan Bajo and Komodo route".

### H2 4 — "How many days do you need for Komodo and Flores?"

> Three days covers Komodo National Park from Labuan Bajo and nothing else. Five
> to seven days adds Rinca, Padar and a proper snorkelling day. Ten days is the
> point at which overland Flores becomes possible, with Kelimutu and the villages
> inland, and that is a different and much slower trip.

**Link della sezione:** `/destinations/komodo-flores/kelimutu-guide`, anchor
"the Kelimutu crater lakes".

### H2 5 — "When is the best time to see Komodo dragons?"

> The dry season, broadly April to September, when trails are firm and boats run
> reliably. Dragons are active year-round, but they move less in the hottest part
> of the day and are easier to find in the cooler morning hours. Mating season
> brings more visible activity and also more caution from rangers.

⚠️ Allineare mese per mese alla guida `best-time-to-visit-komodo` già live: se
divergono, riscrivere questa e non quella.

**Link della sezione:** `/destinations/komodo-flores/best-time-to-visit-komodo`,
anchor "when to go to Komodo".

## 5. Link interni da aggiungere (NON applicati)

La pagina è già raggiunta dalla navigazione e dalla home. Il problema non è il
PageRank interno, è la pertinenza. Detto questo, due link contestuali valgono la
pena perché arrivano da pagine che ranno già sullo stesso tema:

1. **Da `/trips/14-days-bali-komodo-sumba`** (che prende 3 impression a
   posizione 10,7 su "komodo to sumba", la nostra migliore posizione dell'area):
   link in-content all'hub con anchor "Komodo dragons and Flores".
2. **Da `/indonesia-travel-costs`** (4.515 impression, la pagina più vista del
   sito): nella sezione dei costi per parco, una riga sui biglietti di Komodo con
   link all'hub, anchor "Komodo National Park fees".

Metodo obbligatorio se il link va dentro un articolo Sanity: **rileggere
l'array `body` intero, modificarlo in memoria e riscriverlo tutto.** Un selettore
`[_key=="..."]` non matcha e la mutation restituisce comunque 200.

## 6. Cosa NON fare

- Non aggiungere una sezione sui draghi su Flores che prometta più di quanto la
  pagina possa mantenere. I draghi sulla costa di Flores esistono ma non sono
  visitabili in modo organizzato: dirlo chiaramente è il vantaggio competitivo,
  non un problema.
- Non riscrivere il `title` degli articoli figli. Su un articolo `title` guida
  H1, JSON-LD, breadcrumb e ogni card nei listing (verificato il 2026-08-07).
- Non ritoccare di nuovo `metaTitle` e `h1` di questa pagina prima del
  **2026-09-21**, cioè 28 giorni pieni dopo la PARTE 1.

## 7. Cosa aspettarsi

Il segnale da leggere lunedì **22 settembre 2026** sulla finestra 28 giorni:
posizione media di `/destinations/komodo-flores` da **34,2** verso la fascia 20-25
per il solo effetto title/H1, e i primi click su `flores komodo dragon` (oggi 10
impression a posizione 16,2, zero click). Se il title da solo muove la posizione
ma non i click, il collo di bottiglia è il contenuto mancante ed è il momento di
applicare la sezione 4. Se non muove nemmeno la posizione, il cluster è troppo
piccolo per meritare altro lavoro e va chiuso come `bali-nearby-islands`.
