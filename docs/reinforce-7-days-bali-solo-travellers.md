# Piano di rinforzo: /trips/7-days-bali-solo-travellers

> **STATO: APPLICATO il 2026-08-07.** Sezioni H2, tabella, link Booking e link in entrata sono in produzione. Il campo `title` resta intatto per scelta del founder.

Generato dalla run di prova del 2026-08-07 (PARTE 3), approvato e applicato lo stesso giorno.
La PARTE 1 aveva già applicato metaTitle e metaDescription; le sezioni della PARTE 5 sono seguite dopo l'approvazione.

## 1. La pagina e il cluster

Pagina: `https://exploreindonesia.ai/trips/7-days-bali-solo-travellers`
\_id Sanity: `28bac5f8-9b32-4528-970c-1387f166e371` (contentStatus `live`)

Cluster GSC, 28 giorni (2026-07-08 → 2026-08-04): **110 impression, 0 click, posizione media 35,1**, su 32 query. Le principali:

| query                      | impression | posizione |
| -------------------------- | ---------- | --------- |
| bali solo travel           | 22         | 36,9      |
| solo travel bali           | 15         | 38,7      |
| solo trip to bali          | 9          | 34,9      |
| solo travelling bali       | 6          | 33,2      |
| bali solo trip             | 5          | 34,4      |
| travel solo bali           | 5          | 34,8      |
| bali indonesia solo travel | 4          | 28,5      |
| solo traveller bali        | 3          | 35,3      |
| coda lunga (24 query)      | 41         | 21-56     |

Scelta al posto di `/visa-guide` (269 impression, pos 50,8) applicando la regola sulla SERP: le query del visa-guide sono head term istituzionali dove davanti stanno i siti governativi, quindi non recuperabili con una riscrittura.

## 2. Già applicato in produzione (PARTE 1)

**metaTitle**, da `Solo Bali in 7 Days: Safe, Social Itinerary` a:

```
Bali Solo Travel: Where to Base, and a 7-Day Route
```

50 caratteri. Mette "Bali Solo Travel" come frase esatta iniziale, che è la formulazione più cercata (22 + 15 impression sulle due varianti) e che nel vecchio title non compariva mai.

**metaDescription**, da `A 7-day solo Bali itinerary: Ubud, Canggu and Uluwatu, ordered to meet people easily, cut backtracking and keep logistics simple.` a:

```
Bali solo travel done properly: where to base, how to meet people without forcing it, and a 7-day route through Ubud, Canggu and Uluwatu.
```

137 caratteri.

**Per annullare:** rimetti i due valori vecchi qui sopra sul documento `28bac5f8-9b32-4528-970c-1387f166e371`. Nient'altro è stato toccato.

**Il campo `title` NON è stato toccato**, e resta `7 Days in Bali for Solo Travellers: Ubud, Canggu and Uluwatu`. Su un articolo `title` guida H1, headline JSON-LD, breadcrumb e ogni card nei listing, oltre 11 punti nel codice: non è un ritocco reversibile in dieci secondi, quindi esce dal passaggio meccanico e finisce qui sotto come proposta.

## 3. Perché non ranka

**Mismatch di formato, come su `bali-nearby-islands`.** SERP reale per "bali solo travel" (agosto 2026), primi otto risultati:

- sologuides.com, "Bali Solo Travel Guide: No-Fluff Version (Updated 2026)"
- absolutelylucy.com, "Solo Travel in Bali: The Ultimate Guide"
- baliuntold.com, "Bali Solo Travel: My Ultimate Guide"
- balipedia.com, "A FULL Guide to Traveling Bali Solo"
- balisolotrip.com, "Ultimate Bali Solo Travel Guide"
- girlwiththepassport.com, "The Ultimate Bali Solo Travel Guide"
- jessieonajourney.com, "Bali Solo Travel: How To Have A Fun Trip When Visiting Bali Alone"
- bookretreats.com, "Complete Guide For Solo Travel in Bali"

