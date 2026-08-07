# Piano di rinforzo: /trips/9-days-lombok-gili-honeymoon

> **STATO: APPLICATO il 2026-08-07.** Title, meta, le cinque sezioni, le due tabelle e i link Booking sono in produzione.

Generato dal task schedulato del 2026-08-05. **Non applicato: decide il founder.**

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/9-days-lombok-gili-honeymoon`
\_id Sanity: `itinerary-9-days-lombok-gili-honeymoon` (contentStatus `live`, online dal 2026-07-01)

Cluster di query (GSC, 28 giorni: 2026-07-06 → 2026-08-02):

| query                     | impression | click | posizione |
| ------------------------- | ---------- | ----- | --------- |
| honeymoon in lombok       | 53         | 0     | 72,3      |
| gili honeymoon            | 39         | 0     | 46,9      |
| honeymoon lombok          | 35         | 0     | 68,7      |
| lombok honeymoons         | 34         | 0     | 81,2      |
| lombok honeymoon          | 4          | 0     | 71,5      |
| bali and lombok honeymoon | 2          | 0     | 49,0      |
| gili islands honeymoon    | 2          | 0     | 38,0      |
| gili island honeymoon     | 1          | 0     | 37,0      |
| gili trawangan honeymoon  | 1          | 0     | 54,0      |

**Totale pagina: 205 impression, 0 click, posizione media 60,0.**

Nessuna cannibalizzazione: tutte le query "honeymoon" mappano solo su questa pagina.
(`/trips/15-days-indonesia-honeymoon` prende 1 impression su "komodo island honeymoon",
`/trips/10-days-raja-ampat-honeymoon` 4 impression sul suo tema. Irrilevanti.)

Andamento giornaliero: impression stabili dal 4 luglio, posizione che oscilla tra 46 e 85
senza trend di miglioramento. La pagina è indicizzata e ferma, non ancora in salita.

## 2. Perché non ranka

**Causa principale: mismatch di intento.** Le query sono di _decisione sulla destinazione_,
la pagina è un _itinerario logistico_. Chi cerca "honeymoon in lombok" vuole sapere se Lombok
va bene per una luna di miele, in quale isola stare, dove dormire e quanto costa. La pagina
risponde invece a "come si incastrano nove giorni", che è la domanda successiva.

Controllo reale della SERP (agosto 2026), primi risultati per "honeymoon in lombok":

- villa-bali.com, "The Ultimate Honeymooners Guide to Lombok: what to do, where to stay, where to eat"
- thelomboklodge.com, pagina honeymoon del resort
- balihoneymoon.com, "Lombok Honeymoon: the Couples Travel Guide 2026"
- museumofwander.com, "The Most Romantic Lombok Honeymoon Escape"
- Expedia, pacchetti honeymoon Lombok

Nessuno è un itinerario giorno per giorno. Tutti aprono con **dove dormire** e **quale isola**.
Stessa cosa per "gili honeymoon": la SERP è dominata da confronti Meno vs Air vs Trawangan
(wezoree, thehoneymoonguide.co, balihoneymoon, Lonely Planet).

**Cause secondarie, in ordine di peso:**

1. **Manca del tutto una sezione "dove dormire".** L'articolo ha solo righe `Base:` dentro i
   giorni. È il sub-intento numero uno di tutta la SERP e non abbiamo un blocco che lo risponda.
2. **Il confronto tra le tre Gili esiste solo come FAQ.** "Which Gili island is best for couples?"
   è sepolta in fondo. È il formato più citato dagli AI (comparativo) e vale 39 impression su
   "gili honeymoon" da sola.
3. **Il title non contiene la formulazione reale.** Oggi: `Lombok & Gili Honeymoon: 9-Day Itinerary`.
   La e commerciale spezza "Lombok honeymoon" e il token dominante è "9-Day Itinerary", che
   restringe l'intento. La query più cercata è "honeymoon in lombok", senza "itinerary".
4. **Link interni deboli.** Solo due pagine interne linkano l'articolo nel corpo
   (`7-days-lombok-gili-islands` e `10-days-raja-ampat-honeymoon`), entrambe deboli. L'hub
   `/destinations/lombok-gili` (330 impression, pos 24,0, la nostra pagina Lombok più forte)
   lo mostra solo come card automatica, senza anchor text a tema luna di miele.

**Non è un problema di thinness.** L'articolo è già allo standard editoriale, 71 blocchi,
day-by-day completo, 7 FAQ, 8 link affiliati funzionanti.

**Caveat onesto:** una parte della posizione 60 è età della pagina più autorità di dominio.
Le correzioni qui sotto sono la leva controllabile, ma da sole non battono balihoneymoon.com
in due settimane. L'obiettivo realistico è passare dalla pagina 6 alla pagina 2-3.

## 3. Title riscritto

```
Lombok Honeymoon: Which Gili Island, and a 9-Day Route
```

54 caratteri. Mette "Lombok honeymoon" come frase esatta iniziale, aggiunge "Gili Island"
per il secondo cluster, e mantiene il segnale itinerario così che il click non venga deluso.

Alternativa se si vuole spingere l'accommodation invece del confronto isole:

```
Lombok Honeymoon: Where to Stay, and a 9-Day Gili Route
```

54 caratteri.

## 4. Meta description riscritta

```
Which Gili island suits a honeymoon, where to stay on Lombok, and a 9-day route from Kuta Lombok to Gili Meno and Gili Air, with honest boat advice.
```

148 caratteri.

## 5. Sezioni H2 da aggiungere

Da inserire **dopo "Who this trip is for" e prima di "Trip at a glance"** le prime due, e
le altre dopo "Why this route makes sense". Il day-by-day resta intatto.

### H2: `Is Lombok a good honeymoon destination?`

> Lombok works well for a honeymoon if you want quiet beaches and warm, easy water rather than
> nightlife or big resort complexes. It is calmer and cheaper than southern Bali, the south coast
> beaches are wide and uncrowded, and the Gili Islands sit an hour offshore. The trade-off is
> fewer restaurants and longer transfers.

(54 parole, autoconclusivo.) Copre "honeymoon in lombok", "honeymoon lombok", "lombok honeymoons":
122 impression combinate.

### H2: `Which Gili island is best for a honeymoon?`

> Gili Meno is the quietest of the three and the one most couples pick for a honeymoon, with a
> handful of bungalows and almost nothing to do. Gili Air is the balanced choice, quiet but with
> places to eat. Gili Trawangan is the busiest, better for couples who want a scene.

(51 parole.) Seguita dalla **tabella comparativa**, il formato più citato dagli AI:

| Island         | Feel                                                     | Pick it for a honeymoon if                             | Watch out for                                                      |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| Gili Meno      | Smallest and quietest, a handful of bungalows            | You want seclusion and almost nothing on the schedule  | Few places to eat, patchy card payment, three nights can feel long |
| Gili Air       | Quiet, with a working village and more choice for dinner | You want calm without isolation, and an easy last stop | The south beachfront gets busier in peak season                    |
| Gili Trawangan | Largest and liveliest, bars and beach clubs              | You want restaurants and some nightlife at the end     | The party crowd concentrates on the east strip                     |

Linkare da qui alla guida esistente `/destinations/lombok-gili/gili-islands-comparison`
(oggi 11 impression, pos 18,8) invece di duplicarne il contenuto.

### H2: `Where should you stay on a Lombok and Gili honeymoon?`

> Split the stay rather than picking one base. Kuta Lombok in the south puts you near the best
> beaches and the airport. Senggigi and the Sire coast in the north hold most of the island's
> larger resorts. On the Gilis, Meno suits seclusion and Air suits a comfortable finish with more
> choice for dinner.

(54 parole.) Seguita dalla tabella aree, **con link affiliati Booking.com** (l'affiliazione CJ
ora esiste, `normalizeBookingHref()` in `src/lib/booking.ts` incapsula l'URL):

| Area                           | Why couples base here                              | Trade-off                            |
| ------------------------------ | -------------------------------------------------- | ------------------------------------ |
| Kuta Lombok (south)            | Closest to the south coast beaches and the airport | A small town, limited dinner options |
| Senggigi and Sire (north-west) | Most of Lombok's larger resorts and spa hotels     | Far from the south beaches           |
| Gili Meno                      | The seclusion half of the trip                     | Very few rooms, book early           |
| Gili Air                       | A comfortable finish with easier onward boats      | Less secluded than Meno              |

`affiliateLinks` da aggiungere (URL di ricerca semplice, il wrapper CJ è automatico):

- `BOOKING_KUTA_LOMBOK` → `https://www.booking.com/searchresults.html?ss=Kuta+Lombok%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1`
- `BOOKING_SENGGIGI` → `https://www.booking.com/searchresults.html?ss=Senggigi%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1`
- `BOOKING_GILI_MENO` → `https://www.booking.com/searchresults.html?ss=Gili+Meno%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1`
- `BOOKING_GILI_AIR` → `https://www.booking.com/searchresults.html?ss=Gili+Air%2C+Indonesia&group_adults=2&group_children=0&no_rooms=1`

