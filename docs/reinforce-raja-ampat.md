# Piano di rinforzo: /destinations/raja-ampat

> **STATO: APPLICATO INTEGRALMENTE il 2026-08-29,** il giorno dopo la stesura, su
> richiesta esplicita del founder ("spingere").
>
> - **PARTE 1** (`metaTitle`, `metaDescription`, `h1`): commit `08932c7` del 2026-08-28.
> - **PARTE 4** (cinque sezioni H2, quattro sottosezioni h3, una tabella comparativa)
>   e **sezione 5.2 e 5.3** (nove link in uscita, intro riscritta): commit `221706c`.
>   Verificato live: tutte e sei le intestazioni servite in SSR, 7 link `/trips/`
>   distinti, 12 link alle guide, tabella renderizzata.
>
> **Due scostamenti dal piano, entrambi voluti:**
>
> 1. **I link di sezione vanno alle quattro guide, non solo agli itinerari.** Il
>    piano prevedeva sei link ai cinque itinerari. Esistono però quattro guide
>    `raja_ampat` live (`how-to-get-to-raja-ampat`, `raja-ampat-cost-guide`,
>    `liveaboard-vs-basing-in-waisai`, `best-time-to-visit-raja-ampat`) che erano
>    orfane dalla hub. Aggiunte quattro sottosezioni h3 invece di una: nove link
>    totali, che coprono **tutti e cinque gli itinerari e tutte e quattro le guide**.
>    Tutti e nove verificati con HTTP 200 prima del commit.
> 2. **"Birds of paradise" resta**, nella sottosezione su Kri, Gam e Mansuar. Il
>    validatore delle frasi bandite lo segnala per "paradise", ma è il nome della
>    specie e compare già in 19 articoli live. Falso positivo, non corretto.

Pagina: `https://exploreindonesia.ai/destinations/raja-ampat`
Sorgente: **codice, non Sanity.** Il contenuto vive in `src/data/destinations.ts`
(voce `raja-ampat`) e viene renderizzato da `src/routes/destinations.$destination.tsx`.

---

## 1. La pagina, il cluster, i numeri

Finestra GSC 2026-07-29 → 2026-08-25 (28 giorni), dimensioni page+query:

| query                    | impression | click | posizione |
| ------------------------ | ---------: | ----: | --------: |
| raja ampat kri island    |         19 |     0 |      63,7 |
| kri island               |         10 |     0 |      63,0 |
| kri raja ampat           |          5 |     0 |      56,0 |
| raja ampat kri           |          2 |     0 |      58,5 |
| raja ampat coral islands |          2 |     0 |      43,0 |
| corepen homestay         |          1 |     0 |      42,0 |

**Totale pagina: 39 impression, 0 click, posizione media 60,7.**

**36 impression su 39, cioè il 92%, sono il cluster "Kri Island".** Non è una pagina
che prende traffico generico su Raja Ampat: è una pagina che Google mostra per una
singola isola di cui la hub non parla.

---

## 2. Perché non ranka

**2.1. La hub è un elenco nudo.** È una delle **due sole hub del sito rimaste senza
`sections`**, insieme a `bali`. Tutte le altre sei ne hanno:

| hub                 | sezioni | heading |
| ------------------- | ------- | ------- |
| bali-nearby-islands | sì      | 17      |
| java                | sì      | 7       |
| lombok-gili         | sì      | 7       |
| komodo-flores       | sì      | 6       |
| wild-indonesia      | sì      | 5       |
| sumatra             | sì      | 1       |
| **raja-ampat**      | **no**  | **0**   |
| **bali**            | **no**  | **0**   |

È esattamente la condizione che teneva `bali-nearby-islands` a 563 impression e zero
click prima dell'intervento del 2026-08-07. Oggi la hub Raja Ampat offre a Google
un intro di tre righe, quattro parole in `highlights` e una lista di link.

**2.2. Il vecchio title prometteva liveaboard che non esistono.** Verificato sui
cinque articoli `raja_ampat` in produzione: **nessuno è un itinerario liveaboard**.
La parola compare 2 volte in `14-days-raja-ampat-divers` e 4 in
`8-days-raja-ampat-homestays-kri-island`, sempre come alternativa citata di
passaggio. Il vecchio `metaTitle` vendeva quindi una cosa che la pagina non
consegna. Corretto nella PARTE 1.

**2.3. Chi sta davanti è molto più profondo.** SERP controllata il 2026-08-28 su
`kri island raja ampat` e `raja ampat kri island homestay guide`: davanti stanno
**stayrajaampat.com** (una directory di homestay con una pagina per isola e una per
struttura), **papua-diving.com** (il resort che ha aperto Kri, con guida dedicata),
**karang.travel**, **brunetteatsunset.com** e TripAdvisor. Sono blog e operatori
editoriali, **non siti istituzionali**: la SERP è vincibile, ma non con quattro
parole di `highlights`.

