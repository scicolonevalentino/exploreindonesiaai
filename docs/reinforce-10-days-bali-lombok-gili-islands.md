# Piano di rinforzo: /trips/10-days-bali-lombok-gili-islands

> **STATO: APPLICATO il 2026-10-14** dal generatore delle 8:05 (PARTE 3), senza
> toccare title né meta. Registro dell'applicazione in fondo al documento,
> sezione 8. La PARTE 1 del 2026-09-18 (transazione `GZN56eWgvw9k2wjtdMA5m7`)
> resta separata e invariata.

Generato dal task schedulato del 2026-09-18, su dati GSC 2026-08-19 → 2026-09-15.

Coda dei piani residui al momento della scrittura: **uno** in attesa,
`docs/reinforce-20-days-across-indonesia.md`, scritto il 2026-09-16. Con questo
la coda arriva a due, cioè al tetto. La prossima run non potrà scrivere un terzo
piano finché uno dei due non viene applicato o chiuso.

---

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/10-days-bali-lombok-gili-islands`
Sorgente: **Sanity**, `_id` `8d8d8cc6-000e-4388-9019-17cda00b8a34`
(attenzione: **non** segue la convenzione `itinerary-<slug>`; una patch su
`itinerary-10-days-bali-lombok-gili-islands` fallisce con `documentNotFoundError`).

GSC, 28 giorni, 2026-08-19 → 2026-09-15, dimensione pagina:

| | impression | click | CTR | posizione |
| --- | ---: | ---: | ---: | ---: |
| `/trips/10-days-bali-lombok-gili-islands` | **187** | 3 | 1,60% | **27,8** |

Sulla dimensione query + pagina, il cluster che conta:

| query | impression | click | posizione |
| --- | ---: | ---: | ---: |
| bali lombok gili islands | **11** | 0 | **45,0** |
| bali and gili islands | 10 | 0 | **58,4** |
| bali island hopping itinerary | 6 | 0 | 64,5 |
| indonesia itinerary 10 days | 5 | 0 | 64,8 |
| lombok itinerary 10 days | 3 | **1** | 14,7 |
| 10 day itinerary bali and gili islands | 3 | 0 | 16,3 |
| bali and lombok itinerary | 2 | 0 | 25,5 |
| bali lombok gili islands itinerary 2 weeks | 2 | 0 | 43,5 |
| gili islands itinerary | 2 | 0 | 75,0 |

Lo schema è netto: quando la query nomina **Lombok**, la pagina sta fra 11 e 25.
Quando la query nomina **le isole in blocco** ("bali lombok gili islands", "bali
and gili islands", "bali island hopping"), crolla fra 45 e 65. La pagina è
riconosciuta come pagina di Lombok, non come pagina di island hopping.

## 2. Perché non ranka

Quattro cause, in ordine di peso.

**2.1 Il title conteneva una `&` e troncava "Gili".** Valore in produzione fino
al 2026-09-18: `Bali, Lombok & Gili in 10 Days: Island-Hop Plan`. La query è
`bali lombok gili islands`, con "islands" al plurale e senza congiunzione
simbolica. Sullo stesso sito la correzione della `&` ha un precedente misurato:
su `9-days-lombok-gili-honeymoon` la query di testa è passata da posizione 60,0 a
37,0 in 28 giorni (documentato in `docs/reinforce-lombok-gili-honeymoon.md`).
**Questa è la PARTE 1 ed è già applicata**, quindi non fa parte del residuo. È
elencata qui solo perché senza di essa il resto del piano non si legge.

**2.2 Cannibalizzazione reale con `/trips/10-days-bali-gili-islands`.** Sulla
query `bali and gili islands` (33 impression totali) Google alterna le due
pagine: 23 impression a `10-days-bali-gili-islands` a posizione 61,3 e 10 a
questa a 58,4. Nessuna delle due passa. Entrambe hanno dieci giorni nel titolo,
entrambe passano da Ubud, Gili Trawangan e Uluwatu, e la differenza vera, cioè
che una include Lombok e l'altra no, non compare in nessun H2 di nessuna delle
due. Va dichiarata dentro il corpo, non solo nel title.

**2.3 Zero tabelle comparative.** L'articolo ha 91 blocchi e **nessun blocco
`comparisonTable`**. Sul sito le due pagine che hanno recuperato posizioni nel
2026 (`10-days-sulawesi-toraja-bunaken`, `7-days-pulau-weh-sabang-diving-beach`)
lo hanno fatto con l'aggiunta di tabelle. Il formato comparativo è anche quello
più citato dai motori generativi. Su una query che è letteralmente una scelta fra
due o tre isole, non avere una tabella è il buco più grosso.

**2.4 Nessun H2 in forma di domanda.** I 19 H2 sono tutti etichette o
"Day N: ...". Le domande esistono solo nelle FAQ, cioè fuori dal corpo, dove i
motori generativi le estraggono meno volentieri. Le tre query non servite
(`bali island hopping itinerary`, `bali and gili islands`, `indonesia itinerary
10 days`) non hanno una sezione che risponda direttamente.

**Cosa NON è la causa:** l'orfanaggio. La pagina riceve link in entrata da
`7-days-bali-first-timers`, `10-days-bali-gili-islands`, `7-days-bali-couples`,
dalla guida `best-islands-near-bali`, dalla hub `/destinations/lombok-gili`
(`src/data/destinations.ts:1116`), da `/indonesia-travel-costs` e da due rotte
transport. Aggiungere altri link qui non è la leva.

**La SERP è aggredibile.** I primi risultati per `bali lombok gili islands
itinerary 10 days` sono Intrepid Travel, Best at Travel, thewanderingquinn,
happyirishwanderers, outofofficegal, nomadicated, cioè tour operator e blog di
viaggio. Nessun sito istituzionale, nessun aggregatore dominante. Questo cluster
si può vincere con il contenuto, a differenza di `/visa-guide`.

## 3. Il title, testo esatto

**Già applicato come PARTE 1 il 2026-09-18.** Riportato per tracciabilità.

| campo | valore vecchio | valore nuovo |
| --- | --- | --- |
| `metaTitle` | `Bali, Lombok & Gili in 10 Days: Island-Hop Plan` (46 car.) | `Bali, Lombok and the Gili Islands: A 10-Day Itinerary` (53 car.) |
| `metaDescription` | `A decision-led 10-day Bali, Lombok and Gili itinerary: Ubud, Kuta Lombok, Gili Trawangan, Uluwatu, with booking logic and honest transfer warnings.` (146 car.) | `Bali, Lombok and the Gili Islands in one 10-day route. Ubud, Kuta Lombok, Gili Trawangan, Uluwatu, with boat times and honest transfer days.` (140 car.) |

Per annullare: rimettere i due valori della colonna sinistra sul documento
`8d8d8cc6-000e-4388-9019-17cda00b8a34`. Nient'altro è stato toccato.

**Il campo `title` NON va toccato.** Su un articolo guida H1, headline JSON-LD,
breadcrumb e ogni card nei listing, oltre undici punti nel codice. Il valore
attuale, `10 Days in Bali, Lombok and the Gili Islands`, è già corretto per il
cluster e distinto dal nuovo `metaTitle`. Lasciarlo dov'è.

## 4. Le sezioni da aggiungere

Quattro blocchi, tutti da inserire **prima** di "What to book early", cioè dopo
il Day 10. Le prime frasi sono autoconclusive e stanno fra 40 e 60 parole, come
richiesto dallo standard GEO.

### 4.1 Nuovo H2: `Bali, Lombok or the Gilis: which ones should you actually pick?`

Prima frase, testo esatto:

> Take all three only if you have ten days or more. With seven, pick Bali and the
> Gilis and leave Lombok out, because Lombok is the island that needs a car and
> two nights before it gives anything back. With fourteen, add south Lombok
> properly rather than adding a fourth island to the list.

Poi una **`comparisonTable`** subito sotto:

| colonna | | | |
| --- | --- | --- | --- |
| Island | What it gives you | Nights it needs | Leave it out if |
| Bali (Ubud) | Temples, rice terraces, the soft landing | 2 to 3 | You have been before |
| Bali (Uluwatu) | Cliffs, surf, the airport-side finish | 2 | You are flying out of Lombok |
| Lombok (Kuta) | Open coast, space, almost no crowds | 3 | Your trip is under nine days |
| Gili Trawangan | Car-free days, easy snorkelling | 2 to 3 | You want quiet over nightlife |
| Gili Air or Meno | The same water, half the noise | 2 | You want restaurants after nine |

Questa tabella è anche la risposta alla cannibalizzazione del §2.2: dice
esplicitamente quando **non** prendere Lombok, che è la condizione in cui il
lettore dovrebbe stare sull'altra pagina.

### 4.2 Nuovo H2: `How do you island hop between Bali, Lombok and the Gilis?`

Prima frase, testo esatto:

> Fast boats link Bali, Lombok and the Gilis daily from Padang Bai and Serangan,
> with crossings of roughly two to two and a half hours, and short flights link
> Denpasar and Lombok in under an hour. The boats are cheaper and scenic, the
> flights are the reliable option in rough months.

Sotto, una seconda **`comparisonTable`** con le tratte: da, a, mezzo, durata
indicativa, quando preferirlo. Riempirla **solo** con le tratte già verificate
vive su 12Go e citate nella memoria (`bali/lombok`, `bali/gili-trawangan`,
`lombok/bali`, `gili-trawangan/bali`), non con tratte inventate.

Nel corpo di questa sezione va inserito il link affiliato 12Go già presente
nell'articolo (`12GO_GILI_TRAWANGAN_BALI`), oppure ne va creato uno per la
tratta `bali/lombok` seguendo il formato deep link di tratta. **Verificare nel
browser in-app prima**, non con curl: 12Go risponde HTTP 202 a qualsiasi path.

### 4.3 Nuovo H2: `Is 10 days enough for Bali, Lombok and the Gili Islands?`

Prima frase, testo esatto:

> Ten days is the minimum that works, and it works only because this route moves
> in one direction. You spend roughly two days in transit out of ten, change bed
> four times, and give each island two or three nights. Nine days forces you to
> drop one island, not to shorten all three.

Questa domanda esiste già come FAQ. Va **duplicata nel corpo** con una risposta
più lunga, non spostata: le FAQ alimentano lo schema `FAQPage` e vanno lasciate
dove sono.

### 4.4 Nuovo H2: `What does this route cost for ten days?`

Prima frase, testo esatto:

> Budget roughly 980 to 1,400 US dollars per person for ten days at a mid-range
> level, excluding international flights, plus about 40 to 70 dollars for the
> Denpasar to Lombok hop if you fly it. Boats, not beds, are the line that varies
> most between a cheap version of this trip and an expensive one.

Le cifre vanno prese **identiche** da `/indonesia-travel-costs`, sezione
`#whole-trip`, che pubblica già 420-700 / 980-1.400 / 2.100-3.500 per due
settimane e 40-70 dollari a volo interno. Se divergono, le due pagine si
contraddicono a vicenda. Il link interno a `/indonesia-travel-costs` va in
questa sezione.

