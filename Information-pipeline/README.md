# Daily AI Briefing — Information Pipeline

**Mission 6 deliverable:** a daily AI radar for a tech PM serving mid-market customers. Markdown lives in this repo; the published publication lives on Confluence.

**Target reader:** PM at a tech company in the mid-market segment. ≤5 min weekday morning read.

**Published at:** [AI Daily Brief](https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12024578071/AI+Daily+Brief) on Confluence.

---

## What's where

| Path | Purpose |
|---|---|
| **[`design.md`](design.md)** | Full requirements + solution design. (Predates the daily-only scope reduction — still useful for taxonomy and framing.) |
| **[`sources.md`](sources.md)** | Curated, tiered source list with RSS URLs. |
| **[`workflow.md`](workflow.md)** | Step-by-step runbook for the daily run, including the Confluence-publish step. |
| **[`prompts/`](prompts/)** | The Claude prompts that drive the daily run. |
| **[`daily/`](daily/)** | Generated daily briefings, one Markdown file per day. Each one is also published as a Confluence page. |
| **[`index/`](index/)** | Derived indexes for cross-time search (by category, entity, concept, deep-dive backlog). |

> The repo also contains `weekly/` and `monthly/` folders from an earlier scope. Those cadences have been **retired** — the publication is daily-only.

## Prompt files

| File | Used for |
|---|---|
| [`prompts/editor-system.md`](prompts/editor-system.md) | Base persona — referenced by the daily prompt. Tone, hard rules, two-lens framing, source-tier weighting. |
| [`prompts/categorisation.md`](prompts/categorisation.md) | Per-item JSON pre-pass (category, tags, importance, drop decision). Used in Tier 2/3 automation. |
| [`prompts/daily-digest.md`](prompts/daily-digest.md) | Main daily run — raw items + date → daily Markdown briefing. |

The `weekly-recap.md` and `monthly-recap.md` prompt files are kept in the repo for history but are no longer used.

## How it runs

| Cadence | When | Human time | Output |
|---|---|---|---|
| Daily | Every weekday (Monday = weekend-special edition) | ~15–20 min (Tier 1) → 0 min (Tier 3) | `daily/YYYY-MM-DD.md` in this repo + a Confluence page under the AI Daily Brief homepage |

See [`workflow.md`](workflow.md) for the full runbook. The Confluence publish step is part of the routine, every day it runs.

## Delivery

The Confluence page **is** the publication. Markdown commits here; the published Confluence page is the canonical surface readers see. There is no email list and no other delivery channel.

To follow along, hit the **Watch** button at the top-right of the [Confluence homepage](https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12024578071/AI+Daily+Brief).

## Status

**Mission 6: ✅ Complete.** ~30 daily issues published to date, with tag-pages and a publication landing on Confluence.

**Mission 7:** automate steps 1–3 of `workflow.md` (RSS fetch + Claude generation) and steps 8–10 (Markdown → Confluence publish + tag refresh) via Vercel cron + the Anthropic API + the Confluence v2 REST API.

See [`design.md`](design.md) §14 for the original transition plan (note: predates the daily-only scope reduction).
