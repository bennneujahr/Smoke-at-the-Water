---
name: static-site-konsistenz
description: Konsistenzregeln fuer die 7 HTML-Seiten – Nav, Footer, Meta, Performance
---

# Seitenkonsistenz – Smoke at the Water

## Architektur

7 HTML-Seiten ohne Templating. Navigation und Footer sind in jeder Datei dupliziert. Aenderungen an gemeinsamen Elementen muessen in ALLEN Dateien gleichzeitig erfolgen.

### Alle Seiten

```
index.html, speisekarte.html, kontakt.html, events.html,
verleih.html, impressum.html, datenschutz.html
```

## Navigation (identisch auf allen Seiten)

```html
<header class="site-header" id="site-header">
  <nav class="nav" aria-label="Hauptnavigation">
    <a href="index.html" class="nav__logo" aria-label="Smoke at the Water – Zur Startseite">
      <img src="Logos/optimized/logo.png" alt="Smoke at the Water" width="52" height="52">
    </a>
    <ul class="nav__links" id="nav-menu" role="list">
      <li><a href="speisekarte.html">Speisekarte</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="verleih.html">Beach-Rental</a></li>
      <li><a href="kontakt.html">Kontakt</a></li>
    </ul>
    <!-- Hamburger button... -->
  </nav>
</header>
```

### Aktive Seite markieren

Die aktuelle Seite bekommt `class="active" aria-current="page"` auf ihrem Nav-Link. Nur EINE Seite darf aktiv sein. index.html hat KEINEN aktiven Link.

## Footer (identisch auf allen Seiten)

Pruefen:
- Logo-Pfad: `Logos/optimized/logo.png` mit `width="52" height="52" loading="lazy"`
- Adresse: `Smoke at the Water / Am Strand 5a / 19063 Schwerin`
- Social-Links: Instagram + Google Bewertungen (gleiche URLs)
- Legal-Links: Impressum + Datenschutz

## Head-Elemente (auf allen Seiten)

- `<link rel="icon" href="Logos/optimized/logo.png" type="image/png">`
- Google Fonts Preconnect (2 Links)
- `<link rel="stylesheet" href="css/style.css">`
- Geo-Meta-Tags (auf oeffentlichen Seiten)

## Scripts (vor `</body>`, alle Seiten)

```html
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
<script src="js/main.js"></script>
```

## Performance-Regeln

### Bilder

- Alle `<img>` Tags MUESSEN `width` und `height` Attribute haben (verhindert Layout-Shift)
- Alle Bilder unterhalb des Folds: `loading="lazy"`
- Header-Logo: KEIN `loading="lazy"` (above the fold)
- Content-Bilder: `<picture>` mit WebP-Source + JPEG/PNG-Fallback
- Hintergrundbilder (CSS): Nur optimiertes JPEG
- Keine Originalbilder direkt referenzieren – immer `optimized/`-Versionen nutzen
- srcset-Pfade: `%20` statt Leerzeichen

### Preloads

- `index.html`: Hero-Bild vorgeladen mit `<link rel="preload" as="image">`
- Andere Seiten: Kein Preload noetig (page-hero ist CSS-only, kein Bild)

## Konsistenz-Pruefung (Ablauf)

1. Alle 7 HTML-Dateien lesen
2. `<header>` Bloecke extrahieren und vergleichen (ignoriere `class="active"`)
3. `<footer>` Bloecke extrahieren und vergleichen
4. `<link rel="icon">` vergleichen
5. Google Fonts Links vergleichen
6. CSS/JS Einbindung vergleichen
7. Year-Script vergleichen
8. Abweichungen melden mit Dateiname und Zeilennummer
