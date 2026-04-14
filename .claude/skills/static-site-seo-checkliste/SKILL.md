---
name: static-site-seo-checkliste
description: SEO-Checkliste fuer lokale Gastronomie – Meta-Tags, JSON-LD, OG-Tags, lokale SEO-Signale
---

# SEO-Checkliste – Smoke at the Water

## Domain & Hosting

- Domain: `https://smokeatthewater.de`
- Hosting: GitHub Pages
- CNAME-Datei im Root fuer Custom Domain

## Pflicht-Meta-Tags (jede Seite)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Seitentitel] – Smoke at the Water Schwerin</title>
<meta name="description" content="[Unique, 150-160 Zeichen, mit Keywords]">
<link rel="canonical" href="https://smokeatthewater.de/[seite].html">
<link rel="icon" href="Logos/optimized/logo.png" type="image/png">
```

## Open Graph Tags (jede oeffentliche Seite)

```html
<meta property="og:type"        content="website">
<meta property="og:title"       content="[Seitentitel]">
<meta property="og:description" content="[Kurzbeschreibung]">
<meta property="og:url"         content="https://smokeatthewater.de/[seite].html">
<meta property="og:image"       content="https://smokeatthewater.de/[pfad-zum-optimierten-bild]">
```

**OG-Image Regeln:**
- Mindestgroesse: 1200x630px
- Immer absolute URL mit `https://smokeatthewater.de/`
- Auf optimierte Bilder verweisen (nicht Originale)
- URL-Encoding fuer Leerzeichen: `%20`

## Lokale SEO-Tags (jede oeffentliche Seite)

```html
<meta name="geo.region" content="DE-MV">
<meta name="geo.placename" content="Schwerin">
<meta name="geo.position" content="53.602555;11.453974">
<meta name="ICBM" content="53.602555, 11.453974">
```

## JSON-LD Strukturierte Daten

### Restaurant (index.html)

Pflichtfelder: name, description, url, image, servesCuisine, priceRange, address, geo, openingHoursSpecification, telephone, hasMenu, sameAs

**Oeffnungszeiten muessen mit kontakt.html uebereinstimmen!**

### Event (events.html)

Pflichtfelder: name, description, image, startDate, endDate, eventStatus, eventAttendanceMode, location, organizer

**Event-Daten muessen jaehrlich aktualisiert werden!** Aktuell: Sommer 2026.

## NAP-Konsistenz (Name, Address, Phone)

Folgende Daten muessen UEBERALL identisch sein:

- **Name:** Smoke at the Water
- **Adresse:** Am Strand 5a, 19063 Schwerin
- **Telefon:** +491725354796

Pruefen in: index.html (JSON-LD + Footer), kontakt.html (Adressblock + Footer), alle Footers

## Alt-Text Regeln

- Jedes `<img>` MUSS ein `alt`-Attribut haben
- Beschreibend, nicht generisch ("Smoke at the Water Imbiss am Strand" statt "Bild")
- Dekorative Bilder: `alt=""` mit `aria-hidden="true"`
- Keywords natuerlich einbauen, kein Keyword-Stuffing

## Seiten ohne Indexierung

`impressum.html` und `datenschutz.html` haben `<meta name="robots" content="noindex, follow">` – das ist korrekt, diese Seiten sollen nicht in Google erscheinen.

## Pruef-Reihenfolge

1. [ ] Jede Seite hat `<title>`, `<meta description>`, `<link rel="canonical">`
2. [ ] Jede oeffentliche Seite hat OG-Tags (type, title, description, url, image)
3. [ ] OG-Image URLs sind absolute HTTPS-URLs zu optimierten Bildern
4. [ ] Geo-Tags auf allen oeffentlichen Seiten vorhanden
5. [ ] JSON-LD auf index.html und events.html vorhanden und valide
6. [ ] NAP-Daten ueberall konsistent
7. [ ] Alle `<img>` haben sinnvolle Alt-Texte
8. [ ] Event-Daten im JSON-LD sind aktuell (nicht vergangene Saison)
9. [ ] Oeffnungszeiten in JSON-LD stimmen mit kontakt.html ueberein