**Otto guide su otto. Nessun itinerario giorno per giorno.** Tutti aprono su sicurezza, dove stare e come conoscere gente, non su "giorno 1, giorno 2". Buona notizia: sono tutti blog indipendenti, nessun dominio istituzionale, quindi la SERP è battibile.

Cause secondarie:

1. **Manca una sezione sicurezza.** È il primo sub-intento di ogni concorrente, soprattutto per donne che viaggiano sole, e non abbiamo un blocco che lo risponda.
2. **Manca il costo.** "Quanto costa Bali da solo" è ovunque nella SERP. La nostra `/indonesia-travel-costs` ha 1904 impression a posizione 9,2 e non è linkata da qui.
3. **L'H1 è un titolo da itinerario**, non da guida.

## 4. H1 proposto (decide il founder, non applicato)

```
Bali Solo Travel: A 7-Day Route for Going Alone
```

46 caratteri. Attenzione: cambiare `title` cambia anche le card in tutti i listing e l'headline JSON-LD. Se preferisci non toccarlo, il guadagno di metaTitle e meta è comunque già in produzione.

## 5. Sezioni H2 da aggiungere

Da inserire dopo "Who this trip is for" e prima di "Trip at a glance".

### H2: `Is Bali safe for solo travellers?`

> Bali is one of the easier places in Asia to travel alone, including for women. The usual
> problems are traffic and scooter accidents rather than crime, followed by drink spiking in
> the busiest nightlife areas and petty theft from bags left on beaches. Take the same
> precautions you would in any busy tourist town.

(52 parole.) Copre il sub-intento numero uno di tutta la SERP, che oggi non tocchiamo.

### H2: `Where should you stay in Bali as a solo traveller?`

> Base yourself where meeting people is easy rather than where the view is best. Canggu has
> the largest concentration of solo travellers, co-working and hostels. Ubud suits quieter
> trips and courses. Uluwatu is the least social of the three, so put it last rather than
> first.

(50 parole.) Seguita da una **tabella comparativa** delle tre basi, con i link Booking, che oggi la pagina non ha affatto.

### H2: `How much does a week in Bali cost for one person?`

> Our Indonesia cost guide puts mid-range travel at 70 to 100 US dollars a day per person and
> budget travel at 30 to 50, and solo travellers sit higher per head because a room costs the
> same for one as for two. Add roughly a third for a week alone versus the same week shared.

(57 parole.) Linka a `/indonesia-travel-costs`, la nostra pagina più forte, che oggi non è linkata da qui.

### H2: `How do you meet people travelling alone in Bali?`

> Surf lessons, co-working spaces and hostel common rooms do most of the work, in that order.
> Canggu is where this happens easily and Uluwatu is where it does not. Booking a multi-day
> course rather than single activities is the most reliable way to end up with the same
> people twice.

(52 parole.)

## 6. Link interni da aggiungere

| Da                                             | Perché                                              | Anchor                                      |
| ---------------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| `/indonesia-travel-costs` (1904 impr, pos 9,2) | La pagina più forte del sito, oggi non linka questa | "what a week in **Bali costs on your own**" |
| `/destinations/bali`                           | Hub padre                                           | "travelling **Bali solo**"                  |
| `/trips/7-days-bali-first-timers`              | Fratello ad alto traffico                           | "if you are going **alone**"                |
| Questa pagina → `/indonesia-travel-costs`      | Manca il link in uscita al costo                    | dentro la nuova sezione costi               |

Regola di casa: ogni nuovo link in-content richiede `bun run indexnow:submit`.

## 7. Cosa aspettarsi

Title e meta sono già live, quindi il primo segnale misurabile è il **CTR**, non la posizione: la pagina prende 110 impression senza un solo click, e ora il title contiene la frase cercata. Attesa: primi click entro 2-3 settimane. Le sezioni H2 qui sopra servono per muovere la posizione da 35 verso la prima pagina, e senza quelle il ritocco da solo difficilmente basta contro otto guide dedicate.

**Metrica da controllare lunedì** su `/trips/7-days-bali-solo-travellers`: **click e CTR**, non la posizione. Comando: `node scripts/gsc-insights.mjs --days 28`.
