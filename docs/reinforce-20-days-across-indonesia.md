# Piano di rinforzo: /trips/20-days-across-indonesia

> **STATO: IN ATTESA DI APPROVAZIONE.** Nessuna riga di questo documento è stata
> applicata. La PARTE 1 di questa run (solo `metaTitle` e `metaDescription`,
> commit `aed8eb9`, transazione Sanity `Cur7UGAjgNh3XJPK3VdZ2M`) è già in
> produzione ed è **separata** da questo piano.

Generato dal task schedulato del 2026-09-16, su dati GSC 2026-08-17 → 2026-09-13.

La coda dei piani residui era **vuota** quando questo è stato scritto: tutti e 17
i `docs/reinforce-*.md` precedenti risultano applicati o chiusi. Questo è quindi
l'unico piano in attesa.

---

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/20-days-across-indonesia`
Sorgente: **Sanity**, `_id` `cdc8b538-9b51-4ad9-8140-1db6818162d3`
(attenzione: **non** segue la convenzione `itinerary-<slug>`, una patch su quel
`_id` fallisce con `documentNotFoundError`).

GSC, 28 giorni, 2026-08-17 → 2026-09-13:

| | impression | click | CTR | posizione |
| --- | --- | --- | --- | --- |
| Totale pagina | **355** | 2 | **0,56%** | **7,6** |
| Query nominate (8 query) | 13 | 0 | 0% | 5-56 |

Le 342 impression restanti sono anonimizzate da Google. Le poche nominate:

| query | impr | pos |
| --- | --- | --- |
| indonesia 20 day itinerary | 6 | 15,2 |
| indonesia 19 day itinerary | 1 | 10,0 |
| how long in indonesia | 1 | 1,0 |
| indonesia travel time | 1 | 56,0 |
| 20 days / 20 dagen | 2 | 1,0-6,0 |

## 2. Perché non converte

**Non è un problema di ranking.** Posizione 7,6 è prima pagina. Il confronto con
i suoi stessi fratelli, nella stessa finestra, isola il difetto:

| itinerario | impr | pos | CTR |
| --- | --- | --- | --- |
| /trips/7-days-yogyakarta-east-java | 145 | 8,4 | **4,83%** |
| /trips/14-days-bali-komodo-sumba | 175 | 9,8 | **3,43%** |
| /trips/14-days-sulawesi-toraja-togean-bunaken | 256 | 7,3 | **2,73%** |
| /trips/14-days-indonesia-bali-java-komodo | 525 | 7,5 | **1,71%** |
| **/trips/20-days-across-indonesia** | **355** | **7,6** | **0,56%** |

A parità di posizione la pagina rende da tre a otto volte meno dei fratelli. La
PARTE 1 ha già affrontato metà della causa, lo snippet. Restano tre cause di
struttura, tutte verificate leggendo il documento vivo il 2026-09-16:

1. **Zero H2 in forma di domanda.** I 126 blocchi del corpo sono tutti `block`,
   e i 29 H2 sono tutte etichette: "Trip at a glance", "Why this route makes
   sense", "Day 4: Fly to Yogyakarta". Nessuna sezione è formulata come la
   persona la digita. È esattamente il difetto corretto il 2026-09-14 su
   `14-days-raja-ampat-divers` e su `best-time-to-visit-komodo`.
2. **Zero `comparisonTable`.** La pagina non ne ha nessuna. Il tipo di blocco
   esiste, è renderizzato da `src/components/ComparisonTable.tsx` e da
   `trips.$slug.tsx` riga 639, ed è usato per esempio in
   `9-days-banda-islands-spice-route`. Il formato comparativo è quello più
   citato dai motori generativi ed è assente dall'itinerario più "comparabile"
   del sito (quattro regioni, tre voli, due alternative di taglio).
3. **Le risposte migliori sono sepolte nelle FAQ.** Le 5 FAQ già chiedono
   "Is 20 days enough to see Bali, Java, Komodo and Lombok?", "How many domestic
   flights will I need?" e "What is the total budget for 20 days across
   Indonesia?". Le risposte ci sono e sono buone, ma vivono solo nell'accordion
   in fondo. Promuoverle a sezioni del corpo è la mossa già validata il 14/09.

**Cannibalizzazione: nessuna** su questa pagina. Il rischio è invece a monte:
`indonesia itinerary` (28 impr, pos 57,4) è stato assegnato deliberatamente a
`/trips` il 2026-09-14, e `30-days-indonesia-ultimate` tiene le formulazioni
"30 days". Questo piano **non deve** rivendicare nessuna delle due.

## 3. Title e meta

**Già applicati nella PARTE 1, non rifarli.** Valori attuali in produzione:

- `metaTitle`: `Indonesia in 20 Days: Bali to Komodo, 3 Flights, 8 Bases` (56 car.)
- `metaDescription`: `Bali, Java, Komodo, Lombok and the Gilis in 20 days: 3 domestic flights, 8 bases, and US$1,500-4,000 per person. Day-by-day route with real travel days.` (152 car.)

Valori precedenti, per un revert in dieci secondi:

- `metaTitle`: `Indonesia in 20 Days: Bali, Java, Komodo & Lombok`
- `metaDescription`: `20 days across Bali, Java, Komodo, Lombok and the Gilis for US$2,500-4,000 mid-range, or US$1,500-2,200 on a budget. Day-by-day route and real travel days.`

**Il campo `title` non va toccato**, né qui né in una run futura senza una
decisione esplicita: su un articolo guida H1, headline JSON-LD, breadcrumb e
ogni card nei listing (finding del 2026-08-07).

## 4. Le sezioni H2 da aggiungere

Tutte e tre vanno **prima** di "Day 1", subito dopo "Why this route makes sense".
Il testo sotto è la prima frase autoconclusiva, da 40 a 60 parole, pronta da
incollare. Il resto della sezione si costruisce con materiale già presente sulla
pagina, non con fatti nuovi.

### 4.1 H2: `Is 20 days enough for Bali, Java, Komodo and Lombok?`

> Yes, but only as a highlights loop. Twenty days across four regions gives you
> roughly three or four nights in each, with three domestic flights and two
> ferry legs between them. You will see Borobudur, two volcano sunrises, Komodo
> and the Gilis. You will not know any of them well. If depth matters more than
> range, do two regions instead.

Sotto: un paragrafo che riprende il "Not ideal for" già scritto in "Trip at a
glance", senza riscriverlo.

### 4.2 H2: `How many domestic flights does a 20-day Indonesia trip need?`

> Three, on this route: Bali to Yogyakarta on day 4, Bali to Labuan Bajo on day
> 10, and Labuan Bajo to Lombok on day 13. Everything else is road, rail or
> ferry, including the Ijen crossing back to Bali on day 9 and the fast boat
> from the Gilis on day 19.

**Correzione da fare nello stesso passaggio:** la sezione "Before you build this
trip" dice oggi *"roughly three to four domestic flights"*, mentre il giorno per
giorno ne contiene esattamente tre. Portare quella riga a "three". È la stessa
cifra che ora sta nel `metaTitle`, quindi l'incoerenza è visibile dalla SERP.

### 4.3 H2: `What does 20 days in Indonesia cost?`

> As a working estimate, mid-range travellers spend US$2,500 to US$4,000 per
> person for twenty days, including the three domestic flights, a Komodo boat
> day, guided volcano tours and park fees. On guesthouses and shared tours the
> same route runs US$1,500 to US$2,200. International flights are excluded and
> prices change, so treat both as planning ranges.

Le cifre sono già pubblicate in "Trip at a glance" e nella FAQ: **non
inventarne di nuove, e non modificarle**. Questa sezione le rende estraibili,
niente di più. È anche l'aggancio naturale verso `/indonesia-travel-costs`, che
è la pagina che tiene tutta la domanda sui costi del sito.

## 5. La tabella comparativa

Una sola, dentro la sezione 4.1, subito dopo la frase di apertura. Blocco
`comparisonTable`, stessa forma usata in `9-days-banda-islands-spice-route`:
`{_type, _key, caption, columns: string[], rows: [{_key, cells: string[]}]}`.

Colonne: `["", "Bali", "Java", "Komodo", "Lombok e Gili"]` (in inglese sulla
pagina). Righe proposte, **tutte ricavabili dal giorno per giorno esistente**:

| | Bali | Java | Komodo | Lombok and the Gilis |
| --- | --- | --- | --- | --- |
| Nights on this route | 5, split between Ubud and Uluwatu | 6, Yogyakarta to Bromo to Ijen | 3, based in Labuan Bajo | 6, Kuta Lombok and Gili Trawangan |
| How you arrive | International flight into Denpasar | Flight to Yogyakarta, day 4 | Flight to Labuan Bajo, day 10 | Flight to Lombok, day 13 |
| The hard part | Nothing, it is the soft landing | Two pre-dawn starts back to back | The boat day is weather-dependent | The fast boats cancel in swell |
| Cut it if | Never, the airport is here | You will not do 3am alarms | Budget is the constraint | You want Java done properly |

La caption deve dire che le notti sono quelle di questa rotta specifica e che i
voli interni sono tre, coerente con la sezione 4.2.

**Seconda tabella: no.** La sezione "What to cut, adapt or upgrade" già copre lo
stesso terreno in prosa ed è scritta bene. Convertirla in tabella è una scelta
editoriale, non un intervento SEO, e non la propongo.

## 6. Link interni

Lo stato reale, verificato: la pagina ha **tre** link interni, tutti nella
sezione "Related itineraries" (`/destinations/bali`,
`/trips/5-days-labuan-bajo-komodo`, `/trips/7-days-lombok-gili-islands`), e
**venti** link affiliati. Non è una pagina orfana e non è sotto-monetizzata, per
cui qui non c'è molto da fare.

**In entrata, esiste già:** `/indonesia-travel-costs` la linka nel callout degli
itinerari per durata (riga 970), e `30-days-indonesia-ultimate` la cita nel
corpo. Non serve aggiungerne.

**L'unico link mancante che vale:** dalla nuova sezione 4.3 verso
`/indonesia-travel-costs`. Il traffico oggi va in quella direzione (costi → 
itinerari); il ritorno non esiste, e la pagina costi è quella con 23.858
impression.

Un secondo, opzionale: da `/destinations/java` verso questa pagina. La hub Java
prende 431 impression a posizione 10,9 e non linka nessun itinerario multi-regione.

## 7. Cosa NON fare

- Non toccare `title`.
- Non rivendicare `indonesia itinerary`: è di `/trips` dal 2026-09-14.
- Non aggiungere cifre di costo nuove. Quelle pubblicate bastano e devono
  restare identiche in tutti e tre i punti in cui compaiono.
- Non trasformare le FAQ in sezioni **rimuovendole** dall'array `faq`: servono
  ancora allo schema FAQPage. Si duplica il contenuto, non si sposta.
- Se si modifica un array esistente in Sanity, rileggerlo e riscriverlo intero:
  gli item di questo dataset spesso non hanno `_key` e un selettore
  `[_key=="..."]` non matcha nulla restituendo comunque 200.

## 8. Come si misura

Metrica: **CTR di `/trips/20-days-across-indonesia`**, non la posizione.
Baseline oggi: 0,56% su 355 impression a posizione 7,6.
Obiettivo realistico: 1,5-2%, cioè la fascia dei fratelli.
Prima lettura utile: **2026-10-14**, quando la PARTE 1 avrà avuto 28 giorni.
Se questo piano viene applicato dopo quella data, le due modifiche restano
distinguibili. Se viene applicato prima, non lo sono: in quel caso si misura
l'effetto combinato e si accetta di non sapere quale metà ha funzionato.
