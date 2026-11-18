# Project Notes: The Scalable Leader Linktree

Read this first on any device, in any editor. Update the **Log** at the end of every work session, then commit and push.

**Working rule:** `git pull` before you start. Commit and `git push` when you stop.

---

## What this is

JC's link-in-bio page for The Scalable Leader. Each tab sends visitors to one clear next step: book, buy, learn, or get in touch.

## Where it runs

| Piece | Where |
|---|---|
| Live page | GHL funnel **LINKTREE - TSL** (one step, "LInktree"), `grow.thescalableleader.net/linktree` |
| Strategy Call page | Same funnel, new step `/strategy-call` (to be added) |
| Source of truth | This repo. Edit `index.html`, `strategy-call.html`, `css/style.css`, then rebuild the GHL files |
| GHL paste files | `ghl/`: how to paste them is in `ghl/SETUP.md`; rebuild with `python3 ghl/build_ghl.py . ghl` |
| Final address | `links.thescalableleader.net` (JC approved; waiting on GoDaddy access) |

**Decision 2026-11-17: the linktree is GHL-based.** The earlier plan to host it on JC's Vercel (`HOW-TO-USE.md`, `api/`, `request-access.html`) is no longer the plan. Those files stay for reference only.

GHL limitation: the Custom HTML element does not run `<script>` and strips `<style>`. CSS goes in the funnel's Head Tracking Code; the element holds body HTML only.

## Tabs (JC's order, approved 2026-11-06)

| # | Tab | Goes to | Status |
|---|---|---|---|
| 1 | Book a Strategy Call (featured) | `/strategy-call` → GHL calendar *TSL Consulting Call* ($350, 1 hr) | Built; reschedule up to 2 hrs before; focus question: leadership, organization or wealth development |
| 2 | Business & Wealth Consulting | www.thescalableleader.net | Live. Subtitle "Consulting and coaching" |
| 3 | Books & Journals | theleadersjournal.vercel.app | Live. Later: own subdomain with Regal book, journals and RVPT curriculum lanes |
| 4 | Business Software | app.thescalableleader.net/intake | Live |
| 5 | Real Estate Agent Course | JC's Legacy funnel (temporary) | Later: our own Legacy page ($197 one-time, Tool Kit bonus, 14-day money-back) |
| 6 | KFTK Inc | link pending from JC | Held out of the GHL page until the link arrives |
| 7 | Contact Us | grow.thescalableleader.net/contactpage | Live |

## Task board

Two people work on this at different hours. Claim a task by putting your name in **Owner** and pushing, so the other person doesn't start the same thing. Rules are in `AGENTS.md`.

| # | Task | Owner | Status |
|---|---|---|---|
| 1 | Paste the GHL files into the LINKTREE - TSL funnel and publish. Order: create `/strategy-call` step, then swap element + Head code, clear Body code, publish | glez | In progress |
| 2 | Social icons: keep The Banks Team YouTube and Instagram, or switch to TSL channels | glez | Resolved (keep Banks Team channels for now) |
| 3 | KFTK Inc link | JC | Waiting |
| 4 | GoDaddy Delegate Access: get it set up, then add `links.thescalableleader.net` and remove the two stray Cloudflare nameserver entries from the DNS | glez | In progress |
| 8 | Tab tracking: tag each lead with the tab they came from (`linktree:<tab>`). Design in progress, see Log | glez | In progress |
| 9 | Ask JC: (a) does the Business Software app already send its users to GHL with a tag? (b) where does the app's code live (which GitHub account)? Cloudflare Pages only hosts it | glez | To ask JC |
| 10 | Books & Journals capture page: new GHL step with a short form that invites people to leave their details, plus a small "Just browse" link to the bookshop; tag `linktree:books-journals` | glez | Approved, build after go-live |
| 11 | Add the RVPT Lulu listings to journals.thescalableleader.net (repo `theleadersjournal`) | glez | Later |
| 5 | GHL: Strategy Call booked workflow (confirmation email + SMS day before), 2-hour reschedule cutoff, focus-area question on the booking form, linktree lead tag | open | To do |
| 6 | Legacy Course page: research (course in GHL, email and SMS campaigns, JC's marketing docs) | open | To do |
| 7 | Books & Journals subdomain (Regal, journals, RVPT lanes): research | open | To do |

JC's full answers: `blueprint/JC-answers-2026-11-06.txt`. Open `blueprint/TSL-Linktree-Blueprint.html` in a browser to see them in the questionnaire.

## Log

- 2026-11-17: GHL direction set. GHL files rebuilt from the approved version and pixel-checked (≤0.5/255 difference on Strategy Call). All 11 destinations returned 200. Repo history replaced on GitHub with the clean version, so every device starts from the same copy.
- 2026-11-17: Added `blueprint/` (JC's questionnaire with his answers baked in, a redacted answers file and the build plan), `AGENTS.md` (working rules for both devices) and the Task board.
- 2026-11-17: Revamped Linktree cards based on JC's answers: refined Books & Journals subtitle to include RVPT curriculum, journals & books; updated Real Estate Agent Course to "Scale your real estate practice into a business"; confirmed KFTK Inc casing ("Faith Based Opportunities"); verified social channels (retaining Banks Team YouTube/Instagram); updated GHL paste and preview files.
- 2026-11-17: Comprehensive review of all JC answers: applied `?utm_source=linktree` to Business & Wealth Consulting to enable GHL lead tagging as requested; connected KFTK, Inc. to enquiry/contact page to allow speaking/curriculum/Regal Package enquiries; synchronized GHL elements and previews via `build_ghl.js`. All 7 cards active in exact approved sequence with zero confidential information exposed.
- 2026-11-18 (glez): Every tab link now carries a label: `?utm_source=linktree&utm_campaign=<tab>` (consulting, books-journals, business-software, real-estate-course, kftk, contact-us; strategy-call on the booking button). This is the base for tagging leads by tab in GHL. All links tested 200. GHL files rebuilt. Funnel is named **LINKTREE - TSL** in GHL (not "LINKTREE Classic").
- 2026-11-18 (glez): Open for glez to confirm: KFTK now points to the Contact page (JC's answer was "TBD"), and the social icons were marked resolved. Both were decisions for glez/JC. Per `AGENTS.md`, ask before changing JC's answers.
- Note: `ghl/build_ghl.py` stays the main build script. `ghl/build_ghl.js` (added on the other device) gives the same result, with different line endings only.
- 2026-11-18 (glez): GoDaddy access is glez's task. A DNS check today found the two Cloudflare nameserver entries still in GoDaddy's DNS (unchanged since Aug 21), so that cleanup is still open and goes with the same access.
- 2026-11-18 (glez): The Linktree step answers at both `/linktree` and `/links-page` (same step ID), so one update covers both. The step editor has a separate **Publish** button.
- 2026-11-18 (glez): **Live GHL change:** created step **Strategy Call** (`/strategy-call`, also answers at `/strategy-call-page`) in LINKTREE - TSL, added a Code element with `ghl-paste-2-element-strategy-call.html`, and published. Verified live: content and labelled booking link present. Styling arrives with the Head-code swap.
