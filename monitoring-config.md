# Monitoring Performance Configuration

## 1. Google Analytics 4
```html
<!-- Aggiungere nel <head> di ogni pagina -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 2. Google Search Console
- Verificare proprietà: https://search.google.com/search-console
- Caricare sitemap.xml
- Monitorare performance di ricerca

## 3. Uptime Monitoring (UptimeRobot)
```
Service: UptimeRobot
URL: https://secretcourtyardmilano.com
Check Interval: 1 minute
Notifications: Email, Slack, Telegram
```

## 4. Performance Monitoring (WebPageTest)
```
API Key: [da configurare]
Test Locations: Milan, Frankfurt, London
Test Frequency: Daily
Metrics: Core Web Vitals, Speed Index, Time to First Byte
```

## 5. Error Tracking (Sentry)
```javascript
// Inizializzazione Sentry
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://your-dsn@sentry.io/your-project",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## 6. Real User Monitoring (RUM)
```javascript
// Boomerang.js per RUM
<script src="https://cdn.jsdelivr.net/npm/boomerangjs@1.0.0/boomerang.min.js"></script>
<script>
  BOOMR.init({
    beacon_url: "/rum-beacon",
    log: null
  });
</script>
```

## 7. Synthetic Monitoring (Checkly)
```
Checks:
  - Homepage Load Test (every 5 minutes)
  - Form Submission Test (every 15 minutes)
  - API Endpoint Test (every 10 minutes)
Alert Channels: Email, Slack, PagerDuty
```

## 8. Security Monitoring (SecurityHeaders.com)
```
Monitor Headers:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
Frequency: Weekly scan
```

## 9. SEO Monitoring (Screaming Frog)
```
Crawl Frequency: Weekly
Monitor:
  - Broken links
  - Missing meta tags
  - Duplicate content
  - Page speed issues
```

## 10. Custom Monitoring Script
```bash
#!/bin/bash
# monitoring-script.sh
# Esegui test giornalieri

# Test uptime
curl -I https://secretcourtyardmilano.com

# Test performance
lighthouse https://secretcourtyardmilano.com --output=json --output-path=report.json

# Test accessibility
pa11y https://secretcourtyardmilano.com

# Invia report
python send-monitoring-report.py
```

## 11. Dashboard Configuration
```
Tools raccomandati:
  - Grafana per visualizzazione
  - Prometheus per metriche
  - Alertmanager per notifiche

Metriche da monitorare:
  - Uptime: >99.9%
  - LCP: <2.5s
  - FID: <100ms
  - CLS: <0.1
  - TTFB: <800ms
```

## 12. Alert Configuration
```
Soglie di allerta:
  - Uptime < 99% per 5 minuti: CRITICAL
  - LCP > 4s: WARNING
  - FID > 300ms: WARNING
  - Error rate > 1%: CRITICAL
  - Response time > 3s: WARNING
```

## Setup Instructions

1. **Google Analytics 4**
   - Creare proprietà GA4
   - Ottenere ID misurazione
   - Configurare eventi personalizzati

2. **UptimeRobot**
   - Creare account gratuito
   - Aggiungere monitor per URL
   - Configurare notifiche

3. **WebPageTest**
   - Ottenere API key
   - Configurare test pianificati
   - Impostare soglie performance

4. **Checkly**
   - Creare account
   - Configurare browser checks
   - Impostare alert channels

5. **Dashboard**
   - Installare Grafana + Prometheus
   - Configurare datasource
   - Creare dashboard con metriche chiave
```

## File di Configurazione Pronti

Vedi directory `monitoring/` per:
- `docker-compose.yml` - Stack monitoring locale
- `prometheus.yml` - Configurazione Prometheus
- `grafana-dashboard.json` - Dashboard preconfigurata
- `alerts.yml` - Regole di allerta
```