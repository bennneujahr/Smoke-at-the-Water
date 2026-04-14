---
name: static-site-bildoptimierung
description: Bild-Pipeline fuer die Smoke at the Water Webseite – Groessen, Formate, Qualitaet, HTML-Einbindung
---

# Bildoptimierung – Smoke at the Water

## Tools

- `sips` (macOS-Bordmittel) – Bilder verkleinern
- `cwebp` (via `brew install webp`) – WebP-Konvertierung

## Groessentabelle

| Verwendungszweck | Zielbreite | Format | Qualitaet |
|---|---|---|---|
| Hero-Hintergrund (CSS background-image) | 1920px | Nur JPEG | sips formatOptions 80 |
| CTA-Hintergrund (CSS background-image) | 1600px | Nur JPEG | sips formatOptions 75 |
| About-/Content-Bild | 1200px | WebP + JPEG | WebP q=75, JPEG q=80 |
| Galerie-Bild (3-Spalten-Grid) | 800px | WebP + JPEG | WebP q=72, JPEG q=78 |
| Poster/Plakat (max-width 600px CSS) | 1200px | WebP + PNG | WebP q=80 (2x fuer Textschaerfe) |
| Banner (Container-Breite) | 1200px | WebP + PNG | WebP q=80 |
| Logo | 104px | WebP + PNG | WebP q=85 (2x Retina von 52x52) |
| Kontakt-Bilder (2-Spalten-Grid) | 900px | WebP + JPEG | WebP q=75, JPEG q=80 |

## Dateinamen-Konvention

- Optimierte Bilder leben in `optimized/`-Unterordnern
- Dateinamen: **lowercase-kebab-case ohne Leerzeichen**
- Beispiel: `Bild Imbiss3.jpeg` wird zu `optimized/bild-imbiss3.jpeg` + `optimized/bild-imbiss3.webp`

## Befehle

```bash
# JPEG verkleinern
sips -Z <breite> "Original.jpeg" --out "optimized/name.jpeg" -s formatOptions <qualitaet>

# PNG verkleinern
sips -Z <breite> "Original.png" --out "optimized/name.png"

# WebP erstellen (aus dem bereits verkleinerten Bild)
cwebp -q <qualitaet> "optimized/name.jpeg" -o "optimized/name.webp"
cwebp -q <qualitaet> "optimized/name.png" -o "optimized/name.webp"
```

## HTML-Einbindung

### Content-Bilder: `<picture>`-Element mit WebP + Fallback

```html
<picture>
  <source srcset="Bilder%20vom%20Imbiss/optimized/name.webp" type="image/webp">
  <img
    src="Bilder vom Imbiss/optimized/name.jpeg"
    alt="Beschreibung"
    loading="lazy"
    width="800"
    height="533"
  >
</picture>
```

### Hintergrundbilder: Nur optimiertes JPEG (kein WebP moeglich in CSS)

```html
style="background-image: url('Bilder vom Imbiss/optimized/name.jpeg')"
```

## KRITISCH: srcset und Leerzeichen

`srcset`-Attribute nutzen Leerzeichen als Trennzeichen. Pfade mit Leerzeichen MUESSEN URL-kodiert werden:

- `src="Bilder vom Imbiss/optimized/name.jpeg"` – funktioniert (src erlaubt Leerzeichen)
- `srcset="Bilder vom Imbiss/optimized/name.webp"` – KAPUTT (Leerzeichen = Trennzeichen)
- `srcset="Bilder%20vom%20Imbiss/optimized/name.webp"` – KORREKT

## Checkliste fuer neue Bilder

1. [ ] Original in den Asset-Ordner gelegt
2. [ ] Mit `sips` auf Zielgroesse verkleinert (siehe Tabelle oben)
3. [ ] Mit `cwebp` nach WebP konvertiert
4. [ ] In HTML als `<picture>` eingebunden (Content) oder als optimiertes JPEG (Hintergrund)
5. [ ] `width` und `height` auf dem `<img>`-Tag gesetzt
6. [ ] `loading="lazy"` gesetzt (ausser Above-the-fold-Bilder wie Hero)
7. [ ] `srcset`-Pfade mit `%20` statt Leerzeichen
8. [ ] OG-Image URL aktualisiert falls noetig
