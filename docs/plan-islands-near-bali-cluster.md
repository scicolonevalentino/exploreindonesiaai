# Piano ad hoc: il cluster "islands near bali"

> **STATO: APPLICATO il 2026-08-14**, commit `6ec4782`. Le nove sottosezioni per
> isola, i tre nuovi H2 e le due tabelle aggiuntive sono in produzione; la pagina
> passa da 1.2k a 2.5k parole. Title, meta e H1 restano volutamente quelli del
> 7 agosto, servono i 28 giorni pieni per leggerli.
>
> Aggiunto il 2026-08-14 fuori piano: link contestuale in entrata da
> `/indonesia-travel-costs`, la pagina con più impression del sito, con anchor
> "islands near Bali". Il piano trattava solo il contenuto della pagina, ma la
> posizione si era mossa da 46,9 a 44,8 dopo la riscrittura del 7 agosto: segnale
> che il contenuto non era il collo di bottiglia.

## 1. Il cluster e i numeri

Finestra GSC 2026-07-15 → 2026-08-11.

**43 query, 567 impression, 0 click.** È la più grande concentrazione di
impression non monetizzate del sito, quasi tutta su una singola URL,
`/destinations/bali-nearby-islands`.

| Query                                | Impr |      Pos |
| ------------------------------------ | ---: | -------: |
| islands near bali                    |   86 |     35,5 |
| islands around bali                  |   64 |     38,5 |
| islands close to bali                |   64 |     58,0 |
| islands off bali                     |   62 |     57,4 |
| island near bali                     |   46 |     65,3 |
| islands in bali                      |   35 |     40,2 |
| islands of bali                      |   33 |     42,1 |
| **nusa islands bali**                |   31 | **23,9** |
| best island in bali for honeymoon    |   24 |     53,6 |
| day trips from bali to other islands |   18 |     34,4 |
| _(altre 33 query)_                   |  104 |    22-86 |

Due cose da notare subito. La prima: `nusa islands bali` a **23,9** è di gran
lunga la nostra posizione migliore del cluster, ed è anche la query più
specifica. La seconda: le varianti geografiche generiche (`close to`, `off`,
`island near`) stanno tra 57 e 65, cioè pagina sei. Non è un problema di
sfumature di formulazione, è che Google non considera la pagina un candidato
serio per il termine generico.

## 2. Cos'è già stato fatto, e perché non basta ancora

Il 7 agosto è stato applicato per intero `docs/reinforce-bali-nearby-islands.md`:
title `Islands Near Bali: Which to Visit and How to Get There`, H1 `Islands Near
Bali`, cinque sezioni H2 in forma di domanda e una tabella comparativa a nove
isole.

Risultato nei quattro giorni successivi: **43,0 → 40,6**, impression 89 → 97.
Movimento nella direzione giusta, troppo piccolo per contare.

**Correzione a una mia affermazione precedente.** Avevo detto a voce che metà
della pagina era chrome di navigazione e che il contenuto era diluito. Ho
misurato: il blocco di risposta va da 1.247 parole su 1.321 totali. La
navigazione non c'entra niente e l'ordine delle sezioni è già corretto, le
risposte stanno sopra e le liste sotto. La diagnosi qui sotto è quella buona.

## 3. Perché non ranka

**Non è l'intento.** La SERP di `islands near bali` è composta interamente da
listicle numerate: "10 Beautiful Islands Near Bali", "10 Most Beautiful Islands
Near Bali (+Photos)", "7 Gorgeous Islands", "16 Best Indonesian Islands", "Top
Islands Near Bali", "10 Awesome Islands Near Bali". La nostra pagina, dopo il 7
agosto, è già una listicle comparativa a nove isole. La forma è giusta.

**È il peso.** Quei concorrenti girano tra le 2.500 e le 4.000 parole, con una
sezione vera per isola, foto proprie e anni di anzianità. Noi rispondiamo con
1.247 parole e una riga di tabella per isola. Su una query informativa generica
e affollata, con un dominio giovane, quella è la differenza tra pagina 4 e
pagina 1.

**Ed è il tempo.** L'intervento ha sette giorni. Sette giorni non sono un
verdetto, e la pagina si è mossa nella direzione giusta.

## 4. La decisione: approfondire, non biforcare

Ho valutato l'alternativa di costruire una guida dedicata a
`/destinations/bali-nearby-islands/islands-near-bali`, sfruttando il doc type
`guide` che già esiste (ne abbiamo quattro sotto questo hub, incluso un
`comparison`).

