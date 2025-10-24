# Secret Courtyard Milano

Sito web per la promozione e gestione della casa in affitto nel centro di Milano.

## Struttura del sito

### Sezioni Pubbliche
- **Homepage**: Presentazione della struttura
- **Prima e Post Lavori**: Galleria fotografica del prima/dopo
- **Come muoversi a Milano**: Guida ai trasporti e spostamenti
- **Ristoranti e Bar**: Consigli sui locali della zona

### Sezioni Private
- **Area Gestionale**: Gestione prenotazioni e ospiti
- **Area NUKI**: Controllo serratura elettronica

## Installazione

1. Clona il repository
2. Crea un ambiente virtuale: `python -m venv venv`
3. Attiva l'ambiente virtuale
4. Installa le dipendenze: `pip install -r requirements.txt`
5. Configura le variabili d'ambiente nel file `.env`
6. Esegui l'app: `python run.py`

## Configurazione

Copia il file `.env.example` in `.env` e configura:
- Chiavi API NUKI
- Credenziali di accesso
- Configurazioni database

## Sviluppo

Il progetto utilizza Flask come framework web. La struttura è organizzata in moduli separati per facilitare la manutenzione e l'espansione.