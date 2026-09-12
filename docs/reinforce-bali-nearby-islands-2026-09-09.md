# Piano di rinforzo, secondo giro: /destinations/bali-nearby-islands

> **STATO: APPLICATO INTEGRALMENTE il 2026-09-12,** su approvazione esplicita del
> founder ("applica tutto quello che devi applicare"). Guida nuova live su
> `/destinations/bali-nearby-islands/best-islands-near-bali`, otto link in entrata,
> IndexNow lanciato. Commit `c6010a0`. Un solo scostamento dal piano, in §6.1: la
> frase di apertura data dal piano elencava "Menjangan, Java and Sumbawa" e
> arrivava a dieci isole, in contraddizione col titolo "The 9 Best" e con la
> tabella delle nove isole canoniche della hub. Riscritta in "Lombok, Komodo and
> Java need a flight", 3+3+3 = 9. Tutto il resto e' testo esatto del piano.
> Rileggere la posizione della guida e della hub il **10 ottobre 2026**.

Generato dal task schedulato del 2026-09-09 (PARTE 3). Approvato e applicato il 2026-09-12.

Il primo giro (`docs/reinforce-bali-nearby-islands.md`, applicato il 2026-08-07) e' stato
eseguito per intero. Questo documento parte da come e' andato, non da zero.

## 1. La pagina, il cluster, i numeri

Pagina: `https://exploreindonesia.ai/destinations/bali-nearby-islands`
Sorgente: **codice, non Sanity** (`src/data/destinations.ts`, voce `bali-nearby-islands`).

GSC, 28 giorni, 2026-08-10 -> 2026-09-06:

| | impression | click | posizione |
| --- | --- | --- | --- |
| Totale pagina | **1477** | 2 | **43,4** |
| Cluster query visibile (60 query) | 961 | 0 | 36-97 |

E' la **seconda pagina del sito per impression**, dopo `/indonesia-travel-costs`.

Le query si dividono in due sotto-intenti quasi identici per volume:

| Formulazione | Impression (somma) | Esempi |
| --- | --- | --- |
| "islands **near / around / off / close to** bali" | ~438 | islands near bali (83), islands off bali (75), islands around bali (71) |
| "islands **in / of** bali", "**bali islands**" | ~395 | islands in bali (78), bali islands (71), islands of bali (65) |
| contiene "**best**" | ~173 | best islands near bali (54), best islands off bali (53) |

## 2. Perche' non ranka, e perche' il primo giro non e' bastato

**Il primo giro ha aggiunto profondita' e la profondita' non era la leva.** La pagina e'
passata a nove sezioni e circa 2.500 parole e **la posizione e' peggiorata**, da 45,3 a
50,5 nella finestra successiva (constatazione gia' registrata nel commento in cima a
`src/data/destinations.ts`). Le impression sono pero' quasi triplicate, da 563 a 1477:
Google ha capito di cosa parla la pagina, e continua a non metterla in alto.

**La causa residua e' di formato, e il formato di una hub non si cambia scrivendo di piu'.**
SERP reale per "best islands in bali", controllata il 2026-09-09:

- Virgin Australia, "10 best islands near Bali"
- Tripadvisor, "THE 15 BEST Bali Islands to Visit (2026)"
- Jumeirah, "Discovering the Best Islands Around Bali: Island Hopper Guide"
- Globetrove, "7 Gorgeous Islands Near Bali"
- WanderOn, "12 Most Popular Islands In Bali"
- Gap360, "Island Hopping in Bali & Beyond"
- Hotels.com, "7 Best Islands around Bali"

Nessun sito istituzionale, nessun aggregatore di visti: **e' una SERP editoriale, quindi
vincibile.** Ma sono dieci listicle numerate su dieci. La nostra e' una **hub di
destinazione** con card di itinerari: Google la legge come pagina di navigazione, non come
risposta. Nessuna quantita' di sezioni aggiuntive cambia quel tipo di pagina.

**Non c'e' cannibalizzazione** su questo cluster: le 60 query mappano tutte e sole su
questa URL.

## 3. La proposta: smettere di ingrossare la hub, e scrivere la listicle

Il consiglio operativo di questo giro e' **non toccare piu' il corpo della hub**, che ha gia'
dato il suo segnale negativo, e spostare la caccia alla query su una **guida dedicata** nel
terzo tipo di contenuto che gia' esiste sul sito (`_type: "guide"`):

`/destinations/bali-nearby-islands/best-islands-near-bali`

`guideType: "decision_guide"`, `destination: "bali_nearby_islands"`.

Divisione dei ruoli: la **guida** insegue la query informativa ("quale isola scelgo"), la
**hub** torna a fare la navigazione verso gli itinerari e prende il link in entrata. E' lo
stesso schema che funziona gia' con `nusa-penida-vs-nusa-lembongan`, che sta in posizione
10,6 su una query di confronto mentre la hub sta a 43.

Nessuna delle quattro guide esistenti sotto questa hub copre il tema: sono tutte su Nusa
Penida.

## 4. Il title della guida, testo esatto

```
The 9 Best Islands Near Bali, Ranked by Who Should Go
```
52 caratteri.

