# Piano di rinforzo: /indonesia-travel-costs

> **STATO: CHIUSO IL 2026-09-15. Verificato contro la pagina, non applicato come scritto.**
>
> La PARTE 1 (`metaTitle` e `metaDescription`, commit `532a8a5`) era già in
> produzione. Il residuo è stato riletto riga per riga contro
> `src/routes/indonesia-travel-costs.tsx` e **risulta per la quasi totalità già
> implementato**. Il piano è stato scritto su una lettura non aggiornata della
> pagina: le sue premesse fattuali sono in buona parte false. Esito per sezione:
>
> | Sezione | Esito | Motivo |
> |---|---|---|
> | §4 — H2 "Is Indonesia cheap?" + tabella paesi | **NON applicata, già esistente** | La sezione `#cheap-or-expensive` esiste dal 31/08 con l'apertura autoconclusiva, il dato Numbeo **nel corpo** (non solo in FAQ, come afferma il piano) e una tabella a **5 paesi** — Indonesia 26,1, Vietnam 26,4, Filippine 30,1, Malesia 34,0, Thailandia 38,0 — cioè più completa di quella proposta, Filippine incluse. Aggiungerla avrebbe duplicato la sezione e violato il §8 del piano stesso. |
> | §5 — H2 "What makes Indonesia expensive when it goes wrong?" | **NON applicata, per scelta** | Il contenuto esiste in due punti: `#cheap-or-expensive` copre l'inquadramento "expensive", e `#transport` apre con "Inter-island flights are the single biggest cost in Indonesia, at $40 to $70 per hop" sotto un H2 a domanda. Una terza sezione sullo stesso terreno diluisce e basta. La query bersaglio (`is indonesia expensive`, 73 impr) sta **già a posizione 4,5**: il problema non è il ranking ed è documentato in `costs-page-ctr-structurally-flat`. |
> | §6 — H2 "How much is a trip for two weeks?" | **NON applicata, già esistente** | `#whole-trip`, aggiunta il 07/09, ha l'H2 a domanda e **la prosa prima della tabella** con esattamente le cifre proposte ($420-700 / $980-1.400 / $2.100-3.500, +$40-70 a volo). |
> | §7.1 — link a `/transport` | **NON applicata, già esistente** | Linkato a riga 659. Il piano afferma che `/transport` prende 1 impression in 28 giorni: ne prende **72**, a posizione 58,0. |
> | §7.2 — link agli itinerari da 14 giorni | **NON applicata, già esistente** | Ogni riga della tabella per durata linka già il suo itinerario. |
> | §7.3 — link a `/destinations/sumatra` e `/destinations/wild-indonesia` | **APPLICATA** | Era l'unico punto davvero aperto. Vedi sotto. |
> | §7.4 — link in entrata da `/visa-guide` | **NON applicata, già esistente** | `/visa-guide` linka questa pagina a riga 311 e a riga 771. |
>
> **Applicato il 2026-09-15**, oltre al §7.3: la tabella regionale ometteva
> **Sumatra** del tutto, che su una tabella comparativa è il buco peggiore visto
> che è il formato più citato. Aggiunta una riga Sumatra a "$", motivata dalle
> nostre stesse pagine ("a cheap week by Indonesian standards", "sit at the low
> end" della fascia $70-100). **Sulawesi resta fuori**: non ha hub e non ho una
> caratterizzazione di costo verificabile da cui darle un rating.
>
> **Lezione, la seconda in due giorni.** Il 14/09 anche la raccomandazione su
> `/destinations/lombok-gili` è stata ritirata per lo stesso motivo: proposta
> contro una pagina che aveva già la sezione e il link. Prima di scrivere un
> piano di rinforzo, leggere la pagina viva e i commenti inline, non i dati GSC
> da soli.

Generato dal task schedulato del 2026-09-14, su dati GSC 2026-08-15 → 2026-09-11.

---

## 1. La pagina e il cluster

`/indonesia-travel-costs` è, con distacco, la pagina più vista del sito.

| | valore |
|---|---|
| Impression (28 giorni) | **22.641** |
| Click | **44** |
| CTR | **0,19%** |
| Posizione media | **6,4** |

Per confronto: tutto il resto del sito messo insieme fa circa 14.500 impression.
Questa singola pagina vale il 61% della visibilità totale.

Il cluster di query che la alimenta è quasi interamente in forma **sì/no**:

```
is indonesia cheap                         95 impr   pos 7,9    0 click
is indonesia expensive                     73        pos 4,5    1,37%
is indonesia expensive to visit            57        pos 7,9    0
is indonesia cheap to visit                38        pos 8,8    0
how much does it cost to go to indonesia   28        pos 8,6    0
how cheap is indonesia to travel           21        pos 6,1    0
indonesia expensive                        17        pos 7,2    0
indonesia prices                           17        pos 6,3    0
is indonesia cheap to travel               16        pos 6,4    0
how expensive is indonesia to travel       15        pos 6,9    0
how much is a trip to indonesia            15        pos 6,3    0
indonesia cheap or expensive               11        pos 7,7    0
```

## 2. Perché non converte

Non è un problema di posizionamento: sta in prima pagina su tutto il cluster.
È un problema di **snippet e di formato**, e ha tre cause distinte.

**a) Il title non conteneva la domanda.** Era `Indonesia Travel Costs 2026: Daily
Budget Breakdown`. Nessuna delle dodici query qui sopra usa la parola "breakdown"
né "travel costs" in quella forma. **Risolto dalla PARTE 1.**