**2.4. Attenzione alla cannibalizzazione, ed è il punto delicato.**
`8-days-raja-ampat-homestays-kri-island` è stato pubblicato il **2026-08-24**, ha
`metaTitle` "Raja Ampat Homestays: 8 Days Based on Kri Island" e `focusKeyword`
"Raja Ampat homestays". A quattro giorni dalla pubblicazione **non compare ancora
in GSC**: è la hub ad assorbire tutte e 36 le impression su Kri.

**Per questo la PARTE 1 non ha messo "Kri" nel title della hub, ed è una scelta
deliberata.** L'articolo deve vincere su "kri island"; la hub deve vincere su
"quale rotta / quanti giorni / permessi / come si arriva". Se il founder volesse
puntare la hub su Kri, romperebbe l'articolo appena pubblicato. **Non farlo.**

---

## 3. Già applicato in produzione (PARTE 1), con i valori vecchi

| campo             | valore vecchio                                                                                                            | valore nuovo                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `metaTitle`       | `Raja Ampat itineraries, diving & liveaboards`                                                                            | `Raja Ampat Itineraries: Which Route, How Many Days` (50 car.)                                                                       |
| `metaDescription` | `Raja Ampat diving itineraries and liveaboard routes through the world's richest reefs. Plan and book your trip day by day.` | `Five Raja Ampat routes compared, 7 to 14 days: homestays, diving, family and honeymoon. Ferry times from Sorong and what to book first.` (135 car.) |
| `h1`              | *assente*, ripiegava su `name` = `Raja Ampat`                                                                             | `Raja Ampat Itineraries`                                                                                                            |

**Per annullare:** in `src/data/destinations.ts`, voce `raja-ampat`, rimettere le
due stringhe vecchie e **cancellare la riga `h1:`**. Nient'altro è stato toccato.

---

## 4. Le sezioni H2 da aggiungere

Cinque sezioni, nel formato `DestinationSection` già usato dalle altre sei hub. La
prima frase di ogni sezione deve rispondere da sola in 40-60 parole: è il blocco che
gli AI estraggono. **Un solo link per sezione**, come impone il template, più una
sottosezione h3 dove serve un link in più (schema già usato su `java` e `lombok-gili`).

### 4.1 H2: "How many days do you need in Raja Ampat?"

> Seven days is the realistic minimum once the flights are counted, and ten to
> fourteen is where the trip stops feeling rushed. Two of those days go to getting
> in and out through Sorong and Waisai, so a seven-day trip buys about four full
> days on the water. Anything shorter is mostly transit.

Poi: perché il Dampier Strait concentra quasi tutto (Waisai, Gam, Mansuar, Kri);
perché Wayag a nord e Misool a sud sono viaggi separati e non estensioni.

**Link di sezione:** `/trips/7-days-raja-ampat-snorkeling-islands`, ancora
`the 7-day Raja Ampat snorkelling route`.

### 4.2 H2: "How do you actually get to Raja Ampat?"

> Fly to Sorong, usually via Jakarta or Makassar, then take the fast ferry to
> Waisai, which runs around two hours. From Waisai your homestay or resort sends a
> local boat. Ferries commonly depart twice a day in each direction, and the whole
> chain has to line up, so one missed flight costs a full day.

Poi: i biglietti si comprano di persona al porto, gli orari cambiano (l'operatore
ha rivisto il calendario a gennaio 2026), la tariffa gira intorno a IDR 150.000 in
classe standard e IDR 250.000 in business come stima di lavoro, più una tassa
d'imbarco di poche migliaia di rupie. **Verificare sempre la guida ufficiale**: le
fonti pubblicate divergono e alcune indicano IDR 300.000-500.000.

**Link di sezione:** `/trips/14-days-raja-ampat-divers`, ancora
`the 14-day Raja Ampat diving route`.

### 4.3 H2: "How much are the Raja Ampat permits, and what do they cover?"

> Two official fees apply and both are mandatory, even for a short stay. The marine
> park entry permit runs around IDR 700,000 per person and is valid for a year, and
> a visitor entry ticket adds about IDR 300,000. Together roughly IDR 1,000,000, or
> about 65 US dollars per person, paid in cash on arrival.

⚠️ **Queste cifre sono già pubblicate in tre articoli live**
(`14-days-raja-ampat-divers`, `10-days-raja-ampat-honeymoon`,
`7-days-raja-ampat-snorkeling-islands`) e coincidono con le fonti indipendenti
controllate il 2026-08-28. **Vince comunque il valore già in produzione**: non
introdurre una cifra diversa senza allineare anche gli articoli, o si crea la
contraddizione interna che il piano `komodo-flores` ha già prodotto una volta.

