# The Scalable Leader — Linktree → GHL

Clone of https://the-scalable-leader-linktree.vercel.app
Source of truth: `github.com/teamdigitalgpb/the-scalable-leader-linktree`
(verified byte-for-byte identical to the live Vercel deploy on 2026-08-28)

## Files

| File | Goes where |
|---|---|
| `ghl-paste-1-head.html` | Funnel Settings → Tracking → **Head / Header Tracking Code** |
| `ghl-paste-2-footer.html` | Funnel Settings → Tracking → **Footer / Body Tracking Code** |
| `ghl-paste-3-element.html` | The **Custom HTML/Javascript element** on the page |
| `preview.html` | Local check only. Double-click to open in Chrome. Never paste this into GHL. |

Paste the **entire** contents of each file, comments included.

## Why it is split into three

The GHL Custom HTML/Javascript element injects its content with `innerHTML`.
Per the HTML5 spec, `<script>` tags created that way never execute, and GHL
also strips `<style>` from that element. So CSS and JS have to live in the
tracking-code slots, which accept both as written.

## What was changed from the Vercel original

1. **Everything is scoped under `#tsl-tree`.** The original used a global
   `*{margin:0;padding:0}` reset — pasted raw into GHL that would flatten the
   builder's own elements. Every selector is now prefixed, and all classes
   are renamed `tsl-*` so nothing collides with GHL's own class names.
2. **Icons are inline SVG.** The original loaded 9 files from `/icons/`.
   Relative paths do not resolve inside GHL, so the SVG markup is embedded
   directly. Zero external requests.
3. **The fixed `.background-blur` div was removed.** It relied on `z-index:-1`,
   which sits behind GHL's page background and would have been invisible.
   Its two gradients are now layered onto `#tsl-tree` itself with
   `background-attachment:fixed` — same look, no stacking risk.
4. **The fade-in script waits for the cards.** GHL injects the element after
   the page has loaded, so a plain `DOMContentLoaded` handler would find
   nothing. It now polls for up to 6 seconds, then animates.
5. **Markup bugs from the original were fixed** — card 2 and card 3 had
   `rel="noopener noreferrer"class="card"` with no space, and card 3 carried
   `class="card"` twice.
6. Added `prefers-reduced-motion` handling and `aria-label`s on the social icons.

## Fidelity check (2026-08-28)

Rendered both the live site and this build in headless Chrome at 900px and
420px and compared pixel by pixel:

| Width | Mean abs pixel diff | Vertical drift at last content row |
|---|---|---|
| 900px | 0.59 / 255 | 0px |
| 420px | 0.89 / 255 | 0px |

Residual difference is font antialiasing only. All 6 card/arrow SVG path
strings and all 3 social-icon shapes were diffed against the repo's icon files
and match exactly. All 8 destination hrefs match the live page exactly.

Note: an earlier draft of this build added `line-height`, `font-weight`, and
`font-size` values as guards against GHL's inherited styles. Those values were
NOT in the original CSS and pushed the layout 14px out of alignment. They are
now set to the values the original actually computes to (`normal`, UA-default
weights). Do not reintroduce invented typography values here.

## The one external file

The logo is the only asset still loaded from outside:

```
https://the-scalable-leader-linktree.vercel.app/assets/logo.png
```

It is live and public (verified 200). If the Vercel deploy is ever removed,
upload `logo.png` to the GHL Media Library and replace that one `src` in
`ghl-paste-3-element.html`.

Google Fonts (Cormorant Garamond + Inter) also load externally — same as the
original site.

## Links in the page (all verified 200 on 2026-08-28)

| Card | URL |
|---|---|
| Business & Wealth Consulting | https://www.thescalableleader.net |
| Real Estate Agent Course | https://grow.thescalableleader.net/ |
| Books & Journals | https://theleadersjournal.vercel.app/ |
| Book a Strategy Call | https://api.leadconnectorhq.com/widget/booking/7sKRegEZuhTSQhKlX7Ri |
| Contact Us | https://grow.thescalableleader.net/contactpage |
| YouTube | https://www.youtube.com/@thebanksteamchannel/ |
| Instagram | https://www.instagram.com/thebanksteamadvisors/ |
| Email | support@thescalableleader.net |

## After pasting — test this

1. Open the published page on desktop. Cards should fade in one after another.
2. Hover a card: gold border, warm gradient, arrow slides right.
3. Open it on your phone. Headline drops to 2.2rem, cards tighten to 18px padding.
4. Click all five cards and all three social icons — each opens in a new tab.
