# Piano di rinforzo: /destinations/java

> **STATO: APPLICATO il 2026-08-17.** La PARTE 1 (metaTitle, metaDescription, h1) era
> già in produzione dal 2026-08-12, commit `855fd27`. Le cinque sezioni della PARTE 4,
> con le due tabelle, e i link della sezione 5 sono stati applicati oggi.
>
> **Tre scostamenti dal piano, tutti voluti:**
>
> 1. **Due sottosezioni h3 aggiunte, non previste dal piano.** Il template
>    `DestinationSection` porta un solo link per sezione, quindi le quattro guide Java
>    da nominare (sezione 5) non entravano nei cinque link di chiusura. Ho aggiunto
>    "How long should you spend in Yogyakarta itself?" sotto la sezione 1, che porta il
>    link a `things-to-do-in-yogyakarta`, e "How hard is the Ijen blue flames hike?"
>    sotto la sezione 5, che porta il link a `ijen-crater-guide`. Stesso schema già
>    usato su `lombok-gili`. Ora tutte e quattro le guide sono linkate.
> 2. **`/trips/5-days-yogyakarta-bromo` non toccato**: linkava già la hub, con URL
>    assoluto, in fondo al corpo. Stesso per `/trips/7-days-yogyakarta-east-java`, che
>    ha già un link alla hub in un altro punto del corpo. Ho aggiunto solo il link
>    mancante, quello dalla guida `borobudur-vs-prambanan`.
> 3. **Tempi delle tabelle presi da `src/data/routes.ts`**, non dal piano, dopo verifica
>    che coincidessero. Coincidevano: 6-7,5 ore e ~19 treni Jakarta-Yogyakarta, 8-10 ore
>    Yogyakarta-Bromo, 3-4 ore Surabaya-Bromo.
>
> **Ancora aperto:** il punto 6 (le 14 rotte in `src/data/routes.ts` che usano la
> doorway 12Go invece del deep link di tratta), fuori scope allora e ancora oggi.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/destinations/java`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `java`, righe 167-190) e viene renderizzato da `src/routes/destinations.$destination.tsx`.

GSC, 28 giorni (2026-07-13 → 2026-08-09): **128 impression, 0 click, posizione media 29,0.**

Le query attribuite alla pagina (dimensioni page+query, 46 impression su 18 query;
il resto è anonimizzato da Google):

| query                | impression | click | posizione |
| -------------------- | ---------- | ----- | --------- |
| java itinerary       | 20         | 0     | 69,3      |
| java yogyakarta      | 7          | 0     | 34,1      |
| java ijen            | 3          | 0     | 66,0      |
| java trip            | 1          | 0     | 62,0      |
| java volcano         | 1          | 0     | 37,0      |
| java volcanoes       | 1          | 0     | 43,0      |
| java volcanoes map   | 1          | 0     | 48,0      |
| java mount ijen      | 1          | 0     | 49,0      |
| ijen java            | 1          | 0     | 59,0      |
| explore java indonesia | 1        | 0     | 9,0       |
| coda non inglese (ile de java, indonesie java, java voyage, voyage java) | 4 | 0 | 28-68 |

Due cose da notare. La prima: **una sola query vale il 43% del cluster**, ed è
`java itinerary`, in posizione 69. Non è una pagina che ranka male ovunque, è una
pagina che non esiste per la query che conta. La seconda: c'è una coda francese e
olandese (`ile de java`, `java voyage`, `indonesie java`) che non vale la pena
inseguire, ma conferma che l'intent è "pianificare un viaggio a Giava", non
"scoprire cos'è Giava".

## 2. Perché non ranka

**a) La frase cercata non compariva da nessuna parte.** Il vecchio H1 era la sola
parola `Java`, ereditata dal campo `name` che serve alla navigazione. Per quella
stringa il linguaggio di programmazione possiede la SERP mondiale, e noi le
mettevamo davanti una pagina che diceva letteralmente `Java`. Il vecchio title era
un elenco di landmark separati da virgole, senza la parola "itinerary" al
singolare né una promessa. **Questo è il pezzo già sistemato dalla PARTE 1.**

**b) La pagina non risponde a niente.** È un hub in versione minima: una frase di
intro, quattro highlight, poi la lista degli itinerari. Non ha l'array `sections`
che è stato aggiunto a `bali-nearby-islands` e a `lombok-gili`. Chi cerca
"java itinerary" vuole sapere quanti giorni servono, in che ordine muoversi e se
si può fare in treno; la pagina non prova a rispondere a nessuna delle tre.

**c) Chi sta davanti è battibile, e questo è il punto.** La SERP di
`java itinerary` è fatta interamente di blog editoriali: travelfish
("Two weeks in Java: A suggested itinerary"), indietraveller ("Your 1-2 Week Route
In The Island"), christravelblog, snoezelsontheroad ("2 weeks by train"),
azestfortravel, theeagertraveler, happyirishwanderers. Nessun sito istituzionale,
nessun aggregatore di voli. Sono guide lunghe che rispondono in modo diretto alle
tre domande sopra. È esattamente il tipo di SERP che si vince con il contenuto,
al contrario di `/visa-guide`, scartato il 2026-08-07 proprio perché le sue query
sono head term istituzionali.

**d) Un dettaglio ricorrente nella SERP che noi non copriamo: il treno.** Due dei
primi risultati mettono il treno nel titolo. Noi abbiamo la pagina
`/transport/jakarta-to-yogyakarta` con numeri veri e pubblicati (treno executive,
circa 6-7,5 ore, ~19 partenze al giorno), ma l'hub non la nomina e non la linka.
È il vantaggio più concreto che abbiamo e sta parcheggiato in una pagina che
nessuno raggiunge.

**e) Cannibalizzazione: non è il problema qui.** Nessuna query mostra due nostre
URL in competizione su Giava. Anzi, `/destinations/java/borobudur-vs-prambanan`
prende 55 impression in posizione 11,4 da sola: la guida comparativa funziona,
l'hub no. Motivo in più per far somigliare l'hub a quella guida.

## 3. PARTE 1, già applicata (commit `855fd27`)

Registrata qui per poter annullare in dieci secondi.

| campo             | valore vecchio                                                                                                                  | valore nuovo                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `h1`              | _assente_ (ripiegava su `name`, cioè `Java`)                                                                                      | `Java Itineraries`                                                                                                                                    |
| `metaTitle`       | `Java itineraries, Yogyakarta, Bromo & Ijen`                                                                                       | `Java Itineraries: Yogyakarta, Bromo and Ijen, Day by Day` (56 char)                                                                                   |
| `metaDescription` | `Java trip plans covering Yogyakarta, Borobudur, Prambanan, Mount Bromo and the Ijen blue flames. Bookable day-by-day routes.`      | `How many days Java needs, the order that saves the most road time, and where Borobudur, Bromo and Ijen fit. Day-by-day routes with transfer times.` (150 char) |

Per annullare: `git revert 855fd27`.

## 4. Le sezioni da aggiungere (DA APPROVARE)

Da inserire come array `sections` nella voce `java` di `src/data/destinations.ts`,
stessa struttura già usata da `bali-nearby-islands` e `lombok-gili`. Le prime
frasi sono scritte per stare in piedi da sole in 40-60 parole, che è il blocco che
gli AI estraggono.

### Sezione 1

**heading:** `How many days do you need in Java?`

**apertura (53 parole):**

> Five days covers Yogyakarta and one volcano. Seven to eight gets Yogyakarta,
> Bromo and Ijen in a single east-bound line. Ten days adds Jakarta or Bandung at
> the western end without rushing. Two weeks lets you cross into Bali overland at
> the end instead of flying back. Below three days, pick one city.

**tabella:**

| Days    | Route                                | What you get                                     | What you give up                                    |
| ------- | ------------------------------------ | ------------------------------------------------ | --------------------------------------------------- |
| 5       | Yogyakarta, then Bromo via Surabaya  | Borobudur, Prambanan and one sunrise volcano      | Ijen, and any time in Jakarta or Bandung            |
| 7 to 8  | Yogyakarta, Bromo, Ijen, exit to Bali | The classic east-bound crossing, both volcanoes   | West Java entirely, and unhurried temple days       |
| 10      | Jakarta, Bandung, Yogyakarta, Bromo  | The western half plus the temples and one volcano | Ijen, unless you cut a night in Bandung             |
| 14      | Jakarta to Bali overland, west to east | Everything above, with room for a rest day      | Very little, this is the comfortable version        |

**link di chiusura:** verso `/trips/7-days-yogyakarta-east-java` con anchor
`7-day Yogyakarta and East Java route`.

### Sezione 2

**heading:** `What order should you travel Java in?`

**apertura (57 parole):**

> West to east, almost always. Jakarta or Bandung first, then Yogyakarta, then
> Bromo, then Ijen, then the ferry or a short flight into Bali. That direction
> puts the long train legs at the start while you are fresh, ends the trip on a
> beach rather than in traffic, and keeps the two pre-dawn volcano starts close
> together.

**link di chiusura:** verso `/trips/15-days-java-bali` con anchor
`15-day Java to Bali crossing`.

### Sezione 3

**heading:** `Can you cross Java by train?`

**apertura (59 parole):**

> Yes, and for most of the island it is the better choice. Java's rail network is
> the best in Indonesia, and an executive train such as the Taksaka or Argo
> services covers Jakarta to Yogyakarta in about six to seven and a half hours,
> city centre to city centre. The volcanoes are the exception, and both need a
> road transfer.

**tabella** (tutti i numeri sono già pubblicati sulle nostre pagine
`/transport/*`, tenuti allineati di proposito invece di essere ri-cercati):

| Leg                   | Best way                       | Working time                        | Note                                                                       |
| --------------------- | ------------------------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| Jakarta to Yogyakarta | Executive train                | About 6 to 7.5 hours, around 19 daily | Often wins door to door, since YIA airport is about an hour from town     |
| Yogyakarta to Bromo   | Two-day, one-night road package | About 8 to 10 hours each way        | The sunrise jeep leaves around 3am, so a same-day return is brutal          |
| Surabaya to Bromo     | Road transfer or shuttle       | About 3 to 4 hours                  | The closest gateway, and the only one where a single-day tour makes sense   |
| Bali to Yogyakarta    | Direct flight                  | About 1 hour 25 minutes             | There is no sensible overland version coming the other way                 |

**link di chiusura:** verso `/transport/jakarta-to-yogyakarta` con anchor
`Jakarta to Yogyakarta, train against flight`.

### Sezione 4

**heading:** `Borobudur or Prambanan, and can you do both?`

**apertura (52 parole):**

> Both, and in one day if you plan it. They sit on opposite sides of Yogyakarta,
> roughly an hour apart by road, and the usual pairing is Borobudur at sunrise
> and Prambanan in the late afternoon. If you only have time for one, Borobudur
> is the more famous and the more crowded, Prambanan the quieter visit.

**link di chiusura:** verso `/destinations/java/borobudur-vs-prambanan` con anchor
`our full Borobudur against Prambanan comparison`. Questa è la guida che già
ranka in posizione 11,4: il link serve tanto a lei quanto all'hub.

### Sezione 5

**heading:** `When is the best time to visit Java?`

**apertura (48 parole):**

> The dry season, roughly April to October. That window gives the clearest
> sunrises at Bromo and the most reliable conditions at Ijen, where the blue
> flames need a pre-dawn hike and clouds ruin it. The wet months bring haze and
> cancelled crater access more often than travellers expect.

**link di chiusura:** verso `/destinations/java/best-time-to-visit-mount-bromo`
con anchor `when to visit Mount Bromo`.

## 5. I link interni da aggiungere

Oltre a quelli in coda alle sezioni, l'hub dovrebbe nominare esplicitamente le
quattro guide Java che già esistono e che oggi compaiono solo nel blocco generico
in fondo alla pagina:

- `/destinations/java/things-to-do-in-yogyakarta`
- `/destinations/java/borobudur-vs-prambanan`
- `/destinations/java/ijen-crater-guide`
- `/destinations/java/best-time-to-visit-mount-bromo`

E i link in entrata verso l'hub, che oggi mancano dove servono di più:

- da `/trips/7-days-yogyakarta-east-java`, nella sezione "Related itineraries"
- da `/trips/5-days-yogyakarta-bromo`, idem
- da `/destinations/java/borobudur-vs-prambanan`, che ha già autorità e non passa
  quasi niente all'hub

## 6. Fuori scope, ma trovato strada facendo

`src/data/routes.ts` riga 21 definisce
`const TWELVEGO = "https://12go.asia/?z=16022946"` e **14 rotte di trasporto lo
usano come `bookingUrl`**. È la doorway alla homepage, quella che lo standard
affiliati ha deprecato in favore del deep link di tratta
(`https://12go.asia/en/travel/<partenza>/<arrivo>?z=16022946`). Riguarda anche
`/transport/jakarta-to-yogyakarta`, che questo piano vuole linkare dall'hub.
Non toccato qui perché la PARTE 1 è limitata a title, meta e H1. Aperto come task
separato.

## 7. Quando giudicare

La sola PARTE 1 va giudicata il **2026-09-09**, cioè 28 giorni dopo la fine della
finestra usata qui. Metrica: **posizione media di `/destinations/java`**, oggi
29,0, e **posizione della query `java itinerary`**, oggi 69,3. Il click su una
pagina che ne fa zero non è un obiettivo realistico a 28 giorni; il segnale da
guardare è il movimento della query principale sotto la posizione 30.

Se le sezioni della PARTE 4 vengono approvate e applicate, la finestra di giudizio
riparte da quella data.
