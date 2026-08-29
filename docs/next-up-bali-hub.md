# In coda: /destinations/bali

> **Voce di coda, non un piano.** Messa qui dal founder il 2026-08-29 ("metti in
> coda l'hub"). Il piano vero e proprio è la PARTE 3 della prossima run: questo
> file serve solo a fissare il bersaglio, così la prossima run non ne sceglie un
> altro.

## Perché

`/destinations/bali` è **l'ultima hub del sito senza una singola sezione
editoriale**, ora che raja-ampat è stata sistemata il 2026-08-29. Stato misurato
in produzione lo stesso giorno:

| hub                 | H2 editoriali | tabelle |
| ------------------- | ------------: | ------: |
| bali-nearby-islands |             9 |       3 |
| lombok-gili         |             7 |       4 |
| java                |             6 |       2 |
| komodo-flores       |             6 |       1 |
| raja-ampat          |             6 |       1 |
| sumatra             |             2 |       1 |
| wild-indonesia      |             1 |       1 |
| **bali**            |         **0** |   **0** |

I cinque H2 che la pagina ha oggi sono tutti impalcatura generata: "Bali travel
guides", "17 itineraries in Bali", "How to get to and around Bali", "Plan the
practical side", "Other destinations". Nessuno è una domanda, nessuno ha una
risposta autoconclusiva, e non c'è una riga di prosa scritta per un lettore.

## I numeri, finestra 2026-07-29 → 2026-08-25

**Hub: 36 impression, 0 click, posizione media 20,3.**

Il contrasto con i suoi stessi articoli è il punto:

| pagina                              | impression | posizione |
| ----------------------------------- | ---------: | --------: |
| /trips/14-days-indonesia-bali-java-komodo | 536 |       8,0 |
| /trips/10-days-bali-gili-islands    |        393 |      14,5 |
| /trips/5-days-bali-ubud-canggu-uluwatu |     393 |      11,1 |
| /trips/10-days-bali-lombok-gili-islands |    175 |      16,4 |
| **/destinations/bali**              |     **36** |  **20,3** |

Su Bali, che è la destinazione più cercata dell'archipelago, la hub prende meno
impression di sette dei suoi stessi itinerari. Gli articoli reggono tutto il
peso da soli.

## Due cose che la distinguono dalle altre hub già fatte

1. **Non è un caso di posizione 60.** A 20,3 è già in striking distance, quindi
   qui il rinforzo lavora su una pagina che Google mostra già, non su una da
   recuperare. È la condizione più favorevole di tutte quelle affrontate finora.
2. **Correzione del 2026-08-29 alla prima stesura di questo file.** Avevo scritto
   che "il segnale GSC è troppo sottile per guidare il piano". È sbagliato, e il
   metodo di `gsc-monday-insights-exploreindonesia` lo dice chiaramente: la
   striking distance (posizione 5-20) è la **prima** fonte di rendimento, e una
   pagina in top 20 con CTR sotto l'1% ha "un problema di snippet, non di
   ranking", che è l'azione più economica in assoluto. La hub Bali è a
   **posizione 20,3 con CTR zero**: cade esattamente lì. Resta vero che 36
   impression non bastano a ricavare un cluster di query, quindi le sezioni
   vanno costruite su ricerca keyword e SERP reale, ma la pagina **non** è un
   caso da rimandare per debolezza di segnale.

## Nota di processo, 2026-08-29

`gsc-monday-insights-exploreindonesia` gira il lunedì alle 7:30 ed è il primo
anello di una catena di cui il generatore di contenuti delle 8:05 è il secondo.
Il suo report si chiude con una riga esplicita per il generatore: *"RINFORZA
<pagina> su <cluster>, oppure CREA su <tema>"*. **La run del 2026-08-28 non ha
letto quella raccomandazione** e ha scelto la pagina da zero. Le prossime run
devono leggerla prima di scegliere.

## Un debito già aperto che si chiude qui

`docs/reinforce-5-days-bali-ubud-canggu-uluwatu.md`, punto 6.1: il link in
entrata da `/destinations/bali` verso `/trips/5-days-bali-ubud-canggu-uluwatu`
con ancora comparativa **non è stato applicato il 2026-08-29 perché la hub non ha
nessun punto in-content dove appenderlo.** Va aggiunto insieme alle sezioni.
