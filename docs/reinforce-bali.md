# Piano di rinforzo: /destinations/bali

> **STATO: APPLICATO il 2026-08-31,** lo stesso giorno in cui è stato scritto,
> su approvazione esplicita del founder ("approvo tutto").
>
> - **PARTE 1** (`metaTitle`, `metaDescription`, `h1`, sezioni 3, 4 e 5 qui
>   sotto): commit `b4a147a`.
> - **Sezione 6** (le sei H2, le due tabelle, le due sottosezioni h3) e
>   **sezione 8.1 e 8.2** (otto link in uscita, incluso il debito del piano
>   Ubud/Canggu/Uluwatu): commit `baff267`. Verificato live: tutte e sei le
>   intestazioni servite in SSR, due tabelle renderizzate, tutti e otto i link
>   presenti nell'HTML e tutti 200.
>
> **Un solo punto NON applicato, e per una ragione esterna al piano:** il link
> in entrata da `/indonesia-travel-costs` (sezione 8.3). Quel file aveva 186
> righe non committate datate 2026-08-31, cioè una sezione nuova in corso di
> stesura ("Is Indonesia cheap or expensive to travel in 2026?"). Toccarlo
> avrebbe significato o entrare in conflitto con quel lavoro o trascinarlo
> dentro un commit non suo. **Il punto 8.3 resta aperto** e va applicato quando
> quelle modifiche sono atterrate.
>
> Generato dal task schedulato del 2026-08-31, sul bersaglio messo in coda dal
> founder il 2026-08-29 in `docs/next-up-bali-hub.md`.

Pagina: `https://exploreindonesia.ai/destinations/bali`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `bali`, la prima dell'array) e viene renderizzato da
`src/routes/destinations.$destination.tsx`.

---

## 1. La pagina e i numeri

Finestra GSC 2026-08-01 → 2026-08-28 (28 giorni):

| metrica          |    valore |
| ---------------- | --------: |
| impression       |    **34** |
| click            |     **0** |
| posizione media  |  **21,1** |

Il contrasto con i suoi stessi articoli, stessa finestra:

| pagina                                    | impression | posizione |
| ----------------------------------------- | ---------: | --------: |
| /trips/14-days-indonesia-bali-java-komodo  |        568 |       8,0 |
| /trips/30-days-indonesia-ultimate          |        538 |      10,4 |
| /trips/5-days-bali-ubud-canggu-uluwatu     |        523 |      10,6 |
| /trips/10-days-bali-gili-islands           |        377 |      15,5 |
| /trips/10-days-bali-lombok-gili-islands    |        173 |      19,2 |
| **/destinations/bali**                     |     **34** |  **21,1** |

Su Bali, la destinazione più cercata dell'arcipelago, la hub prende meno
impression di cinque dei suoi stessi itinerari.

**Il cluster di query non è leggibile da GSC.** Delle 34 impression una sola
query è visibile, `exploreindonesia.ai` con 2 impression: il resto è
anonimizzato. Va dichiarato invece che fingere un cluster. Le sezioni qui sotto
sono quindi costruite sulla SERP reale e sull'intento, non su query GSC, come
già previsto da `docs/next-up-bali-hub.md`.

## 2. Perché non ranka