Questa è anche la sezione che monetizza: oggi l'articolo non ha nessun link accommodation.

### H2: `Lombok or Bali for a honeymoon?`

> Choose Bali if you want variety, restaurants, spas and short transfers between very different
> places. Choose Lombok if the point of the honeymoon is quiet. Lombok has better empty beaches
> and lower prices, but fewer flights, fewer places to eat and longer drives. Many couples split
> the two, which the Gili boats make simple.

(54 parole.) Copre "bali and lombok honeymoon" e intercetta l'intento adiacente di
"best island in bali for honeymoon" (22 impression, oggi su `/destinations/bali-nearby-islands`
a posizione 55).

### H2: `How much does a Lombok and Gili honeymoon cost?`

> Our Indonesia cost guide puts mid-range travel at 70 to 100 US dollars a day per person and
> comfortable travel at 150 to 250, and a honeymoon usually sits between the two. Lombok runs
> cheaper than southern Bali, but rooms on Gili Meno and Gili Air cost more than the mainland for
> the same standard. Treat these as planning ranges.

(60 parole.) Cifre prese da `/indonesia-travel-costs` per coerenza, non inventate. Linka a
quella pagina, che è la nostra più forte in assoluto (1956 impression, pos 8,9).

**FAQ:** rimuovere "Which Gili island is best for couples?" dalle FAQ una volta che diventa H2,
per non ripetere. Sostituirla con "Is Lombok or Bali better for a honeymoon?".

