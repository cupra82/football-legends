# Football Legends v0.4 — Mega Almanacco

## Contenuto verificabile

- 131 domande curate presenti nel file `questions.json` (dalla precedente release).
- Generatore automatico per **fino a 50.000 ulteriori domande** da partite e statistiche presenti nei dataset pubblici CC0 di OpenFootball.
- 8 campionati monitorati (Premier League, La Liga, Serie A, Süper Lig, Bundesliga, Ligue 1, Championship, Segunda División) e Mondiali dal 1930. I file sono richiesti per stagioni 2010-11–2026-27; i dati assenti e le partite senza punteggi conclusivi sono ignorati.
- Tipologie: vincente, punteggio, gol casa/trasferta/totali, numero di squadre a segno, intervallo, statistiche stagionali per club, stadi dei Mondiali e marcatori dei Mondiali quando documentati.
- Multiplayer simultaneo per 2–8 persone su WebSocket. Le domande vengono scelte sul server e non viene trasmessa la soluzione prima dello scadere del turno.

**Attenzione:** 50.000 è la capienza/obiettivo del generatore e NON il numero già verificato e incluso nello ZIP. Questo pacchetto **non include** `questions-generated.json`, perché nel contesto di generazione non è disponibile accesso Internet diretto ai JSON grezzi. Per ottenere e confermare il numero, lancia l'azione GitHub descritta qui sotto. Il gioco funziona con le 131 domande di base durante la generazione. La Svizzera mantiene le domande iniziali: non è ancora stata collegata una fonte storica svizzera estesa. Non sono ancora presenti 50.000 domande biografiche o sui trasferimenti: la maggioranza è legata alle partite.

## Aggiornamento da GitHub per il Render che già funziona

1. Estrai lo ZIP e **carica tutti i file e le cartelle** nel repository `cupra82/football-legends` (sostituisci file omonimi). Verifica che `index.html`, `server.js`, `football-bank.js`, `questions.json`, `package.json`, `scripts/build-bank.js` e `.github/workflows/update-questions.yml` siano nel percorso indicato (non in una sottocartella doppia).
2. Fai Commit. Render aggiornerà la web app se Auto Deploy è attivo.
3. Apri `https://football-legends-okp1.onrender.com/api/status`. All'inizio il server potrebbe indicare `loading` mentre scarica il database; quando pronto appare `ready`, `count`, `generated`, e `stats`.
4. Per **preparare un archivio statico stabile e non ricalcolare tutto al riavvio**, nel repository GitHub vai su **Actions** → **Aggiorna archivio Football Legends** → **Run workflow**. Se riesce, l'azione crea/aggiorna `questions-generated.json` sul branch `main`, innescando un nuovo deploy Render. Nei Settings del repository, sotto Actions → General → Workflow permissions, potrebbe essere necessario consentire **Read and write permissions**.
5. L'azione è anche programmata ogni lunedì alle 06:25 UTC. Se non trova almeno 50.000 domande, termina senza sovrascrivere lo snapshot precedente: controlla il log per i dettagli.

Il client scarica un campione massimo di 2.500 domande a sessione. L'archivio completo rimane **sul server** per il multiplayer e per nuove sessioni. La pagina `/api/status` indica il totale reale; se non vengono raggiunte 50.000, non dichiarare che sono già presenti.

## Fonti e limiti

- Dati partite dei club (CC0): https://github.com/openfootball/football.json
- Mondiali e marcatori / stadi presenti nei dati (CC0): https://github.com/openfootball/worldcup.json
- Le fonti OpenFootball non garantiscono che l'archivio della stagione corrente sia aggiornato ogni giorno: viene aggiornato il repository JSON, ma il dataset a monte potrebbe essere incompleto.
- Non vengono estratti dati da football-data.co.uk per via delle condizioni d'uso restrittive.
- Le statistiche derivate dalle partite disponibili non sono necessariamente uguali alle classifiche ufficiali (penalizzazioni, risultati a tavolino, lacune nei dataset).

## Test e sviluppo

`npm install && node test-bank.js && npm start`

`node scripts/build-bank.js` per generare `questions-generated.json` in locale con accesso Internet. Puoi impostare `MIN_QUESTIONS=1000` solo durante i test, non per il workflow di pubblicazione.

Il servizio è un prototipo; per un prodotto commerciale completo servono revisione editoriale, fonti dati affidabili per biografie/trasferimenti, moderazione, account e persistenza delle classifiche.
