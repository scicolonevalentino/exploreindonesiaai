# Piano di rinforzo: /destinations/lombok-gili

> **STATO: APPLICATO il 2026-08-14.** La PARTE 1 (metaTitle, metaDescription, h1) era
> già in produzione dal 2026-08-10, commit `10f4043`. La PARTE 4 (cinque sezioni H2,
> tre tabelle, una sottosezione h3) e i punti 1, 2 e 3 della sezione 6 sono stati
> applicati oggi in `src/data/destinations.ts` e `src/routes/indonesia-travel-costs.tsx`.
>
> **Due scostamenti dal piano, entrambi voluti:**
>
> 1. I tempi di traversata della sezione 4, H2 2, erano sbagliati nel piano. Diceva
>    "1.5 to 2.5 hours" per barche verso "Gili Trawangan, Gili Air and Lombok",
>    accorpando due tratte diverse. `src/data/routes.ts` le tiene separate: Gili 1,5-2,5
>    ore, Lombok 2-3,5 ore. Applicati i valori di `routes.ts`, che è la fonte pubblicata.
> 2. Il template `DestinationSection` porta un solo link per sezione, quindi i due link
>    trasporto del punto 6.1 sono stati divisi: `/transport/bali-to-lombok` sul link di
>    sezione, `/transport/lombok-to-gili-islands` su una sottosezione h3 intitolata
>    "How do you get from Lombok to the Gili Islands?", che è anche la traduzione della
>    query italiana da 16 impression. Stessa logica per il punto 6.2: il 7 giorni sul
>    link della sezione "How many days", il 10 giorni su quella "Lombok or Bali".
>
> **Ancora aperto:** il punto 6.4 (link da `6-days-nusa-islands-honeymoon` alla hub,
> richiede scrittura Sanity). **Il punto 5 (metaTitle di `/trips/7-days-lombok-gili-islands`)
> è stato CHIUSO il 2026-08-19**, vedi `docs/reinforce-7-days-lombok-gili-islands.md`.
>
> **Nota sulla lettura dei dati.** La PARTE 1 ha ora quattro giorni di vita e la PARTE 4
> zero. I due effetti si mescolano, come previsto dalla sezione 7: la data di giudizio
> resta il **2026-09-07** e la metrica primaria la posizione media della pagina, oggi 30,7.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/destinations/lombok-gili`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `lombok-gili`) e viene renderizzato da `src/routes/destinations.$destination.tsx`.

Cluster GSC, 28 giorni (2026-07-11 → 2026-08-07, dimensioni page+query):

| query                                 | impression | click | posizione |
| ------------------------------------- | ---------- | ----- | --------- |
| gili islands lombok                   | 37         | 0     | 29,4      |
| da lombok a isole gili (IT)           | 16         | 0     | 27,8      |
| lombok and gili islands itinerary     | 15         | 0     | 4,9       |
| lombok gili islands                   | 11         | 0     | 37,1      |
| lombok and gili islands               | 9          | 0     | 45,2      |
| gili islands and lombok               | 7          | 0     | 47,4      |
| lombok and the gili islands indonesia | 7          | 0     | 37,1      |
| gili islands lombok indonesia         | 6          | 0     | 22,7      |
| lombok and gili                       | 6          | 0     | 38,8      |
| lombok islands                        | 6          | 0     | 35,2      |
| lombok gili islands indonesia         | 5          | 0     | 49,6      |
| coda lunga (39 query residue)         | 83         | 0     | 15-90     |

**Totale pagina: 208 impression, 0 click, posizione media 30,7. Su 50 query distinte.**

È la quarta pagina del sito per impression fra quelle non toccate di recente, ed è la
seconda senza un solo click dopo `/destinations/bali-nearby-islands`.

## 2. Perché non ranka

**a) Il title non conteneva mai la frase cercata.** Il cluster si scrive
"lombok and gili islands", con la congiunzione estesa. Il vecchio title usava
l'ampersand (`Lombok & Gili Islands itineraries, Rinjani to reefs`) e chiudeva con
"Rinjani to reefs", una formulazione che **non compare in nessuna delle 50 query**.
L'H1 aveva lo stesso problema. Questa parte è già stata corretta, vedi sezione 3.

**b) Cannibalizzazione reale con `/trips/7-days-lombok-gili-islands`.** Su quattro
query le due URL si contendono la SERP e la hub vince sempre:

| query                                 | hub      | trip 7 giorni |
| ------------------------------------- | -------- | ------------- |
| lombok and gili islands itinerary     | pos 4,9  | pos 13,3      |
| lombok gili islands                   | pos 37,1 | pos 86,8      |
| lombok and gili islands               | pos 45,2 | pos 87,2      |
| lombok and the gili islands indonesia | pos 37,1 | pos 76,5      |

Il trip da 7 giorni prende 57 impression totali a posizione media 64,5, quindi non sta
difendendo niente. **La hub è la pagina che Google ha scelto.** L'intervento va fatto lì
e il trip va trattato come pagina di destinazione interna, non come concorrente.

**c) La pagina è troppo sottile rispetto a chi sta davanti.** La SERP su
"lombok and gili islands itinerary" è fatta interamente di blog e contenuti editoriali
(Ferryhopper, The Gone Goat, Nomadicated, Chasing Gambozinos, The Lombok Lodge, Medium),
nessun sito istituzionale e nessun grande aggregatore. **È vincibile con contenuto**,
al contrario di `/visa-guide`, scartato per questo motivo il 2026-08-07.
La nostra hub oggi offre una intro di due frasi, quattro highlight e una griglia di card.
Non risponde a nessuna delle domande che il cluster implica: quale Gili scegliere, come
si arriva, quanti giorni servono, se conviene aggiungere Lombok o restare sulle isole.

**d) Una query italiana con intento di trasporto.** "da lombok a isole gili" fa 16
impression a posizione 27,8 e atterra sulla hub, ma la risposta giusta esiste già:
`/transport/lombok-to-gili-islands`. Manca il link dalla hub, vedi sezione 6.

## 3. Già applicato in produzione (PARTE 1, commit `10f4043`)

**h1**: prima **assente**, quindi renderizzava il campo `name`, cioè
`Lombok & Gili Islands`. Ora:

```
Lombok and the Gili Islands
```

**metaTitle**, da `Lombok & Gili Islands itineraries, Rinjani to reefs` a:

```
Lombok and the Gili Islands: Day-by-Day Itineraries
```

51 caratteri. Porta la frase esatta del cluster in apertura e sostituisce
"Rinjani to reefs" con "Day-by-Day", che è il nostro unico differenziatore
reale contro una SERP di blog.

**metaDescription**, da `Surf Lombok's south coast, climb Mount Rinjani, and unwind on the Gili Islands. Bookable, day-by-day Indonesia trip plans.` a:

