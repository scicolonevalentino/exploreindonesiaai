# Piano di rinforzo: /trips/10-days-sulawesi-toraja-bunaken

> **STATO: NON APPLICATO. Decide il founder.**
> Generato dal task schedulato del 2026-09-02 (PARTE 3). La coda dei piani in
> attesa era vuota: tutti e dodici i piani precedenti risultano applicati.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/10-days-sulawesi-toraja-bunaken`
\_id Sanity: `itinerary-10-days-sulawesi-toraja-bunaken` (contentStatus `live`)

Cluster di query (GSC, finestra 2026-08-03 → 2026-08-30):

| query                   | impression | click | posizione |
| ----------------------- | ---------- | ----- | --------- |
| sulawesi route          | 31         | 0     | 46,0      |
| sulawesi itinerary      | 25         | 0     | 53,7      |
| backpacken sulawesi     | 2          | 0     | 24,5      |
| overland sulawesi       | 1          | 0     | 33,0      |
| sulawesi blog           | 1          | 0     | 53,0      |
| south sulawesi itinerary| 1          | 0     | 67,0      |
| sulawesi trip           | 1          | 0     | 98,0      |

**Le due query di testa valgono 56 impression, 0 click, posizione media ~49.**
La pagina nel suo complesso prende 326 impression a posizione 18,5 con 6 click:
la coda anonimizzata ranka molto meglio delle due teste, che è il segnale che il
problema è sul termine generico, non sulla pagina.

**Cannibalizzazione confermata.** `sulawesi route` si divide su due nostre URL:

- `/trips/10-days-sulawesi-toraja-bunaken`, 31 impression, posizione 46,0
- `/trips/14-days-sulawesi-toraja-togean-bunaken`, 3 impression, posizione 5,3

Google non ha deciso quale delle due possiede l'intento. La pagina che prende il
volume sta a 46, quella che prende quasi nulla sta a 5.

## 2. Perché non ranka

**Causa principale: mismatch di forma, non di argomento.** `sulawesi itinerary` e
`sulawesi route` sono query di *scelta della regione*, non di *singola rotta*.
Chi le digita non sa ancora quanti giorni servono né quale braccio dell'isola
prendere. La nostra pagina risponde alla domanda successiva, "come si incastrano
questi dieci giorni".

Controllo reale della SERP (settembre 2026), primi risultati per
`sulawesi itinerary`:

- kimkim, con più itinerari affiancati (14 giorni, 10 giorni, 9 giorni)
- viajeroslowcosteros.com, "Sulawesi Indonesia itinerary | 2, 3, and 4 Weeks"
- sulawesitransfers.com, "Sulawesi Itinerary 3 weeks: A Ultimate Guide"
- luwukbanggai.com, "Sulawesi Indonesia Guide 2026, Makassar, Toraja & Togeans"
- asiktravel.com, "Sulawesi Travel Guide: Four Regions, Routes and Costs"

Nessun risultato istituzionale, nessun aggregatore: **la query è vincibile**, e
supera quindi il test che ha fatto scartare `/visa-guide` il 2026-08-07. Ma
**tutti** i primi risultati aprono confrontando durate o regioni. Nessuno apre
con una rotta sola.

**Cause secondarie, in ordine di peso:**

1. **Zero tabelle comparative sulla pagina.** Verificato:
   `count(body[_type=="comparisonTable"])` restituisce 0. È il formato che su
   questo sito ha la resa dimostrata più alta, `/destinations/java/borobudur-vs-prambanan`
   sta a posizione 7,9, e la nota di chiusura del cluster "islands near bali"
   (2026-08-29) indica proprio i contenuti di confronto come la leva che rende.
2. **La domanda sulla durata esiste solo come FAQ.** "How many days do you need
   for Sulawesi?" è la prima FAQ, cioè in fondo al documento. Non è una forma
   che gli AI answer estraggono, e non è un H2.
3. **Nessuna pagina nostra risponde "quale Sulawesi".** Abbiamo quattro
   itinerari Sulawesi (10 giorni Toraja/Bunaken, 14 giorni con le Togean,
   10 giorni nord diving, 8 giorni Wakatobi) e nessuno che li metta in fila.
   Il termine di testa non ha un proprietario dichiarato, ed è per questo che si
   spacca fra due URL.
4. **Il titolo promette una rotta, non una scelta.** `Sulawesi Itinerary:
   10-Day Toraja to Bunaken Route` contiene la keyword ma dichiara subito che la
   decisione è già stata presa per te.

Da notare: la keyword di testa **è già** nel `metaTitle`. Per questo la pagina è
stata **scartata dalla PARTE 1 di questa run**: un ritocco meccanico di
title/meta qui non ha leva, perché non manca la keyword. Serve la struttura, ed
è esattamente il contenuto di questo piano.

## 3. Il `metaTitle` riscritto (53 caratteri)

```
Sulawesi Itinerary: 10 Days, and How to Pick a Region
```

Valore vecchio, esatto, per un revert immediato:

```
Sulawesi Itinerary: 10-Day Toraja to Bunaken Route
```

Mantiene la promessa dei dieci giorni e aggiunge l'intento di selezione, che è
quello che la SERP premia.

## 4. La `metaDescription` riscritta (152 caratteri)

```
How many days you need for Sulawesi, which of its four regions to pick, and a full 10-day route through Tana Toraja and Bunaken with honest drive times.
```

Valore vecchio, esatto:

```
Ten days is enough for Sulawesi if you pick one half. This route pairs Tana Toraja with Bunaken, with honest drive times and what to book first.
```

## 5. L'H1 (campo `title`) — DA DECIDERE, non applicare alla leggera

Proposta (66 caratteri):

```
10 Days in Sulawesi: Which Region to Pick, and the Road to Bunaken
```

Valore attuale:

```
10 Days in Sulawesi: Tana Toraja, Bunaken and the Long Road Between
```

⚠️ Su un articolo il campo `title` guida H1, headline JSON-LD, breadcrumb e ogni
card nei listing, oltre 11 punti nel codice (verificato il 2026-08-07). Non è un
ritocco reversibile in dieci secondi. **Se hai dubbi, applica le sezioni della
sezione 6 e lascia il `title` com'è:** le sezioni portano quasi tutto il valore.

## 6. Le sezioni H2 da aggiungere

Vanno inserite **subito dopo "Why this route makes sense"**, prima di "Day 1",
così che la risposta autoconclusiva sia alta nel documento.

### 6.1 Nuovo H2: `How many days do you need in Sulawesi?`

Primo paragrafo, 59 parole, autoconclusivo:

> Ten days covers one half of Sulawesi properly, either the Toraja highlands or
> the northern reefs, with one internal flight between them. Two weeks lets you
> add the Togean Islands. Three weeks covers the island end to end. Sulawesi is
> shaped like a starfish and every arm is a separate trip, so the honest first
> decision is which arm.

Segue la tabella durata → cosa entra (nuova, `comparisonTable`):

| Days      | What fits                                  | Flights inside Sulawesi | Best for                       |
| --------- | ------------------------------------------ | ----------------------- | ------------------------------ |
| 7 days    | Toraja only, or Bunaken and Lembeh only    | None                    | A first taste, one region      |
| 10 days   | Toraja plus Bunaken, with the Makassar backtrack | One                | The trip on this page          |
| 14 days   | Toraja, the Togeans, then Bunaken          | One, plus two ferries   | Travellers with schedule slack |
| 21 days   | The island end to end, southeast included  | Two or more             | Repeat visitors to Indonesia   |

### 6.2 Nuovo H2: `Which part of Sulawesi should you visit?`

Primo paragrafo, 54 parole, autoconclusivo:

> South Sulawesi means Tana Toraja and its funeral culture, reached by road from
> Makassar. North Sulawesi means Bunaken, Lembeh and the volcanoes, reached
> through Manado. Central Sulawesi means the Togean Islands and long ferries.
> The southeast means Wakatobi and diving. Most ten-day trips take one region,
> or two if you accept an internal flight.

Segue la tabella delle quattro regioni (nuova, `comparisonTable`), con una riga
per regione: gateway, cosa ci si va a fare, come si arriva, punto debole. Ogni
riga chiude linkando il nostro itinerario di quella regione, il che risolve il
problema 3 della sezione 2.

### 6.3 Nuovo H2: `What is the best route through Sulawesi?`

Primo paragrafo, 58 parole, autoconclusivo:

> There is no single loop, because Sulawesi has no road that joins its arms
> efficiently. The workable routes are all point to point with a flight in the
> middle. Makassar to Toraja and back, then a flight to Manado for Bunaken, is
> the standard ten-day shape. Adding the Togeans means two weeks and two ferries
> on fixed days.

Questo H2 usa la formulazione esatta di `sulawesi route`, la query con più
impression del cluster, una volta sola e in modo naturale. Nessuna ripetizione
altrove.

## 7. I link interni da aggiungere

Obiettivo doppio: dichiarare a Google che la pagina da dieci giorni è la
proprietaria del termine di testa, e chiudere la cannibalizzazione.

| Da                                                    | Anchor proposta                          | A                                       |
| ----------------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| `/trips/14-days-sulawesi-toraja-togean-bunaken`        | how many days you need in Sulawesi       | `/trips/10-days-sulawesi-toraja-bunaken` |
| `/trips/10-days-north-sulawesi-diving-bunaken-lembeh`  | which part of Sulawesi to visit          | `/trips/10-days-sulawesi-toraja-bunaken` |
| `/trips/8-days-wakatobi-diving-southeast-sulawesi`     | the wider Sulawesi picture               | `/trips/10-days-sulawesi-toraja-bunaken` |
| `/destinations/wild-indonesia`                         | start with the 10-day Sulawesi route     | `/trips/10-days-sulawesi-toraja-bunaken` |

Il primo è il più importante dei quattro: è la pagina che sta rubando
`sulawesi route` a posizione 5,3 con 3 impression. Un link contestuale da lì
verso la pagina da dieci giorni dice a Google quale delle due è la risposta al
termine generico.

⚠️ **Trappola nota di Sanity, vale per tutti e tre i link su articolo.** Gli item
degli array in questo dataset spesso non hanno `_key`. Una patch con selettore
`body[_key=="..."]` non matcha nulla e **restituisce comunque 200**. Rileggere
l'array `body` intero, modificarlo in memoria, riscriverlo intero, e
ri-verificare con una query dopo la scrittura.

## 8. Cosa aspettarsi, e quando leggerlo

Le sezioni 6.1 e 6.3 puntano a `sulawesi itinerary` (25 impr, pos 53,7) e
`sulawesi route` (31 impr, pos 46,0). L'ipotesi è che la forma comparativa
sposti entrambe sotto posizione 30 entro 28 giorni, e che la cannibalizzazione
si risolva a favore della pagina da dieci giorni.

**Metrica da leggere il 30 settembre 2026:** posizione media di
`/trips/10-days-sulawesi-toraja-bunaken` sulle due query di testa, e se
`/trips/14-days-sulawesi-toraja-togean-bunaken` è sparita da `sulawesi route`.
Se la posizione non si muove sotto 40, il vincolo non è on-page e il cluster va
trattato come quello di Bali, cioè chiuso.
