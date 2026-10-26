# Rinforzo: /destinations/komodo-flores (secondo giro)

> **STATO: APPLICATO il 2026-10-26** dal generatore delle 8:05 (PARTE 1 + PARTE 3,
> una sola pagina). Rileggere il risultato **il 2026-11-23**, non prima.
> Primo giro: `docs/reinforce-komodo-flores.md` (2026-08-24).

## 1. Pagina, cluster, baseline

Pagina: `https://exploreindonesia.ai/destinations/komodo-flores`
Sorgente: `src/data/destinations.ts`, voce `slug: "komodo-flores"`.

GSC, 28 giorni, 2026-09-26 → 2026-10-23, dimensione query + pagina:
**46 impression, 0 click** sulla pagina.

| query | impr | pos |
| --- | ---: | ---: |
| komodo and flores | 4 | 36,0 |
| komodo dragon flores | 4 | 17,8 |
| are there komodo dragons on flores island | 3 | 23,0 |
| komodo flores | 3 | 45,7 |
| where to see komodo dragons in indonesia | 3 | 62,3 |
| flores komodo | 2 | 42,5 |
| komodo to flores | 2 | 25,0 |
| komodo dragons flores | 2 | 21,0 |
| bali flores komodo | 1 | 40,0 |

## 2. Perché non rankava

- **Le domande sui draghi vanno già discretamente** (pos 17-27) grazie al primo giro.
  Il cluster **generico** ("komodo and flores", "komodo flores", "flores komodo",
  "komodo to flores", "bali flores komodo") stava invece fra 25 e 46: il title
  apriva con "Komodo Dragons on Flores", mai con il nome della destinazione.
- **Cannibalizzazione in arrivo**: dal 2026-10-21 esiste
  `/trips/5-days-komodo-dragons-rinca-wae-wuul-flores`, costruito proprio su
  "komodo dragons on flores / where to see komodo dragons". L'hub non deve
  contendergli quell'intento; deve diventare la pagina "Komodo e Flores" generica e
  passare il lettore dei draghi all'articolo.
- **Mancava la sezione che risponde al cluster generico**: nessun H2 diceva che
  differenza c'è fra il parco e Flores via terra, né come ci si arriva da Bali.
- **SERP controllata** ("komodo and flores travel guide"): Bucketlistly,
  Responsible Travel, Audley, Original Travel, Experience Travel Group, Komodo Resort.
  Blog e tour operator, nessun sito istituzionale: vincibile sul contenuto.

## 3. PARTE 1, cosa è cambiato (valori vecchi esatti)

| campo | vecchio | nuovo |
| --- | --- | --- |
| `h1` | Komodo Dragons and Flores | Komodo and Flores: the Dragons, the Boats and the Road East |
| `metaTitle` | Komodo Dragons on Flores: Where to See Them, Day by Day | Komodo and Flores Travel Guide: Dragons, Boats and Routes (57) |
| `metaDescription` | Komodo dragons live on Komodo, Rinca and parts of Flores. Where to see them from Labuan Bajo, plus day-by-day Komodo and Flores itineraries. | Plan Komodo and Flores: where the dragons live, how many days you need, flights from Bali, park fees and day-by-day routes from Labuan Bajo. (140) |

Annullare: rimettere i tre valori vecchi (sono anche nel commento datato sopra la
voce in `destinations.ts`) e pushare su main.

## 4. PARTE 3, cosa è stato aggiunto

1. **H2 nuovo, secondo nella pagina**: "Komodo or Flores: what is the difference,
   and do you need both?" Risposta autoconclusiva di 59 parole, poi una
   **tabella comparativa** parco vs Flores via terra (cosa vedi, come ti muovi,
   giorni, da dove riparti, per chi), con link interno a
   `/trips/5-days-komodo-dragons-rinca-wae-wuul-flores` (cede l'intento "draghi"
   all'articolo dedicato).
2. **H2 nuovo, dopo "How many days"**: "How do you get to Komodo and Flores from
   Bali?" Risposta di 57 parole (volo di circa un'ora per Labuan Bajo, cifra
   coerente con la tratta 12Go `bali/labuan-bajo` verificata il 2026-10-21; barca
   multi-giorno da Lombok come alternativa; uscita da Ende o Maumere se si prosegue
   via terra, coerente con `10-days-komodo-flores`). Link interno a
   `/transport/bali-to-labuan-bajo`.

Nessuna cifra nuova inventata: tariffe del parco e quote invariate rispetto al
primo giro. Drive time su Flores (3-5 ore fra le tappe) ripreso da
`10-days-komodo-flores`.

## 5. Cosa ci aspettiamo, e come lo leggiamo il 2026-11-23

- **Metrica**: posizione media della pagina sul cluster generico (le cinque query
  "komodo and flores / komodo flores / flores komodo / komodo to flores / bali
  flores komodo"), oggi fra 25 e 46. Obiettivo: sotto 20.
- **Controllo di non-regressione**: le query sui draghi (oggi 17-27) non devono
  peggiorare di oltre 5 posizioni. Se peggiorano e salgono in parallelo su
  `5-days-komodo-dragons-rinca-wae-wuul-flores`, è il passaggio di intento voluto,
  non una perdita.
- Volumi piccoli (46 impression): non trarre conclusioni da 1-2 click.
