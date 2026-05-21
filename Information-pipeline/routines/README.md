# Claude Code Routines

> Scheduled Claude Code sessions that run the daily and weekly briefing pipeline automatically. Each routine spawns a fresh Claude Code session with this repo cloned, executes a prompt, and ends — no human in the loop except for the manual NotebookLM/Claude Design paste steps (weekly audio, monthly deck) which are flagged via GitHub issues.

---

## What's here

| File | Purpose | Schedule |
|---|---|---|
| [`daily.md`](daily.md) | Prompt for the daily briefing routine | Mon-Fri at 07:00 AEST |
| [`weekly.md`](weekly.md) | Prompt for the Friday weekly recap routine | Fri at 17:00 AEST |

(Monthly recap routine TBD — first one due last weekday of May 2026.)

---

## One-time setup

These routines need to be configured **once** in the Claude Code on the Web UI. The repo + prompts are version-controlled here; only the routine configuration itself (schedule + connectors) lives in your Claude account settings.

### Email delivery: Microsoft 365 (preferred) vs. Resend (fallback)

Two paths exist for the email-send step:

1. **Microsoft 365 connector (preferred).** Both routines attach the M365 connector and use its "send email" tool. Emails come from your real MYOB account (best deliverability inside the org, no spam-folder issues, no API key to manage).
2. **Resend (fallback).** If the M365 connector doesn't expose a send tool or send fails at runtime, the routine commits the briefing anyway and opens a GitHub issue. A human can then re-send manually using `Information-pipeline/scripts/send-briefing.py` — that script uses Resend and requires `RESEND_API_KEY` in env. The key currently in use: `re_TeW8LY3x_ADYajEvBuDox15Z4dTs5891m` (rotate at https://resend.com/api-keys if needed).

### 1. Create the daily routine

- **Claude Code on the Web** → **Routines** → **New routine**
- **Name:** `Daily AI Briefing`
- **Repository:** `james-myob/AIResolutionProgram` (already selected in the form's chip area)
- **Trigger:** `Weekdays` at `08:00 GMT+10` (= 8am AEST, Mon-Fri)
- **Instructions:** see the [`Instructions text`](#instructions-text-daily) section below — copy-paste into the Instructions field
- **Connectors:** include **Microsoft 365** (already in default list)
- **Behavior / Permissions:** allow `WebSearch`, `WebFetch`, `Bash`, `Edit`, `Write`, `Read`, GitHub tools

### 2. Create the weekly routine

- **Name:** `Weekly AI Recap`
- **Repository:** `james-myob/AIResolutionProgram`
- **Trigger:** `Weekly` → Friday at `17:00 GMT+10` (= 5pm AEST, every Friday)
- **Instructions:** see the [`Instructions text`](#instructions-text-weekly) section below
- **Connectors:** Microsoft 365 (same as daily)

### 3. Manual dry-run

After creating each routine, use the "Run now" option once to verify it works end-to-end. The daily run should produce a briefing for today's date, email it via M365, and push a commit. The weekly run should produce a weekly recap, email it, push a commit, and open a NotebookLM reminder issue.

### Instructions text (Daily)

Paste the entire contents of [`daily.md`](daily.md) into the routine's Instructions field. (Or, if Routines supports referencing a repo file as the prompt source, point it at `Information-pipeline/routines/daily.md`.)

### Instructions text (Weekly)

Paste the entire contents of [`weekly.md`](weekly.md) into the weekly routine's Instructions field.

---

## Timezone notes

Sydney/MYOB is on **AEST (UTC+10)** in May. Daylight Saving (AEDT, UTC+11) starts the first Sunday in October and ends the first Sunday in April. **The cron expressions above will drift by 1 hour from October to April** — when DST kicks in, update both schedules to:
- Daily: `0 20 * * 0-4` (Sun-Thu 20:00 UTC = Mon-Fri 07:00 AEDT)
- Weekly: `0 6 * * 5` (Fri 06:00 UTC = Fri 17:00 AEDT)

Set a calendar reminder for late September each year as a workaround for cron's lack of timezone support.

---

## Cost expectations

Each daily routine session uses your Claude Code subscription quota. Rough budget per run:
- Daily: ~30-60 minutes of Claude session time (mostly waiting on WebSearch/WebFetch), modest token consumption — well within Pro/Max limits.
- Weekly: ~15-30 minutes of Claude session time, synthesis is more token-heavy but shorter total runtime.

If you hit subscription quota issues, options:
1. Upgrade to a higher Claude Code tier.
2. Move the daily generation to a GitHub Action with your own Anthropic API key (Mission 7 alternative path — keeps you control of cost).
3. Drop cadence to 3x/week (Mon/Wed/Fri).

---

## What the routines do NOT do automatically

Two steps still require a human paste (no public APIs available):

1. **Weekly NotebookLM audio overview** — the weekly routine opens a GitHub issue reminding you to paste the weekly Markdown into NotebookLM and update the front-matter with the audio URL.
2. **Monthly Claude Design deck** — when the monthly routine is added, same pattern.

These manual steps are ~2 min and ~5 min respectively. They stay manual until Google/Anthropic ship public APIs for those products.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Routine ran but no email arrived | `RESEND_API_KEY` not set in Routine env, or set incorrectly | Re-add the env var, then click "Run now" |
| Email arrived but no audio/deck links | The daily file's front-matter didn't include `notebooklm_audio_url:` or `claude_design_deck_url:` (normal for daily emails — those links only appear in weekly/monthly emails) | No fix needed; this is correct behaviour for dailies |
| Daily ran on a public holiday and produced a thin briefing | News volume was genuinely low — the briefing is honest about it | No fix needed |
| Routine session timed out | Source list grew too large, or one source is slow to respond | Trim `sources.md`, or add `(scrape failed)` tolerance in the daily prompt |
| Commit failed due to merge conflict | A human committed to `main` while the routine was running | Routine should rebase + retry once; if it persists, drop a human in to resolve |
