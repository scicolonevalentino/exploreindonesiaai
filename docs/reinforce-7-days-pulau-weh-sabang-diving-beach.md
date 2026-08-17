# Piano di rinforzo: /trips/7-days-pulau-weh-sabang-diving-beach

> **STATO: NON APPLICATO.** Generato dal task schedulato del 2026-08-17. La PARTE 1
> (metaTitle e metaDescription) è già in produzione, transazione Sanity
> `9I1TyPaxC6m0CvrgC94ORe`, verificata live. Tutto quello che segue dalla sezione 4 in
> poi **non è applicato: decide il founder.**

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/7-days-pulau-weh-sabang-diving-beach`
\_id Sanity: `itinerary-7-days-pulau-weh-sabang-diving-beach` (contentStatus `live`, online dal 2026-07-10)

GSC, 28 giorni (2026-07-18 → 2026-08-14): **136 impression, 3 click, posizione media 33,2.**
Le query nominate (dimensioni page+query, 46 impression su 20 query; il resto è anonimizzato da Google):

| query                         | impression | click | posizione |
| ----------------------------- | ---------- | ----- | --------- |
| pulau weh                     | 8          | 0     | 69,5      |
| pulau weh diving              | 5          | 0     | 70,8      |
| pulau weh island indonesia    | 5          | 0     | 66,4      |
| pulau weh island              | 4          | 0     | 61,3      |
| pulau weh aceh                | 3          | 0     | 42,7      |
| pulau weh indonesia           | 3          | 0     | 63,3      |
| banda aceh ferry to pulau weh | 2          | 0     | 70,0      |
| pualu weh                     | 2          | 0     | 60,5      |
| pulau weh di aceh             | 2          | 0     | 53,5      |
| sumatra pulau weh             | 2          | 0     | 56,5      |
| coda lunga (10 query)         | 10         | 0     | 50-94     |

## 2. Perché non ranka

**Non è cannibalizzazione.** Nessun'altra nostra URL compare su queste query. Il
`15-days-sumatra` linka la pagina ma non compete per il cluster.

**Non è il title.** "Pulau Weh" era già nel title. La PARTE 1 di oggi ha comunque
riscritto il metaTitle perché il vecchio apriva con "7 Days in", cioè con la durata,
mentre il 90% del cluster è una query di nome-luogo: chi cerca "pulau weh" o "pulau weh
island" vuole una panoramica, non un piano di sette giorni. Ma questo è un intervento da
CTR, non da posizione, e da solo non sposta niente da posizione 65.

**È l'intento.** La pagina è costruita interamente come itinerario. I 16 H2 sono
"Who this trip is for", "Trip at a glance", "Day 1: Arrive in Banda Aceh" fino a
"Day 7: Fly out", più le sezioni di chiusura. **Zero H2 formulati come domanda, zero
tabella comparativa.** Chi cerca il nome dell'isola non trova, in nessun punto scansionabile
della pagina, la risposta a "dov'è", "come ci si arriva", "quanto costa immergersi",
"quando andare", "in quale baia dormire". Quelle risposte esistono, ma sono sciolte
dentro i paragrafi dei giorni, dove né Google né un motore generativo le estrae.

**È la densità di fatti.** 2.606 parole, **zero prezzi**, zero cifre di visibilità, zero
mesi di stagione nel corpo. Il set che sta davanti è fatto solo di blog e centri
immersione (Stingy Nomads, Underwater Asia, Iboih Dive Centre, Lumba Lumba, PADI,
Adventures Around Asia, Tripadvisor): tutti pubblicano listino per immersione, elenco
dei siti e temperatura dell'acqua. Su una query di nome-luogo in ambito diving, la
tabella dei siti è il formato che vince, e noi non ne abbiamo una.

**Nessun ostacolo istituzionale.** La SERP non contiene siti governativi, consolati o
grandi aggregatori. È interamente editoriale, quindi è vincibile sul contenuto.

## 3. Cosa è già stato applicato oggi (PARTE 1)

| campo             | valore vecchio                                                                                                                                     | valore nuovo                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `metaTitle`       | `7 Days in Pulau Weh: Aceh Diving and Beach Escape` (48)                                                                                             | `Pulau Weh Island, Aceh: Diving, Beaches and the Ferry` (53)                                                                                     |
| `metaDescription` | `A relaxed 7-day Pulau Weh and Banda Aceh trip for divers and couples: easy island days, Rubiah snorkeling, and honest logistics for Aceh's far north.` (148) | `Pulau Weh in Aceh: what the diving is really like, how the Banda Aceh ferry works, where to base yourself, and a 7-day plan that fits it all.` (141) |

