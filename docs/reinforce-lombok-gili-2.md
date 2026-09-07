# Piano di rinforzo, secondo giro: /destinations/lombok-gili

> **STATO: APPLICATO INTEGRALMENTE il 2026-09-07**, lo stesso giorno in cui è stato
> scritto, su autorizzazione esplicita del founder ("autorizzo tutto"). In produzione:
> `metaTitle`, `metaDescription`, `h1` (sezioni 4, 5, 6) e tutte e quattro le sezioni
> H2 della 7, in `src/data/destinations.ts`.
>
> **Tre scostamenti dal piano, tutti voluti e tutti verificati:**
>
> 1. **La sezione 8 era sbagliata e non è stata applicata.** Il piano affermava che
>    mancasse il link contestuale da `/indonesia-travel-costs` verso la hub. **Il link
>    esiste già**, con anchor "Lombok and the Gili Islands", aggiunto il 2026-08-14
>    dal primo piano e presente in `HEAD:src/routes/indonesia-travel-costs.tsx`. Ho
>    scritto la sezione 8 contando i link in entrata dagli articoli e dando per
>    mancante quello dalla pagina costi senza controllarlo: esattamente l'errore che
>    la sezione 2 di questo stesso piano dice di non fare. Nessun link aggiunto,
>    nessun duplicato creato.
> 2. **I tempi di traversata vengono da `src/data/routes.ts`, non dal piano.** La
>    sezione 7.1 proponeva "about twenty minutes to Gili Air and closer to forty to
>    Gili Trawangan". `routes.ts` pubblica **15 to 30 minutes** e **$2 to $4** per
>    l'intera traversata da Bangsal. Applicati i valori di `routes.ts`, che è la
>    fonte pubblicata. Stessa regola stabilita il 2026-08-14.
> 3. **Rimossa una riga ridondante.** Promuovendo la traversata Lombok-Gili da
>    sottosezione h3 a H2 con tabella propria, la riga "Lombok to the Gili Islands"
>    nella tabella della sezione "How do you get from Bali to Lombok and the Gili
>    Islands?" diventava un doppione, ed è stata tolta. Quella tabella ora confronta
>    solo le traversate da Bali.
>
> **Aggiunti oltre al piano:** i tempi di trasferimento via terra fino a Bangsal
> (circa 2 ore dall'aeroporto di Lombok, circa 2 ore da Kuta Lombok), verificati, e
> che sono il vero costo della giornata. Erano il pezzo mancante della risposta.
>
> **Preservata:** la sottosezione h3 "Can you combine Bali and the Gili Islands in one
> trip?", aggiunta il 2026-09-05 dal piano di `10-days-bali-gili-islands`. Il branch
> di questo lavoro era nato da `main`, che era sette commit indietro e non conteneva
> quella sottosezione; è stato ribasato sul ramo di lavoro reale prima di applicare,
> altrimenti il merge l'avrebbe annullata.
>
> **Verifiche:** `tsc --noEmit` e `eslint` puliti, zero frasi bandite, zero trattini
> lunghi, `metaTitle` 53 caratteri, `metaDescription` 147. La hub passa da 6 a 10
> sezioni H2 e da 4 a 5 tabelle.
>
> **La data di giudizio resta il 2026-10-05**, vedi sezione 9.

## 1. Il verdetto sul primo giro

Pagina: `https://exploreindonesia.ai/destinations/lombok-gili`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `lombok-gili`), reso da `src/routes/destinations.$destination.tsx`.

| finestra                | impression | click | posizione |
| ----------------------- | ---------- | ----- | --------- |
| 2026-06-13 → 2026-07-10 | 208        | 0     | 30,7      |
| 2026-07-11 → 2026-08-07 | 352        | 0     | 25,2      |
| 2026-08-08 → 2026-09-04 | **456**    | **1** | **19,9**  |

Tre finestre consecutive in miglioramento su tutte e tre le metriche. La PARTE 1
(metaTitle, metaDescription, h1, commit `10f4043` del 10 agosto) e la PARTE 4
(cinque sezioni H2 con tabelle, 14 agosto) hanno agito insieme; non sono separabili
e non serve separarle.