## 5. I link interni da aggiungere

L'orfanaggio non è il problema, quindi qui serve poco e mirato.

1. **Da questa pagina verso `/trips/10-days-bali-gili-islands`**, dentro la
   sezione 4.1, con anchor che dichiara la differenza: "if you drop Lombok, the
   ten day Bali and Gili Islands route is the same trip without the ferry day".
   Il link inverso esiste già. Serve a dire a Google quale delle due sta a valle
   dell'altra.
2. **Da `/destinations/bali`** verso questa pagina. La hub Bali non la linka
   affatto (`grep` su `src/data/destinations.ts` trova solo la voce in
   `lombok-gili`, riga 1116). Una sottosezione "Can you add Lombok to a Bali
   trip?" sulla hub Bali è il singolo link in entrata che manca davvero.
3. **Dalla guida `best-islands-near-bali`** il link esiste già. Non toccarla.

## 6. Trappole note, da rileggere prima di applicare

- Gli item degli array in questo dataset **spesso non hanno `_key`**. Una patch
  con selettore `body[_key=="..."]` non matcha nulla e **restituisce comunque
  200 con l'ID del documento**, sembrando riuscita. Rileggere l'array `body`
  intero, modificarlo in memoria, riscriverlo intero, e **ri-verificare con una
  query** dopo la mutation.
