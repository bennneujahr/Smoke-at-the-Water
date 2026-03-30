# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Static website for **Smoke at the Water** – a beach food stall (Strandimbiss) at Zippendorfer Strand in Schwerin, Germany. Deployed on Netlify. No build step, no framework, no package manager.

## How to preview

Open any HTML file directly in a browser – no local server needed:

```
open index.html
open speisekarte.html
```

For a local server (useful to avoid CORS issues with the Google Maps iframe):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Deployment

Push to the connected Git repository. Netlify auto-deploys from the root (`publish = "."`).

## Architecture

**One shared CSS file, one shared JS file, seven HTML pages – no templating.**

Navigation and footer HTML are duplicated across all pages (static site, no includes).

```
css/style.css     – All styles (Custom Properties → Reset → Layout → Components → Pages)
js/main.js        – Three IIFEs: initNav, initScrollReveal, initLightbox
index.html        – Startseite: hero, über uns, galerie (6 Bilder), CTA-Banner
speisekarte.html  – 4 clickable menu cards (lightbox)
kontakt.html      – Opening hours table, Google Maps iframe, social links
events.html       – DJ Abende: page-hero with image, poster, CTA
verleih.html      – SUP & Strandliegen: page-hero with image, poster, info cards, CTA
impressum.html    – Legal (placeholders still to fill in)
datenschutz.html  – GDPR text (placeholders still to fill in)
```

Assets live in German-named folders at the root – paths with spaces work fine in HTML `src`/`href` attributes, but **must be quoted in CSS `url()`**:
`background-image: url('Bilder vom Imbiss/Bild.jpeg')` ✓ — unquoted breaks CSS parsing.


- `Logos/` – `Logo.png`, `Logo_Schriftzug.png`
- `Bilder vom Imbiss/` – `Bild Imbiss.jpeg` … `Bild Imbiss14.jpeg`, `Plakat DJ-Abende.png`, `Plakat Beach-Rental.png`, `Banner Webseite.png`
- `Preis- und Speisekarten/` – `Speisekarte Stammsortiment.png`, `Speisekarte Pizza.png`, `Preisliste Aushang_1.jpeg`, `Preisliste Aushang_2.jpeg`

## CSS conventions

All design tokens are CSS Custom Properties in `:root` at the top of `style.css`:

| Token group | Examples |
|---|---|
| Colors | `--color-sand`, `--color-blue`, `--color-amber`, `--color-white`, `--color-muted` |
| Spacing | `--space-xs` … `--space-xl` |
| Z-index | `--z-content: 10`, `--z-nav: 30`, `--z-lightbox: 50` |
| Transitions | `--t-fast: 150ms`, `--t-base: 200ms`, `--t-slow: 300ms` |
| Radii | `--r-sm` … `--r-xl` |

Never hardcode color hex values or spacing px values in new rules – always use the tokens.

Sections in `style.css` are numbered and labelled (1. Custom Properties, 2. Reset, … 16. Reduced Motion). Add new component styles before section 14 (Lightbox) – that is the designated insertion zone for new components.

### Page hero with background image

Inner pages that need a photographic hero (not just a solid blue bar) use the modifier class `.page-hero--img` together with an inline `style="background-image: url('...')"`:

```html
<section
  class="page-hero page-hero--img"
  style="background-image: url('Bilder vom Imbiss/Plakat DJ-Abende.png')"
  aria-label="Seitentitel"
>
  <div class="page-hero__inner">
    <h1>Seitentitel</h1>
    <p>Untertitel</p>
  </div>
</section>
```

The `::before` pseudo-element on `.page-hero--img` applies a dark blue gradient overlay for text legibility.

### Info cards (two-column layout)

`.info-cards` is a 2-column CSS Grid (collapses to 1 column on ≤600 px). Each child is an `.info-card` with sand background and rounded corners. Used on `verleih.html`.

### Centered poster image

`.event-img` renders a full-width image capped at 600 px with `border-radius: var(--r-xl)` and centered via `margin-inline: auto`. Used on `events.html` and `verleih.html`.

## JS conventions

`main.js` uses plain ES5-compatible IIFEs (`var`, `function`), no modules, no transpiler. Keep new code in the same style. Each IIFE exits early if its required DOM element is missing.

The lightbox (`#lightbox`) is triggered by any element with class `.gallery-item` or `.menu-card` – clicking reads the first `<img>` inside the element.

Scroll-reveal animations use class `.reveal` (invisible by default). JS adds `.is-visible` when the element enters the viewport. Staggered delays: `.reveal-delay-1`, `.reveal-delay-2`, `.reveal-delay-3`.

## When adding a new page

1. Copy the `<header>` block and `<footer>` block from any existing page.
2. Add `class="active" aria-current="page"` to the matching nav link.
3. Use `class="page-hero"` for a plain blue hero, or `class="page-hero page-hero--img"` + inline `background-image` for a photographic hero.
4. Include `<div id="lightbox" …>` before `</body>` only if the page uses `.gallery-item` or `.menu-card` triggers.
5. Link `css/style.css` and `js/main.js` from the root (not a subfolder).

## Open TODO items

These need real values before going live:

- **Alle Seiten** – `og:url` auf allen Seiten noch auf `https://smokeatthewater.de/PAGE.html` setzen (aktuell noch nicht gesetzt)
- **impressum.html** – alle `[...]` Felder (Name, Adresse, Telefon, E-Mail, USt-IdNr.)
- **datenschutz.html** – alle `[...]` Felder
- **index.html JSON-LD** – `"telephone"` Feld mit echter Telefonnummer ergänzen wenn vorhanden
