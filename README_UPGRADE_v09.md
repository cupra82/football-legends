# Football Legends v0.9 — Stanza persistente e impostazioni condivise

## Cambiamenti
- Categoria e numero di domande visibili a tutti nella stanza.
- Organizzatore può cambiare categoria e numero di domande nella sala d’attesa; aggiornamento in tempo reale per tutti.
- Partita finita: i giocatori rimangono connessi, stessa stanza/codice. L’organizzatore clicca **Prepara rivincita** per riportare tutti nella sala d’attesa.
- Il server resta autorevole sulle impostazioni, per evitare incongruenze tra telefoni.

## Installazione
Copia tutto il contenuto dello ZIP nella cartella del repository tramite GitHub Desktop, sostituendo i file. Commit e Push origin. Render effettua il deploy automaticamente se Auto Deploy è attivo. Non serve Run workflow: le domande non sono cambiate. Conserva `questions-generated.json` già presente nel repository.

## Note
Le stanze persistono tra le partite sullo stesso processo Render. Se Render riavvia il server o un partecipante ricarica la pagina, la connessione e la stanza di quel partecipante non vengono ripristinate automaticamente; per gestire il recupero dopo disconnessione serve una funzione successiva.