- `_id` del documento: `8d8d8cc6-000e-4388-9019-17cda00b8a34`. Non
  `itinerary-<slug>`.
- Ogni nuovo `affiliateLinkRef` deve avere la voce corrispondente in
  `affiliateLinks` **con `affiliateUrl` non vuoto**, altrimenti il CTA diventa
  testo morto.
- Niente trattini lunghi, niente frasi bandite.

## 7. Su cosa si misura

Metrica primaria: **posizione media della query `bali lombok gili islands`** su
questa pagina. Baseline da battere: **45,0 con 11 impression e 0 click**.

- **2026-10-16**, quando la sola PARTE 1 avrà 28 giorni pieni più il lag GSC.
  Attesa dalla sola correzione della `&`, sulla base del precedente
  `9-days-lombok-gili-honeymoon` (60,0 → 37,0): qualcosa fra 28 e 35.
- Metrica secondaria: la posizione della pagina nel complesso, oggi **27,8**, e
  se `bali and gili islands` smette di alternare fra le due URL.
- Se questo piano viene applicato **prima** del 16 ottobre, i due effetti non
  sono più distinguibili e si misura solo il combinato. Registrare qui sopra la
  data di applicazione quando succede.

Soglia onesta: se al 16 ottobre la query resta sopra 40 con la `&` già tolta, il
title non era il vincolo, e la leva diventa il contenuto delle sezioni 4.1 e 4.2.
Se anche quelle non muovono nulla entro 28 giorni dalla loro applicazione, il
cluster va chiuso come sono stati chiusi `islands near bali` il 2026-08-29 e il
cluster Bali generico.


