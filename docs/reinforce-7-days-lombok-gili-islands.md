# Piano di rinforzo: /trips/7-days-lombok-gili-islands

> **STATO: APPLICATO INTEGRALMENTE il 2026-08-19,** lo stesso giorno in cui è stato
> scritto, su richiesta esplicita del founder.
>
> - **PARTE 1** (`metaTitle`, `metaDescription`): transazione `sZarkGCWKodXiPseaUUR9a`.
> - **Sezione 4 e 5** (le quattro H2 in forma di domanda e le due tabelle comparative):
>   transazione `uBwiUtn9Wx8WqRIUPfUNhE`, 15 blocchi inseriti prima di
>   "What to book early", da 89 a 104 blocchi.
> - **Sezione 6.1 e 6.2** (link in-content a `/transport/lombok-to-gili-islands` e a
>   `/trips/4-days-gili-islands-trawangan-meno-air`): stessa transazione. I due URL ora
>   compaiono due volte ciascuno, una in-content con ancora descrittiva e una nel footer
>   con l'ancora breve preesistente. È voluto: posizioni e ancore diverse.
>
> **Sezione 6.3 e 6.4: nessun intervento necessario, verificato.** La hub linkava già
> questa pagina in due punti di `src/data/destinations.ts` (righe 269 e 748) con l'ancora
> `7-day Lombok and Gili route`, che contiene già il numero di giorni come chiedeva il
> punto 6.2 del piano della hub. E `7-days-lombok-rinjani-trek` linkava già questa pagina.
> Il punto 6.4 era quindi basato su un presupposto sbagliato: il link esisteva di già.
>
> Questo piano chiude il **punto 5 rimasto aperto** in `docs/reinforce-lombok-gili.md`,
> che rimandava esplicitamente il ritocco di questa pagina a "un secondo run di verifica".
> Questo è quel run.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/7-days-lombok-gili-islands`
\_id Sanity: `cf1690ad-14cc-4b46-b08a-6c39d860e9ab` (contentStatus `live`)

Cluster GSC, 28 giorni (2026-07-20 → 2026-08-16), dimensioni page+query:
**25 query, 62 impression, 0 click, posizione media 63,6.**

Il cluster non è un blocco unico. Si divide in **tre intenti** con posizioni molto diverse,
ed è questa la cosa importante:

| Intento                     | Query | Impression | Posizione       |
| --------------------------- | ----- | ---------- | --------------- |
| Nome generico della coppia  | 15    | ~44        | 72 a 88         |
| Durata e itinerario         | 6     | ~13        | **13 a 44**     |
| Trasporto Lombok ↔ Gili     | 3     | ~5         | 42 a 50         |

Le query per intento:

| query                             | impr | pos      | intento    |
| --------------------------------- | ---- | -------- | ---------- |
| lombok and gili                   | 9    | 75,4     | generico   |
| lombok gili islands               | 6    | 82,7     | generico   |
| lombok and gili islands           | 5    | 86,0     | generico   |
| gili lombok                       | 4    | 74,3     | generico   |
| lombok and the gili islands indonesia | 4 | 74,3    | generico   |
| **lombok 7 day itinerary**        | 5    | **30,4** | durata     |
| **lombok and gili islands itinerary** | 3 | **13,3** | durata     |
| **lombok itinerary 7 days**       | 2    | **22,5** | durata     |
| one week in lombok                | 1    | 44,0     | durata     |
| gili island itinerary             | 1    | 58,0     | durata     |
| lombok 1 week itinerary           | 1    | 68,0     | durata     |
| gili islands to lombok            | 3    | 50,0     | trasporto  |
| kuta lombok to gili islands       | 1    | 42,0     | trasporto  |
| gili island to lombok             | 1    | 50,0     | trasporto  |

## 2. Perché non ranka

**a) Sul generico non deve rankare: ha già perso, ed è giusto così.** Su ogni query
col nome della coppia la hub `/destinations/lombok-gili` sta davanti, spesso di 40
posizioni. È la pagina che Google ha scelto per quell'intento, e il piano della hub
(2026-08-14) l'ha appena rinforzata. Inseguire quelle query da qui significa
cannibalizzare la nostra pagina migliore. **Vanno concesse.**

**b) Sulla durata sta a un passo e non ha una sezione che risponde.** Le sei query di
durata stanno fra posizione 13 e 44, cioè molto meglio della media della pagina. Ma
l'articolo, verificato oggi, ha **17 H2 e nessuno in forma di domanda**: sono tutte
etichette ("Who this trip is for", "Trip at a glance", "Why this route makes sense").
Non esiste un punto della pagina dove sia scritto, in modo estraibile, quanti giorni
servono e se una settimana basta. Google trova la risposta implicita in 2.300 parole di
narrazione ma non ha un blocco da citare.

**c) Zero tabelle comparative.** La pagina ha 0 blocchi `comparisonTable`. Le due
decisioni che ogni lettore di questo itinerario deve prendere, quale Gili scegliere e
come dividere la settimana, sono esattamente contenuto comparativo, cioè il formato più
citato dai motori generativi.

**d) Cinque impression di trasporto sono parcheggiate sulla pagina sbagliata.**
"gili islands to lombok", "gili island to lombok" e "kuta lombok to gili islands"
atterrano qui a posizione 42-50, ma abbiamo `/transport/lombok-to-gili-islands`, che è
la pagina giusta e più specifica. L'articolo la linka già, ma in fondo e senza una
sezione che risponda alla domanda.

**e) La pagina NON è sottile.** 2.300 parole, 6 FAQ, 8 link affiliati, link interni alla
hub e a due rotte di trasporto. Il problema è la forma, non la quantità. **Non allungarla.**

## 3. Il ritocco già applicato (PARTE 1, in produzione dal 2026-08-19)

Il `title` **non** è stato toccato: su un articolo guida H1, headline JSON-LD, breadcrumb
e ogni card nei listing. Resta `7 Days in Lombok and the Gili Islands: Kuta Lombok,
Senaru and Gili Trawangan`.

| campo             | valore vecchio                                                                                                                                       | valore nuovo                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `metaTitle`       | `Lombok & Gili Islands in 7 Days: Full Itinerary` (47)                                                                                                | `Lombok 7 Day Itinerary: Kuta, Senaru, Gili Trawangan` (52)                                                                                     |
| `metaDescription` | `A practical 7-day Lombok and Gili Islands itinerary: Kuta Lombok beaches, Senaru waterfalls and Gili Trawangan, with honest transfer and ferry advice.` (150) | `Seven days on Lombok and one Gili: Kuta's south beaches, the Senaru waterfalls and Gili Trawangan, with real ferry times and what to book first.` (144) |

