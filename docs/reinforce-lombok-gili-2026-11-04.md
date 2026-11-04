# Rinforzo, terzo giro: /destinations/lombok-gili (2026-11-04)

> **STATO: APPLICATO il 2026-11-04** dal generatore delle 8:05 (PARTE 1 + PARTE 3),
> in `src/data/destinations.ts`, voce `lombok-gili`. Commento datato nel codice.
> **Rileggere il 2026-12-02, non prima.**

## 1. Perché questa pagina

Unico candidato della lista B fuori prova e con impression significative. Gli altri
sono stati scartati:

- cluster "islands near/in/off bali": chiuso fino a novembre per autorità di dominio;
- `/visa-guide` ("bali visa cost", "indonesia visa cost"): SERP governativa;
- `/trips/10-days-bali-gili-islands` (in prova fino al 2026-11-13), `/trips/10-days-sulawesi-toraja-bunaken`
  (fino al 2026-11-20), `/trips/10-days-bali-lombok-gili-islands` (fino al 2026-11-11),
  `/destinations/komodo-flores` (fino al 2026-11-23), `/destinations/java` (fino al 2026-11-06),
  `/destinations/sumatra` (ritoccata il 2026-10-16, fino al 2026-11-13);
- `/trips/7-days-gili-islands-learn-to-dive`: a livello pagina sta migliorando (32,7 → 27,0 → 21,9), non va toccata;
- `/trips/14-days-sulawesi-toraja-togean-bunaken`: condivide le query Sulawesi con la pagina in prova, toccarla confonderebbe la lettura.

## 2. I numeri (GSC, livello pagina)

| finestra                | impression | click | posizione |
| ----------------------- | ---------: | ----: | --------: |
| 2026-08-08 → 2026-09-04 |        456 |     1 |      19,9 |
| 2026-09-07 → 2026-10-04 |        177 |     1 |      16,6 |
| 2026-10-05 → 2026-11-01 |        164 |     1 |      28,2 |

Query principali (2026-10-05 → 11-01): "gili islands lombok" 24 impr pos 28,8;
"gili islands to lombok" 24 pos 23,0; "gili lombok" 6 pos 60,5; "gili islands lombok
indonesia" 5 pos 44,8; "lombok gili islands" 5 pos 57,5.

Parte del calo è di sito (posizione media del sito 7,9 → 11,9 nello stesso periodo),
ma la hub ha perso 12 posizioni contro le 4 della media.

## 3. Perché non ranka

- **Ordine delle parole.** Le query mettono "Gili" per primo; title, H1 e meta
  aprivano con "Lombok". La meta non conteneva nemmeno le parole "Gili Islands".
- **Manca la risposta di entità.** La SERP reale (verificata il 2026-11-04) è
  Wikipedia, Wikivoyage, hotels.com e blog: nessun sito governativo, vincibile.
  Wikipedia e Wikivoyage aprono con la risposta a "dove sono le Gili, sono parte di
  Lombok?". La hub, con dieci sezioni, non lo diceva da nessuna parte.
- Cannibalizzazione parziale con `/transport/lombok-to-gili-islands` su "gili islands to
  lombok": non toccata (pagina diversa, regola una pagina per run). Annotata per la prossima lettura.

## 4. PARTE 1, applicata

| campo           | vecchio                                                                                                                                              | nuovo                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| h1              | Lombok and the Gili Islands, Planned Around the Boat                                                                                                 | The Gili Islands and Lombok, Planned Around the Boat                                                                                            |
| metaTitle       | Lombok and the Gili Islands: Which Island, Which Boat                                                                                                | Gili Islands and Lombok: Which Island, Which Boat (49)                                                                                          |
| metaDescription | Trawangan, Meno or Air, and how the boats from Bangsal and Kuta Lombok run. Crossing times, what a day trip costs you, and how long each leg needs. | Gili Trawangan, Meno or Air, how the Gilis sit off Lombok, and the Bangsal boats: crossing times, day-trip costs and how many days each needs. (142) |

## 5. PARTE 3, applicata

Nuova prima sezione H2, **"Are the Gili Islands part of Lombok?"**, prima di "Which
Gili island should you stay on?":

- risposta autoconclusiva di 51 parole (North Lombok Regency, West Nusa Tenggara, non Bali;
  Bangsal 15-30 minuti; fast boat da Bali);
- secondo paragrafo: niente aeroporto né veicoli a motore sulle Gili, Lombok è un altro viaggio;
- tabella comparativa Gili vs Lombok continentale (arrivo, spostamenti, per cosa, notti tipiche
  in 7 giorni). Tempi da `src/data/routes.ts`, notti coerenti con la tabella "How many days";
- link interno nuovo verso `/trips/7-days-south-lombok-kuta-beaches` (la hub non lo linkava).

Verifiche: `tsc` pulito, eslint pulito sui file toccati (il lint del repo fallisce già su
`origin/main` per file preesistenti in `scripts/` e `src/components/ui/`), build ok, zero
trattini lunghi, zero frasi bandite.

## 6. Come annullare

Ripristinare h1/metaTitle/metaDescription dai valori della sezione 4 (sono anche nel
commento datato nel codice) e rimuovere la prima voce di `sections` della hub `lombok-gili`.

## 7. Cosa guardare il 2026-12-02

Posizione della pagina (baseline 28,2) e posizione di "gili islands lombok" (baseline 28,8).
Successo: hub sotto 20 e la query sotto 20. Se non si muove, il cluster Gili segue la stessa
sorte di "islands near bali" (autorità, non contenuto) e va chiuso.
