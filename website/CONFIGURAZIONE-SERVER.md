# Configurazione Server - Secret Courtyard Milano

## Panoramica

Questa documentazione descrive come configurare il server per ottimizzare le performance, sicurezza e SEO del sito Secret Courtyard Milano.

## File di Configurazione

### 1. `.htaccess` (Apache)
Posizione: `/website/.htaccess`

**Funzionalità abilitate:**
- ✅ Compressione GZIP per file testuali
- ✅ Headers di sicurezza (CSP, XSS, Clickjacking)
- ✅ Cache control ottimizzato
- ✅ Rewrite rules per URL puliti
- ✅ Protezione file sensibili
- ✅ Configurazione MIME types

**Utilizzo:** Copiare nella root del sito su server Apache.

### 2. `nginx-config.conf` (Nginx)
Posizione: `/website/nginx-config.conf`

**Funzionalità abilitate:**
- ✅ Compressione GZIP e Brotli (commentata)
- ✅ Headers di sicurezza
- ✅ Cache control per tipo di file
- ✅ Rewrite rules
- ✅ Ottimizzazioni performance

**Utilizzo:** Copiare in `/etc/nginx/sites-available/` e creare symlink in `sites-enabled/`.

## Compressione GZIP Attivata

### File compressi:
- HTML, CSS, JavaScript
- XML, JSON
- Fonts (TTF, OTF, WOFF, WOFF2)
- SVG, ICO

### Configurazione Apache (mod_deflate):
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript
    AddOutputFilterByType DEFLATE application/javascript application/json application/xml
    AddOutputFilterByType DEFLATE application/x-font application/x-font-truetype
    AddOutputFilterByType DEFLATE font/opentype font/ttf font/otf image/svg+xml
</IfModule>
```

### Configurazione Nginx:
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript application/javascript
           application/xml application/json image/svg+xml font/ttf font/otf
           font/woff font/woff2;
gzip_comp_level 6;
```

## Cache Control Ottimizzato

### Durate cache:
- **Immagini, Fonts, CSS, JS:** 1 anno (`immutable`)
- **HTML:** 1 giorno (`must-revalidate`)
- **Default:** 1 ora

### Headers impostati:
```http
Cache-Control: public, max-age=31536000, immutable  # Per file statici
Cache-Control: public, max-age=86400, must-revalidate  # Per HTML
```

## Headers di Sicurezza

### Implementati:
1. **X-Frame-Options:** `SAMEORIGIN` (previene clickjacking)
2. **X-XSS-Protection:** `1; mode=block` (protezione XSS)
3. **X-Content-Type-Options:** `nosniff` (previene MIME sniffing)
4. **Referrer-Policy:** `strict-origin-when-cross-origin`
5. **Content-Security-Policy:** Policy base con whitelist

### CSP (Content Security Policy):
Permette risorse solo da:
- Sito stesso (`self`)
- Google Maps/APIs
- Google Fonts
- Immagini da qualsiasi fonte HTTPS

## URL Rewrite Rules

### Regole implementate:
1. **Rimozione `.html`:** `pagine/la-casa.html` → `pagine/la-casa`
2. **Rimozione slash finale:** `pagine/la-casa/` → `pagine/la-casa`
3. **Redirect `index.html`:** `index.html` → `/`

## Protezione File

### File bloccati:
- File di configurazione: `.htaccess`, `.env`, `.git`
- File di log: `.log`, `.sql`
- File di sistema: `.ini`, `.sh`

## Deployment Steps

### Per Apache:
1. Copiare `.htaccess` nella root del sito
2. Verificare che `mod_deflate`, `mod_headers`, `mod_rewrite` siano abilitati
3. Riavviare Apache: `sudo systemctl restart apache2`

### Per Nginx:
1. Copiare `nginx-config.conf` in `/etc/nginx/sites-available/secretcourtyardmilano`
2. Creare symlink: `sudo ln -s /etc/nginx/sites-available/secretcourtyardmilano /etc/nginx/sites-enabled/`
3. Test configurazione: `sudo nginx -t`
4. Riavviare Nginx: `sudo systemctl restart nginx`

### Per Hosting Condiviso (cPanel, etc.):
1. Caricare `.htaccess` nella root pubblica
2. Verificare supporto GZIP nel pannello di controllo
3. Controllare che le rewrite rules funzionino

## Verifica Configurazione

### Test GZIP:
```bash
curl -H "Accept-Encoding: gzip" -I https://secretcourtyardmilano.com/
# Cercare: Content-Encoding: gzip
```

### Test Headers di Sicurezza:
```bash
curl -I https://secretcourtyardmilano.com/
# Verificare presenza di X-Frame-Options, X-XSS-Protection, etc.
```

### Test Cache:
```bash
curl -I https://secretcourtyardmilano.com/assets/css/base.css
# Verificare: Cache-Control: public, max-age=31536000, immutable
```

## Ottimizzazioni Aggiuntive

### 1. HTTPS (SSL/TLS)
**Raccomandato:** Certificato Let's Encrypt
- Abilitare HSTS (Strict-Transport-Security)
- Redirect HTTP → HTTPS
- Usare TLS 1.2/1.3

### 2. CDN (Cloudflare)
**Vantaggi:**
- Compressione aggiuntiva
- Cache globale
- DDoS protection
- SSL gratuito

### 3. Brotli Compression
**Se supportato:** Compressione ~20% migliore di GZIP
- Nginx: modulo `ngx_brotli`
- Apache: modulo `mod_brotli`

### 4. HTTP/2 o HTTP/3
**Performance migliorate:**
- Multiplexing
- Header compression
- Server push (HTTP/2)

## Risoluzione Problemi

### GZIP non funziona:
1. Verificare che il modulo sia abilitato
2. Controllare error log del server
3. Testare con `curl -H "Accept-Encoding: gzip" -I`

### Rewrite rules non funzionano:
1. Verificare che `mod_rewrite` sia abilitato (Apache)
2. Controllare sintassi `.htaccess`
3. Verificare permessi file

### Headers non presenti:
1. Verificare che `mod_headers` sia abilitato (Apache)
2. Controllare sintassi
3. Verificare conflitti con altre configurazioni

## Monitoraggio

### Metriche da monitorare:
1. **Performance:** PageSpeed Insights, Lighthouse
2. **Security:** SecurityHeaders.com
3. **SEO:** Google Search Console
4. **Uptime:** Monitoraggio server

### Strumenti consigliati:
- **Google Lighthouse:** Test performance
- **SecurityHeaders.com:** Verifica headers sicurezza
- **GTmetrix:** Analisi performance approfondita
- **Pingdom:** Monitoraggio uptime

## Riferimenti

- [Apache mod_deflate](https://httpd.apache.org/docs/2.4/mod/mod_deflate.html)
- [Nginx Gzip Module](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [Security Headers](https://securityheaders.com/)
- [Mozilla CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)