**b) La meta description rispondeva per intero.** Dava le tre fasce di prezzo al
giorno, cioè esattamente la risposta cercata. Chi voleva solo il numero era
servito senza cliccare. **Risolto dalla PARTE 1.**

**c) La pagina non ha una sezione che risponda alla domanda sì/no.** Questa parte
resta aperta ed è l'oggetto di questo piano. La pagina ha un H1 "Indonesia Travel
Costs 2026", tabelle giornaliere, una tabella per durata (aggiunta il 2026-09-07)
e un blocco sui visti. Non ha, da nessuna parte, un H2 che dica *"Is Indonesia
cheap?"* e risponda "sì, e ecco il confronto". Il dato Numbeo (26,1 contro 38,0
della Thailandia) esiste **solo dentro una FAQ**, cioè nel punto più in basso e
meno estraibile della pagina.

**d) Cannibalizzazione: nessuna.** Controllato. Su questo cluster compare solo
questa URL. Non c'è nulla da consolidare.

**e) Chi sta davanti.** SERP verificata: novo-monde, southeastasiabackpacker,
neverendingfootsteps, budgetyourtrip, thetraveler.org. Sono tutti blog
editoriali, nessun sito istituzionale, nessun aggregatore. Il cluster **è
vincibile**, che è il motivo per cui questa pagina è stata scelta al posto di
`/visa-guide` (scartata il 2026-08-07 perché la sua SERP è imigrasi.go.id).

## 3. Valori vecchi, per annullare

Già applicati dalla PARTE 1. Per tornare indietro basta revertire `532a8a5`.

```
TITLE (vecchio)
"Indonesia Travel Costs 2026: Daily Budget Breakdown"

DESCRIPTION (vecchia)
"Indonesia costs $30 to $50 a day on a budget, $70 to $100 mid-range, $150 to
$250 in comfort. Full 2026 breakdown of rooms, food, transport and flights."

TITLE (nuovo, 53 caratteri)
"Is Indonesia Cheap? 2026 Daily Budgets and Trip Costs"

DESCRIPTION (nuova, 150 caratteri)
"Yes, at $30 to $50 a day, until you add island flights. The 2026 numbers for
rooms, food and transport, and how Indonesia really compares to Thailand."
```

L'H1 **non** è stato toccato e non va toccato: `/indonesia-travel-costs` non è un
hub `/destinations/`, quindi non ha il campo `h1` isolato, e cambiarlo qui
significherebbe toccare anche il JSON-LD e il breadcrumb.

---

## 4. Sezione H2 da aggiungere, numero 1 (la più importante)

Va messa **subito sotto l'intro, prima della prima tabella giornaliera**. È il
blocco che gli AI estraggono e quello che Google può promuovere a featured
snippet, e oggi semplicemente non esiste.

### Formulazione esatta dell'H2

> **Is Indonesia cheap? Yes, with one expensive exception**

### Prime 48 parole, risposta autoconclusiva

> Yes. Indonesia is the cheapest country in Southeast Asia to travel day to day,
> scoring 26.1 on Numbeo's mid-2026 cost of living index against Vietnam's 26.4
> and Thailand's 38.0. Rooms and food run a third below Thai prices. The
> exception is moving between islands, where each domestic flight adds $40 to
> $70.

### Poi, subito sotto, la tabella comparativa

Il formato comparativo è quello più citato in assoluto dagli AI e questa pagina
non ne ha uno sul confronto fra paesi. Usare il componente `comparisonTable` già
in uso negli articoli.

Caption: *"Numbeo mid-2026 cost of living index, lower is cheaper. Daily costs
are our own working ranges and exclude international flights."*