## 5. La meta description della guida, testo esatto

```
Nine islands within reach of Bali, ranked. Boat times from Sanur, what each one is actually good for, and the three most people should skip.
```
139 caratteri.

## 6. Le sezioni H2 della guida, con le prime 40-60 parole

Ogni apertura deve reggersi da sola fuori contesto: e' il blocco che gli AI estraggono.

### 6.1 `How many islands are there near Bali, and which are worth the trip?`

> Nine islands are realistically worth a night or more from Bali. The three Nusa islands sit
> 25 to 45 minutes by fast boat from Sanur, the three Gilis and Lombok are one to two hours
> further east, and Menjangan, Java and Sumbawa need a drive or a short flight. Most trips
> should pick two, not five.

Segue **la tabella comparativa** (nove righe), che e' il pezzo piu' citabile dell'intera
pagina. Riusare le colonne gia' scritte nella hub, che sono buone: Isola / Come ci si
arriva da Bali / Ci vai per / Saltala se. I tempi di traversata vengono da
`src/data/routes.ts`, non vanno ri-ricercati.

### 6.2 `Which island near Bali should you pick for your first trip?`

> Nusa Lembongan, for almost everyone. It is the shortest crossing, it is walkable, and it
> is the only one of the nine where you can arrive without a plan and be fine. Nusa Penida
> is more spectacular and much harder work, and its roads are the single most common
> complaint we hear.

### 6.3 `What is the difference between the Nusa islands and the Gili islands?`

> Distance and character. The Nusas are 25 to 45 minutes from Sanur and belong to Bali,
> with cliffs, viewpoints and rough roads. The Gilis are one to two hours further, belong to
> Lombok, and are flat, car-free and built around the water. Choose the Nusas for scenery
> and the Gilis for swimming.

Seconda tabella comparativa qui: Nusa vs Gili su crossing time, roads, reef access,
nightlife, best for.

### 6.4 `Which island near Bali is best with children?`

> Nusa Lembongan and Gili Air. Both are small, flat and shallow at the shore, and both have
> a short walk from the boat to most rooms. Nusa Penida is the one to avoid with young
> children: the viewpoints have unfenced drops and the island crossings are long and rough.

Copre "best island in bali for family" (17 impression, posizione 72,2), oggi senza
risposta diretta da nessuna parte sul sito.

### 6.5 `Can you visit the islands near Bali as a day trip?`

> Only the three Nusas, and only Lembongan and Ceningan comfortably. The Sanur fast boats
> make a day trip physically possible to Penida, but the island is big and the roads are
> slow, so a day gives you two viewpoints and a lot of driving. The Gilis are too far to
> return the same day.

Copre "day trips from bali to other islands" (13 impression, posizione 25,1: la query
meglio posizionata del cluster e quindi la piu' vicina a dare click).

## 7. I link interni da aggiungere, e da dove

1. **Dalla hub alla guida**, in cima alla sezione "Which islands are near Bali?", una
   riga di chiusura con il link. E' il link in entrata piu' importante perche' la hub e'
   gia' indicizzata e prende 1477 impression.
2. **Da `/destinations/bali`**, sezione "Getting around" o equivalente: chi legge di Bali
   e' esattamente il lettore di questa query.
3. **Da `/trips/10-days-bali-gili-islands`** e **`/trips/5-days-nusa-penida-lembongan`**,
   un link contestuale in corpo, non in coda.
4. **Dalle quattro guide Nusa esistenti**, una riga ciascuna verso la nuova guida: oggi
   sono foglie senza link tra loro.
5. **Dalla nuova guida verso gli itinerari**, che e' il punto commerciale di tutta la
   manovra.

## 8. Cosa NON fare

- **Non aggiungere altre sezioni alla hub.** Provato, misurato, ha peggiorato la posizione.
- **Non tradurre in tedesco** per "insel bei bali" (21 impression, posizione 96,6). Il sito
  non ha una struttura multilingua e una pagina isolata non la giustifica.
- **Non rincorrere "islands in bali" con una pagina separata.** E' la stessa intenzione di
  "islands near bali" e due pagine si toglierebbero forza a vicenda.

## 9. Cosa e' gia' stato applicato oggi (PARTE 1, non richiede approvazione)

Solo title, meta e H1 della hub, in `src/data/destinations.ts`:

| campo | valore vecchio | valore nuovo |
| --- | --- | --- |
| `h1` | `Islands Near Bali` | `The 9 Best Bali Islands, and Which One to Pick` |
| `metaTitle` | `Islands Near Bali: Which to Visit and How to Get There` | `The 9 Best Islands Near Bali, and Which One to Pick` |
| `metaDescription` | `Which islands sit near Bali, how long each takes to reach by fast boat or plane, and how to pick the one that fits your trip. Honest trade-offs.` | `Nine islands sit within reach of Bali. Nusa Penida, the Gilis, Lombok and more, with boat times, what each is good for, and when to skip it.` |

Per annullare: ripristinare i tre valori della colonna sinistra nella voce
`bali-nearby-islands` di `src/data/destinations.ts`. Nient'altro e' stato toccato.

Rileggere la posizione il **7 ottobre 2026** (28 giorni).
