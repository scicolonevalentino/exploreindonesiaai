# Piano di rinforzo, `/trips/7-days-gili-islands-learn-to-dive`

> **STATO: APPLICATO INTEGRALMENTE il 2026-08-21,** lo stesso giorno in cui è stato scritto.
> La PARTE 1 aveva già applicato `metaTitle` e `metaDescription`; il founder ha approvato il
> resto in giornata, quindi sono stati applicati anche il `title` nuovo, le quattro sezioni H2
> con la seconda tabella comparativa, e i link interni. Il corpo è passato da 66 a 81 blocchi.
>
> **Correzione al punto 5.4 di questo documento:** la stesura originale diceva che da
> `/trips/4-days-gili-islands-trawangan-meno-air` "oggi non c'è link". Falso, verificato al
> momento di applicare: il link esiste già, aggiunto da una run precedente, nel blocco
> "Stretch to five or six days". Non è stato toccato.

\_id Sanity: `itinerary-7-days-gili-islands-learn-to-dive` (contentStatus `live`)
URL: https://exploreindonesia.ai/trips/7-days-gili-islands-learn-to-dive

---

## 1. I numeri, finestra GSC 2026-07-22 → 2026-08-18 (28 giorni)

La pagina è a **78 impression, posizione media 32,8, zero click**.

| Query                        | Impression | Click | Posizione |
| ---------------------------- | ---------: | ----: | --------: |
| gili islands diving holidays |         17 |     0 |      36,9 |
| duiken gili (olandese)       |          9 |     0 |      54,2 |
| gili island diving           |          4 |     0 |      57,8 |
| diving gili islands          |          3 |     0 |      63,3 |
| dive in gili islands         |          2 |     0 |      51,5 |
| gili islands diving          |          2 |     0 |      61,5 |
| dive gili islands            |          1 |     0 |      40,0 |
| duiken gili eilanden         |          1 |     0 |      46,0 |
| gili islands scuba diving    |          1 |     0 |      55,0 |

Il cluster è uno solo e non è ambiguo: **immersioni alle Gili**. Nessuna variante contiene
"learn to dive", "course" o "PADI". Google associa questa pagina alla domanda larga, e la
pagina risponde solo a quella strettissima.

---

## 2. Perché non ranka

**(a) Non nomina un solo dive site.** Verificato sul corpo dell'articolo: zero occorrenze di
Shark Point, Halik, Turtle Heaven, Meno Wall, Air Wall, Simon's Reef. Ogni pagina che ci sta
davanti nella SERP (divein.com, la scheda destinazione PADI, la guida SSI, ZuBlu, i blog dei
dive shop) **apre con l'elenco dei siti**. È il formato che Google riconosce come pertinente
per "gili islands diving" e noi non lo abbiamo.

**(b) È sottile.** 1.368 parole contro guide concorrenti che stanno fra le 2.500 e le 4.000, e
con una sola tabella. Su questo sito le pagine che rankano stanno sopra le 2.500.

**(c) Non ha prezzi.** L'unica cifra nel corpo è la tariffa del fast boat (IDR 275.000). Non
c'è il costo del corso Open Water, non c'è il prezzo di un fun dive, non c'è la marine park fee
delle Gili. I concorrenti hanno tutti una sezione prezzi, ed è la parte più citata dagli AI.

**(d) Nessuna sezione sulla stagionalità.** "Quando immergersi alle Gili" è una delle prime
domande di chi cerca una vacanza subacquea, e non è coperta.

**(e) NON è cannibalizzazione.** Verificato query per query: `/destinations/lombok-gili` porta
un cluster diverso (lombok + gili itinerary, 167 impression), `/trips/4-days-gili-islands-trawangan-meno-air`
e `/destinations/lombok-gili/gili-islands-comparison` sono a **zero impression** su queste
query. Su "immersioni alle Gili" questa pagina è sola. Rafforzarla non toglie niente a nessuno.

---

## 3. Title e meta, GIÀ APPLICATI dalla PARTE 1 del 2026-08-21

Registrati qui per poter annullare in dieci secondi.

**`metaTitle`, valore vecchio (esatto):**

```
Learn to Dive in the Gili Islands: A 7-Day Plan
```

**`metaTitle`, valore nuovo applicato (52 caratteri):**

```
Gili Islands Diving Holiday: 7 Days, Course Included
```

**`metaDescription`, valore vecchio (esatto):**

```
How long an open water course really takes in the Gili Islands, what it costs in 2026, and why four days is not enough. A 7-day plan that works.
```

