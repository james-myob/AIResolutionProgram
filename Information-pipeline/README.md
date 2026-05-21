# Daily AI Briefing — Information Pipeline

**Mission 6 deliverable:** a reusable workflow that turns daily AI news into a digestible briefing for a tech PM, with weekly NotebookLM audio recaps and monthly Claude Design slide packs.

**Target reader:** PM at a tech company in the mid-market segment. ≤5 min weekday morning read.

---

## What's where

| Path | Purpose |
|---|---|
| **[`design.md`](design.md)** | Full requirements + solution design. Start here. |
| **[`sources.md`](sources.md)** | Curated, tiered source list with RSS URLs. |
| **[`workflow.md`](workflow.md)** | Step-by-step runbook for daily, weekly, and monthly runs. |
| **[`prompts/`](prompts/)** | The five Claude prompts that drive the pipeline. |
| **[`daily/`](daily/)** | Generated daily briefings, one Markdown file per weekday. |
| **[`weekly/`](weekly/)** | Generated Friday EOD recaps + NotebookLM audio links. |
| **[`monthly/`](monthly/)** | Generated monthly trend packs + claude.ai/design decks. |
| **[`index/`](index/)** | Derived indexes for cross-time search (by category, entity, concept, deep-dive backlog, recaps hub). |

## Prompt files

| File | Used for |
|---|---|
| [`prompts/editor-system.md`](prompts/editor-system.md) | Base persona — referenced by every other prompt. Tone, hard rules, two-lens framing, source-tier weighting. |
| [`prompts/categorisation.md`](prompts/categorisation.md) | Per-item JSON pre-pass (category, tags, importance, drop decision). Used in Tier 2/3 automation. |
| [`prompts/daily-digest.md`](prompts/daily-digest.md) | Main daily run — raw items + date → daily Markdown briefing. |
| [`prompts/weekly-recap.md`](prompts/weekly-recap.md) | Friday EOD — week's daily files → weekly Markdown tuned for NotebookLM. |
| [`prompts/monthly-recap.md`](prompts/monthly-recap.md) | Last weekday of month — month's files → monthly Markdown tuned for claude.ai/design. |

## How it runs

| Cadence | When | Human time | Output |
|---|---|---|---|
| Daily | Every weekday (Monday = weekend-special edition) | ~15-20 min (Tier 1) → 0 min (Tier 3) | `daily/YYYY-MM-DD.md` |
| Weekly | Friday EOD | ~5 min (paste into NotebookLM) | `weekly/YYYY-Www.md` + audio link |
| Monthly | Last weekday of month | ~10 min (paste into Claude Design + light deck edit) | `monthly/YYYY-MM.md` + PPTX deck |

See [`workflow.md`](workflow.md) for the full runbook.

## Delivery

All outputs commit to this repo + email to `james.peck@myob.com`.

## Status (as of 2026-05-21)

- ✅ Design + sources + taxonomy
- ✅ Five prompts written
- ✅ Workflow runbook
- ✅ Pilot daily briefing for 2026-05-20 (Google I/O cluster + Anthropic momentum cluster, 12 items)
- ⏳ Pending manual step: paste 2026-05-20 briefing into NotebookLM → audio overview
- ⏳ Pending manual step: paste 2026-05-20 briefing into claude.ai/design → 8-12 slide deck (Mission 6 "brief in 7 min" deliverable)
- ⏳ Mission 7: automate the daily/weekly/monthly Markdown generation via Claude API + cron

## Mission 7 path

The Tier 1 manual flow proves the prompts and taxonomy work. Mission 7 will move daily/weekly/monthly Markdown generation to Tier 3 (Vercel cron + Claude API + Resend email). The NotebookLM and Claude Design paste steps stay manual until those products ship consumer APIs.

See [`design.md`](design.md) §14 for the transition plan.
