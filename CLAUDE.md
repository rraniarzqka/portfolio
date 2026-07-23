# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A hand-written, **static portfolio site** for Rania Rizqika (digital marketer). No framework, no build step, no `package.json`, no tests, no linter. Just vanilla HTML, one CSS file, and one JS file. Edits are made directly to the source files.

- `index.html` — homepage (hero, brand marquee, "What I do", Featured Work carousel, About, Contact).
- `work/*.html` — six case-study pages: `prenagen`, `morinaga`, `ascott` (The Ascott Limited), `taman-safari`, `havara`, `boleh-belajar`.
- `assets/css/style.css` — the **single** stylesheet for every page (~1600 lines).
- `assets/js/main.js` — the **single** script for every page (one IIFE).
- `assets/img/` — all images, referenced with relative paths (`../assets/img/...` from `work/`).

## Preview workflow (important, non-obvious)

The dev server in `.claude/launch.json` (the `portfolio` config) does **not** serve this repo directly. macOS TCC blocks the server process from reading `~/Documents`, so it serves an rsync mirror at `/Users/raniarizqika/.cache/portfolio-preview` instead.

**After every edit, sync the mirror before the preview reflects the change:**

```bash
rsync -a --delete --exclude '.git' ./ /Users/raniarizqika/.cache/portfolio-preview/
```

The site is opened via the Browser preview tools using the `portfolio` launch config (serves `http://localhost:4173`). There is nothing to compile or install.

## CSS cache-busting (do not forget)

Every HTML file links the stylesheet with a version query: `style.css?v=N`. Browsers cache aggressively, so **after any change to `style.css`, bump `N` in all HTML files** or the change won't show:

```bash
for f in index.html work/*.html; do sed -i '' 's|style.css?v=OLD|style.css?v=NEW|' "$f"; done
```

Keep the token identical across all files. (`.claude/launch.json` and `.claude/settings.local.json` are gitignored — machine-specific.)

## Architecture

**Design system lives entirely in `style.css`.** Tokens are CSS custom properties in `:root` — evergreen `#12382B`, cream `#FAF6EE`, periwinkle/`--peri`, butter `#F8DC6E`, plus `--line`, `--ink-soft`, radii, and shadows. Fonts: Manrope (display, weights 700/800) + Instrument Sans (body), loaded from Google Fonts. Prefer these tokens over raw hex values.

**Case-study pages share one component vocabulary** (same classes, same CSS, per-page content):
- `.case-hero` — evergreen rounded hero panel with `.headline-metric` + `.case-meta` (Role/Timeframe/Scope).
- `.snapshot` / `.snap-card` — three-card Challenge/Strategy/Outcome strip.
- `.case-funnel` / `.case-stage` — the numbered "The Approach" steps. Number-badge colors are keyed by position via `.case-stage:nth-child(n) .num` (only 1–4 are defined).
- `.showcase-grid` / `.show-card` — "Work Showcase" cards (thumbnail image, `.show-type` badge, `.show-contrib`, external `.show-cta ↗`).
- `.highlight-grid` / `.highlight` — "Execution Highlights" (emoji icon + heading + copy).
- `.result-grid` / `.result-cell` — final metric tiles.
- `.case-next` / `.case-next-panel` — the clickable "Next Case Study" transition. The `href`s form a **cycle** through all six pages (ascott → prenagen → havara → morinaga → taman-safari → boleh-belajar → ascott); keep it intact when reordering.

**`main.js` is one IIFE** wiring behavior by hook, and respects `prefers-reduced-motion` throughout:
- Sticky-nav border toggle; mobile menu (`#navToggle` / `#navLinks`).
- Scroll reveals: elements with class `.reveal` get `.in` via IntersectionObserver (add `.reveal` to opt in; `.d1`–`.d4` stagger delays).
- Metric count-up: spans with `data-count` (plus optional `data-decimals`, `data-prefix`, `data-suffix`) animate on scroll.
- Featured Work carousel (`#metricsCarousel` / `#carTrack` / `#carDots`): auto-slides every 5s, pauses on hover/focus/tab-hidden, supports arrows, dots, and touch swipe. Dots are generated from the slide count — no per-slide dot markup needed.

## Conventions

- **Copy is treated as final/approved.** Change wording only when a task explicitly asks for it; UI/design tasks must leave headings, body, metrics, labels, and CTAs byte-identical.
- External links open in a new tab (`target="_blank" rel="noopener"`); the case-study CTA arrow convention is a trailing `↗`.
- Client-CDN images block `curl` without a full browser header set; new images are typically saved locally into `assets/img/` rather than hot-linked.
- Screenshots of below-the-fold content in the Browser preview intermittently render blank; verify layout via DOM measurement (element geometry, `getComputedStyle`) as the reliable signal.