Per contrasto, nella stessa finestra `/destinations/bali-nearby-islands` è passata da
44,8 a 45,3 dopo due riscritture complete, e `/destinations/sumatra`, mai toccata, da
30,2 a 40,4. La differenza non è lo sforzo: il cluster Lombok/Gili ha una SERP di blog
e operatori, mentre quello "islands near Bali" ha listicle affermate. Vedi
`docs/plan-islands-near-bali-cluster.md`, dove il cluster è stato chiuso.

## 2. Il cluster oggi, e cosa non risponde ancora

Cluster GSC, 28 giorni (2026-08-08 → 2026-09-04, dimensioni page+query), circa 50
query per 456 impression. Le rilevanti:

| query                                 | impression | click | posizione |
| ------------------------------------- | ---------- | ----- | --------- |
| da lombok a isole gili (IT)           | **63**     | 0     | 20,4      |
| gili islands lombok                   | **50**     | 0     | 25,5      |
| lombok and gili islands               | 9          | 0     | 40,8      |
| lombok gili islands                   | 9          | 0     | 37,2      |
| day trips from gili islands to lombok | 6          | 0     | 18,2      |
| gili and lombok                       | 5          | 0     | 53,4      |
| gili lombok                           | 5          | 0     | 23,6      |
| gili lombok indonesia                 | 5          | 0     | 31,8      |
| lombok and gili islands itinerary     | 5          | 0     | 9,6       |
| lombok island                         | 5          | 0     | 44,4      |
| lombok and gili                       | 5          | 0     | 48,0      |
| gili islands in lombok                | 4          | 0     | 36,8      |
| kuta lombok to gili islands           | 1          | 0     | 9,0       |

Fuori dalla hub ma dentro lo stesso cluster tematico, e oggi senza una pagina che le
serva bene: `honeymoon in lombok` (16 impression, posizione 42,6) e
`gili islands diving holidays` (34 impression, posizione 36,4, atterra su
`/trips/7-days-gili-islands-learn-to-dive`).

Tre osservazioni, in ordine di importanza.

**La query più grande della pagina è una query di trasporto, ed è italiana.**
`da lombok a isole gili` fa 63 impression da sola, più del doppio della seconda, e
significa "da Lombok alle isole Gili". Con `day trips from gili islands to lombok`
(18,2) e `kuta lombok to gili islands` (9,0) il tema traversata vale la fetta più
concreta del cluster. Oggi la hub lo tratta in una sottosezione h3 che rimanda subito
a `/transport/lombok-to-gili-islands`. È la sezione che merita di diventare la più
forte della pagina, con una tabella.

Sull'italiano: **non inseguirlo.** 63 impression da una query italiana su una pagina
inglese non si convertono, e tradurre la pagina non è nel perimetro di questo sito.
Va letta come conferma che l'intento dominante è la traversata, non come una lacuna
linguistica.

**Il termine di testa non ha intento itinerario.** `gili islands lombok` (50 impression,
25,5) è definitorio: chi la cerca vuole sapere cosa sono le Gili e come stanno rispetto
a Lombok. Il metaTitle attuale finisce con "Day-by-Day Itineraries", che promette un
indice di itinerari. Il mismatch fra promessa e intento è la spiegazione più semplice
dello zero click a posizione 25.

**I link interni non sono il collo di bottiglia, di nuovo.** Otto articoli puntano già
alla hub in-content (`10-days-lombok-gili-families`, `4-days-gili-islands-trawangan-meno-air`,
`7-days-gili-islands-learn-to-dive` ×2, `7-days-lombok-rinjani-trek`,
`7-days-south-lombok-kuta-beaches`, `8-days-southwest-lombok-sekotong-secret-gilis`,
`7-days-lombok-gili-islands`, `9-days-lombok-gili-honeymoon`). È la stessa lezione del
cluster Bali: contare i link **prima** di proporne altri. Questo piano ne propone uno
solo, e per una ragione precisa.

