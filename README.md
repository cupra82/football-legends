# Football Legends 2.0 — Almanacco divertente

**Focus:** Mondiali, EURO, Champions, stadi famosi, derby, leggende, allenatori, Pallone d’Oro e campionati europei. Sempre tre scelte.

- `classics-questions.json`: 156 domande curate, incluse nella selezione server.
- `people-questions.json`, `portugal-questions.json`, `questions.json`: archivio storico precedente.
- `people-generated.json`: profili da archivio biografico (se presenti nel repository).
- `questions-generated.json`: domande su campionati (rigenerate dal lunedì, solo classifiche complete).
- `football-bank.js`: genera domande su prime posizioni, senza risultati/gol di partite casuali.
- `server.js`: seleziona le domande miste bilanciando argomenti, con massimo circa 25% di nazionalità/ruolo/epoca quando la scelta è “Tutte”.
- `index.html`: applica lo stesso criterio alla carriera solitaria.

## Aggiornamento
1. GitHub Desktop → Fetch/Pull (quando necessario) → copia i file → Commit → Push origin.
2. GitHub Actions → Aggiorna archivio Football Legends → Run workflow per rigenerare subito, senza attendere lunedì.
3. Verifica `/api/version` e `/api/status`. **Non eliminare i JSON generati esistenti prima della prima rigenerazione riuscita.**

Le 156 domande aggiuntive sono dati storici stabili; gli aggiornamenti del lunedì non garantiscono nuove domande se le fonti non sono cambiate. Non sono stati verificati qui i download remoti del workflow.


## v2.1.2
- categorie riordinate: campionati, coppe, altri argomenti
- foto differenziate per Allenatori e tecnici, Calciatori leggendari, Leggende, Curiosità, Europei, Nazionali, Europa/UEFA
