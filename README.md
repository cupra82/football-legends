# Football Legends 1.3 — People First

**Cosa cambia:** le domande sui gol di singole partite, punteggi esatti, intervalli e statistiche numeriche di singole stagioni sono escluse dalle domande giocabili, anche se il file storico `questions-generated.json` resta disponibile nel repository. L'archivio di domande su persone viene scaricato e generato da GitHub Actions usando il dataset CC0 Reep/Wikidata.

## Installazione
1. In GitHub Desktop fai Fetch/Pull e copia **tutti** i file di questo pacchetto nel repository (sostituendo i vecchi; non cancellare `questions-generated.json`).
2. Commit e Push origin. Render pubblicherà subito la nuova interfaccia e il filtro anti-domande-noiose.
3. GitHub → Actions → Aggiorna archivio Football Legends → Run workflow. La generazione sulle persone prova a scaricare `data/people.csv` dal progetto `withqwerty/reep`.
4. Controlla Actions: il passaggio “Genera domande su calciatori e allenatori” deve riuscire. Un errore non va ignorato. Se riesce, sarà aggiunto `people-generated.json` e GitHub farà un ulteriore commit; Render dovrà completare un nuovo deploy.
5. Verifica `/api/status`: `biographies` indica quante nuove domande **reali** sono state caricate; `hiddenMatchTrivia` quante vecchie domande ripetitive vengono escluse. **Non aspettarti necessariamente 50.131 quesiti giocabili: è una scelta voluta.**

**Attenzione**: non è possibile verificare il numero effettivo di biografie prima che Actions scarichi i dati. Il generatore è programmato per non pubblicare set inferiori a 2.000 quesiti. Le domande su ruoli e nazionalità sono basate sui campi del registro e possono essere aggiornate nel tempo; nominativi meno noti vengono filtrati chiedendo più identificativi incrociati. Il Pallone d’Oro conserva il set storico originale; non abbiamo inventato migliaia di vincitori o premi.

**Fonte biografie:** https://github.com/withqwerty/reep — database CC0 derivato da Wikidata. **Fonte storico:** OpenFootball CC0. Conservare gli accrediti quando si redistribuisce il gioco.

**Test locali:** `node test-people-bank.js`; `node --check server.js`; `node --check scripts/build-people.js`.
