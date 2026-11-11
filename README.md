# Football Legends v0.6 — Calcio svizzero completo (upgrade compatibile)

La release **mantiene 50.000 domande generate + le 131 originali**, senza cambiare le regole di gioco, l'interfaccia o il server multiplayer.

## Cosa aggiunge

- **Super League svizzera**: 6 stagioni OpenFootball disponibili (2014/15, 2018/19, 2019/20, 2020/21, 2023/24, 2024/25). Il generatore riserva fino a **5.000** domande alla categoria `Campionato svizzero`, se i dati bastano.
- **Challenge League svizzera**: 2019/20, 2020/21, 2023/24, 2024/25 (fino a 1.200 domande dedicate).
- **Coppa Svizzera**: 2023/24 e 2024/25 (fino a 500 domande dedicate). Include partite di FC Mendrisio, AC Bellinzona, FC Lugano e altre squadre ticinesi ove presenti nell'archivio.
- Fonti CC0: https://openfootball.github.io/europe/ (URL dei JSON verificati).
- Tre risposte per domanda, con spiegazione e fonte. Nessun risultato inventato.

**Importante:** `5.000` è la quota *massima riservata*, non il numero garantito. Alcune competizioni o stagioni possono essere incomplete; i conteggi reali vengono mostrati da `/api/status` dopo l'esecuzione del workflow. Il dato 2026/27 non è ancora coperto da queste fonti. Le statistiche stagionali nel quiz si riferiscono alle sole partite registrate, non necessariamente a una classifica ufficiale.

## Installazione sicura sul progetto Render esistente

1. Da GitHub Desktop apri **Repository → Show in Explorer**. Copia **soltanto `football-bank.js`** dal nuovo ZIP nella cartella del repository, sostituendo quello già presente. Gli altri file del progetto NON devono essere sovrascritti.
2. GitHub Desktop: **Commit to main** poi **Push origin**. Render può fare un deploy automatico, ma continuerà a usare il vecchio archivio finché non viene rigenerato il JSON.
3. GitHub web → **Actions** → **Aggiorna archivio Football Legends** → **Run workflow** (branch `main`).
4. Dopo il workflow verde, verifica che il file `questions-generated.json` abbia un commit aggiornato; Render dovrebbe ridistribuire automaticamente il gioco (se Auto Deploy è attivo).
5. Apri https://football-legends-okp1.onrender.com/api/status e verifica `state: ready`, `count`, `byCategory["Campionato svizzero"]`, `byCategory["Challenge League svizzera"]` e `byCategory["Coppa Svizzera"]`.
6. Prova il single player e poi una stanza multiplayer con due dispositivi.

## Verifiche locali

`node test-bank.js` non richiede Internet. `node scripts/build-bank.js` richiede accesso a Internet e può aggiornare il database; GitHub Actions lo fa senza usare il tuo PC.

## Limitazioni

Il nuovo archivio contiene soprattutto domande su risultati, gol e statistiche calcolate. Non include ancora una banca dati completa di giocatori, allenatori e albi d'oro svizzeri. Questo aggiornamento conserva la struttura precedente e non modifica la gestione delle stanze.
