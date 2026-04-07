# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Static website for **Smoke at the Water** – a beach food stall (Strandimbiss) at Zippendorfer Strand in Schwerin, Germany. Domain: `https://smokeatthewater.de`. Hosted on GitHub Pages. No build step, no framework, no package manager.

## How to preview

Open any HTML file directly in a browser – no local server needed:

```
open index.html
```

For a local server (useful to avoid CORS issues with the Google Maps iframe):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Deployment

Hosted on **GitHub Pages** (kostenlos, kein Build-Limit).

- Repository: `bennneujahr/Smoke-at-the-Water`
- Custom Domain: `smokeatthewater.de` (via `CNAME`-Datei im Root)
- Deploy: automatisch bei jedem `git push` auf `main`
- DNS: A-Record bei STRATO → `185.199.108.153`

Ein einfaches `git push` genügt – kein Build-Schritt, kein Dashboard.

## Architecture

**One shared CSS file, one shared JS file, seven HTML pages – no templating.**

Navigation and footer HTML are duplicated across all pages (static site, no includes).

Current navigation order: **Speisekarte · Events · Beach-Rental · Kontakt**

```
css/style.css     – All styles (Custom Properties → Reset → Layout → Components → Pages)
js/main.js        – Three IIFEs: initNav, initScrollReveal, initLightbox
index.html        – Hero, Über uns, Event-Banner-CTA, Galerie, CTA-Banner
speisekarte.html  – 4 clickable menu cards (lightbox)
kontakt.html      – Opening hours table, Google Maps iframe, social links
events.html       – Events 2026: plain blue hero, Herrentag event-card, poster, CTA
verleih.html      – SUP & Strandliegen: plain blue hero, poster, info-cards, CTA
impressum.html    – Legal (vollständig ausgefüllt)
datenschutz.html  – GDPR text (vollständig ausgefüllt)
```

Assets live in German-named folders at the root – paths with spaces work fine in HTML `src`/`href` attributes, but **must be quoted in CSS `url()`**:
`background-image: url('Bilder vom Imbiss/Bild.jpeg')` ✓ — unquoted breaks CSS parsing.

- `Logos/` – `Logo.png`, `Logo_Schriftzug.png`
- `Bilder vom Imbiss/` – `Bild Imbiss.jpeg` … `Bild Imbiss14.jpeg`, `Plakat DJ-Abende.png`, `Plakat Beach-Rental.png`, `Banner Website.png`
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

### Page hero variants

- `class="page-hero"` – plain dark-blue bar (default for all inner pages)
- `class="page-hero page-hero--img"` + inline `style="background-image: url('...')"` – photographic hero with dark overlay via `::before`

### Key reusable components

| Class | Description | Used on |
|---|---|---|
| `.event-card` | 2-column grid (date badge + info). Date badge uses `--color-amber`. Collapses to 1 col on ≤600px. | `events.html` |
| `.event-card__date` | Amber badge with `.event-card__day` (Pacifico, 3rem) and `.event-card__month` | inside `.event-card` |
| `.banner-cta-wrap` | Flex column: image on top, 2-button bar below. Image gets top radius, buttons get bottom radius. | `index.html` |
| `.banner-cta-buttons` | 2-column grid of full-width buttons (amber + blue). Collapses to 1 col on ≤480px. | inside `.banner-cta-wrap` |
| `.content-centered` | Centers text, adds spacing below h2 and limits p to 60ch. | `events.html`, `verleih.html` |
| `.info-cards` | 2-column CSS Grid (collapses to 1 col on ≤600px). Each child is `.info-card`. | `verleih.html` |
| `.event-img` | Full-width image capped at 600px, rounded corners, centered. | `events.html`, `verleih.html` |

## JS conventions

`main.js` uses plain ES5-compatible IIFEs (`var`, `function`), no modules, no transpiler. Keep new code in the same style. Each IIFE exits early if its required DOM element is missing.

The lightbox (`#lightbox`) is triggered by any element with class `.gallery-item` or `.menu-card` – clicking reads the first `<img>` inside the element.

Scroll-reveal animations use class `.reveal` (invisible by default). JS adds `.is-visible` when the element enters the viewport. Staggered delays: `.reveal-delay-1`, `.reveal-delay-2`, `.reveal-delay-3`.

## When adding a new page

1. Copy the `<header>` and `<footer>` blocks from any existing page.
2. Add `class="active" aria-current="page"` to the matching nav link.
3. Use `class="page-hero"` for a plain blue hero, or add `.page-hero--img` + inline `background-image` for a photo hero.
4. Add geo meta tags, canonical link, and (for main content pages) JSON-LD structured data – see `index.html` as reference.
5. Include `<div id="lightbox" …>` before `</body>` only if the page uses `.gallery-item` or `.menu-card` triggers.
6. Link `css/style.css` and `js/main.js` from the root (not a subfolder).

## Open TODO items

- **Alle Seiten** – `og:url` noch auf `https://smokeatthewater.de/PAGE.html` setzen (aktuell nicht gesetzt)
- **index.html JSON-LD** – `"telephone"` Feld mit echter Telefonnummer ergänzen
- **events.html JSON-LD** – Event-Daten jährlich aktualisieren (aktuell: Sommer 2025)
