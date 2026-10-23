# Rinforzo 2: /trips/10-days-sulawesi-toraja-bunaken (2026-10-23)

> **STATO: APPLICATO il 2026-10-23** dal generatore delle 8:05 (PARTE 1 + PARTE 3).
> Script: `scripts/reinforce-10-days-sulawesi-toraja-bunaken-2026-10-23.mjs` (idempotente,
> contiene in testa i valori vecchi esatti). **Data di rilettura: 2026-11-20.**
> Primo rinforzo: `docs/reinforce-10-days-sulawesi-toraja-bunaken.md` (2026-09-05).

\_id Sanity: `itinerary-10-days-sulawesi-toraja-bunaken` (contentStatus `live`)

## 1. Baseline GSC (2026-09-23 → 2026-10-20)

| query              | impression | click | posizione | prima del 05/09 |
| ------------------ | ---------- | ----- | --------- | --------------- |
| sulawesi itinerary | 15         | 1     | 37,0      | 53,7            |
| sulawesi route     | 14         | 0     | 56,4      | 46,0            |

Sulla stessa query `sulawesi route` la pagina sorella `/trips/14-days-sulawesi-toraja-togean-bunaken`
sta a **13,5** (16 impression), e prende anche `sulawesi itinerary 2 weeks` a 6,1.

## 2. Lettura del primo rinforzo e diagnosi

Il piano del 05/09 (metaTitle "How to Pick a Region", due H2 con tabella su durata e regione)
ha funzionato su `sulawesi itinerary`: +16,7 posizioni. Ha invece peggiorato `sulawesi route`
di 10 posizioni. La spiegazione più semplice: il metaTitle del 05/09 ha **tolto la parola
"Route"** che c'era prima ("10-Day Toraja to Bunaken Route").

La SERP reale di `sulawesi itinerary` (controllata oggi) è fatta di Lonely Planet (9 giorni),
blog e tour operator (Experience Travel Group 17 giorni, Exo Travel, beyondthebucketlist): nessun
sito istituzionale, quindi vincibile. Il formato dominante mette **più durate e più opzioni**
a confronto. Alla pagina mancava proprio un "quale itinerario Sulawesi scegliere" che mettesse in
fila le nostre sette rotte Sulawesi; due di queste (honeymoon nord e famiglie nord) non ricevevano
alcun link da questa pagina.

## 3. PARTE 1, cosa è cambiato (solo meta, il `title` non è stato toccato)

| campo           | vecchio (esatto)                                                                                                                                         | nuovo                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| metaTitle       | Sulawesi Itinerary: 10 Days, and How to Pick a Region                                                                                                    | Sulawesi Itinerary: 1, 2 or 3 Weeks, Plus a 10-Day Route (56c)                                                                                                |
| metaDescription | How many days you need for Sulawesi, which of its four regions to pick, and a full 10-day route through Tana Toraja and Bunaken with honest drive times. | How long to spend in Sulawesi, which region fits one, two or three weeks, and a full 10-day route from Tana Toraja to Bunaken with honest drive times. (150c) |

Rimette "Route" nel title e riprende il formato multi-durata della SERP.

## 4. PARTE 3, cosa è cambiato nel body

Inseriti 4 blocchi (`_key` con prefisso `sr1023-`) tra "What is the best route through
Sulawesi?" e "Day 1":

1. H2 **"Which Sulawesi itinerary should you choose?"**
2. Risposta autoconclusiva (54 parole): una settimana una regione, dieci giorni le due, due
   settimane con le Togean, e le rotte dedicate per sub, honeymoon e famiglie.
3. Tabella comparativa delle 7 rotte Sulawesi del sito (giorni, regioni, per chi, compromesso).
4. Paragrafo con 3 link interni nuovi: `/trips/7-days-south-sulawesi-toraja-makassar`,
   `/trips/8-days-north-sulawesi-honeymoon-bunaken-siladen`,
   `/trips/8-days-north-sulawesi-with-kids-bunaken-tangkoko`.

Più una FAQ nuova in seconda posizione (`_key` `sr1023-faq`): "What is the best Sulawesi
itinerary for two weeks?", che rimanda la domanda delle due settimane alla rotta da 14 giorni.

Per annullare: ripristinare i due meta qui sopra ed eliminare i blocchi e la FAQ `sr1023-*`.

## 5. Cosa ci aspettiamo, e come lo misuriamo il 2026-11-20

- `sulawesi itinerary` su questa pagina: da 37 verso la pagina 2 alta (sotto 25).
- `sulawesi route` su questa pagina: torna almeno sui livelli di agosto (46) senza far
  scendere la 14 giorni, che resta la proprietaria naturale della query.
- Se `sulawesi route` scende sulla 14 giorni, la cannibalizzazione è peggiorata: in quel caso
  togliere "Route" dal metaTitle di questa pagina e lasciare la query alla 14 giorni.
