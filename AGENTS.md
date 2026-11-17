# Working rules for this repo

For anyone working on this project, person or AI assistant, on any device and in any editor.

## Start of every session
1. `git pull`
2. Read `PROJECT-NOTES.md`: status, the **Task board**, and the latest **Log** entry (the handoff from whoever worked last).

## End of every session
1. Update the **Task board** and add a **Log** entry in `PROJECT-NOTES.md`: what you did, what is half-done, what the next person should do.
2. Commit and `git push`. Unpushed work is invisible to the other device.

If `git pull` or `git push` reports a conflict, stop and leave a note in the Log. Never force-push.

## Rules
- **This repo is public.** Never commit passwords, API keys, webhook URLs, private emails, account logins or private document links.
- Refer to the builder as **glez** in every file and document. JC reads this work.
- Commit author: `glez`, no email. Do not add AI co-author lines to commits.
- The site files (`index.html`, `strategy-call.html`, `css/style.css`) are the source of truth. After changing them, rebuild the GHL files: `python3 ghl/build_ghl.py . ghl`
- GHL's Custom HTML element does not run `<script>` and strips `<style>`. CSS goes in the funnel's Head Tracking Code. See `ghl/SETUP.md`.
- `blueprint/` holds JC's questionnaire with his answers (private details removed) and the build plan. Treat JC's answers as decisions; ask before changing them.
- Don't change anything live in GHL without writing it in the Log.
