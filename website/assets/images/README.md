# Struttura Immagini Secret Courtyard Milano

Questa struttura è progettata per organizzare le immagini del sito in modo ottimale e scalabile.

## Struttura Cartelle (Aggiornata)

```
assets/
├── images/
│   ├── Home/              # Immagini per la homepage
│   │   ├── Hero.jpg       # Immagine hero principale
│   │   ├── Camera.jpg     # Foto della camera
│   │   ├── Bagno.jpg      # Foto del bagno
│   │   ├── Cucina.jpg     # Foto della cucina
│   │   └── Soggiorno.jpg  # Foto del soggiorno
│   ├── La casa/           # Immagini per la sezione "La casa"
│   │   ├── Hero.jpg       # Immagine hero della sezione
│   │   ├── La casa.jpg    # Vista generale della casa
│   │   └── L'ingresso.jpg # Foto dell'ingresso
│   ├── La ristrutturazione/ # Documentazione ristrutturazione
│   │   ├── Hero.jpg       # Immagine hero della sezione
│   │   ├── Cucina prima.jpg / Cucina dopo.jpg
│   │   ├── Salotto prima.jpg / Salotto dopo.jpg
│   │   ├── Soppalco prima.jpg / Soppalco dopo.jpg
│   │   └── Facciata prima.jpg / Facciata dopo.jpg
│   ├── Mobilità/          # Informazioni sulla mobilità
│   │   └── Hero.jpeg      # Immagine hero della sezione
│   ├── Scopri Milano/     # Scoprire Milano
│   │   └── Hero.jpeg      # Immagine hero della sezione
│   ├── QR code/           # Codici QR per pagamenti
│   │   ├── Paypal.png     # QR code PayPal
│   │   ├── Revolut.png    # QR code Revolut
│   │   └── Satispay.png   # QR code Satispay
├── icons/                 # Icone SVG e PNG
└── graphics/              # Grafiche e illustrazioni
```

## Formati Supportati

### Formati Principali
- **JPEG**: Per foto con molti dettagli e colori
- **PNG**: Per immagini con trasparenza
- **WebP**: Formato moderno con compressione superiore
- **AVIF**: Formato di ultima generazione (futuro)

### Linee Guida
1. **Priorità WebP**: Convertire sempre in WebP per il web
2. **Fallback**: Mantenere versioni JPEG/PNG per compatibilità
3. **Dimensioni**: Ottimizzare per diversi breakpoint:
   - Mobile: max 800px larghezza
   - Tablet: max 1200px larghezza
   - Desktop: max 1920px larghezza

## Nomenclatura

Usare nomi descrittivi e consistenti:
- `hero-milano-skyline.jpg`
- `room-living-room-main.jpg`
- `amenity-courtyard-day.jpg`
- `transport-metro-map.png`

## Strumenti Raccomandati

- **Compressione**: Squoosh, ImageOptim
- **Conversione**: cwebp per WebP
- **Ottimizzazione**: SVGO per icone SVG