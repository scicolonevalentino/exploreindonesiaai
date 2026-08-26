# Piano di rinforzo: `/trips/5-days-bali-ubud-canggu-uluwatu`

> **STATO: NON APPLICATO. Decide il founder.**
> Generato dal task schedulato del 2026-08-26. La PARTE 1 di quella run ha già
> applicato `metaTitle` e `metaDescription` in produzione (transazione
> `SseX7szR4uwwNDZHqDBqUY`). Tutto il resto di questo documento è una proposta.

## 1. La pagina, il cluster, i numeri

Pagina: `https://exploreindonesia.ai/trips/5-days-bali-ubud-canggu-uluwatu`
Documento Sanity: `27fa5aae-afe5-4993-90e7-6e7f7f3a47c0`

Finestra GSC 2026-07-27 → 2026-08-23 (28 giorni):

**419 impression, 0 click, posizione media 10,9.**

È la più grande concentrazione di impression a zero click del sito su una pagina
mai toccata da una run precedente, e a differenza di
`/destinations/bali-nearby-islands` (951 impression a posizione 49,4) sta in una
posizione da cui un click è realisticamente ottenibile.

Le query visibili (GSC anonimizza il resto, quindi queste ~23 impression sono un
campione, non il totale):

| Query                             | Impr |  Pos |
| --------------------------------- | ---: | ---: |
| ubud or canggu                    |    4 | 41,8 |
| canggu or uluwatu                 |    3 | 23,7 |
| ubud and canggu                   |    2 |  6,5 |
| ubud and uluwatu                  |    2 |  8,0 |
| ubud and uluwatu travel routes    |    2 | 27,5 |
| uluwatu vs ubud                   |    2 | 13,0 |
| canggu and uluwatu                |    1 | 17,0 |
| canggu ubud                       |    1 | 34,0 |
| ubud canggu                       |    1 |  8,0 |
| ubud or uluwatu                   |    1 | 58,0 |
| ubud to uluwatu driving time 2026 |    1 | 11,0 |

Il pattern è netto e coerente: **l'intento è comparativo, non itinerario.**
Chi digita "ubud or canggu" sta decidendo dove dormire, non cercando un piano
di cinque giorni.

## 2. Perché non prende click

Tre cause, in ordine di peso.

**a) La pagina non contiene una singola sezione comparativa.** I 15 H2 attuali
sono tutti struttura da itinerario: "Who this trip is for", "Trip at a glance",
"Why this route makes sense", i cinque giorni, "What to book early", "Mistakes",
"What to cut", "Before you build this trip", "Final verdict", "Related
itineraries". Nessuno risponde alla domanda "Ubud o Canggu?", e non c'è nessuna
tabella. Google la fa vedere per quelle query perché i tre nomi sono nel titolo,
poi l'utente legge lo snippet e capisce che è un'altra cosa.

**b) È sottile per quella SERP.** 2.009 parole contro post dedicati al confronto
da 2.500-4.000. La SERP per "ubud or canggu" è fatta interamente di blog
editoriali (Indie Traveller, Breathing Travel, Seek Sophie, Roavara, Finns Beach
Club): **nessun sito governativo, nessun grande aggregatore.** È vincibile.

**c) Non è cannibalizzata.** Verificato: per queste query GSC mostra solo questa
URL, mai `/destinations/bali`. Il problema è dentro la pagina.

Nota di contesto: `docs/plan-islands-near-bali-cluster.md` ha chiuso il cluster
"islands near bali" il 2026-08-24 con la conclusione che le pagine di confronto
sono dove lo stesso sforzo rende di più, citando
`/destinations/java/borobudur-vs-prambanan` a posizione 7,9. Questo piano è
l'applicazione diretta di quella conclusione.

## 3. Title e meta

**GIÀ APPLICATO il 2026-08-26 (PARTE 1).** Valori vecchi conservati qui per
poter annullare in dieci secondi.

