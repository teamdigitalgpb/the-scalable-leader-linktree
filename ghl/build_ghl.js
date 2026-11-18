/**
 * Build the GHL 2-piece split (head CSS + element HTML) from the linktree repo.
 * Node.js port of build_ghl.py
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(process.argv[2] || '.');
const OUT = path.resolve(process.argv[3] || 'ghl');

const LOGO = "https://the-scalable-leader-linktree.vercel.app/assets/logo.png";
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const CLASSES = `container hero logo-circle subtitle ornament statement setup punch links card featured
icon-box content arrow badge section-title social social-icons quote quote-mark signature back-link
hero-text page-lede page fit-grid fit-card yes no flow flow-num price-card price-label price price-note
submit-btn cta-btn price-fine page-alt`.split(/\s+/);

const CLS_RE = new RegExp(`\\.(${CLASSES.slice().sort((a, b) => b.length - a.length).map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\w-])`, 'g');

// ---------- CSS ----------
let css = fs.readFileSync(path.join(REPO, 'css/style.css'), 'utf8');
css = css.replace(/\/\*[\s\S]*?\*\//g, '');
// drop unused Request Access form rules
css = css.replace(/\.access-form,\.form-success\{[\s\S]*?\.form-success \.back-link\{margin:0\}/g, '');
css = css.replace(/\s*\.access-form,\.form-success\{padding:22px\}/g, '');
css = css.replace(/\s*\.field-row\{grid-template-columns:1fr\}/g, '');
css = css.replace(/\.background-blur\{[\s\S]*?\}/g, '');
css = css.replace(/@keyframes rise/g, '@keyframes tsl-rise').replace(/animation:rise /g, 'animation:tsl-rise ');
css = css.replace(/\.icon-box img/g, '.icon-box svg').replace(/\.social-icons img/g, '.social-icons svg');

function scopeSel(sel) {
    sel = sel.trim();
    if (sel === ':root' || sel === 'body') return '#tsl-tree';
    if (sel === '*') return '#tsl-tree,#tsl-tree *';
    if (sel === 'html') return null;
    sel = sel.replace(CLS_RE, (_, name) => '.tsl-' + name);
    return '#tsl-tree ' + sel;
}

function scope(block) {
    const out = [];
    let i = 0;
    while (i < block.length) {
        const j = block.indexOf('{', i);
        if (j < 0) break;
        const head = block.slice(i, j).trim();
        if (head.startsWith('@media')) {
            let depth = 1;
            let k = j + 1;
            while (depth > 0 && k < block.length) {
                if (block[k] === '{') depth++;
                else if (block[k] === '}') depth--;
                k++;
            }
            out.push(head + '{' + scope(block.slice(j + 1, k - 1)) + '}');
            i = k;
            continue;
        }
        const k = block.indexOf('}', j);
        const body = block.slice(j + 1, k).trim();
        if (head.startsWith('@keyframes')) {
            const k2 = block.indexOf('}}', j) + 2;
            out.push(block.slice(i, k2).trim());
            i = k2;
            continue;
        }
        const sels = head.split(',').map(scopeSel).filter(Boolean);
        if (sels.length) {
            out.push(sels.join(',') + '{' + body + '}');
        }
        i = k + 1;
    }
    return out.join('\n');
}

const scoped = scope(css);
const noise = fs.readFileSync(path.join(REPO, 'assets/noise-texture.svg'), 'utf8').trim();
const noiseUri = 'data:image/svg+xml,' + encodeURIComponent(noise).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/');

const guards = `
/* GHL guards: full-bleed canvas, keep GHL's inherited styles out */
body{background-color:#0A1420;overflow-x:hidden}
html{background-color:#0A1420}
.c-section:has(#tsl-tree),.c-row:has(#tsl-tree),.c-column:has(#tsl-tree),.c-section:has(#tsl-tree)>.inner,.c-row:has(#tsl-tree)>.inner,.c-column:has(#tsl-tree)>.inner{padding-top:0!important;padding-bottom:0!important;margin-top:0!important;margin-bottom:0!important}
#tsl-tree{line-height:normal;text-align:left;font-size:16px;font-style:normal}
#tsl-tree *{font-family:inherit;line-height:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;font-weight:inherit;font-style:inherit;text-decoration:none}
#tsl-tree .tsl-page-alt a{text-decoration:underline}
#tsl-tree h1,#tsl-tree h2,#tsl-tree h3,#tsl-tree h4,#tsl-tree p,#tsl-tree blockquote{font-size:inherit}
/* film grain (was .background-blur) */
#tsl-tree::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:url("${noiseUri}");opacity:.55;mix-blend-mode:overlay}
#tsl-tree .tsl-container{position:relative;z-index:1}
`;

const after = `/* full-bleed: break out of GHL section/row padding (after the reset so margin survives) */\n#tsl-tree{position:relative;isolation:isolate;width:100vw;left:50%;margin-left:-50vw}`;

const head = `<!-- ============================================================
     THE SCALABLE LEADER — LINKTREE (v2, JC-approved Nov 2026)
     PASTE 1  →  Funnel Settings → Tracking → HEAD TRACKING CODE
     Fonts + all CSS for BOTH steps (Linktree and Strategy Call).
     Everything is scoped under #tsl-tree.
     Built from repo the-scalable-leader-linktree, css/style.css.
     ============================================================ -->

${FONTS}

<style>
${guards}
${scoped}
${after}
</style>
`;

// ---------- HTML ----------
function icon(name) {
    let svg = fs.readFileSync(path.join(REPO, `icons/${name}.svg`), 'utf8').trim();
    svg = svg.replace(/\s(width|height)="64"/g, '');
    svg = svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
    return svg.replace(/>\s+</g, '><');
}

function convert(html, page) {
    const match = html.match(/<div class="container">([\s\S]*?)<\/div>\s*<\/body>/);
    let body = match ? match[1] : html;
    body = body.replace(/<img src="icons\/([\w-]+)\.svg" alt="">/g, (_, name) => icon(name));
    body = body.replace(/src="assets\/logo\.png"/g, `src="${LOGO}"`);
    body = body.replace(/href="strategy-call\.html"/g, 'href="/strategy-call"');
    body = body.replace(/href="index\.html"/g, 'href="/linktree"');
    
    body = body.replace(/class="([^"]+)"/g, (_, clsList) => {
        const names = clsList.split(/\s+/).map(c => CLASSES.includes(c) ? 'tsl-' + c : c).join(' ');
        return `class="${names}"`;
    });
    return `<div id="tsl-tree">\n<div class="tsl-container">${body}</div>\n</div>\n`;
}