## 3. La SERP, controllata davvero

Primi risultati per `gili islands lombok` al 2026-09-07: Audley Travel, The Lombok
Lodge, homeiswhereyourbagis.com, TripAdvisor, ourbigjourney.com, gilibookings.com,
theislandgirladventures.com, alikitravelblog.com, un resort locale, hotels.com.

Nessun sito istituzionale, nessun aggregatore di visti o voli. È una SERP di blog,
operatori e una OTA. Vincibile sul contenuto. Questo è il criterio che ha scartato
`/visa-guide` il 2026-08-07 e che qui è soddisfatto.

Da notare: **due dei dieci risultati parlano delle Gili "segrete"** (Gili Kondo e le
isolette di Lombok est, le Gili del sudovest intorno a Sekotong). Noi abbiamo un
articolo su quelle del sudovest e la hub non le nomina mai.

## 4. Il metaTitle riscritto

**Valore vecchio, testo esatto** (`src/data/destinations.ts`, voce `lombok-gili`,
campo `metaTitle`):

```
Lombok and the Gili Islands: Day-by-Day Itineraries
```

**Valore nuovo proposto** (52 caratteri):

```
Lombok and the Gili Islands: Which Island, Which Boat
```

Motivo: sostituisce una promessa di formato ("itinerari giorno per giorno") con la
promessa delle due decisioni che il cluster chiede davvero, quale Gili e come
attraversare. Copre sia l'intento definitorio del termine di testa sia quello
trasporto della query più grande.

## 5. La meta description riscritta

**Valore vecchio, testo esatto** (144 caratteri):

```
Which Gili to stay on, how the boats connect to Lombok, and how many days each leg needs. Day-by-day routes with transfer times and booking notes.
```

**Valore nuovo proposto** (153 caratteri):

```
Trawangan, Meno or Air, and how the boats from Bangsal and Kuta Lombok actually run. Crossing times, what a day trip costs you, and how long each leg needs.
```

## 6. L'H1 riscritto

**Valore vecchio, testo esatto** (campo `h1`, override isolato):

```
Lombok and the Gili Islands
```

**Valore nuovo proposto** (51 caratteri):

```
Lombok and the Gili Islands, Planned Around the Boat
```

Motivo: l'H1 attuale è il nome del posto e non aggiunge nulla al titolo del tab.
Quello nuovo dichiara il punto di vista della pagina nella prima riga visibile, che
è anche quello che gli AI answer estraggono per primo.

⚠️ Questo è l'unico campo `h1` toccabile senza effetti collaterali, perché è un
override isolato su una hub. Non vale per gli articoli, dove `title` guida H1,
JSON-LD, breadcrumb e card (verificato il 2026-08-07).

## 7. Le sezioni H2 da aggiungere

Il template `DestinationSection` accetta `heading`, `body` (array di paragrafi),
`table` opzionale e **un solo** `link` per sezione. Ordine proposto: la 7.1 va
inserita subito dopo "Which Gili island should you stay on?", le altre in coda.

### 7.1 Espandere "How do you get from Lombok to the Gili Islands?" da h3 a H2

Oggi è una sottosezione h3 breve. Diventa H2, con questa apertura autoconclusiva:

> The public boat from Bangsal harbour is the cheapest way across and takes about
> twenty minutes to Gili Air and closer to forty to Gili Trawangan. Bangsal is
> roughly ninety minutes from Lombok airport and two hours from Kuta Lombok, so
> the drive to the harbour is longer than the crossing itself. Fast boats from
> Bali take one and a half to two and a half hours.

Con tabella comparativa. ⚠️ I tempi di percorrenza vanno presi da
`src/data/routes.ts`, non da questo piano, come stabilito il 2026-08-14 dopo lo
scostamento della PARTE 4.

