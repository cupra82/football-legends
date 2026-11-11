# FOOTBALL LEGENDS v0.8 — PACCHETTO COMPLETO

Questo pacchetto contiene **il progetto completo** per il server Render e per GitHub, NON il file delle 50.000 domande generate. Il file `questions-generated.json` che GitHub Actions ha già creato rimane nel repository quando si copiano i file sopra quelli esistenti. **Non cancellarlo**.

## Cosa include
- Carriera solitaria e duello: 10, 15, 20, 30 domande.
- Arena online: selezione 10, 15, 20, 30 domande **prima di creare la stanza**, modificabile dall'host anche nella lobby.
- Server WebSocket con tempo e opzioni controllati sul server, fino a 8 giocatori.
- Generatore 50.000 domande con riserva per Super League svizzera, Challenge League e Coppa Svizzera dove disponibili.
- `scripts/build-bank.js` e `.github/workflows/update-questions.yml` per aggiornare `questions-generated.json`.

## Installazione su GitHub Desktop
1. In GitHub Desktop: **Fetch origin**, poi **Pull origin** se disponibile. NON forzare se compaiono conflitti.
2. Repository > Show in Explorer. Aprire questa cartella, copiare **tutti i file e le sottocartelle contenuti in questo pacchetto** nella cartella del repository. **Non eliminare i file già presenti**.
3. GitHub Desktop: Commit to main > Push origin. Se segnala modifiche remote, Fetch > Pull > Push e risolvi eventuali conflitti.
4. GitHub Actions > Aggiorna archivio Football Legends > Run workflow, branch main.
5. Verificare che il log mostri fonti svizzere: in `/api/status`, nel campo `stats.byCategory`, cercare `Campionato svizzero`, `Challenge League svizzera`, `Coppa Svizzera`.
6. Render deve completare il deploy `Live`; aprire il sito con Ctrl+F5 per aggiornare la cache.

## Verifica in Arena
Nel sito aprire Arena online: il campo `Numero di domande Arena online` deve essere visibile subito. Scegliere 30, creare stanza, entrare da un secondo dispositivo e avviare. In alto la partita deve mostrare `DOMANDA 1 / 30`.

## Chiarimenti sui numeri
Il totale 50.131 è corretto per la banca generata 50.000 + 131 originali. Le domande svizzere **sostituiscono** altre domande nella quota delle 50.000: il totale può rimanere 50.131 anche quando quelle svizzere sono state aggiunte. Bisogna guardare `stats.byCategory`, non solo `count`. **Non è garantito** che siano esattamente 5.000 svizzere: dipende dalle fonti disponibili.

Fonti: OpenFootball (CC0), https://openfootball.github.io/europe/ e https://github.com/openfootball/football.json
