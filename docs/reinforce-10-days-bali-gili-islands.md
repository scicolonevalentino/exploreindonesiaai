# Piano di rinforzo: /trips/10-days-bali-gili-islands

> **STATO: APPLICATO INTEGRALMENTE il 2026-09-05,** su delega esplicita del
> founder ("sistema tutto quello che devi sistemare senza chiedermi niente").
> `metaTitle` e `metaDescription` erano già in produzione dal 2026-09-04.
> Applicate oggi tutte e cinque le sezioni della 6, con le due tabelle
> comparative, e create le quattro voci Booking che alla pagina mancavano del
> tutto (`BOOKING_UBUD`, `BOOKING_CANGGU`, `BOOKING_GILI_TRAWANGAN`,
> `BOOKING_ULUWATU`): l'articolo passa da 100 a 118 blocchi e da 10 a 14
> affiliati. Il campo `title` NON è stato toccato, come indicato alla sezione 5.
>
> Della sezione 7, applicati il punto 3 (link da `7-days-bali-first-timers`) e
> il punto 1, che era il più importante: la hub `/destinations/lombok-gili` non
> linkava affatto questa pagina, e ora lo fa da una nuova sottosezione in
> `src/data/destinations.ts`, "Can you combine Bali and the Gili Islands in one
> trip?". Il punto 2 risultava **già presente** sulla hub `/destinations/bali`,
> e il punto 4 pure. Verificato in produzione: i cinque H2 nuovi, le due tabelle
> e i quattro CTA Booking renderizzano.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/10-days-bali-gili-islands`
\_id Sanity: `5f2db4e8-efa0-4b1b-9fe3-657193995076` (`live`, online dal 2026-06-02)

Cluster di query (GSC, 28 giorni: 2026-08-05 → 2026-09-01):

| query                          | impression | click |      posizione |
| ------------------------------ | ---------: | ----: | -------------: |
| bali and gili islands          |     **33** |     0 |       **57,3** |
| bali island hopping itinerary  |          3 |     0 |           76,0 |
| bali and gili islands itinerary|          1 |     0 |        **1,0** |
| gili islands itinerary         |          1 |     0 |            5,0 |
| bali with gili island          |          1 |     0 |           99,0 |
| indonesia 10 day itinerary     |          1 |     0 |           82,0 |

**Totale pagina sulla dimensione query+pagina: 43 impression, 0 click, posizione
media 54,0.** Sulla sola dimensione pagina la URL fa 345 impression, 3 click e
posizione 16,4: quindi la pagina nel complesso funziona, ed è questo cluster
specifico a stare fermo in fondo.

**La domanda sta crescendo in fretta.** Stessa query, finestra precedente
(2026-07-08 → 2026-08-04): `bali and gili islands` faceva **8 impression a
posizione 55,4**. In quattro settimane è passata a **33 a 57,3**: le impression
si sono quadruplicate e la posizione non si è mossa. È domanda nuova che ci
scorre addosso.

**Nessuna cannibalizzazione.** Verificato interrogando GSC su tutte le query che
contengono "gili": per `bali and gili islands` compare **una sola nostra URL**,
questa. `/trips/10-days-bali-lombok-gili-islands` prende una query diversa
(`bali lombok gili islands`, 10 impression, pos 48,6),
`/destinations/lombok-gili` prende il cluster Lombok, e
`/transport/bali-to-gili-islands` prende 3 impression in croce. Il campo è
libero, non c'è niente da disambiguare.

## 2. Perché non ranka

**La prova è dentro i dati e non serve interpretarla.** Alla query
`bali and gili islands itinerary` siamo a **posizione 1**. Alla query
`bali and gili islands`, senza quella parola, siamo a **57,3**. Google sa
benissimo cosa è questa pagina: un itinerario. Il problema è che la query
dominante del cluster, quella da 33 impression, non chiede un itinerario. Chiede
un orientamento: cosa sono le Gili rispetto a Bali, come ci si arriva, quale
delle tre, vale la pena aggiungerle.

Controllo reale della SERP (settembre 2026), primi risultati per
`bali and gili islands`:

- thebackpackinghousewife.com, "Island Hopping: Bali to The Gili Islands"
- finnsbeachclub.com, "Island Hopping Bali: An Introduction To The Gili Islands, The Nusa Islands and Beyond"
- finnsbeachclub.com, "Bali Or Gili Islands: One Island Or Three Tiny Ones?"
- alexa-west.com, "30 Days in Bali & Gili Islands: Where to Stay"
- lethergoit.com, "Bali, Gili Islands and Lombok: complete 2-week itinerary"
- thebalitripmate.com, pacchetto tour "7 Days Bali and Gili Islands"

Nessun risultato governativo, nessun aggregatore istituzionale: sono blog di
viaggio e un operatore. **È una SERP vincibile**, al contrario di `/visa-guide`,
che per questo motivo è stato scartato il 2026-08-07.

Notare cosa aprono quei risultati: *dove sono*, *come ci si arriva*, *quale
isola*, *dove dormire*. Nessuno apre con il giorno 1.

**Cause secondarie, in ordine di peso:**

1. **Le quattro risposte che la SERP chiede esistono già sulla pagina, ma solo
   come FAQ in fondo.** Le FAQ attuali sono, testualmente: "How do I get from
   Bali to the Gili Islands, and how much is the fast boat?", "Is 10 days enough
   for Bali and the Gili Islands?", "Which Gili island should I choose?", "When
   is the best time to visit Bali and the Gilis?". Sono esattamente i quattro
   sotto-intenti della SERP, sepolti sotto duemila parole di day-by-day e in un
   formato che Google usa come snippet, non come segnale di pertinenza della
   pagina.
2. **Zero tabelle comparative.** La pagina ha 100 blocchi e nessun
   `comparisonTable`. Il confronto Trawangan / Meno / Air è il formato più
   estratto dagli AI su questo tema, e non ce l'abbiamo in nessuna forma.
3. **Il `metaTitle` spezzava la frase esatta.** Corretto oggi, vedi sezione 3.
4. **Link interni deboli.** Solo **4** pagine linkano l'articolo nel corpo
   (`7-days-lombok-gili-islands`, `4-days-gili-islands-trawangan-meno-air`,
   `5-days-nusa-penida-lembongan`, `7-days-bali-with-kids`), tutte deboli.
   **Non lo linka `/destinations/lombok-gili`**, che a 222 impression e
   posizione 28,0 è la nostra pagina Gili più forte, e non lo linka
   `/destinations/bali`.

**Non è un problema di thinness.** 100 blocchi, day-by-day completo, 6 FAQ, 10
link affiliati.

**Caveat onesto:** la pagina è online dal 2 giugno 2026, quindi ha tre mesi. Una
parte della posizione 57 è età e autorità, e nessuna riscrittura la porta in
prima pagina in due settimane contro finnsbeachclub. L'obiettivo realistico è
passare dalla pagina 6 alla pagina 2-3, come è successo su
`9-days-lombok-gili-honeymoon` (da 60,0 a 37,0 in 28 giorni con lo stesso tipo
di intervento).

## 3. Il `metaTitle` (GIÀ APPLICATO il 2026-09-04)

**Valore vecchio, testo esatto:**

```
Bali & the Gili Islands in 10 Days: Itinerary
```

**Valore nuovo applicato (57 caratteri):**

```
Bali and the Gili Islands: How to Combine Them in 10 Days
```

Tre cambiamenti. La `&` diventa `and`, perché spezzava il match sulla frase
cercata: è lo stesso difetto diagnosticato e corretto su
`9-days-lombok-gili-honeymoon` il 2026-08-07, dove la posizione è poi passata da
60,0 a 37,0. La frase esatta della query passa in testa. E il token dominante
smette di essere "Itinerary", che restringe l'intento a quello in cui siamo già
primi e per cui nessuno cerca.

**Per annullare:** patch di `metaTitle` sul documento
`5f2db4e8-efa0-4b1b-9fe3-657193995076` con il valore vecchio qui sopra.

## 4. La `metaDescription` (GIÀ APPLICATA il 2026-09-04)

**Valore vecchio, testo esatto:**

```
10 days across Bali and Gili Trawangan: Ubud, Canggu, the island, then Uluwatu. Guesthouses from $30 a night, pool villas $100–120, one fast boat each way.
```

**Valore nuovo applicato (138 caratteri):**

```
Bali and the Gili Islands work as one trip if you get the boat right. Ubud, Canggu, Gili Trawangan, then Uluwatu, with honest transfer days.
```

La vecchia apriva con "10 days across", che è di nuovo l'intento in cui siamo
già primi. La nuova apre con la frase cercata e mette davanti la barca, che è la
prima cosa che chiede chi sta valutando se le due si combinano.

**Per annullare:** patch di `metaDescription` con il valore vecchio qui sopra.

## 5. L'H1 (campo `title`) — NON serve toccarlo

Titolo attuale:

```
10 Days in Bali and the Gili Islands: Ubud, Canggu, Gili Trawangan and Uluwatu
```

**Contiene già la frase esatta `Bali and the Gili Islands`, senza `&`.** Non c'è
niente da correggere e non vale il rischio: su un articolo il campo `title`
guida H1, headline JSON-LD, breadcrumb e ogni card nei listing, oltre undici
punti nel codice (verificato il 2026-08-07). Lasciarlo com'è.

## 6. Le sezioni H2 da aggiungere

Cinque sezioni, tutte prima del day-by-day, tutte con una prima risposta
autoconclusiva in 40-60 parole. Sono i quattro sotto-intenti della SERP più il
confronto, e ognuna promuove una FAQ già scritta da nota a piè di pagina a
sezione di pagina.

### 6.1 Nuovo H2: `How do you get from Bali to the Gili Islands?`

Va inserito subito dopo "Trip at a glance". È la prima domanda della SERP e oggi
la risposta è dentro il Giorno 6.

Prime 40-60 parole, autoconclusive:

> By fast boat, from one of three Bali ports. Serangan and Sanur are the usual
> departures for Gili Trawangan and take around two to two and a half hours;
> Padang Bai is closer to the Gilis and shortens the crossing but adds a longer
> drive from south Bali. Book the crossing, not the day.

Poi: prezzi indicativi già presenti nell'articolo, la regola del mare mosso, il
link a `/transport/bali-to-gili-islands` e i due link affiliati 12Go già in
pagina (`12GO_BALI_GILI_TRAWANGAN`, `12GO_GILI_TRAWANGAN_BALI`).

### 6.2 Nuovo H2: `Which Gili island should you stay on?` + tabella

Il pezzo che manca di più. È il formato comparativo, quello più citato dagli AI,
e non esiste in nessuna forma sulla pagina.

Prime 40-60 parole:

> Gili Trawangan if you want bars, dive shops and somewhere to eat after nine.
> Gili Air if you want a middle ground with beaches on two sides and a quieter
> evening. Gili Meno if the point is doing nothing. On a ten-day trip with one
> island stop, Trawangan is the safe pick.

Poi un `comparisonTable`:

| Isola          | Va bene se                                       | Il compromesso                              |
| -------------- | ------------------------------------------------ | ------------------------------------------- |
| Gili Trawangan | Vuoi vita serale, diving e scelta di ristoranti   | La più costruita e la più rumorosa          |
| Gili Air       | Vuoi la via di mezzo, spiagge e sere tranquille   | Meno immersioni organizzate, meno scelta    |
| Gili Meno      | Vuoi che non succeda niente                       | Poche camere, quasi nessuna cena fuori      |

### 6.3 Nuovo H2: `How many days do you need for Bali and the Gili Islands?`

Prime 40-60 parole:

> Ten days is the first honest number, because the crossing costs you the best
> part of two days out of the total. Seven days works only if you accept two
> nights on the Gilis. Under seven, skip the Gilis and stay in Bali; over
> fourteen, add Lombok rather than a second Gili.

Poi un `comparisonTable` sulle durate, con link interni a
`/trips/5-days-bali-ubud-canggu-uluwatu`, `/trips/7-days-bali-first-timers`,
questa pagina e `/trips/10-days-bali-lombok-gili-islands`.

### 6.4 Nuovo H2: `Is it worth adding the Gili Islands to a Bali trip?`

È il sotto-intento "Bali or Gili" che occupa due dei primi sei risultati della
SERP, e che non tocchiamo affatto.

Prime 40-60 parole:

> Only if you have ten days or more. The Gilis give you something Bali does not,
> an island with no cars and no traffic, but they cost two travel days and a
> boat that gets cancelled in bad weather. On a one-week Bali trip the Nusa
> islands do the same job for half the transit.

Chiudere con il link a `/destinations/bali-nearby-islands`, che è l'alternativa
onesta e la nostra pagina con più impression non monetizzate.

### 6.5 Nuovo H2: `Where should you stay on a Bali and Gili trip?`

Prime 40-60 parole:

> Three bases, not one. Ubud for the first three nights, Canggu or Seminyak for
> the beach half, Gili Trawangan for the island stop, then Uluwatu for the
> last two nights so the airport run is short. Moving four times in ten days
> sounds like a lot and is the reason the route works.

Poi i link Booking già in tassonomia sul sito (`BOOKING_UBUD`, `BOOKING_CANGGU`,
`BOOKING_GILI_TRAWANGAN`, `BOOKING_ULUWATU`), da creare come voci
`affiliateLinks` nuove: **oggi la pagina non ha nemmeno un link Booking**, ha
solo Klook, Viator, 12Go e Airalo. È il buco di monetizzazione più grosso della
pagina.

## 7. I link interni da aggiungere

Oggi sono 4, tutti da pagine deboli. Da aggiungere, in ordine di valore:

1. **Da `/destinations/lombok-gili`** (222 impression, pos 28,0, la nostra
   pagina Gili più forte): link contestuale nel corpo, anchor
   `combine Bali and the Gili Islands in ten days`. È l'aggiunta singola con più
   valore di tutta questa lista.
2. **Da `/destinations/bali`**: link contestuale nella sezione sulle isole
   vicine, anchor `a ten-day Bali and Gili Islands route`.
3. **Da `/trips/7-days-bali-first-timers`** (106 impression, pos 12,0): anchor
   `if you have ten days, add the Gili Islands`.
4. **Da `/trips/4-days-gili-islands-trawangan-meno-air`**: c'è già, ma l'anchor
   va reso esplicito sulla frase `Bali and the Gili Islands`.
5. **Da `/transport/bali-to-gili-islands`** verso questa pagina, e viceversa
   dalla nuova sezione 6.1.

Quando si aggiungono, ricordare la trappola nota: gli item degli array in questo
dataset spesso non hanno `_key`, quindi **rileggere e riscrivere l'array `body`
intero** invece di usare un selettore `[_key==...]`, e ri-verificare con una
query dopo la mutation.

## 8. Cosa aspettarsi, e quando leggerlo

Il ritocco della PARTE 1 da solo dovrebbe muovere `bali and gili islands` dalla
pagina 6 verso la 4-5, cioè da 57 a qualcosa tra 35 e 45, sulla base di quello
che è successo su `9-days-lombok-gili-honeymoon` con la stessa correzione della
`&` (60,0 → 37,0 in 28 giorni). Le sezioni della 6.1-6.5, se approvate, sono
quelle che possono portarla in pagina 2-3, e i link interni della 7 sono la
leva più lenta e più duratura.

**Metrica da leggere il lunedì 2026-10-06** (28 giorni pieni più il lag GSC di
tre giorni): posizione media della query `bali and gili islands` su
`/trips/10-days-bali-gili-islands`. Baseline da battere: **57,3 con 33
impression e 0 click**. Se le impression continuano a crescere e la posizione
resta sopra 50, il problema non è on-page ed è il caso di fermarsi, come è stato
fatto sul cluster `islands near bali` il 2026-08-29.