**Logica:** il vecchio `metaTitle` apriva con "Lombok & Gili Islands", cioè la frase
generica su cui la hub vince e questa pagina sta a posizione 82. Il nuovo apre con
`Lombok 7 Day Itinerary`, che è la formulazione esatta della query meglio posizionata
del cluster (pos 30,4), e nomina le tre tappe invece della coppia. La hub tiene il
generico ("Lombok and the Gili Islands: Day-by-Day Itineraries"), l'articolo prende la
durata. Le due pagine smettono di dire la stessa cosa.

**Per annullare**, un solo patch su `cf1690ad-14cc-4b46-b08a-6c39d860e9ab` che rimette i
due valori della colonna sinistra.

## 4. Le sezioni H2 da aggiungere

Quattro sezioni, tutte in forma di domanda, ognuna con la prima risposta autoconclusiva
in 40-60 parole. Vanno inserite **prima** di "What to book early", non in fondo.

### H2 1. "How many days do you need in Lombok?"

> Five to seven days is the realistic range for Lombok, and seven is the version that
> also fits the Gili Islands. Lombok is big and the roads are slow, so a week buys you
> one region properly plus a few nights offshore. Under five days you are choosing
> between the south coast and the north, not doing both.

### H2 2. "Is one week enough for Lombok and the Gili Islands?"

> Yes, if you accept one Gili rather than three. Seven days covers the south coast
> beaches around Kuta, the drive north to the Senaru waterfalls and three or four nights
> on Gili Trawangan. What it does not cover is the Rinjani trek, which needs two to three
> days on its own and belongs in a different trip.

Questa risponde anche a "lombok 1 week itinerary" e "one week in lombok", oggi a 68 e 44.

### H2 3. "How do you get from Lombok to the Gili Islands?"

> The public boat from Bangsal harbour reaches the Gilis in 15 to 30 minutes for a few
> dollars, and it leaves when it fills rather than on a timetable. A private speedboat
> charter does it in 10 to 15 minutes from around $35 per boat. Buy public tickets only
> at the official Karya Bahari counter.

Cifre prese da `src/data/routes.ts`, che è la fonte già pubblicata: non reinventarle.
Questa sezione porta il link in-content a `/transport/lombok-to-gili-islands` e recupera
le 5 impression di trasporto oggi parcheggiate a posizione 42-50.

