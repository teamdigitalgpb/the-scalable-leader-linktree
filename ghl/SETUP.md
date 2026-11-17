# The Scalable Leader — Linktree in GHL (v2)

Built 2026-11-17 from this repo's site files (`index.html`, `strategy-call.html`, `css/style.css`),
which applies JC's blueprint answers of 2026-11-06. The August clone is kept in `archive-2026-08-original-clone/`.

Funnel: **LINKTREE Classic** on `grow.thescalableleader.net`.

## Files

| File | Goes where |
|---|---|
| `ghl-paste-1-head.html` | Funnel Settings → Tracking → **Head Tracking Code** (replaces the August CSS; covers both steps) |
| *(none)* | Funnel Settings → Tracking → **Footer / Body Tracking Code**: **clear it**. The August fade-in script is no longer needed; v2 animates with CSS only |
| `ghl-paste-2-element-linktree.html` | Custom HTML/Javascript element on step **`/linktree`** |
| `ghl-paste-2-element-strategy-call.html` | Custom HTML/Javascript element on a **new step `/strategy-call`** (path verified free on grow, 2026-11-17) |
| `preview-linktree.html`, `preview-strategy-call.html` | Local check only, inside a simulated GHL page. Never paste |

Paste each file whole, comments included.

## What changed from the repo version

- Everything scoped under `#tsl-tree`; classes renamed `tsl-*` so GHL's own classes can't collide.
- Guards against GHL's inherited fonts, line-heights, colours and link underlines.
- Full-bleed: `#tsl-tree` breaks out of the section/row width, and `body` is set to the page's navy, so any section padding left in GHL shows as the same colour.
- Film grain moved from a fixed `z-index:-1` div to `#tsl-tree::before` (inline SVG data URI).
- Icons inlined as SVG. Only external files: Google Fonts and the logo (`the-scalable-leader-linktree.vercel.app/assets/logo.png`, verified identical to the repo copy). Move the logo to GHL Media Library if that Vercel deploy is ever removed.
- Internal links: Strategy Call card → `/strategy-call`; "All links" → `/linktree`.
- **KFTK Inc card left out** (JC: link "TBD"). An HTML comment marks its slot; add it back when the link arrives.
- Unused Request Access form styles dropped (Business Software now goes to `app.thescalableleader.net/intake`).

## Verification (2026-11-17)

Headless Chrome, repo original vs. GHL build inside a simulated GHL page (default margins, padded section,
hostile `p`/`h2`/`a` styles), at 420px and 900px:

| Page | Mean abs pixel diff (top 1200px) |
|---|---|
| Strategy Call | 0.46 / 0.44 of 255 |
| Linktree | 2.07 / 1.32 of 255: the missing KFTK card shifts everything below it; above it identical |

All 11 destination links returned 200 on 2026-11-17.

Published GHL pages can't be screenshotted headless (times out). After publishing, check is structural
(fetch served HTML, grep `#tsl-tree`, hrefs) plus a visual check by the user on phone and desktop.

## Regenerate

After any change to the site files, rebuild from the repo root:
`python3 ghl/build_ghl.py . ghl`
