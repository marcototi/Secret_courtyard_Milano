# Ottimizzazione Immagini - srcset/sizes

## Panoramica

Questo documento descrive come implementare correttamente `srcset` e `sizes` per ottimizzare il caricamento delle immagini sul sito Secret Courtyard Milano.

## Perché usare srcset/sizes?

- **Performance**: Carica solo l'immagine appropriata per la dimensione dello schermo
- **Risparmio dati**: Evita di scaricare immagini grandi su dispositivi mobili
- **Qualità migliore**: Fornisce immagini ad alta risoluzione per schermi retina
- **Core Web Vitals**: Migliora LCP (Largest Contentful Paint)

## Implementazione Attuale

### 1. Immagini Hero (Background CSS)

Le immagini hero sono state spostate da inline styles a classi CSS:

```css
.hero-home {
    background: linear-gradient(rgba(44, 85, 48, 0.3), rgba(44, 85, 48, 0.3)),
                url('../assets/images/Home/Hero.jpg') center/cover no-repeat;
}

/* Per schermi retina */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .hero-home {
        background-image: linear-gradient(rgba(44, 85, 48, 0.3), rgba(44, 85, 48, 0.3)),
                         url('../assets/images/Home/Hero@2x.jpg');
    }
}

/* Per mobile */
@media (max-width: 768px) {
    .hero-home {
        background-image: linear-gradient(rgba(44, 85, 48, 0.3), rgba(44, 85, 48, 0.3)),
                         url('../assets/images/Home/Hero-mobile.jpg');
    }
}
```

**File HTML corrispondenti:**
- `index.html`: usa `class="hero hero-home"`
- `la-casa.html`: dovrebbe usare `class="hero hero-la-casa"`
- `la-ristrutturazione.html`: `class="hero hero-ristrutturazione"`
- ecc.

### 2. Immagini HTML con srcset/sizes

Esempio di implementazione:

```html
<img src="assets/images/Home/Soggiorno.jpg"
     srcset="assets/images/Home/Soggiorno-thumb.jpg 400w,
             assets/images/Home/Soggiorno-mobile.jpg 800w,
             assets/images/Home/Soggiorno.jpg 1200w,
             assets/images/Home/Soggiorno@2x.jpg 2400w"
     sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 50vw,
            33vw"
     width="800"
     height="600"
     alt="Soggiorno di Secret Courtyard Milano">
```

## Passi per Completare l'Implementazione

### Step 1: Generare Versioni Multiple

Eseguire lo script di generazione:

```bash
cd website
pip install Pillow
python generate-responsive-images.py
```

Lo script creerà:
- `nome@2x.ext` - Versione 2x per retina
- `nome-mobile.ext` - Versione ottimizzata per mobile (800x600)
- `nome-thumb.ext` - Versione thumbnail (400x300)
- `nome.webp` - Versione in formato WebP (se supportato)

### Step 2: Aggiornare le Immagini HTML

Per ogni immagine `<img>` nel sito, aggiungere:

1. **srcset**: Elenco delle versioni con le loro larghezze intrinseche
2. **sizes**: Query media che definiscono quanto spazio occupa l'immagine
3. **width/height**: Già implementati per prevenire layout shift

### Step 3: Aggiornare le Immagini CSS

Per ogni hero image, creare classi CSS corrispondenti:

```css
.hero-la-casa {
    background: linear-gradient(rgba(44, 85, 48, 0.3), rgba(44, 85, 48, 0.3)),
                url('../assets/images/La casa/Hero.jpg') center/cover no-repeat;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .hero-la-casa {
        background-image: linear-gradient(rgba(44, 85, 48, 0.3), rgba(44, 85, 48, 0.3)),
                         url('../assets/images/La casa/Hero@2x.jpg');
    }
}

@media (max-width: 768px) {
    .hero-la-casa {
        background-image: linear-gradient(rgba(44, 85, 48, 0.3), rgba(44, 85, 48, 0.3)),
                         url('../assets/images/La casa/Hero-mobile.jpg');
    }
}
```

### Step 4: Testare

1. **Test responsive**: Verificare su diverse dimensioni di schermo
2. **Test performance**: Usare Lighthouse in Chrome DevTools
3. **Test retina**: Verificare su dispositivi ad alta densità pixel

## Best Practices

### Dimensioni Immagini Consigliate

| Tipo | Larghezza | Altezza | Uso |
|------|-----------|---------|-----|
| Hero desktop | 1200px | 630px | Desktop |
| Hero mobile | 800px | 600px | Mobile |
| Hero retina | 2400px | 1260px | Schermi 2x |
| Immagini stanze | 800px | 600px | Gallery |
| Thumbnail | 400px | 300px | Anteprime |

### Formati

1. **JPEG**: Per fotografie (qualità 85%)
2. **WebP**: Formato moderno (30% più piccolo)
3. **PNG**: Per immagini con trasparenza

### Compressione

- Usare qualità 85% per JPEG
- Ottimizzare con `optimize=True`
- Considerare strumenti come:
  - ImageMagick
  - Squoosh.app (online)
  - Photoshop "Save for Web"

## File da Modificare

### HTML Files
- `index.html` - Immagini home
- `pages/la-casa.html` - Immagini casa
- `pages/la-ristrutturazione.html` - Immagini prima/dopo
- `pages/mobilita.html` - Immagini mobilità
- `pages/scopri-milano.html` - Immagini attrazioni

### CSS Files
- `assets/css/base.css` - Classi hero images

## Monitoraggio

Dopo l'implementazione, monitorare:

1. **LCP (Largest Contentful Paint)**: Dovrebbe migliorare
2. **Dimensioni pagina**: Dovrebbero ridursi
3. **Utilizzo dati**: Ridotto specialmente su mobile

## Risoluzione Problemi

### Immagini non si aggiornano
- Cancellare cache browser
- Verificare percorsi file
- Controllare permessi file

### Qualità immagine scarsa
- Aumentare qualità a 90%
- Verificare dimensioni originali
- Usare algoritmi di resize migliori (LANCZOS)

### Performance non migliora
- Verificare che vengano caricate immagini appropriate
- Controllare dimensioni file generate
- Considerare lazy loading aggiuntivo

## Riferimenti

- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Google: Serve Responsive Images](https://web.dev/serve-responsive-images/)
- [Image Optimization Guide](https://images.guide/)