Il campo `title` **non è stato toccato** e resta `7 Days in Pulau Weh: A Diving and Beach
Escape in Aceh`, perché su un articolo guida H1, headline JSON-LD, breadcrumb e ogni card
nei listing.

Per annullare la PARTE 1, una sola patch Sanity su
`itinerary-7-days-pulau-weh-sabang-diving-beach` che rimette i due valori vecchi.

## 4. Le sezioni H2 da aggiungere

Vanno inserite **prima** del blocco "Day 1", subito dopo "Trip at a glance". Sono le
risposte che il cluster chiede e che oggi la pagina non espone in modo estraibile. Ogni
prima frase è autoconclusiva in 40-60 parole.

### H2 nuovo 1: "Where is Pulau Weh, and how do you get there?"

> Pulau Weh is Indonesia's northwesternmost island, off the tip of Sumatra past Banda
> Aceh, where the Andaman Sea meets the Indian Ocean. You reach it by flying into Sultan
> Iskandar Muda airport, code BTJ, then taking the ferry from Ulee Lheue harbour to
> Balohan on the island. There is no other way in.

Secondo paragrafo: le due opzioni di traghetto (veloce e lento), quanto durano, quante
corse al giorno, e l'avvertenza che gli orari cambiano. Riusare le cifre già presenti nel
corpo dell'articolo, non inventarne di nuove. Questa sezione copre "banda aceh ferry to
pulau weh" (pos 70,0) e la parte "how do you get there" delle query di nome.

### H2 nuovo 2: "What is the diving like on Pulau Weh?"

> Pulau Weh has more than twenty dive sites within short boat rides of Iboih and Gapang,
> from the Canyon's boulders to an underwater volcanic vent. Water sits around 27 to 29
> degrees all year and visibility runs roughly 10 to 30 metres. Currents can be strong,
> so it reads as an intermediate destination rather than a beginner one.

Poi la **tabella comparativa** (vedi sezione 5). Copre "pulau weh diving" (pos 70,8),
"dive pulau weh", "weh island diving".

### H2 nuovo 3: "Iboih, Gapang or Sumur Tiga: where should you stay?"

> Iboih is the backpacker end, walking distance to the Rubiah snorkelling channel and
> the cheapest beds. Gapang is quieter and where most dive centres sit. Sumur Tiga on the
> east coast has the best sand and the fewest people, and the highest prices. All three
> are within twenty minutes of each other by scooter.

Copre "iboih beach weh island" e la parte "where to stay" implicita nelle query di nome.

### H2 nuovo 4: "When is the best time to visit Pulau Weh?"

> Diving runs all year on Pulau Weh because the sites stay open through the rainy season,
> but April to October is the dry window and gives the calmest crossings and the clearest
> water. December to February brings more surface swell than reef trouble. Note that
> water activities pause island-wide until 2pm every Friday.

La regola del venerdì è già nel corpo dell'articolo ma sepolta: qui diventa estraibile.

### H2 nuovo 5: "What does a week on Pulau Weh cost?"

> Diving is the main line and it is cheap by Indonesian standards, with fun dives
> published at around 23 US dollars including gear at island centres. Rooms in Iboih start
> at guesthouse level and Sumur Tiga runs several times that. Budget separately for the
> BTJ flight and the ferry, which are the fixed costs of getting there at all.