---

## 8. Registro dell'applicazione, 2026-10-14

Applicato dal task schedulato con `scripts/patch-bali-lombok-gili-geo-2026-10-14.py`
(transazione Sanity `Zv9EDjKnoLgJA5HG3GphBs`), più una correzione di coerenza.

**Perché adesso e non dopo il 16 ottobre.** La PARTE 1 ha già 23 giorni di dati
GSC (2026-09-18 → 2026-10-11) e la query di testa non si è mossa nel verso
atteso: `bali lombok gili islands` è passata da **45,0** a **49,2** (12
impression, 0 click). È la soglia del §7: il title non era il vincolo. Il
contenuto applicato oggi non può comparire nei dati GSC fino a fine ottobre,
quindi la lettura del 16/10 sulla sola PARTE 1 resta pulita.

**Cosa è cambiato sul documento `8d8d8cc6-000e-4388-9019-17cda00b8a34`:**

1. Quattro H2 nuovi, inseriti prima di "What to book early" (blocchi con
   `_key` che inizia per `r1014-`, 14 blocchi in tutto, body da 91 a 105):
   - `Bali, Lombok or the Gilis: which ones should you actually pick?` + tabella
     isole (testo §4.1, con "almost no crowds" ammorbidito in "far fewer
     crowds" e Uluwatu a 1-2 notti per coerenza col Day 9-10) + link 5.1 verso
     `/trips/10-days-bali-gili-islands`.
   - `How do you island hop between Bali, Lombok and the Gilis?` + tabella tratte
     (solo tratte 12Go verificate vive) + link affiliati.
   - `Is 10 days enough for Bali, Lombok and the Gili Islands?` (FAQ lasciata dov'era).
   - `What does this route cost for ten days?` + link a `/indonesia-travel-costs`.
2. **Correzione al piano, §4.4.** Il testo proposto diceva 980-1.400 dollari per
   dieci giorni, ma su `/indonesia-travel-costs` quella è la cifra **di due
   settimane**. Applicato invece 700-1.000 dollari per dieci giorni mid-range
   (le stesse fasce giornaliere moltiplicate), più 40-70 per il volo e 25-42 a
   fast boat, cifre già presenti nella pagina.
3. Nuovo affiliato `12GO_BALI_LOMBOK` →
   `https://12go.asia/en/travel/bali/lombok?z=16022946`, verificato vivo nel
   browser in-app il 2026-10-14 (volo più veloce 40 min, Wings Air e fast boat).
   L'array `affiliateLinks` è stato riscritto intero (gli item esistenti non
   hanno `_key`).
4. **Coerenza:** due menzioni "around 25 minutes" del volo Bali-Lombok (Day 3 e
   "Before you build") portate a "around 40 minutes", il dato 12Go attuale.
5. Campo non renderizzato `seoNote` con baseline e date.
6. **Link 5.2 applicato in codice:** nuova subsection
   `Can you add Lombok to a Bali and Gili trip?` sulla hub `/destinations/bali`
   (`src/data/destinations.ts`, commento datato), con link a questa pagina.

**Per annullare:** rimuovere dal `body` i blocchi con `_key` `r1014-*`, togliere
la voce `12GO_BALI_LOMBOK` da `affiliateLinks`, rimettere "around 25 minutes"
nei due blocchi `k2c` e `k6g`, e togliere la subsection dalla hub Bali. Lo
snapshot completo è in `content/articles/10-days-bali-lombok-gili-islands.json`.

**Baseline (GSC 2026-09-14 → 2026-10-11):** pagina 33 impression, 0 click sulla
dimensione query+pagina (159 impression, posizione 14,5 sulla dimensione
pagina); `bali lombok gili islands` 12 impression a 49,2; `bali gili lombok` 4
a 50,8; `bali island hopping itinerary` 2 a 59,5.

**Rileggere il 2026-11-11.** Successo: `bali lombok gili islands` sotto 35,
oppure la pagina che comincia a raccogliere `bali island hopping itinerary`.
Se resta sopra 40, il cluster si chiude come `islands near bali`.