| Campo             | Vecchio                                                                                                                                              | Nuovo                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metaTitle`       | `Bali in 5 Days: Ubud, Canggu & Uluwatu Trip Plan`                                                                                                    | `Ubud, Canggu or Uluwatu? Do All Three in 5 Days`                                                                                                     |
| `metaDescription` | `5 days in Bali: 2 nights Ubud, 1 Canggu, 1 Uluwatu. Around $200–300 per person on a budget, $500–700 mid-range, flights excluded. Transfer times included.` | `Which base suits you, and how to fit all three in five days: 2 nights Ubud, 1 Canggu, 1 Uluwatu, north to south, with real drive times and costs.` |

Il campo `title` **non è stato toccato**, per la regola del 2026-08-07: su un
articolo `title` guida H1, headline JSON-LD, breadcrumb e ogni card nei listing,
oltre 11 punti nel codice, e non è un ritocco reversibile in dieci secondi.

**Proposta da approvare (punto 6).** Se le sezioni qui sotto vengono applicate,
il `title` andrebbe allineato:

- attuale: `5 Days in Bali: Ubud, Canggu and Uluwatu`
- proposto: `Ubud, Canggu or Uluwatu: How to Do All Three in 5 Days` (55 caratteri)

Da decidere **dopo** le sezioni, non prima: senza contenuto comparativo un titolo
comparativo è una promessa che la pagina non mantiene, e peggiora il pogo-sticking.

## 4. Le sezioni H2 da aggiungere

Quattro sezioni nuove, tutte in forma di domanda, ognuna con la prima risposta
autoconclusiva in 40-60 parole. Vanno inserite **dopo "Why this route makes
sense" e prima di "Day 1"**, così il blocco comparativo sta sopra la piega e i
giorni restano dove sono.

### 4.1 `Ubud or Canggu: which should you base in?`

Prime 40-60 parole (blocco di risposta):

> Ubud if you want temples, rice terraces and cool evenings, Canggu if you want
> to walk to a beach and eat well at midnight. Ubud sits inland, about an hour
> from the nearest coast, and costs noticeably less. Canggu is on the sand and
> is one of the pricier parts of the island.

Poi il paragrafo lungo, la tabella (4.4) e la conclusione: su cinque giorni la
risposta pratica è entrambe, due notti a Ubud e una a Canggu, che è esattamente
l'itinerario sotto.

### 4.2 `Is Uluwatu worth a night, or is it a day trip?`

> A night, if your flight is in the afternoon or later. Uluwatu sits 30 to 45
> minutes from Ngurah Rai airport against an hour and a half from Ubud, so the
> last night there buys you a relaxed final morning instead of a dash north to
> south with luggage.

Poi: il Kecak alle 18 rende il giorno lungo se devi anche rientrare, le spiagge
(Padang Padang, Bingin, Melasti) sono a scogliera e vogliono mezza giornata, e
chi ha il volo la mattina presto può invece dormire a Jimbaran.

### 4.3 `How far apart are Ubud, Canggu and Uluwatu?`

> Ubud to Canggu runs about 1 to 1.5 hours by car, Canggu to Uluwatu about 1 to
> 1.5 hours, and Uluwatu to the airport 30 to 45 minutes in normal traffic.
> Ubud is the furthest point from everything, which is why this route goes north
> to south and never doubles back.

Questa sezione intercetta direttamente `ubud and uluwatu travel routes` (27,5) e
`ubud to uluwatu driving time bali 2026` (11,0), due query che oggi non hanno
nessuna riga di testo dedicata nella pagina. Tutti i numeri esistono già nel
corpo attuale, sparsi nei "Travel note": vanno solo raccolti in un punto.

### 4.4 La tabella comparativa (dentro 4.1)

Tipo `comparisonTable`, caption che dichiara che sono stime di lavoro.

| | Ubud | Canggu | Uluwatu |
| --- | --- | --- | --- |
| Cos'è | Interno, culturale, verde, aria più fresca | Costa ovest, surf, caffè, vita sociale | Falesie a sud, spiagge sotto le scogliere, tramonti |
| Distanza dal mare | Circa un'ora | Ci cammini | Ci scendi a piedi o in scooter |
| Distanza da Ngurah Rai | 1,5 ore, fino a 2,5 nel traffico | 1 ora circa | 30-45 minuti |
| Prezzo relativo | Il più basso dei tre | Il più alto dei tre | Alto sulle falesie, medio nell'entroterra |
| Serate | Presto e tranquille | Tardi e affollate | Kecak alle 18, poi cena vista mare |
| Quante notti su cinque | Due | Una | Una |
| A chi conviene | Chi vuole templi, terrazze e risparmiare | Chi vuole spiaggia e vita | Chi ha il volo nel pomeriggio |

### 4.5 `Which one should you cut if you only have three days?`

> Cut Canggu. It is the shortest stop, the least distinctive of the three, and
> the one whose best parts (beach, coffee, sunset) Uluwatu also has. Three days
> works as two nights in Ubud and one near Uluwatu, with the drive south taken
> in the middle of the day.

## 5. Le FAQ da aggiungere

Alle sei attuali, aggiungere due domande in linguaggio naturale:

- `Should I stay in Ubud or Canggu?`
- `How long does it take to drive from Ubud to Uluwatu?`

## 6. I link interni da aggiungere

**In entrata** (queste mancano, ed è la leva più economica):

1. Da `/destinations/bali`, nella sezione di apertura, ancora `Ubud, Canggu or
   Uluwatu`. La hub Bali oggi non punta a questa pagina con un'ancora
   comparativa.
2. Da `/trips/7-days-bali-first-timers`, ancora `which base suits you`, perché
   il lettore di quella pagina si sta ponendo la stessa domanda con due giorni in più.

**In uscita**, dalla nuova sezione 4.2, verso
`/destinations/bali/where-to-stay-in-bali`, che è la guida di supporto già live
sullo stesso tema.

## 7. Cosa aspettarsi

Il target non è la posizione, che a 10,9 è già accettabile: è **il CTR, oggi a
zero su 419 impression.** Il metaTitle nuovo lavora da solo da subito. Le
sezioni, se approvate, dovrebbero portare le query comparative lunghe
(`ubud or canggu` a 41,8, `canggu ubud` a 34,0, `ubud or uluwatu` a 58,0) dentro
la prima pagina, perché oggi rankano per associazione di nomi e non per
pertinenza.

Verifica il lunedì: click e CTR su `/trips/5-days-bali-ubud-canggu-uluwatu`,
finestra 28 giorni. Un singolo click è già un cambio di stato rispetto a zero.