```
Which Gili to stay on, how the boats connect to Lombok, and how many days each leg needs. Day-by-day routes with transfer times and booking notes.
```

146 caratteri. Apre con la domanda vera ("which Gili"), non con un elenco di attività.

**Per annullare**: `git revert 10f4043`, oppure rimettere a mano i tre valori vecchi
riportati qui sopra in `src/data/destinations.ts`.

---

## 4. Le sezioni H2 da aggiungere (APPLICATO il 2026-08-14, con i due scostamenti in testa)

Da inserire come `sections: [...]` nella voce `lombok-gili` di
`src/data/destinations.ts`, stessa struttura già usata per `bali-nearby-islands`.
Il template le renderizza sopra la lista degli itinerari.

### H2 1: "Which Gili island should you stay on?"

Prima frase autoconclusiva (52 parole):

> Gili Air is the safest choice for most travellers, quiet enough to relax but with
> enough restaurants to stay a week. Gili Trawangan is the largest and the only one with
> nightlife. Gili Meno is the smallest and the quietest, best for couples who want
> almost nothing on the schedule.

Poi una tabella comparativa:

| Island         | What it feels like                                    | Pick it if                                     | The trade-off                                  |
| -------------- | ----------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Gili Trawangan | Largest, with bars, dive shops and a beachfront strip | You want restaurants and some nightlife        | The east strip is busy and loud in peak season |
| Gili Air       | Quiet, with a working village and real dinner choice  | You want calm without isolation                | The south beachfront gets crowded mid-morning  |
| Gili Meno      | Smallest and stillest, a handful of bungalows         | You are a couple and want almost nothing to do | Few places to eat, patchy card payment         |

