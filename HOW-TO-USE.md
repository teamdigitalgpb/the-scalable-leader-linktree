# The Scalable Leader — Linktree: How to Use

> **Superseded 2026-11-17:** the linktree is now GHL-based. See `PROJECT-NOTES.md` and `ghl/SETUP.md`. The Vercel hosting steps below are kept for reference only.


One page that links to every part of JC's business. Share it in bios, email signatures and QR codes.

**Live address (once set up):** `https://links.thescalableleader.net`

This repo is **public**. Never commit webhook URLs, passwords, keys or private emails. Those live in Vercel and GitHub settings only.

---

## 1. What's on the page

| Card | Goes to | Notes |
|---|---|---|
| **Book a Strategy Call** (featured, gold) | `strategy-call.html` (on this site) → paid GHL calendar | Paid call page: $350, 1 hour, GHL calendar "TSL Consulting Call" (same as thescalableleader.net/book-consulting.html) |
| Business & Wealth Consulting | `www.thescalableleader.net` | Main website |
| Books & Journals | `theleadersjournal.vercel.app` | To be replaced by a books subdomain (Regal, journals, RVPT curriculum) |
| **Business Software** | `app.thescalableleader.net/intake` | The software's own Request Access page |
| Real Estate Agent Course | Legacy course funnel in GHL (`sites.leadconnectorhq.com/preview/zDHvksHY8ljitDR7mtf5`) | Temporary, until the new Legacy page is live |
| **KFTK Inc** | Link pending | Kings For The Kingdom: faith-based opportunities |
| Contact Us | `grow.thescalableleader.net/contactpage` | |

The featured card uses `class="card featured"` with a small `START HERE` badge. Only one card should be featured.

Social row: YouTube, Instagram, email (`support@thescalableleader.net`).

## 2. Files

