# Football Legends 1.3.3 — Primeira Liga portoghese

## Novità

- Nuova categoria selezionabile **Primeira Liga portoghese**.
- **99 domande curate**, sempre con **3 risposte**, su club, campioni, calciatori, allenatori e competizioni.
- Non sono generate domande su gol in partite casuali o risultati all'intervallo.
- Conservati server multiplayer, nickname, database PostgreSQL, classifiche e archivio delle domande.
- La nuova categoria è selezionabile in Carriera solitaria e Arena online.
- `/api/status` mostrerà la nuova voce `Primeira Liga portoghese` con 99 quesiti.

## Installazione

1. Su GitHub Desktop esegui **Fetch origin** e **Pull origin** se disponibile.
2. Estrai questo ZIP e copia tutto il suo contenuto nella cartella locale del repository, sostituendo i file esistenti senza cancellare i file non presenti nello ZIP.
3. **Non cancellare** `questions-generated.json` e `people-generated.json`, perché questi due file vengono creati da GitHub Actions e possono non essere presenti nello ZIP.
4. In GitHub Desktop: **Commit to main → Push origin**.
5. Non serve eseguire **Run workflow**: le 99 domande portoghesi sono già incluse nel nuovo file `portugal-questions.json`.
6. Verifica che Render sia Live e apri `/api/version` (atteso `1.3.3`) e `/api/status` (categoria `Primeira Liga portoghese`).
7. Forza il refresh nel browser con Ctrl+Shift+R.

## Fonti principali

- RSSSF albo d'oro: https://rsssf.org/tablesp/portchamp.html
- UEFA club portoghesi: https://pt.uefa.com/uefachampionsleague/news/023d-0e97b175ee2d-090504adece2-1000--palmares-na-uefa-clubes-com-mais-titulos/
- UEFA Champions Porto 2004: https://www.uefa.com/uefachampionsleague/news/0250-0c50f100f076-ecb0d9d85bb1-1000--2003-04-porto-pull-off-biggest-surprise/
- UEFA storia Porto: https://www.uefa.com/uefachampionsleague/news/025a-0eaae2d4aef0-8d3790dac4c0--raise-a-glass-to-porto/
- UEFA calciatori portoghesi: https://www.uefa.com/news/0246-0e98e228fe16-d5ff2a10c737-1000--europe-s-top-portuguese-players/
- Primeira Liga marcatori: https://futebol.pt/recordes/melhores-marcadores-liga/

Le domande stagionali arrivano fino alla stagione 2025/26 conclusa. La stagione 2026/27 non è ancora conclusa.
