"""Build the GHL 2-piece split (head CSS + element HTML) from the linktree repo."""
import re, sys, urllib.parse
from pathlib import Path

REPO = Path(sys.argv[1])
OUT = Path(sys.argv[2])
LOGO = "https://the-scalable-leader-linktree.vercel.app/assets/logo.png"
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">')

CLASSES = """container hero logo-circle subtitle ornament statement setup punch links card featured
icon-box content arrow badge section-title social social-icons quote quote-mark signature back-link
hero-text page-lede page fit-grid fit-card yes no flow flow-num price-card price-label price price-note
submit-btn cta-btn price-fine page-alt""".split()
CLS_RE = re.compile(r"\.(" + "|".join(sorted(map(re.escape, CLASSES), key=len, reverse=True)) + r")(?![\w-])")

# ---------- CSS ----------
css = (REPO / "css/style.css").read_text()
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
# drop the unused Request Access form rules (block between its header and the Strategy Call header)
css = re.sub(r"\.access-form,\.form-success\{.*?\.form-success \.back-link\{margin:0\}", "", css, flags=re.S)
css = re.sub(r"\s*\.access-form,\.form-success\{padding:22px\}", "", css)
css = re.sub(r"\s*\.field-row\{grid-template-columns:1fr\}", "", css)
css = re.sub(r"\.background-blur\{.*?\}", "", css, flags=re.S)
css = css.replace("@keyframes rise", "@keyframes tsl-rise").replace("animation:rise ", "animation:tsl-rise ")
css = css.replace(".icon-box img", ".icon-box svg").replace(".social-icons img", ".social-icons svg")
css = css.replace(".logo-circle img", ".logo-circle img")


def scope_sel(sel):
    sel = sel.strip()
    if sel == ":root" or sel == "body":
        return "#tsl-tree"
    if sel == "*":
        return "#tsl-tree,#tsl-tree *"
    if sel == "html":
        return None
    sel = CLS_RE.sub(lambda m: ".tsl-" + m.group(1), sel)
    return "#tsl-tree " + sel


def scope(block):
    out = []
    i = 0
    while i < len(block):
        j = block.find("{", i)
        if j < 0:
            break
        head = block[i:j].strip()
        if head.startswith("@media"):
            depth, k = 1, j + 1
            while depth:
                depth += {"{": 1, "}": -1}.get(block[k], 0); k += 1
            out.append(head + "{" + scope(block[j + 1:k - 1]) + "}")
            i = k; continue
        k = block.find("}", j)
        body = block[j + 1:k].strip()
        if head.startswith("@keyframes"):
            k2 = block.find("}}", j) + 2
            out.append(block[i:k2].strip()); i = k2; continue
        sels = [s for s in (scope_sel(x) for x in head.split(",")) if s]
        if sels:
            out.append(",".join(sels) + "{" + body + "}")
        i = k + 1
    return "\n".join(out)

scoped = scope(css)
noise = (REPO / "assets/noise-texture.svg").read_text().strip()
noise_uri = "data:image/svg+xml," + urllib.parse.quote(noise, safe="=:/ ")
guards = f"""
/* GHL guards: full-bleed canvas, keep GHL's inherited styles out */
body{{background-color:#0A1420;overflow-x:hidden}}
#tsl-tree{{line-height:normal;text-align:left;font-size:16px;font-style:normal}}
#tsl-tree *{{font-family:inherit;line-height:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;font-weight:inherit;font-style:inherit;text-decoration:none}}
#tsl-tree .tsl-page-alt a{{text-decoration:underline}}
#tsl-tree h1,#tsl-tree h2,#tsl-tree h3,#tsl-tree h4,#tsl-tree p,#tsl-tree blockquote{{font-size:inherit}}
/* film grain (was .background-blur) */
#tsl-tree::before{{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:url("{noise_uri}");opacity:.55;mix-blend-mode:overlay}}
#tsl-tree .tsl-container{{position:relative;z-index:1}}
"""
# guards must sit BEFORE the scoped rules so the real values win on equal-or-higher specificity
after = "/* full-bleed: break out of GHL section/row padding (after the reset so margin survives) */\n#tsl-tree{position:relative;isolation:isolate;width:100vw;left:50%;margin-left:-50vw}"

head = f"""<!-- ============================================================
     THE SCALABLE LEADER — LINKTREE (v2, JC-approved Nov 2026)
     PASTE 1  →  Funnel Settings → Tracking → HEAD TRACKING CODE
     Fonts + all CSS for BOTH steps (Linktree and Strategy Call).
     Everything is scoped under #tsl-tree.
     Built from repo the-scalable-leader-linktree, css/style.css.
     ============================================================ -->

{FONTS}

<style>
{guards}
{scoped}
{after}
</style>
"""

# ---------- HTML ----------
def icon(name, premium=False):
    svg = (REPO / f"icons/{name}.svg").read_text().strip()
    svg = re.sub(r'\s(width|height)="64"', "", svg)
    svg = svg.replace("<svg ", '<svg aria-hidden="true" focusable="false" ', 1)
    return re.sub(r">\s+<", "><", svg)


def convert(html, page):
    body = re.search(r'<div class="container">(.*)</div>\s*</body>', html, re.S).group(1)
    body = re.sub(r'<img src="icons/([\w-]+)\.svg" alt="">', lambda m: icon(m.group(1)), body)
    body = body.replace('src="assets/logo.png"', f'src="{LOGO}"')
    body = body.replace('href="strategy-call.html"', 'href="/strategy-call"')
    body = body.replace('href="index.html"', 'href="/linktree"')
    # KFTK has no link yet (JC: "TBD"): keep it out of the live page
    body = re.sub(r'(\s*)<a href="https://REPLACE-WITH-KFTK-INC-LINK".*?</a>',
                  lambda m: m.group(1) + "<!-- KFTK INC card: add back when JC sends the link (JC answer: TBD) -->", body, flags=re.S)
    def cls(m):
        names = " ".join(("tsl-" + c) if c in CLASSES else c for c in m.group(1).split())
        return f'class="{names}"'
    body = re.sub(r'class="([^"]+)"', cls, body)
    assert "REPLACE-WITH" not in body and 'src="icons' not in body and "assets/" not in body.replace(LOGO, "")
    return f'<div id="tsl-tree">\n<div class="tsl-container">{body}</div>\n</div>\n'

pages = {
    "linktree": ((REPO / "index.html").read_text(), "/linktree"),
    "strategy-call": ((REPO / "strategy-call.html").read_text(), "/strategy-call"),
}
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "ghl-paste-1-head.html").write_text(head)
for n, (src, path) in pages.items():
    el = convert(src, n)
    hdr = f"""<!-- ============================================================
     THE SCALABLE LEADER — {n.upper()} step  (path: {path})
     PASTE INTO  →  the Custom HTML/Javascript ELEMENT on this step
     Body markup only. No <style>, no <script>.
     ============================================================ -->

"""
    (OUT / f"ghl-paste-2-element-{n}.html").write_text(hdr + el)
    prev = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PREVIEW ONLY — {n}</title>
<!-- simulates a GHL page: default margins + a padded section wrapper -->
<style>body{{margin:8px;font-family:Georgia;line-height:1.7;color:#333}} .ghl-section{{padding:20px 15px;max-width:1170px;margin:0 auto}} p{{margin:0 0 1em}} h2{{font-family:Arial;font-weight:700}} a{{color:#188bf6}}</style>
{head}</head><body><div class="ghl-section">{el}</div></body></html>"""
    (OUT / f"preview-{n}.html").write_text(prev)
print("ok", [p.name for p in OUT.iterdir()])