### H2 4. "Which Gili island should you choose?"

> Gili Trawangan is the biggest and the only one with a real evening, Gili Air is the
> compromise most couples end up preferring, and Gili Meno is the quiet one where there
> is deliberately nothing to do. All three are 15 to 30 minutes from Bangsal and hop
> between each other, so the choice is about where you sleep, not where you go.

## 5. Le due tabelle comparative

**Tabella 1, sotto l'H2 4.** Colonne: `Island` / `What it gives you` / `What it costs you`
/ `Who should pick it`. Righe: Gili Trawangan, Gili Air, Gili Meno. Caption che dichiara
che le tre isole sono a 15-30 minuti l'una dall'altra e che si può cambiare in giornata.

**Tabella 2, sotto l'H2 2.** Le tre divisioni realistiche di una settimana. Colonne:
`Split` / `What you get` / `What you give up` / `Best for`. Righe:

- **All Lombok, no Gilis** (7 notti a terra): sud, nord e Senaru senza fretta; rinuncia
  al reef; per chi guida e vuole vedere l'isola.
- **4 Lombok + 3 Gili** (la rotta di questo articolo): equilibrio; rinuncia a una delle
  due coste; per la maggioranza.
- **2 Lombok + 5 Gili**: settimana da spiaggia; rinuncia all'entroterra e alle cascate;
  per chi vuole snorkeling e basta.

## 6. Link interni da aggiungere

1. **Verso `/transport/lombok-to-gili-islands`**, in-content dentro l'H2 3, con ancora che
   contenga "Bangsal" o "public boat". Oggi il link esiste ma è in fondo alla pagina.
2. **Verso `/trips/4-days-gili-islands-trawangan-meno-air`**, dentro l'H2 4, per chi
   decide che vuole più Gili e meno Lombok. Il link esiste già ma senza contesto di scelta.
3. **Dalla hub `/destinations/lombok-gili` a questa pagina con l'ancora giusta.** Il punto
   6.2 del piano della hub è stato applicato il 2026-08-14 usando ancore con il numero di
   giorni. **Verificare che sia ancora così** prima di aggiungere altro: se c'è già, non
   toccare nulla.
4. **Da `/trips/7-days-lombok-rinjani-trek`**, un link in-content verso questa pagina nel
   punto in cui si dice che il trek non entra in una settimana normale. È la coppia
   naturale della risposta dell'H2 2.

## 7. Cosa NON fare

- **Non inseguire le query generiche.** Sono 44 impression e sembrano il premio grosso.
  Sono la trappola: appartengono alla hub, che le tiene a posizione 32 contro le 82 di
  questa pagina.
- **Non toccare il `title`.** Vale la stessa regola verificata il 2026-08-07.
- **Non allungare la pagina.** Ha già 2.300 parole. Le quattro sezioni proposte aggiungono
  forma, non volume: se una di esse ripete qualcosa che il day-by-day già dice, va tagliata
  la ripetizione altrove, non aggiunta due volte.

## 8. Cosa misuriamo, e quando

Il segnale della PARTE 1 è pulito solo sulle **query di durata**, perché sono le uniche in
cui questa pagina compete davvero.

**Metrica primaria:** posizione media di `lombok 7 day itinerary` (oggi **30,4**) e
`lombok itinerary 7 days` (oggi **22,5**). Attesa: entrambe sotto 20 entro fine settembre.
**Metrica secondaria:** primo click sulla pagina. Oggi sono 0 su 62 impression.
**Da ignorare:** la posizione media della pagina (63,6). È dominata dalle query generiche
che stiamo deliberatamente cedendo, quindi può peggiorare mentre la pagina migliora.

**Data di lettura: lunedì 2026-09-16**, cioè 28 giorni dopo l'applicazione.

⚠️ **Nota sull'entanglement.** La hub `/destinations/lombok-gili` ha ricevuto la sua
PARTE 1 il 2026-08-10 e la PARTE 4 il 2026-08-14. Questa pagina è stata toccata il
2026-08-19. I due effetti si sovrappongono nella stessa finestra e sullo stesso cluster.
È una scelta consapevole, perché l'intervento di oggi **riduce** la concorrenza interna
invece di aggiungerne, ma va tenuto presente leggendo i numeri: un miglioramento della
hub sul generico e un miglioramento di questa pagina sulla durata sono lo stesso
fenomeno visto da due lati, non due risultati indipendenti.