|                  | Public boat da Bangsal          | Hotel shuttle / fast boat           | Charter privato                    |
| ---------------- | ------------------------------- | ----------------------------------- | ---------------------------------- |
| Costo indicativo | Il più basso                    | Medio, spesso incluso col soggiorno | Il più alto, per barca             |
| Orari            | Parte quando è pieno            | Orario fisso                        | A richiesta                        |
| Rischio          | Attesa imprevedibile            | Poche partenze al giorno            | Nessuno, oltre al meteo            |
| Adatto a         | Chi ha tempo e bagaglio leggero | Quasi tutti                         | Gruppi, famiglie, bagaglio pesante |

Link di sezione: `/transport/lombok-to-gili-islands`.

### 7.2 "Can you do the Gili Islands as a day trip from Lombok?"

Query `day trips from gili islands to lombok`, 6 impression a 18,2, e
`kuta lombok to gili islands` a 9,0. Apertura:

> Yes, and Gili Air is the one to pick. It is the closest of the three to Bangsal,
> about twenty minutes each way, which leaves five or six hours on the island after
> a morning crossing. From Kuta Lombok the drive to Bangsal is long enough that a
> day trip becomes a twelve-hour day, so an overnight is the better shape.

Link di sezione: `/trips/4-days-gili-islands-trawangan-meno-air`.

### 7.3 "Which other islands are there off Lombok?"

Due dei dieci risultati della SERP parlano delle Gili minori e la hub non le nomina.
Apertura:

> Around forty, and three of them are not the ones you have heard of. The southwest
> cluster off Sekotong, Gili Nanggu, Gili Kedis and Gili Sudak, is reached by short
> boat from the mainland and sees a fraction of the traffic. The east coast has its
> own group around Gili Kondo. None has the dive infrastructure of the main three.

Link di sezione: `/trips/8-days-southwest-lombok-sekotong-secret-gilis`.

### 7.4 "Where should honeymooners stay in Lombok and the Gilis?"

Query `honeymoon in lombok`, 16 impression a 42,6, oggi senza una pagina che la serva.
Apertura:

> Gili Meno for the quietest few days, south Lombok for space and a view, and the
> two together for a fortnight. Meno is the smallest and stillest of the three
> islands, with almost nothing on the schedule. Kuta Lombok and the bays east of it
> have the resorts with room to move that the Gilis cannot offer.

Link di sezione: `/trips/9-days-lombok-gili-honeymoon`.

## 8. Link interni ~~da aggiungere~~ (SEZIONE ERRATA, NON APPLICATA)

> **Corretta il 2026-09-07, prima di applicare.** Questa sezione sosteneva che
> mancasse il link contestuale da `/indonesia-travel-costs` verso la hub. È falso:
> il link **esiste già**, con anchor "Lombok and the Gili Islands", aggiunto il
> 2026-08-14 dal primo piano. Verificato con
> `git show HEAD:src/routes/indonesia-travel-costs.tsx | grep -c 'destination: "lombok-gili"'` → `1`.
>
> L'errore è lo stesso che la sezione 2 di questo piano dice di non commettere: ho
> contato gli otto link in entrata dagli articoli e ho dato per mancante quello dalla
> pagina costi senza controllarlo. **Nessun link è stato aggiunto**, per non creare un
> doppione nello stesso paragrafo.
>
> Resta valida la conclusione di merito: i link interni verso questa hub sono nove in
> totale e **non sono il collo di bottiglia**. Non aggiungerne altri.

## 9. Come verificare

**Data di giudizio: 2026-10-05**, quattro settimane dopo l'applicazione, sulla run
del lunedì.

**Metrica primaria:** posizione media di `/destinations/lombok-gili`. Oggi **19,9**.
Soglia di successo: sotto 15. Soglia di fallimento: sopra 19,9, cioè nessun movimento.

**Metriche secondarie:** click sulla pagina (oggi **1**) e posizione di
`gili islands lombok` (oggi **25,5**).

Se dopo questo secondo giro la posizione è ferma sopra 15, la conclusione è la stessa
del cluster Bali: le leve on-page sono esaurite e serve autorità, non contenuto. In
quel caso chiudere anche questo cluster e spostarsi sulle pagine di confronto, dove
il pattern resta il più forte del sito (`/destinations/java/borobudur-vs-prambanan`
è a posizione 7,6).