| File | What it does |
|---|---|
| `index.html` | The linktree page: every card lives here |
| `strategy-call.html` | Paid Strategy Call page: who it's for, how it works, price, booking button |
| `request-access.html` | Business Software request form (not linked from the page any more; the card goes to the software's own intake) |
| `js/request-access.js` | Checks the form and sends it to `/api/request-access` |
| `api/request-access.js` | Vercel function that forwards the lead to GHL |
| `css/style.css` | All styling, for both pages |
| `icons/` | Gold line icons used on cards |
| `contact.html` | Not linked from the page; still has placeholder links |

## 3. Everyday changes

**Change where a card goes:** in `index.html`, find the card's `<h2>` title and edit the `href="…"` on the `<a>` just above it.

**Add a card:** copy a whole `<a class="card" …> … </a>` block, paste it where it should appear, then change the `href`, icon, title and one-line description. Keep titles in capitals, to match the other cards. Each card has `style="--i:N"`, its position for the fade-in. Number them in order.

**Publish:** commit and push to `main` in the working repo. The change flows through to JC's live page automatically (section 5). Allow about a minute.

## 4. Business Software: how leads reach GHL

```
Visitor fills the form → /api/request-access (Vercel) → GHL Inbound Webhook → GHL workflow
```

The browser never sees the GHL webhook URL. It is stored in JC's Vercel project as an environment variable, so it can't be copied from the public code.

**Fields sent to GHL:**

| Field | Example |
|---|---|
| `first_name` | Ana (required) |
| `last_name` | Cruz |
| `email` | ana@example.com (required, lower-cased) |
| `phone` | +1 469 555 0100 |
| `company_name` | Cruz Realty |
| `message` | What they want the software to help with |
| `source` | `TSL Linktree - Business Software Request Access` |
| `submitted_at` | ISO date and time |

A hidden spam-trap field quietly drops bot submissions.

**One-time setup:**
1. In JC's TSL sub-account in GHL, create a workflow that starts with an **Inbound Webhook** trigger, and copy its webhook URL.
2. In JC's Vercel project, go to **Settings → Environment Variables** and add `GHL_WEBHOOK_URL` with that URL, for Production. Redeploy.
3. Submit one test request from the live page. In the GHL trigger, load the sample request, then map the fields above to a **Create/Update Contact** action. Add a tag such as `business-software-request` and any notification you want.
4. Publish the workflow, then submit a second test and confirm the contact appears.

If the env variable is missing, the form shows a friendly error and nothing is lost silently.

## 5. How the code gets to JC's live site

```
Working repo                                    (we build here)
        │  GitHub Action mirrors every push to main
        ▼
JC's GitHub account → mirror repo               (JC owns it)
        │  Vercel deploys on every push
        ▼
JC's Vercel project                             (JC owns it)
        │  custom domain
        ▼
links.thescalableleader.net  ← CNAME in JC's GoDaddy DNS
```

Why this way: JC owns the GitHub repo, the Vercel project and the domain. We keep working in our own repo, and nothing needs JC's passwords.

### 5a. Mirror setup (one time)

1. **JC's GitHub:** create an empty repo, for example `the-scalable-leader-linktree`. Make it **public**. On Vercel's free Hobby plan, deployments of commits written by someone outside the account are blocked on private repos.
2. **Generate a deploy key pair** (we do this; one key pair used only for this mirror).
3. **JC's repo → Settings → Deploy keys:** add the *public* key and tick **Allow write access**. This key can push to that one repo only.
4. **Working repo → Settings → Secrets and variables → Actions:**
   - Secret `JC_MIRROR_DEPLOY_KEY` = the *private* key
   - Variable `JC_MIRROR_REPO` = `jc-github-username/the-scalable-leader-linktree`
5. Add the workflow `.github/workflows/mirror-to-jc.yml`, which pushes `main` to JC's repo on every push. It only runs in the working repo, never inside JC's copy.
6. Run it once from the **Actions** tab and confirm JC's repo now has the files.

To revoke access later, JC deletes the deploy key. The mirror stops and JC keeps everything.

### 5b. Vercel (JC's account)

1. **Add New → Project**, import JC's mirror repo. Framework preset: **Other**. No build command.
2. Add `GHL_WEBHOOK_URL` (section 4).
3. **Settings → Domains:** add `links.thescalableleader.net`. Vercel shows the exact CNAME value to use. Copy it from there.

## 6. GoDaddy: subdomain and DNS fix

The domain is registered at GoDaddy and uses GoDaddy's DNS.

**Add the subdomain:** in the DNS records for `thescalableleader.net`, add:

| Type | Name | Value |
|---|---|---|
| CNAME | `links` | the value Vercel shows in Domains |

**Fix the stray nameservers.** GoDaddy's DNS for this domain lists four NS records: its own two (`ns71`/`ns72.domaincontrol.com`) plus two left over from Cloudflare (`trey.ns.cloudflare.com`, `carlane.ns.cloudflare.com`). Cloudflare refuses every request for this domain, so any lookup that lands there fails. Delete the two Cloudflare NS records and keep the GoDaddy ones. The domain is not hosted on Cloudflare, so nothing depends on them.

**Do not touch:**

| Record | Why |
|---|---|
| `@` (apex) and `www` | Live main website on Vercel |
| `grow` | GHL funnels (course, contact page) |
| `mail`, MX, TXT | Email delivery |

GoDaddy's two-step login code goes to JC's phone. We work through GoDaddy **Delegate Access** that JC grants and can revoke. It is not an ownership transfer.

**Check it worked:** `links.thescalableleader.net` opens the linktree with a padlock, and Vercel's Domains page shows the domain as valid. DNS can take from a few minutes to a few hours.

## 7. URL map: one address per job

| Address | What it is | Keep? |
|---|---|---|
| `links.thescalableleader.net` | **The linktree**, on JC's Vercel | Yes. This is the one to share |
| `grow.thescalableleader.net/` | 5 Shifts ebook funnel (GHL) | Yes |
| `grow.thescalableleader.net/linktree` | Old GHL copy of the linktree | Redirect to `links.` (bio links already use it) |
| `grow.thescalableleader.net/links-page` | Same GHL copy, funnel-level path | Retire with the GHL funnel |
| `grow.thescalableleader.net/links-6822` | Same GHL copy again: a duplicate step GHL auto-numbered | Delete the duplicate step |
| `www.thescalableleader.net` | Main website (Vercel) | Yes |

The linktree lives on its own subdomain so it never looks like part of the ebook funnel, and nothing in GHL's funnel settings can affect it.

## 8. After launch

- The older GHL copy at `grow.thescalableleader.net/linktree` keeps working. Point it at `links.thescalableleader.net` with a redirect so any bio links already shared still land on the current page.
- Update bio links and QR codes to `links.thescalableleader.net`.

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Change pushed but site unchanged | Mirror failed | Working repo → Actions → read the failed run |
| Vercel says deployment blocked | JC's repo is private on Hobby | Make it public, or upgrade Vercel |
| Form says "Something went wrong" | `GHL_WEBHOOK_URL` missing or wrong | Check Vercel env var, redeploy |
| Form succeeds but no contact in GHL | Workflow not published or fields not mapped | Publish, re-map from a fresh sample |
| A card opens a blank page | Destination link is dead (e.g. deleted calendar) | Replace the link in `index.html` |
| `links.` doesn't load | CNAME missing or not yet propagated | Re-check the GoDaddy record against Vercel's value |