| | Indonesia | Vietnam | Thailand | Filippine |
|---|---|---|---|---|
| Indice costo della vita (Numbeo, metà 2026) | 26,1 | 26,4 | 38,0 | *da verificare prima di pubblicare* |
| Budget al giorno, backpacker | $30 a $50 | | | |
| Budget al giorno, mid-range | $70 a $100 | | | |
| Il costo che sorprende | Voli fra isole, $40 a $70 l'uno | | | |

⚠️ **Non pubblicare la colonna Filippine senza il dato Numbeo verificato.** Se al
momento dell'esecuzione il dato non è reperibile, fare la tabella a tre colonne.
Indonesia, Vietnam e Thailandia sono già verificati e citati nella FAQ esistente.

## 5. Sezione H2 da aggiungere, numero 2

Va messa **dopo** la tabella per durata (quella aggiunta il 2026-09-07).

### Formulazione esatta dell'H2

> **What makes Indonesia expensive when it goes wrong?**

### Prime 52 parole, risposta autoconclusiva

> Island flights. A two week trip that stays on one island costs $980 to $1,400
> mid-range. The same two weeks split across Bali, Komodo and Java adds four
> domestic flights, $160 to $280, plus airport transfers and a lost half day
> each time. Route planning moves the budget more than daily spending does.

Motivo: risponde a "indonesia expensive" (73 impression, posizione 4,5, che è la
query con il CTR meno disastroso del gruppo, 1,37%) con la sua formulazione, e
rilancia sugli itinerari, cioè verso le pagine che monetizzano.

## 6. Sezione H2 da aggiungere, numero 3

### Formulazione esatta dell'H2

> **How much is a trip to Indonesia for two weeks?**

### Prime 45 parole, risposta autoconclusiva

> Two weeks in Indonesia costs $420 to $700 on a budget, $980 to $1,400
> mid-range, or $2,100 to $3,500 in comfort, excluding international flights.
> Add $40 to $70 for each domestic flight between islands. Two weeks on one
> island sits at the bottom of each range.

I numeri esistono già nella tabella per durata: qui servono **in prosa**, prima
della tabella, perché è la prosa che gli AI estraggono e la tabella che Google
mostra. Query servite: "how much is a trip to indonesia" (15 impr, pos 6,3),
"cost of trip to indonesia" (11 impr, pos 16,5), "indonesia vacation cost" (12
impr, pos 17,2).

## 7. Link interni da aggiungere

La pagina prende 22.641 impression e ne passa pochissime al resto del sito. È il
singolo nodo di link equity più forte che abbiamo e va usato.

1. **Dalla sezione 5 (voli interni) verso `/transport`.** Ancora consigliata:
   "what each hop between islands actually costs". Oggi la pagina non linka
   `/transport` da nessuna parte, e `/transport` prende 1 impression in 28
   giorni.
2. **Dalla sezione 6 (due settimane) verso `/trips/14-days-indonesia-bali-java-komodo`**
   (544 impr, pos 7,7) e **`/trips/14-days-bali-komodo-sumba`**. Sono le due
   pagine da 14 giorni e la sezione parla esattamente di quello.
3. **Dalla sezione 4 (confronto paesi) verso `/destinations/sumatra` e
   `/destinations/wild-indonesia`**, con l'ancora sul fatto che fuori da Bali i
   prezzi scendono ancora. Sono i due hub più economici e i meno visti.
4. **Un link in entrata verso questa pagina da `/visa-guide`**, che è la seconda
   pagina del sito per impression (3.590) e oggi non la linka nel corpo.

## 8. Cosa NON fare

- **Non toccare l'H1.** Vedi sezione 3.
- **Non aggiungere altre tabelle giornaliere.** La pagina ne ha già due e una
  terza diluisce.
- **Non ripetere "is Indonesia cheap" più di una volta nel corpo.** Compare già
  nell'H2 della sezione 4 e nel title. Il keyword stuffing abbassa le citazioni
  negli AI answer, non le alza.
- **Non toccare le cifre giornaliere senza rifare anche la tabella per durata**,
  che è costruita moltiplicandole. Se divergono, la pagina si contraddice da sola.

## 9. Su cosa si misura

Lunedì **2026-10-12**, su `/indonesia-travel-costs`, in questo ordine:

1. **CTR.** È la metrica di questa run. Da 0,19% a qualcosa fra 0,8% e 1,5% è il
   risultato atteso dalla sola PARTE 1. Sotto 0,5% il title nuovo non ha
   funzionato e va revertito, non ritoccato di nuovo.
2. **Posizione media.** Deve restare intorno a 6,4. Se sale sopra 9 il title
   nuovo ha perso rilevanza e va revertito subito.
3. **Impression.** Se crollano è un segnale di rilevanza persa, non di stagione.