**La scarto, per adesso.** Le cinque sezioni H2 che vincerebbero su quella guida
sono esattamente le cinque che abbiamo appena messo sull'hub. Costruirla
significherebbe mettere due nostre URL sulla stessa query, che è precisamente la
cannibalizzazione che il report GSC ci segnala già altrove (hub lombok-gili
contro l'articolo da 7 giorni, con entrambe che affondano). E significherebbe
cambiare strategia dopo sette giorni, ripartendo da zero su una URL nuova mentre
quella vecchia si stava muovendo.

Quindi: **stessa URL, tre volte il contenuto.**

## 5. Cosa fare, in concreto

### 5.1 Non toccare title, meta e H1

Sono stati cambiati il 7 agosto. Vanno lasciati fermi fino al **4 settembre**,
altrimenti non sapremo mai cosa ha funzionato. Questa è la parte del piano che
costa zero e che è più facile violare per impazienza.

### 5.2 Da una riga di tabella a una sezione per isola

È il grosso del lavoro. Ogni isola passa da una cella a un `h3` con 120-180
parole, nella voce di casa: cosa ci vai a fare, quanto ci metti ad arrivarci,
quanto ci resti, e per chi non è. Ordine per distanza, che è anche l'ordine in
cui la gente decide.

Nusa Penida, Nusa Lembongan, Nusa Ceningan, Gili Trawangan, Gili Air, Gili Meno,
Lombok, Komodo via Labuan Bajo, Java. Nove sezioni, circa 1.400 parole nuove.

Ogni `h3` chiude con un link all'itinerario nostro che copre quell'isola, che è
anche il modo in cui questa pagina inizia a generare click interni invece di
solo impression.

### 5.3 Tre sezioni nuove, con la risposta autoconclusiva in apertura

Le formulazioni degli H2 vengono dalle query reali, non inventate.

**`How far is each island from Bali?`** (copre `islands close to bali` 64 impr,
`islands off bali` 62 impr, entrambe a pos 57-58, le due peggiori del cluster)

> The closest islands to Bali are the three Nusas, about 30 to 45 minutes by
> fast boat from Sanur. The Gilis and Lombok sit one and a half to three and a
> half hours east by boat, or 45 minutes by plane to Lombok. Komodo and Java
> need a flight of roughly an hour and a quarter.

Seguita da una **tabella nuova**: isola, porto o aeroporto di partenza, mezzo,
durata, frequenza indicativa. I numeri esistono già sulle nostre pagine
`/transport/*`, non vanno inventati, vanno solo tenuti allineati.

**`Which island near Bali is best for a honeymoon?`** (24 impr, pos 53,6)

La sezione esiste già ma è corta. Portarla a 250 parole e darle una **tabella**
a tre righe: Nusa Lembongan, Gili Meno, Lombok sud, con colonne "perché
funziona", "il compromesso", "quanto costa in più". E linkare i due itinerari
honeymoon che ora sono live, il Nusa da 6 giorni e il Lombok-Gili da 9.

**`Can you island hop between them?`** (copre `island to island bali`,
`bali island hopping itinerary`, `islands from bali`)

> Yes, but only along two corridors. Sanur to the Nusa islands is one, and Bali
> to the Gilis and Lombok is the other. Crossing directly between the Nusas and
> the Gilis is possible on some days and unreliable on others, so most trips go
> back through Bali rather than risk it.

Questa è una domanda a cui i listicle concorrenti non rispondono mai, perché non
sanno la logistica. È il nostro vantaggio strutturale.

### 5.4 Cinque link interni in entrata, con l'ancora giusta

L'hub è linkato dalla navigazione, che non conta. Serve un link in-content dai
cinque itinerari `bali_nearby_islands`, nelle "Related itineraries", con
un'ancora che contenga la frase esatta:

| Da                                         | Ancora                                   |
| ------------------------------------------ | ---------------------------------------- |
| `10-days-bali-gili-islands`                | which islands near Bali to pick          |
| `5-days-nusa-penida-lembongan`             | the full list of islands near Bali       |
| `6-days-nusa-penida-diving-manta-mola`     | how the islands near Bali compare        |
| `7-days-nusa-lembongan-ceningan-with-kids` | choosing between the islands near Bali   |
| `6-days-nusa-islands-honeymoon`            | which island near Bali suits a honeymoon |

Ancore diverse, stessa destinazione. Cinque link in-content da pagine a tema
sono il segnale più forte che possiamo mandarci da soli.

### 5.5 Dimensione finale

Da 1.247 a circa **3.000 parole**, tre tabelle invece di una, nove sezioni per
isola. Allineato con chi sta in prima pagina, con in più la logistica reale che
loro non hanno.

## 6. Quanto lavoro è

Mezza giornata scarsa. Il grosso è scrivere le nove sezioni per isola, e i fatti
ci sono già tutti tra gli itinerari pubblicati e le pagine transport: è
riscrittura, non ricerca.

## 7. Come si giudica, e il punto di uscita

**Data di verifica: 4 settembre**, ventotto giorni dopo l'intervento del 7
agosto. Metrica: posizione media di `/destinations/bali-nearby-islands` sul
cluster, e i primi click.

- Se `islands near bali` scende **sotto 25**, ha funzionato, si continua a
  spingere sulla stessa URL.
- Se resta **tra 25 e 35**, siamo sulla strada giusta ma è una guerra di
  autorità e serve tempo, non altre modifiche.
- Se resta **sopra 35**, allora il formato hub non può vincere questa query, e a
  quel punto la biforcazione della sezione 4 diventa la mossa giusta: guida
  dedicata, e l'hub torna a fare solo l'hub.

Questo è il punto che mi interessa di più. Il rischio vero di questo cluster non
è scegliere male, è continuare a ritoccare ogni settimana senza mai lasciare a
un intervento il tempo di dire se ha funzionato.

## 8. Una cosa che ho trovato strada facendo

`nusa islands bali` sta a **23,9**, cioè 15-40 posizioni meglio di ogni variante
generica, su 31 impression. Le query `nusa` sono un cluster più piccolo ma molto
più vincibile, e sotto questo hub abbiamo già quattro guide dedicate a Nusa
Penida più tre itinerari.

Se il cluster generico si rivela troppo caro, quello Nusa è il ripiego a
rendimento più alto del sito, e vale un piano suo.
