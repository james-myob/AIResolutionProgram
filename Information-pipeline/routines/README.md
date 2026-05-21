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

These routines need to be configured **once** in the Claude Code on the Web UI. The repo + prompts are version-controlled here; only the routine configuration itself (schedule + env vars) lives in your Claude account settings.

### 1. Add the Resend API key as a Routine environment variable

Both routines call `Information-pipeline/scripts/send-briefing.py`, which reads `RESEND_API_KEY` from the environment.

- Go to **Claude Code on the Web** → **Settings** → **Environment variables** (or the Routine-specific env var section if it has one).
- Add: `RESEND_API_KEY = re_TeW8LY3x_ADYajEvBuDox15Z4dTs5891m`
- (Optional, recommended once Resend domain is verified) `BRIEFING_FROM = "Daily AI Briefing <briefing@yourdomain.com>"`

The key is held in the Routine's environment, **not** in the repo. If it ever leaks, rotate at https://resend.com/api-keys and update the Routine env var.

### 2. Create the daily routine

- **Claude Code on the Web** → **Triggers / Routines** → **New routine**
- **Name:** `Daily AI Briefing`
- **Repository:** `james-myob/AIResolutionProgram`
- **Branch:** `main`
- **Schedule:**
  - Cron expression: `0 21 * * 0-4`
    (Sun-Thu 21:00 UTC = Mon-Fri 07:00 AEST)
  - Or natural language: *"Every weekday at 7:00 AM Sydney time"*
- **Prompt:** paste the entire contents of [`daily.md`](daily.md). Or, if Routines supports referencing a repo file as the prompt source, point it at `Information-pipeline/routines/daily.md`.
- **Permissions:** allow `WebSearch`, `WebFetch`, `Bash`, `Edit`, `Write`, `Read`, and the GitHub MCP tools (needed for committing + opening issues).

### 3. Create the weekly routine

- **Name:** `Weekly AI Recap`
- **Repository:** `james-myob/AIResolutionProgram`
- **Branch:** `main`
- **Schedule:**
  - Cron expression: `0 7 * * 5`
    (Fri 07:00 UTC = Fri 17:00 AEST)
  - Or natural language: *"Every Friday at 5:00 PM Sydney time"*
- **Prompt:** paste the entire contents of [`weekly.md`](weekly.md).
- **Permissions:** same as the daily routine.

### 4. (Recommended) Manual dry-run

After creating each routine, click **"Run now"** once to verify it works end-to-end. The daily run should produce a briefing for today's date, email it, and push a commit; the weekly run should produce a weekly recap, email it, push a commit, and open a NotebookLM reminder issue.

If a dry-run fails, the routine session transcript is captured in Claude Code on the Web — read it to diagnose.

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