## 6. Link interni da aggiungere

| Da                                                                  | Perché                                                                             | Anchor suggerito                                                                                                      |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `/destinations/lombok-gili` (330 impr, pos 24,0)                    | La nostra pagina Lombok più forte, oggi linka l'articolo solo come card automatica | riga in-content: "Couples planning a honeymoon here should start with our **9-day Lombok and Gili honeymoon route**." |
| `/indonesia-travel-costs` (1956 impr, pos 8,9)                      | Pagina con più autorità del sito, passa peso reale                                 | "what a **Lombok and Gili honeymoon** actually costs"                                                                 |
| `/destinations/lombok-gili/gili-islands-comparison` (pos 18,8)      | Tema quasi identico, chiude il loop col nuovo H2                                   | "if you are choosing for a **honeymoon**, see the couples version"                                                    |
| `/destinations/lombok-gili/where-to-stay-in-kuta-lombok`            | Sub-intento accommodation                                                          | "**honeymoon couples** usually pair Kuta Lombok with the Gilis"                                                       |
| `/trips/7-days-bali-couples` e `/trips/15-days-indonesia-honeymoon` | Fratelli romantici, oggi non linkano                                               | link reciproco in "Related itineraries"                                                                               |
| `/destinations/bali-nearby-islands` (653 impr, pos 45,3)            | Ranka per "best island in bali for honeymoon" a pos 55 senza rispondere            | "if the honeymoon is the point, **Lombok and the Gilis** do it better"                                                |

Regola di casa: ogni nuovo link in-content richiede `bun run indexnow:submit`.

## 7. Cosa aspettarsi

Il rinforzo agisce su un asset già indicizzato con domanda provata, quindi il segnale arriva
prima di un articolo nuovo. Attesa: la posizione media del cluster honeymoon scende da ~60
verso 30-40 in 2-4 settimane, primi click entro 4-6 settimane. Non ci si aspetta la top 5:
davanti ci sono domini honeymoon-specialisti con anni di storico.

**Metrica da controllare lunedì** su `/trips/9-days-lombok-gili-honeymoon`:
**posizione media**, non i click. Con 0 click di baseline il CTR non è misurabile, e le
impression sono già stabili. Il movimento di posizione è il primo segnale che il retarget
di intento ha funzionato. Comando: `node scripts/gsc-insights.mjs --days 28`.
