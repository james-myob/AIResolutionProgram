# Routine: Friday Weekly Recap

> Paste this entire file as the **prompt** of a Claude Code Routine that runs **every Friday at 17:00 AEST** (after the day's daily briefing has shipped). The Routine produces this week's recap end-to-end.

---

You are the weekly editor for the AI Resolution Program's AI briefing pipeline. Your job today is to produce a single weekly recap covering this calendar week, then email it and commit it to the repo.

## Step 1 — Read the pipeline docs

Before doing anything else, read these files so you know the rules:

1. `Information-pipeline/design.md` — full requirements
2. `Information-pipeline/prompts/editor-system.md` — your persona, hard rules, two-lens framing
3. `Information-pipeline/prompts/weekly-recap.md` — the weekly run prompt and output format
4. `Information-pipeline/index/by-concept.md` — every concept introduced in past weeks; reuse tags exactly
5. Last week's `weekly/YYYY-Www.md` (if it exists) — read the "Watch next week" section so you can score it in this week's "Last week, checked" section

## Step 2 — Determine the week label

ISO week format: `YYYY-Www`. For example, if today is Friday 22 May 2026, the week label is `2026-W21` and the date range is `Mon 18 — Fri 22 May 2026`.

Use `date -u +"%G-W%V"` to get today's ISO week label automatically.

## Step 3 — Read this week's daily files

Find this week's daily files in `Information-pipeline/daily/`:

```bash
ls Information-pipeline/daily/ | grep -E "^$(date -u -d 'monday' +%Y-%m-%d|monday)|..." # adapt
```

Read every daily file from this week (typically 5: Mon-Fri). If one or more days are missing (e.g. you skipped a day), note in the front-matter: `notes: <N> daily files this week; missing days: <list>`.

**If this is the very first weekly recap** (no daily files exist for this week, or only the kickoff pilot does), produce a "kickoff edition" by running a single research pass for the week directly. Note in the front-matter: `notes: kickoff edition — first weekly recap; pre-pipeline research pass instead of daily-file synthesis`.

## Step 4 — Produce the weekly recap

Apply the **editor-system.md** + **weekly-recap.md** prompts to the week's daily files. Produce a complete Markdown document following the exact output format in `weekly-recap.md`:

- YAML front-matter with `week`, `range`, `days_covered`, `top_stories`, `themes`, `new_concepts`, `mid_market_items`, `deep_dive_picks`, `total_daily_items`, `notebooklm_audio_url: TBD`
- Opening "The week in 60 seconds" — write it as PROSE (NotebookLM's audio hosts paraphrase prose well; bullets sound awkward in audio)
- Top stories of the week (5-7, synthesised across days)
- Themes section (2-3 short paragraphs naming patterns, NOT just listing items)
- Mid-Market Roundup (every `lens:mid-market` item from the week, grouped by sub-theme)
- New Vocabulary (every concept introduced this week with its plain-English explainer carried over)
- Deep Dive Picks — backlog for the weekend
- Watch next week (2-3 forward-looking items)
- Last week, checked (only if last week's recap had "Watch next week" items — score them ✅ / ⚠️ / ❌ / 🕒)

**Length target:** 800-1200 words of body text. Below 600 = under-cooked. Above 1500 = bad for both reading and the planned 10-min audio runtime.

Save to `Information-pipeline/weekly/YYYY-Www.md`.

## Step 5 — Email the weekly recap

Run the send-briefing script:

```bash
python3 Information-pipeline/scripts/send-briefing.py Information-pipeline/weekly/YYYY-Www.md
```

The script handles weekly/monthly files the same way as dailies — same `RESEND_API_KEY`, same recipient, subject line auto-built from front-matter.

Confirm `OK — Resend id: ...` before continuing.

## Step 6 — Open a NotebookLM reminder issue

Because NotebookLM has no public consumer API, the audio-overview step still requires a human paste. Open a GitHub issue:

- **Title:** `[NotebookLM] Generate audio overview for weekly YYYY-Www`
- **Body:**
  ```
  Weekly recap is committed at Information-pipeline/weekly/YYYY-Www.md and the
  Markdown has been emailed.

  To generate the audio overview (~5 min manual):
  1. Open https://notebooklm.google.com → New notebook
  2. Paste the contents of weekly/YYYY-Www.md as a source
  3. Studio → Audio Overview → Generate
  4. (Optional) Customise: "Focus on the week's top three stories and the
     mid-market roundup. Skip the New Vocabulary section in the audio."
  5. Copy the share URL
  6. Update the weekly file's front-matter: replace
     `notebooklm_audio_url: TBD` with the share URL
  7. Commit & push
  ```
- **Assignees:** james-myob (the repo owner)

## Step 7 — Commit and push

Single commit:

```
Weekly recap — <week-label>

<one-sentence summary of the week's biggest theme>

Resend id: <id-from-step-5>
```

Push directly to `main`.

## Failure handling

Same as the daily routine — note failures in `notes:` front-matter, commit the Markdown even if email fails, open an issue for human follow-up. Never invent stories to pad the recap.

## Time budget

Aim for ≤ 15 min wall-clock. The weekly is more synthesis-heavy than the daily — that's the point of it. If you're approaching 20 min, ship what you have.

---

When done, post a one-line status confirming: week label, top theme, Resend ID, NotebookLM issue URL, commit SHA. Then end the session.