Nota: le tre righe esistono già come contenuto verificato dentro
`/trips/9-days-lombok-gili-honeymoon` (tabella "Island / Feel / Pick it for a honeymoon
if / Watch out for"). Vanno riadattate, non riscritte da zero, per restare coerenti.

### H2 2: "How do you get from Bali to Lombok and the Gili Islands?"

Prima frase autoconclusiva (48 parole):

> Fast boats run daily from Bali's east coast ports to Gili Trawangan, Gili Air and
> Lombok, taking roughly 1.5 to 2.5 hours depending on the operator and the sea. Lombok
> also has an international airport near Praya, which is the faster option if you are
> starting the trip in the south of the island.

Segue il link interno alla rotta trasporti, che risolve anche la query italiana:
`/transport/bali-to-lombok` e `/transport/lombok-to-gili-islands`.

### H2 3: "How many days do you need in Lombok and the Gilis?"

Prima frase autoconclusiva (51 parole):

> Seven days is the working minimum for both, with three or four nights in Lombok and
> three on one Gili. Four days works if you only do the Gilis. Ten days is where the
> Rinjani trek and the south coast beaches fit in without the trip becoming a series of
> transfers.

Poi due frasi con i link agli itinerari da 7 e 10 giorni.

### H2 4: "Lombok or Bali: which one should you pick?"

Prima frase autoconclusiva (47 parole):

> Choose Bali if you want variety, restaurants and short transfers between very different
> places. Choose Lombok if the point of the trip is quiet. Lombok has emptier beaches and
> lower prices, but fewer places to eat, longer drives and less to do when the weather
> turns.

Questa sezione è quella che intercetta la coda lunga comparativa, oggi assente
del tutto dal sito, e serve la domanda che precede la scelta dell'itinerario.

### H2 5: "When is the best time to visit Lombok and the Gilis?"

Prima frase autoconclusiva (49 parole):

> Roughly May to October, the drier months, when the fast boat crossings are calmest and
> the water is clearest for snorkelling. November to March brings rougher seas and more
> cancelled sailings. Conditions vary year to year, so check the forecast in the week
> before you travel.

## 5. Il body ancora da decidere: l'H1 dell'articolo da 7 giorni

`/trips/7-days-lombok-gili-islands` è a posizione media 64,5 su 57 impression e non
difende nessuna query. Il suo `title` attuale guida H1, headline JSON-LD, breadcrumb e
tutte le card nei listing, quindi **non è un ritocco meccanico** e non è stato toccato.

Proposta da approvare: lasciare il `title` invariato e riscrivere solo il suo
`metaTitle` per differenziarlo dalla hub, ad esempio verso una formulazione che punti
sulla durata ("Lombok and the Gilis in 7 Days: Day-by-Day Route") invece di ripetere la
frase generica su cui la hub vince già. Serve un secondo run di verifica prima di
applicarlo, perché tocca una pagina diversa da quella di questo run.

## 6. Link interni da aggiungere

1. **Dalla hub alle rotte di trasporto.** La hub oggi elenca i `TRANSPORT_ROUTE`
   corrispondenti in fondo alla pagina, ma non li richiama nel corpo. La sezione H2 2
   deve linkare esplicitamente `/transport/bali-to-lombok` e
   `/transport/lombok-to-gili-islands`. Chiude anche la query italiana da 16 impression.
2. **Dalla hub agli itinerari, con l'ancora giusta.** La sezione H2 3 deve linkare
   `/trips/7-days-lombok-gili-islands` e `/trips/10-days-bali-lombok-gili-islands`
   con ancore che contengano il numero di giorni, non il nome della destinazione.
3. **Dalla guida costi alla hub.** `/indonesia-travel-costs` prende 226 impression a
   posizione 15,5 ed è la nostra pagina più forte. Un link in-content verso
   `/destinations/lombok-gili` nella sezione sui costi per isola passa autorità dalla
   pagina migliore a quella che ne ha bisogno. Stessa mossa già fatta il 2026-08-07 per
   `/trips/7-days-bali-solo-travellers` (commit `c7e95fa`).
4. **Dal nuovo articolo honeymoon alla hub.** `6-days-nusa-islands-honeymoon`, creato
   in questo run, cita già le Gili nella tabella comparativa e linka il honeymoon
   Lombok/Gili. Vale la pena aggiungere un link diretto alla hub quando l'articolo
   passa live.

## 7. Come verificare

Su GSC, taglio 28 giorni, dimensione page filtrata su `/destinations/lombok-gili`:

- **Metrica primaria**: posizione media della pagina, oggi **30,7**.
- **Metrica secondaria**: click, oggi **0**, su 208 impression.
- **Controllo di rumore**: impression totali della pagina, oggi 208. Se scendono molto
  senza che la posizione migliori, la riscrittura ha spostato la pagina fuori dal
  cluster e va annullata.

La sola PARTE 1 (title, meta, H1) va giudicata il **2026-09-07**, cioè 28 giorni dopo.
Se le sezioni della PARTE 4 vengono applicate prima di quella data, i due effetti si
mescolano e non sapremo quale ha funzionato. Consiglio: applicare le sezioni comunque,
perché la pagina fa 0 click e il costo di non saperlo è basso, ma segnare la data di
applicazione qui sopra.