Va accompagnata dal cautelativo di casa ("come stima di lavoro, i prezzi cambiano") e
dall'attribuzione della fonte dove è identificabile. È la sezione che oggi manca del
tutto: **zero prezzi in 2.606 parole**, contro concorrenti che pubblicano un listino.

## 5. La tabella comparativa da aggiungere

Blocco `comparisonTable` sotto l'H2 nuovo 2. Le celle vanno riempite con i siti già
nominati nel corpo dell'articolo, verificando profondità e livello prima di pubblicare.
Non inventare siti che l'articolo non cita.

Colonne: `Dive site` · `Depth` · `What you see` · `Level`

Caption suggerita: "The sites most Pulau Weh centres run, as a working guide. Depths and
conditions vary with the day, so confirm with your dive centre before you book."

Una seconda tabella, opzionale, sulle due opzioni di traghetto (tipo, durata, frequenza,
per chi), sotto l'H2 nuovo 1.

## 6. I link interni da aggiungere

1. **Da `15-days-sumatra` verso questa pagina**: il link esiste già. Verificare solo che
   l'anchor text contenga "Pulau Weh" e non una formula generica.
2. **Da `/destinations/sumatra`** (hub, sorgente `src/data/destinations.ts`): oggi
   `highlights` e l'intro non nominano Pulau Weh. Aggiungere una sezione o almeno un
   riferimento nella intro, con link alla pagina. L'hub prende 16 impression a posizione
   24,6 su "explore sumatra", quindi ha un minimo di forza da passare.
3. **Dalla guida `best-time-to-visit-sumatra`**: aggiungere un rimando alla finestra
   aprile-ottobre di Pulau Weh e alla regola del venerdì, con link. Quella guida prende 63
   impression a posizione 21,6, la più forte delle guide Sumatra.
4. **Da `9-days-north-sumatra-with-kids` e `7-days-west-sumatra-bukittinggi-harau-valley`**:
   un rimando contestuale in stile "se vuoi chiudere sulla costa". Il secondo è la nostra
   pagina Sumatra più forte, 453 impression a posizione 10,4.
5. **Verso l'articolo nuovo di oggi**: nessuno. `7-days-bali-diving-tulamben-amed-menjangan`
   è su un'altra isola e un collegamento sarebbe forzato.

Attenzione operativa: i punti 1, 3 e 4 richiedono scrittura su Sanity, e gli item degli
array in questo dataset spesso non hanno `_key`. Rileggere il `body` intero, modificarlo
in memoria e riscriverlo tutto, mai una patch con selettore `[_key==...]`, poi ri-verificare
con una query.

## 7. La proposta sull'H1 (decide il founder)

Il `title` attuale è `7 Days in Pulau Weh: A Diving and Beach Escape in Aceh`. Apre con
la durata, mentre il cluster è quasi tutto nome-luogo. Proposta:

> **Pulau Weh: Diving, Beaches and a 7-Day Plan for Aceh's Far North**

Mantiene la durata ma la sposta dopo il nome dell'isola. **Non applicato di proposito**:
su un articolo il `title` guida H1, headline JSON-LD, breadcrumb e ogni card nei listing,
oltre undici punti nel codice, quindi non è un ritocco reversibile in dieci secondi.
Se il founder lo approva, va cambiato in una sola transazione insieme al resto.

## 8. Come si giudica

Metrica: **posizione media di `/trips/7-days-pulau-weh-sabang-diving-beach`**, oggi 33,2.

- Il **2026-09-14** la sola PARTE 1 avrà 28 giorni di vita. Ci si aspetta poco sulla
  posizione e qualcosa sul CTR, oggi 2,2%.
- Se la PARTE 4 viene approvata, la data di giudizio va spostata a 28 giorni dalla sua
  applicazione, e i due effetti restano mescolati. Registrare la data di applicazione qui
  sopra quando succede.

Soglia onesta: se dopo la PARTE 4 il cluster resta sopra posizione 40, il problema non è
il contenuto della pagina ma l'autorità del dominio su un tema dove i centri immersione
locali hanno anni di vantaggio, e la mossa giusta diventa smettere di rinforzare questa
pagina.