**`metaDescription`, valore nuovo applicato (142 caratteri):**

```
What diving in the Gili Islands is really like, what an open water course costs in 2026, and why four days is not enough. A tested 7-day plan.
```

Il campo `title` (`7 Days Learning to Dive in the Gili Islands`) **non è stato toccato**: su un
articolo `title` guida H1, headline JSON-LD, breadcrumb e ogni card nei listing.

### Proposta sul `title` (questa sì da decidere)

Il `title` attuale promette solo il corso. Se il founder vuole allinearlo alla domanda reale:

```
Diving the Gili Islands: A 7-Day Learn to Dive Trip
```

Non è un ritocco meccanico e va deciso a mano, per il motivo sopra.

---

## 4. Le sezioni H2 da aggiungere

Vanno inserite **prima** del blocco "Day 1", tranne dove indicato. Ogni prima frase è
autoconclusiva in 40-60 parole, perché è il blocco che gli AI estraggono.

### H2 nuovo, dopo "Why this route makes sense"

**`Which dive sites will you actually dive in the Gili Islands?`**

> Most Gili courses and fun dives run inside a ring of about a dozen sites between the three
> islands. Shark Point and Halik sit off Gili Trawangan, Meno Wall and Turtle Heaven off Gili
> Meno, Air Wall and Air Slope off Gili Air. Almost all of them are boat dives of ten to twenty
> minutes, and none of them are deep.

Poi il paragrafo di dettaglio: Turtle Heaven come pinnacolo con tartarughe verdi ed
embricate e copertura corallina fra i 10 e i 30 metri; Meno Wall come drift lungo una parete
e miglior sito notturno delle isole; Air Wall come caduta verticale dai 5 ai 30 metri sul lato
est di Gili Air, con gorgonie e pesci pappagallo bumphead in profondità; Air Slope come mix
reef e muck, buono sia per principianti sia per la macro. Chiudere con il punto di vista di
casa: quali di questi un allievo Open Water vede davvero durante il corso, e quali restano per
i fun dive dopo il brevetto.

**Aggiungere qui una tabella comparativa** (`comparisonTable`), colonne
`Site | Island | Depth and conditions | What you see | Course or post-course`.
È il formato più citato in assoluto dagli AI answer e la pagina oggi ne ha una sola.

### H2 nuovo, subito dopo la tabella dei siti

**`How much does diving in the Gili Islands cost in 2026?`**

> Budget roughly IDR 5,000,000 to 6,900,000 for a PADI Open Water course, about $310 to $390,
> depending on the school. Individual fun dives run around IDR 500,000 to 700,000 each, with
> real discounts on packages of five or ten. There is also a one-off Gili marine park fee of
> around IDR 100,000 per person.

Regola di casa sulle cifre: cautelativo **più** fonte. "come stima di lavoro, i listini dei
dive shop cambiano ogni stagione" e, dove la fonte è identificabile, citarla nel testo
("prezzo pubblicato dal centro immersioni"). Aggiungere la nota che i prezzi sono
deliberatamente allineati fra le scuole delle Gili da un accordo locale, quindi cercare il
centro più economico è tempo perso: si scelgono l'istruttore e il rapporto allievi/guida.

### H2 nuovo, dopo la sezione prezzi

**`When is the best time to dive in the Gili Islands?`**

> April to November is the reliable window: calm seas, visibility around 25 to 30 metres and
> currents that a newly certified diver can handle. Water sits between 25 and 30 degrees all
> year, so the season is about surface conditions and visibility rather than temperature.

Poi il paragrafo onesto: dicembre-marzo si immerge comunque, ma le traversate da Bali si
cancellano più spesso ed è quello, non l'acqua, che rompe un programma di corso di quattro
giorni. Le tartarughe verdi ed embricate si vedono tutto l'anno.

### H2 nuovo, prima di "Final verdict"

**`Gili Trawangan, Gili Air or Gili Meno: where should a diver stay?`**

> Trawangan has the most schools and the only real nightlife, Gili Air has a quieter strip with
> a handful of good centres, Gili Meno has the fewest of everything. For a seven-day trip built
> around a course, doing the certification on Trawangan and the fun dives from Gili Air gives
> you both without a second crossing from Bali.

Questa sezione fa doppio lavoro: risponde a una domanda reale e crea il gancio naturale per
il link interno alla guida di confronto (sotto).

---

## 5. Link interni da aggiungere