Aggiungere: la carta è fisica e le guide la controllano, i bambini sotto i 12 anni
sono esentati, e a Waisai gli ATM sono pochi, quindi il contante si preleva a Sorong.

**Link di sezione:** `/trips/10-days-raja-ampat-honeymoon`, ancora
`the 10-day Raja Ampat honeymoon route`.

### 4.4 H2: "Homestay or dive resort: which should you book?"

> Papuan homestays cost roughly 27 to 30 US dollars per person per night with three
> meals included, and put you on the beach the reef sits off. Dive resorts cost
> several times that and buy you hot water, reliable boats and a dive operation on
> site. The reef is the same from both.

**Tabella comparativa** (il formato più citato dagli AI, e la hub non ne ha nessuna):

| | Papuan homestay | Dive resort |
| --- | --- | --- |
| Prezzo a persona/notte | Circa $27-30, tre pasti inclusi | Diverse volte tanto, spesso a pacchetto |
| Camere | Bungalow di legno, spesso sull'acqua, bagno condiviso o mandi | Camere con acqua calda e corrente stabile |
| Immersioni | Da organizzare, charter barca circa $100-200 al giorno | Centro interno, uscite quotidiane programmate |
| Corrente e wifi | Generatore a ore, segnale scarso | Generalmente continua, wifi lento ma presente |
| A chi conviene | Chi vuole snorkeling, budget basso, ritmo lento | Chi immerge ogni giorno e non vuole logistica |

Caption: `The reef is identical from either. What you are buying is logistics, not access.`

**Sottosezione h3: "Which island should you base on: Kri, Gam or Mansuar?"**

> Kri is the busiest and best connected, with the largest concentration of homestays
> and the shortest boat times to the best-known sites. Gam is quieter and better for
> birdlife. Mansuar sits between the two. For a first trip, Kri wins on convenience
> and loses on solitude.

**Link della sottosezione:** `/trips/8-days-raja-ampat-homestays-kri-island`, ancora
`the 8-day Kri Island homestay route`. **Questo è il link che deve raccogliere le 36
impression su Kri e passarle all'articolo.** È il punto più importante del piano.

**Link di sezione:** `/trips/9-days-raja-ampat-with-kids`, ancora
`the 9-day Raja Ampat route with kids`.

### 4.5 H2: "When is the best time to visit Raja Ampat?"

> October to April is the window most operators favour, with the calmest seas and
> the best visibility, and manta activity peaking in the wetter months around
> December to March. June to September brings stronger wind and rougher crossings.
> Raja Ampat has no true dry season, so expect rain in any month.

⚠️ `8-days-raja-ampat-homestays-kri-island` pubblica già **"Best time: October to
April"**. Allinearsi a quello.

---

## 5. I link, e cosa NON serve fare

**5.1. In entrata: già a posto, verificato, non toccare.** Tutti e cinque gli
articoli `raja_ampat` linkano già `/destinations/raja-ampat` dal corpo. Una
verifica GROQ del 2026-08-28 lo conferma su tutti e cinque gli slug. **Nessun
intervento richiesto**, e sarebbe stato facile proporlo a vuoto.

**5.2. In uscita: è qui che manca tutto.** Senza `sections` la hub non ha nemmeno
un link in-content: gli itinerari compaiono solo nella lista generata. Le cinque
sezioni sopra più la sottosezione portano **sei link in-content descrittivi**, uno
per ciascuno dei cinque itinerari, con il sesto che rinforza Kri.

**5.3. Da correggere mentre si è nel file:** `intro` dice ancora *"plus liveaboard
options for serious divers"*. È la stessa promessa non mantenuta rimossa dal title
nella PARTE 1. Riscriverla su homestay e dive resort, che è ciò che la pagina elenca
davvero.

---

## 6. Cosa aspettarsi, e quando giudicare

La PARTE 1 ha oggi zero giorni di vita. **Data di giudizio: 2026-09-25**, 28 giorni
pieni.

- **Metrica primaria:** posizione media di `/destinations/raja-ampat`, oggi **60,7**.
- **Metrica secondaria, ed è quella che conta di più:** le impression su
  `raja ampat kri island` + `kri island` devono **migrare dalla hub all'articolo**
  `8-days-raja-ampat-homestays-kri-island`. Se a fine settembre l'articolo prende
  quelle query e la hub no, l'intervento ha funzionato **anche se la posizione
  della hub non migliora**. È il risultato desiderato, non un effetto collaterale.
- Il CTR non è una metrica utile qui: a posizione 60 lo zero click è atteso e non
  dice niente sul title.