1. **Zero sezioni editoriali.** È l'ultima hub del sito senza una riga di prosa
   scritta per un lettore. I cinque H2 di oggi ("Bali travel guides", "17
   itineraries in Bali", "How to get to and around Bali", "Plan the practical
   side", "Other destinations") sono tutti impalcatura generata: nessuno è una
   domanda, nessuno ha una risposta autoconclusiva.
2. **Il title vendeva il prodotto, non il contenuto.** `Bali itineraries,
   bookable AI trip plans` metteva "bookable AI trip plans" in un tag dove chi
   cerca vuole leggere una durata. Corretto nella PARTE 1.
3. **L'H1 era la parola "Bali".** Nessuno cerca "Bali" per arrivare a una hub
   di itinerari. Corretto nella PARTE 1.
4. **La SERP è vincibile per formato, non per autorità.** I primi risultati su
   "bali itinerary" e "bali itinerary 7 days" sono blog e blog di agenzie
   (Flamingo Travels, DMCQuote, Balisim, MonkeyTravel), non siti governativi né
   grandi aggregatori. Il formato che vince è comparativo e per durata: è
   esattamente quello che la hub non ha.
5. **Non è un caso di posizione 60.** A 21,1 Google la mostra già. Il rendimento
   qui arriva dallo snippet e dalla profondità, non dal recupero.

## 3. Il title, testo esatto

- **Vecchio (per annullare):** `Bali itineraries, bookable AI trip plans`
- **Nuovo, applicato:** `Bali Itineraries: 5, 7, 10 and 14 Days, Day by Day`
  (50 caratteri)

Le quattro durate nominate esistono tutte tra i 17 itinerari linkati dalla hub.

## 4. La meta description, testo esatto

- **Vecchia (per annullare):** `Hand-picked Bali itineraries, from short escapes to two-week routes through Ubud, Canggu, Uluwatu and the east. Turn any plan into a bookable trip.`
- **Nuova, applicata:** `Seventeen Bali routes from 5 to 30 days, through Ubud, Canggu, Uluwatu, the east coast and the Nusa islands. Pick the length, then read the days.`
  (145 caratteri)

## 5. L'H1, testo esatto

- **Vecchio (per annullare):** nessun campo `h1`, quindi l'H1 cadeva su `name`,
  cioè `Bali`. Per annullare basta rimuovere la riga `h1:` dalla voce.
- **Nuovo, applicato:** `Bali Itineraries`

## 6. Le sezioni da aggiungere

Sei sezioni, nell'ordine. Ogni `heading` è formulato come lo digita una persona,
e la prima frase di ogni `body` risponde in modo autoconclusivo in 40-60 parole.

> ⚠️ **Vincolo specifico di Bali, che le altre hub non avevano.** Bali ha già sei
> guide live che rankano: `where-to-stay-in-bali` prende 87 impression a
> posizione **8,9**, e `best-time-to-visit-bali` esiste. Le sezioni 2 e 3 qui
> sotto **non devono replicare quelle guide**: devono rispondere in un paragrafo
> e passare la mano con il link. Su questa hub il rischio non è la superficialità,
> è la cannibalizzazione di una pagina che sta già in top 10.

### H2 1. "How many days do you need in Bali?"

> Five days covers one region properly, seven covers two, and ten to fourteen
> lets you add an island or the east coast without living in a car. Bali is small
> on a map and slow on the road, so the working limit on a first trip is one base
> change every three nights or so.

Seguono due paragrafi e **la tabella A** (sotto). Link di chiusura:
`/trips/5-days-bali-ubud-canggu-uluwatu`.

### H2 2. "Where should you base yourself in Bali?"

> Ubud for rice terraces and temples, Canggu for surf and cafes, Uluwatu for
> cliffs and sunsets, Sanur or Amed for a quieter coast. Most first trips work
> best split between two of those, one inland and one on the coast, because every
> extra move costs you an afternoon in traffic.

Un solo paragrafo in più, poi passa la mano. Link di chiusura:
`/destinations/bali/where-to-stay-in-bali`.

### H2 3. "When is the best time to visit Bali?"

> April to October is the dry season and the reliable window. July, August and
> the fortnight around Christmas are the busiest and the most expensive. April,
> May, June and September give you close to the same weather with fewer people.
> The wet season brings afternoon rain rather than washed out days.

Un paragrafo in più sul prezzo dell'alta stagione, poi link di chiusura:
`/destinations/bali/best-time-to-visit-bali`.

### H2 4. "How much does a week in Bali cost?"

> Budget travel in Bali runs about $30 to $50 a day, mid range $70 to $100, and
> comfortable travel with a villa and a driver $150 to $250. A mid range
> fortnight lands near $800 to $1,200 before flights. Every arriving visitor also
> pays the IDR 150,000 Bali tourism levy.

Le cifre sono **quelle già pubblicate** su `/indonesia-travel-costs` e la tassa è
quella già pubblicata su `/visa-guide`: non inventarne di nuove, la coerenza tra
le due pagine è il punto. Link di chiusura: `/indonesia-travel-costs`.

### H2 5. "Should you add Nusa Penida, the Gilis or Komodo?"

> Add Nusa Penida at seven days or more, the Gili Islands at ten, and Komodo only
> at fourteen. The first is a fast boat and half a day, the second costs you a
> travel day each way, and the third is a flight that needs three days of its own
> to be worth taking.

Seguono **la tabella B** e il link di chiusura a
`/destinations/bali-nearby-islands`. Due sottosezioni h3 servono a portare i due
link che la sezione da sola non può portare (stesso schema già usato su `java` e
`raja-ampat`):

- **h3 "Is Nusa Penida worth a day trip or a night?"** → link a
  `/trips/5-days-nusa-penida-lembongan`
- **h3 "How long does it take to reach the Gili Islands from Bali?"** → link a
  `/trips/10-days-bali-gili-islands`

### H2 6. "How do you get around Bali?"

> Most travellers cover Bali with a driver hired by the day, a scooter for short
> local hops, or ride hailing in the south. Denpasar airport to Ubud is about 75
> minutes off peak and up to two hours in traffic, at roughly $25 to $35 per car
> for a pre-booked private transfer.

I tempi e i prezzi sono **quelli già in `src/data/routes.ts`** (voce
`denpasar-airport-to-ubud`). **Non inventare una tariffa giornaliera per
l'autista:** non è pubblicata da nessuna parte sul sito e non serve alla
sezione. Link di chiusura: `/transport/denpasar-airport-to-ubud`.

## 7. Le tabelle

### Tabella A, sotto l'H2 1: la durata

Caption: "Come si comporta un viaggio a Bali per durata. Sono stime di lavoro
sulla base dei nostri itinerari, non promesse: il traffico decide più di ogni
altra cosa."

| Days | What fits | Bases | Best for |
| --- | --- | --- | --- |
| 5 | One region, properly | One, or two at a push | A first taste, or a stopover |
| 7 | Two regions, one island day trip | Two | The most common first trip |
| 10 | Bali plus the Gilis or Nusa Penida | Two on Bali, one island | Travellers who want a beach half |
| 14 | Bali plus Komodo or Java | Three, with one flight | A second visit, or a long first one |

### Tabella B, sotto l'H2 5: cosa aggiungere

Caption: "Le tre aggiunte più frequenti a un viaggio a Bali, e cosa costano in
giorni. I tempi di traversata cambiano con il mare, quindi confermali il giorno
prima."

| Add-on | How you get there | Days it really costs | Add it from |
| --- | --- | --- | --- |
| Nusa Penida | Fast boat from Sanur, roughly 45 minutes | Half a day each way, or one night | 7 days |
| Gili Islands | Fast boat from Padangbai or Amed | A travel day each way | 10 days |
| Komodo | Flight to Labuan Bajo | Three days minimum | 14 days |

## 8. I link interni

### 8.1 Il debito già aperto, da chiudere qui

`docs/reinforce-5-days-bali-ubud-canggu-uluwatu.md`, punto 6.1: il link in
entrata da `/destinations/bali` verso `/trips/5-days-bali-ubud-canggu-uluwatu`
**non fu applicato il 2026-08-29 perché la hub non aveva nessun punto in-content
dove appenderlo.** L'H2 1 di questo piano è quel punto. Ancora suggerita:
`what five days in Ubud, Canggu and Uluwatu actually looks like`.

### 8.2 In uscita, dalle sezioni

Sei link di sezione più due di sottosezione, tutti già elencati sopra. Copertura
risultante: 3 delle 6 guide Bali (`where-to-stay-in-bali`,
`best-time-to-visit-bali`, più le tre `things-to-do-in-*` che restano coperte
solo dal blocco "Bali travel guides" già esistente), 3 itinerari, 1 rotta di
trasporto, 2 pagine trasversali.

### 8.3 In entrata

`/indonesia-travel-costs` è la pagina con più impression del sito (9.582 in
questa finestra) e **oggi non linka la hub Bali in-content**. Aggiungere
un'ancora contestuale nella sezione sui budget di Bali, del tipo
`the Bali itineraries by length`. È lo stesso intervento fatto il 2026-08-14
verso `bali-nearby-islands`, che da solo non ha spostato quel cluster: qui però
la pagina di destinazione parte da posizione 21 e non da 50, quindi la premessa è
diversa.

## 9. Cosa NON fare

- **Non replicare `where-to-stay-in-bali`.** Sta a posizione 8,9. La sezione 2 la
  cita e la linka, non la riscrive.
- **Non aggiungere una nona, decima sezione.** Sei bastano. La hub
  `bali-nearby-islands` è arrivata a nove sezioni e 2.500 parole e la posizione è
  **peggiorata**, da 45,3 a 50,5 (vedi `docs/plan-islands-near-bali-cluster.md`).
  Su Bali la profondità da sola non è la leva.
- **Non toccare di nuovo il title prima del 28 settembre.** La PARTE 1 è di oggi:
  servono 28 giorni pieni per leggere il CTR.

## 10. Come si misura

Sulla stessa pagina, alla finestra di 28 giorni che si chiude intorno al **28
settembre 2026**, nell'ordine di importanza:

1. **CTR e click.** Oggi 0 click su 34 impression. Il ritocco della PARTE 1 lavora
   qui per primo: qualunque click è un segnale.
2. **Impression.** Se le sezioni vengono applicate, l'attesa è che la hub inizi a
   prendere query informative ("how many days in bali", "bali itinerary length")
   che oggi non tocca affatto.
3. **Posizione.** 21,1 oggi. È la metrica più lenta delle tre e la meno
   affidabile su 34 impression, quindi va letta per ultima.