Tutti in-content, non nel footer. Da fare riscrivendo l'array `body` intero: i selettori
`[_key==...]` su questo dataset non matchano e la mutation restituisce comunque 200.

**In uscita, da questa pagina:**

1. Dalla nuova sezione "Gili Trawangan, Gili Air or Gili Meno" →
   `/destinations/lombok-gili/gili-islands-comparison`. La guida esiste ed è a **zero
   impression**: è orfana in pratica, e questo è il link che le dà senso.
2. Dalla sezione stagionalità → `/destinations/lombok-gili/best-time-to-visit-lombok`
   (71 impression, posizione 9,8: pagina sana, il link passa autorità in una direzione utile).
3. Dal Day 1 (traversata da Bali) → `/transport/bali-to-gili-islands`.

**In entrata, verso questa pagina:**

4. Da `/trips/4-days-gili-islands-trawangan-meno-air`, in-content: chi fa quattro giorni sulle
   tre isole è esattamente chi si chiede se aggiungere il brevetto. Oggi non c'è link.
5. Da `/trips/7-days-lombok-gili-islands` (229 impression), nel giorno che passa alle Gili.
6. Dall'hub `/destinations/lombok-gili`, dalla sezione immersioni se esiste, altrimenti dalle
   card itinerari con un'ancora che dica "learn to dive", non il titolo nudo.

---

## 6. Cosa aspettarsi

Il ritocco della PARTE 1 da solo agisce sulla CTR e, marginalmente, sulla pertinenza del
`<title>` per "gili islands diving holidays". Da solo non porta una pagina da 32,8 a top 10:
il salto vero richiede i siti di immersione, i prezzi e la stagionalità, cioè la PARTE 3.

Metrica da guardare il lunedì, su `/trips/7-days-gili-islands-learn-to-dive`:

- **subito (1-2 settimane):** posizione media della pagina, oggi 32,8. Un movimento sotto 28 è
  il segnale che il nuovo `<title>` è pertinente.
- **se si applica la PARTE 3:** primi click su "gili islands diving holidays" (oggi 0 su 17
  impression) e comparsa della pagina su query di singolo sito ("turtle heaven gili",
  "meno wall", "shark point gili"), che oggi non generano nessuna impression per noi.

---

## 7. Cosa è stato applicato davvero, 2026-08-21

**`title`** (deciso dal founder, non era un ritocco meccanico):

```
vecchio: 7 Days Learning to Dive in the Gili Islands
nuovo:   Diving the Gili Islands: A 7-Day Learn to Dive Trip
```

**Quattro sezioni H2 nuove**, nell'ordine in cui compaiono ora nella pagina:

1. `Which dive sites will you actually dive in the Gili Islands?`, con una
   **`comparisonTable` nuova** (Site / Island / Depth and conditions / What you see /
   Course or after) su Shark Point, Halik Reef, Turtle Heaven, Meno Wall, Air Wall e Air Slope.
   La colonna "Course or after" è il punto di vista di casa: chi fa l'Open Water non si immerge
   sui siti che crede, e quello è l'argomento per restare dopo il brevetto.
2. `How much does diving in the Gili Islands cost in 2026?`, con Open Water a
   IDR 5.000.000-6.900.000, fun dive a IDR 500.000-700.000, marine park fee IDR 100.000.
3. `When is the best time to dive in the Gili Islands?`
4. `Gili Trawangan, Gili Air or Gili Meno: where should a diver stay?`

**Fatto verificato aggiunto in fase di scrittura, non era nel piano:** la **Gili Indah Dive
Alliance**, nata nel 2008 e guidata dagli anziani locali, fissa prezzi minimi comuni fra i dive
centre associati. Cercare il preventivo più basso alle Gili è tempo perso, e questo nessuna
delle pagine che ci stanno davanti lo dice con chiarezza. È il differenziale editoriale della
pagina, non solo un numero in più.

**Link interni applicati:**

- in uscita → `/destinations/lombok-gili/gili-islands-comparison` (guida a zero impression, ora
  ha un ingresso contestuale), `/destinations/lombok-gili/best-time-to-visit-lombok`,
  `/transport/bali-to-gili-islands`
- in entrata → da `/trips/7-days-lombok-gili-islands` nel Day 6 (snorkeling), e dall'hub
  `/destinations/lombok-gili` con una sezione nuova `Can you learn to dive in the Gili Islands?`
  in `src/data/destinations.ts`. Prima l'hub la linkava solo con una card automatica.
- da `/trips/4-days-gili-islands-trawangan-meno-air` il link esisteva già, vedi la correzione
  in cima.
