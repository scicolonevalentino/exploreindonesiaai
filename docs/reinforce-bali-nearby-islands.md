# Piano di rinforzo: /destinations/bali-nearby-islands

Generato dal task schedulato del 2026-08-07. **Non applicato: decide il founder.**

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/destinations/bali-nearby-islands`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `bali-nearby-islands`) e viene renderizzato da `src/routes/destinations.$destination.tsx`.

Cluster di query (GSC, 28 giorni: 2026-07-08 → 2026-08-04, dimensioni page+query):

| query | impression | click | posizione |
|---|---|---|---|
| islands near bali | 85 | 0 | 39,8 |
| islands around bali | 65 | 0 | 39,2 |
| islands close to bali | 63 | 0 | 56,3 |
| islands off bali | 63 | 0 | 59,5 |
| island near bali | 51 | 0 | 66,9 |
| islands in bali | 33 | 0 | 39,3 |
| islands of bali | 33 | 0 | 42,2 |
| best island in bali for honeymoon | 24 | 0 | 55,0 |
| nusa islands bali | 22 | 0 | 23,0 |
| islands bali | 15 | 0 | 46,9 |
| islands in bali indonesia | 12 | 0 | 43,3 |
| day trips from bali to other islands | 10 | 0 | 35,6 |
| coda lunga (37 query residue) | 87 | 0 | 30-79 |

**Totale pagina: 563 impression, 0 click, posizione media 46,9. Su 49 query distinte.**

È la **seconda pagina del sito per impression** e la prima in assoluto senza un solo click.
Per confronto, `/indonesia-travel-costs` fa 214 impression con posizione 16,0 sullo stesso taglio.

Nessuna cannibalizzazione sul cluster principale: le sette varianti di "islands near bali"
mappano tutte e sole su questa pagina. (Le query "lombok gili islands" sono un cluster
separato che punta correttamente su `/destinations/lombok-gili`.)

**Perché questa pagina e non le altre.** La mossa RINFORZA del run precedente
(`docs/reinforce-lombok-gili-honeymoon.md`, 2026-08-05) è ancora non applicata e copre
`/trips/9-days-lombok-gili-honeymoon`, 171 impression. Rifarla sarebbe un run sprecato.
Il secondo candidato, `/visa-guide` (269 impression, pos 50,8), è scartato di proposito:
le sue query sono head term istituzionali ("indonesia visa", "indonesia visa requirements")
dove davanti ci sono i siti governativi e i grandi aggregatori visti, non contenuto
battibile con una riscrittura. `bali-nearby-islands` ha il triplo delle impression e una
SERP fatta di blog, quindi è la leva più alta e più realistica sul tavolo.

## 2. Perché non ranka

**Causa principale: mismatch di formato, non di argomento.** Ho controllato la SERP reale
per "islands near bali" (agosto 2026). I primi dieci risultati sono, senza eccezioni,
**listicle enumerative**:

- Touropia, "10 Most Beautiful Islands Near Bali (+Map)"
- The Honeymoon Guide, "10 Indonesian Islands Near Bali To Explore In 2026"
- Virgin Australia, "10 islands near Bali that are worth visiting"
- Globetrove, "7 Gorgeous Islands Near Bali..."
- Tripadvisor, "THE 15 BEST Bali Islands to Visit (2026)"
- Holidify, "13 Islands Near Bali That Every Traveller Must Know"

Tutte rispondono alla stessa domanda: *quali sono queste isole, una per una.*
Il set che Google si aspetta (dal risultato in posizione 1) è: Lombok, Gili Trawangan,
Gili Meno, Gili Air, Nusa Lembongan, Nusa Penida, Nusa Ceningan, Komodo, Java, Moyo.

La nostra pagina invece è un **contenitore di itinerari**. Verificato sull'HTML in
produzione, gli unici H2 sono:

```
H1: Bali + Nearby Islands
H2: Bali & Islands travel guides
H2: 6 itineraries in Bali & Islands
H2: How to get to and around Bali & Islands
H2: Plan the practical side
H2: Other destinations
```

659 parole totali, di cui la maggior parte sono titoli di card e navigazione. Il testo
discorsivo è **una sola frase di 45 parole** (il campo `intro`). **Non esiste un singolo
blocco di contenuto che elenchi le isole e dica com'è ciascuna.** Google ci mostra a
39-66 per una domanda a cui letteralmente non rispondiamo.

**Cause secondarie, in ordine di peso:**

1. **Il title non contiene mai la formulazione cercata.** Oggi:
   `Bali + Nusa Islands itineraries, Penida, Lembongan, Gili`. Il token dominante è
   "itineraries", che è l'intento *successivo*. La frase "islands near Bali" non compare
   né nel title né nell'H1 (`Bali + Nearby Islands`, che è un'etichetta di navigazione
   interna, non una frase che qualcuno digita).
2. **Copriamo 9 isole su 10 ma non lo diciamo da nessuna parte.** Abbiamo 6 itinerari e
   4 guide sull'hub (`nusa-penida-itinerary`, `nusa-penida-vs-nusa-lembongan`,
   `things-to-do-in-nusa-penida`, `nusa-penida-snorkelling-guide`), più pagine transport
   dedicate. Il materiale c'è, manca la pagina che lo tiene insieme e risponde alla domanda.
3. **Il nostro vantaggio reale è inutilizzato.** I listicle in SERP sono gallerie
   fotografiche: dicono che un'isola è bella, non quanto ci metti ad arrivarci. Noi
   abbiamo già pubblicato tempi e prezzi verificati su 7 tratte da Bali. Una tabella
   "quanto dista davvero" è contenuto che nessuno dei primi dieci offre, ed è il formato
   comparativo che gli AI citano di più.
4. **Le 4 guide Nusa sono tutte su Nusa Penida.** "nusa islands bali" (22 impression) sta
   già a posizione 23, la più vicina alla rottura di tutto il cluster, ma non ha una
   sezione che la indirizzi.

**Non è un problema di autorità di dominio.** Il cluster è stabile su 49 query e la
posizione media 46,9 con zero click indica che Google capisce il tema e non trova la
risposta, non che ci ignora.

**Caveat onesto:** i primi tre risultati sono domini con anni di storico e questa è una
query informativa pura, quindi il traffico che porta è meno qualificato del traffico
itinerario. L'obiettivo realistico è passare da pagina 5 a pagina 1-2 e usare la pagina
come **porta d'ingresso** verso gli itinerari, non come conversione diretta.

## 3. Nota di implementazione (leggere prima di stimare il lavoro)

Questa **non è una modifica di contenuto in Sanity.** Il tipo `DestinationContent` in
`src/data/destinations.ts` ha solo `metaTitle`, `metaDescription`, `intro`, `highlights`.
Non esiste un campo per sezioni di corpo.

Serve quindi: aggiungere un campo opzionale (es. `sections?: { heading: string; body: string[] }[]`
più un `comparisonTable?`) al type, popolarlo per `bali-nearby-islands`, e renderizzarlo in
`destinations.$destination.tsx` **sopra** la lista itinerari. Essendo dati statici, finisce
in SSR, che è ciò che serve. Il campo resta opzionale, quindi gli altri 7 hub non cambiano.
Ricordarsi il gotcha `routeTree.gen.ts`: se compare nel diff, `git restore`.

## 4. Title riscritto

```
Islands Near Bali: Which to Visit and How to Get There
```
54 caratteri. Mette "Islands Near Bali" come frase esatta iniziale (il cluster da 393
impression), poi promette le due cose che la SERP non dà bene: la scelta e la logistica.

Cambiare anche l'**H1** da `Bali + Nearby Islands` a `Islands Near Bali`.

## 5. Meta description riscritta

```
Which islands sit near Bali, how long each takes to reach by fast boat or plane, and how to pick the one that fits your trip. Honest trade-offs.
```
144 caratteri.

## 6. Sezioni H2 da aggiungere

Da inserire **sotto l'intro e sopra "Bali & Islands travel guides"**. Le sezioni esistenti
restano tutte, in coda.

### H2: `Which islands are near Bali?`

> Nine islands sit within easy reach of Bali. The three Nusa islands, Penida, Lembongan and
> Ceningan, are the closest, around 30 to 45 minutes by fast boat from Sanur. The three Gilis
> and Lombok are an hour or two further east. Komodo, Java and Sumbawa need a short flight.

(49 parole, autoconclusivo.) Copre le sette varianti del cluster principale: 393 impression.
Seguita dalla **tabella comparativa**, il pezzo centrale di tutto l'intervento. Le cifre sono
riprese dalle nostre pagine transport già pubblicate, non nuove:

| Island | Getting there from Bali | Go for | Skip it if |
|---|---|---|---|
| Nusa Penida | Fast boat from Sanur, about 30 to 45 minutes | Cliff viewpoints and manta snorkelling | You dislike rough roads, the island's tracks are hard work |
| Nusa Lembongan | Same Sanur corridor, about 30 to 45 minutes | An easy first island, walkable and calm | You want variety, it is small |
| Nusa Ceningan | Bridge from Lembongan, a few minutes | A quiet half day next door | You need it to fill a whole trip |
| Gili Trawangan | Fast boat, roughly 1.5 to 2.5 hours | Restaurants, bars and easy reef swims | You want quiet |
| Gili Air | Fast boat, roughly 1.5 to 2.5 hours | The balance of calm and somewhere to eat | You want full seclusion |
| Gili Meno | Fast boat, roughly 1.5 to 2.5 hours | Seclusion, very little on the schedule | Three nights would bore you |
| Lombok | Flight about 45 minutes, or fast boat 2 to 3.5 hours | Empty surf beaches and the Rinjani trek | Your trip is under a week |
| Komodo (via Labuan Bajo) | Flight about 1 hour 15 minutes | Dragons, Padar, the best boat days in Indonesia | You cannot spare three days |
| Java | Flight to Yogyakarta about 1 hour 25 minutes | Borobudur, Prambanan and volcano sunrises | You want beach time |

Nota di cautela da tenere nel testo: "these are working estimates, sea crossings depend on
conditions and operators change schedules, so confirm before you book." I tempi delle tratte
sono quelli pubblicati sulle nostre pagine `/transport/*`, mantenerli allineati se cambiano.

### H2: `What are the Nusa Islands?`

> The Nusa Islands are three small islands off Bali's south-east coast: Nusa Penida, Nusa
> Lembongan and Nusa Ceningan. Penida is the largest and most dramatic, Lembongan the easiest
> to spend a few slow days on, and Ceningan is joined to Lembongan by a bridge. All three run
> from Sanur.

(49 parole.) Copre "nusa islands bali" (22 impression, **posizione 23, la più vicina alla
prima pagina di tutto il cluster**) e "nusa islands itinerary" (4 impression, pos 22).
Da qui linkare le 4 guide Nusa esistenti, che oggi sono raggiungibili solo come card.

### H2: `Which islands near Bali can you visit as a day trip?`

> Only the Nusa islands work as a day trip, and even then Nusa Penida is a long day: an early
> boat, a full schedule on poor roads, and a late return. Lembongan and Ceningan are the
> gentler choice. The Gilis, Lombok and Komodo all need at least one overnight to be worth
> the crossing.

(54 parole.) Copre "day trips from bali to other islands" (10 impression, pos 35,6), e dice
onestamente di non farlo, che è la voce editoriale di casa.

### H2: `Nusa Penida or Lombok?`

> Pick Nusa Penida if you have two or three days and want the famous cliff viewpoints close to
> Bali. Pick Lombok if you have a week or more and want beaches, surf and a volcano trek with
> far fewer people. Penida is a side trip from Bali. Lombok is a destination of its own.

(54 parole.) Copre "nusa penida or lombok" (pos 38,7) e l'intento comparativo generale.

### H2: `Which island near Bali is best for a honeymoon?`

> Gili Meno is the usual answer: the quietest of the three Gilis, a handful of bungalows and
> almost nothing to do. Gili Air suits couples who want calm plus somewhere to eat. Nusa
> Lembongan works if you want to stay close to Bali. Lombok's north coast holds the larger
> resorts.

(50 parole.) Copre "best island in bali for honeymoon" (24 impression, pos 55).

> ⚠️ **Coordinare con il piano precedente.** `docs/reinforce-lombok-gili-honeymoon.md`
> assegna l'intento honeymoon a `/trips/9-days-lombok-gili-honeymoon`. Questa sezione deve
> restare **corta e passare la mano**, chiudendo con un link a quell'itinerario, altrimenti
> le due pagine si cannibalizzano su una query da 24 impression. Se si applicano entrambi i
> piani, applicare prima quello honeymoon.

## 7. Link interni da aggiungere

La pagina linka già bene in uscita (itinerari, guide, transport). Il problema è in entrata:
**nessuna pagina forte del sito la linka in-content.**

| Da | Perché | Anchor suggerito |
|---|---|---|
| `/indonesia-travel-costs` (1904 impr, pos 9,2) | La nostra pagina più forte in assoluto, oggi non la linka | "the **islands near Bali** each add a boat or a flight to the budget" |
| `/destinations/bali` | L'hub padre, passaggio naturale | "when you are ready to leave the mainland, see the **islands near Bali**" |
| `/trips/7-days-bali-first-timers` | Già taggato `bali_nearby_islands`, alto traffico potenziale | "deciding **which island to add**" |
| `/destinations/lombok-gili` (204 impr, pos 29,9) | Link reciproco, chiude il loop tra i due hub isole | "how the Gilis compare with the **other islands near Bali**" |
| `/trips/5-days-nusa-penida-lembongan` | Il figlio più diretto del cluster Nusa | "the **Nusa Islands** in context" |
| `/destinations/bali-nearby-islands/nusa-penida-vs-nusa-lembongan` | Dalla nuova sezione Nusa verso la guida comparativa esistente | "the full **Penida vs Lembongan** comparison" |

Regola di casa: ogni nuovo link in-content richiede `bun run indexnow:submit`.

## 8. Cosa aspettarsi

L'intervento agisce su un asset già indicizzato, con 563 impression di domanda provata e
zero click da recuperare, quindi qualunque movimento è un guadagno netto. La leva è forte
perché oggi la pagina **non risponde affatto** alla domanda: non stiamo limando un
contenuto mediocre, ne stiamo aggiungendo uno mancante.

Attesa: la posizione media del cluster scende da ~47 verso 20-30 in 3-5 settimane, con i
primi click che arrivano da "nusa islands bali" e "islands in bali" (già a 23 e 39, le due
più vicine). Non ci si aspetta la top 3: davanti ci sono Tripadvisor e Virgin Australia.

**Metrica da controllare lunedì** su `/destinations/bali-nearby-islands`:
**posizione media della pagina**, che oggi è 46,9. Con 0 click di baseline il CTR non è
misurabile e le impression sono già alte e stabili, quindi la posizione è il primo segnale
che il cambio di formato ha funzionato. Secondo indicatore: la comparsa dei primi click su
"nusa islands bali". Comando: `node scripts/gsc-insights.mjs --days 28`.
