# Secret Courtyard Milano

Sito web per la promozione e gestione della casa in affitto nel centro di Milano.

## Struttura del Progetto

Il progetto è composto da due componenti principali:

### 1. Sito Web Statico (HTML/CSS)
- **Posizione**: `website/`
- **Descrizione**: Sito web statico per la promozione della struttura
- **Pagine**:
  - `index.html` - Homepage principale
  - `pages/la-casa.html` - Descrizione dettagliata della casa
  - `pages/mobilita.html` - Guida ai trasporti e spostamenti
  - `pages/scopri-milano.html` - Attrazioni e punti di interesse
  - `pages/la-ristrutturazione.html` - Galleria del prima/dopo lavori

### 2. Applicazione Flask (Backend)
- **Posizione**: Root del progetto
- **Descrizione**: Sistema di gestione per prenotazioni e controllo accessi
- **Funzionalità**:
  - Gestione prenotazioni
  - Controllo serratura elettronica NUKI
  - Dashboard amministrativa

## Installazione

### Per il Sito Web Statico
1. Apri il file `website/index.html` con il tuo browser
2. Tutte le risorse (CSS, immagini) sono incluse localmente

### Per l'Applicazione Flask
1. Crea un ambiente virtuale: `python -m venv venv`
2. Attiva l'ambiente virtuale
3. Installa le dipendenze: `pip install -r requirements.txt`
4. Configura le variabili d'ambiente nel file `.env`
5. Esegui l'app: `python run.py`

## Configurazione

Copia il file `.env.example` in `.env` e configura:
- Chiavi API NUKI
- Credenziali di accesso
- Configurazioni database

## Struttura delle Cartelle

```
Secret_courtyard_Milano/
├── website/           # Sito web statico (HTML/CSS)
│   ├── index.html
│   ├── style.css
│   └── pages/         # Pagine secondarie
├── app/               # Applicazione Flask
├── config/            # Configurazioni
├── data/              # Dati dell'applicazione
├── tests/             # Test automatizzati
├── venv/              # Ambiente virtuale Python
├── requirements.txt   # Dipendenze Python
└── run.py            # Avvio applicazione Flask
```

## Sviluppo

Il progetto utilizza Flask come framework web per il backend e HTML/CSS puro per il frontend statico. La struttura è organizzata in moduli separati per facilitare la manutenzione e l'espansione.

## Ottimizzazione Immagini

Il sito include un sistema di ottimizzazione immagini avanzato:

### Script Disponibili
```bash
# Ottimizza tutte le immagini (riduzione ~90%)
npm run optimize:images

# Converti PNG in WebP
python convert-png-to-webp.py
```

### Risultati Ottimizzazione
- **Dimensione originale**: 413 MB
- **Dimensione ottimizzata**: 48 MB
- **Riduzione**: 88.7% (366 MB risparmiati)
- **Formati supportati**: JPG, PNG, WebP

### Caratteristiche
- Ridimensionamento intelligente mantenendo qualità
- Conversione automatica PNG → WebP
- Fallback per browser legacy
- Backup completo delle originali

Per dettagli completi: [IMAGE_OPTIMIZATION_REPORT.md](IMAGE_OPTIMIZATION_REPORT.md)