const pages = {
    'linktree': [fs.readFileSync(path.join(REPO, 'index.html'), 'utf8'), '/linktree'],
    'strategy-call': [fs.readFileSync(path.join(REPO, 'strategy-call.html'), 'utf8'), '/strategy-call']
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'ghl-paste-1-head.html'), head);

for (const [n, [src, urlPath]] of Object.entries(pages)) {
    const el = convert(src, n);
    const hdr = `<!-- ============================================================
     THE SCALABLE LEADER — ${n.toUpperCase()} step  (path: ${urlPath})
     PASTE INTO  →  the Custom HTML/Javascript ELEMENT on this step
     Body markup only. No <style>, no <script>.
     ============================================================ -->\n\n`;
    fs.writeFileSync(path.join(OUT, `ghl-paste-2-element-${n}.html`), hdr + el);
    
    const prev = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PREVIEW ONLY — ${n}</title>
<!-- simulates a GHL page: default margins + a padded section wrapper -->
<style>body{margin:8px;font-family:Georgia;line-height:1.7;color:#333} .ghl-section{padding:20px 15px;max-width:1170px;margin:0 auto} p{margin:0 0 1em} h2{font-family:Arial;font-weight:700} a{color:#188bf6}</style>
${head}</head><body><div class="ghl-section">${el}</div></body></html>`;
    fs.writeFileSync(path.join(OUT, `preview-${n}.html`), prev);
}

console.log('Build complete. Files in', OUT);
