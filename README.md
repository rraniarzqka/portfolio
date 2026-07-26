# Rania Rizqika — Portfolio

A hand-built, static portfolio site for Rania Rizqika (digital marketer).
No framework and no build step — vanilla HTML, one CSS file, and one JS
file. A playful, retro-inspired candy design system with a warm cream base,
rounded borders, hard offset shadows, and Fredoka + Space Mono type.

## Structure

- `index.html` — homepage (hero, brand marquee, "What I do", Featured Work
  carousel, About, Contact).
- `work/*.html` — six case studies: `prenagen`, `morinaga`, `ascott`
  (The Ascott Limited), `taman-safari`, `havara`, `boleh-belajar`. Each
  carries a per-page candy theme class (`c-purple`, `c-chartreuse`, …).
- `assets/css/style.css` — the single stylesheet for every page.
- `assets/js/main.js` — the single script (one IIFE): sticky nav, mobile
  menu, scroll reveals, metric count-ups, and the auto-slide carousel.
- `assets/img/` — images, plus the CV and certification PDFs.

## Local preview

There's no build. Open `index.html` in a browser, or serve the folder with
any static server, e.g.:

```bash
python3 -m http.server 4173
# then visit http://localhost:4173
```

### CSS cache-busting

Every HTML file links the stylesheet with a version query
(`style.css?v=N`). After editing `style.css`, bump `N` in all HTML files so
browsers don't serve a stale cache:

```bash
for f in index.html work/*.html; do
  sed -i '' 's|style.css?v=OLD|style.css?v=NEW|' "$f"
done
```

## Deployment

Deployed on Netlify from this repository as a plain static site (no build
command; publish directory is the repo root). Pushes to `main` trigger an
automatic redeploy.
