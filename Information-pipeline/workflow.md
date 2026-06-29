# Workflow — Runbook

> Step-by-step procedure for the daily AI briefing pipeline. Tier 1 (manual) only. Tier 2/3 automation steps are noted but not yet built — Mission 7 territory.

---

## At a glance

| Cadence | When | Human time | Output | Recipient |
|---|---|---|---|---|
| **Daily** | Every weekday morning | 15–20 min (Tier 1) → 0 min (Tier 3) | `daily/YYYY-MM-DD.md` in the repo + a Confluence page under the AI Daily Brief homepage | Confluence page (the canonical published surface) |

Monday is a **weekend special edition** — extended source window to cover Sat–Sun.

> **Publishing to Confluence is part of the daily routine, every day it runs.** The Confluence page IS the publication — committing the Markdown is the input; the published Confluence page is the output. No email list, no weekly audio, no monthly slide pack.

---

## Daily run (Tier 1 — manual)

### Prereqs
- An RSS reader with all sources from `sources.md` subscribed (Feedly, Inoreader, or NetNewsWire). Group by tier (T1–T6) for fast scanning.
- A Claude Pro/Max account (or Claude API access).
- The repo cloned locally with the working branch checked out.
- Confluence access via the Atlassian MCP (`mcp__Atlassian__createConfluencePage` + `updateConfluencePage`).

### Confluence anchors (do not change without updating the routine)

| What | Page ID | URL |
|---|---|---|
| AI Daily Brief homepage | `12024578071` | https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12024578071/AI+Daily+Brief |
| Tags index | `12026511459` | https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12026511459/Tags+AI+Daily+Brief |
| About this publication | `12024578165` | https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12024578165/About+this+publication |
| cloudId | `4fdd78ef-1f86-405c-ab28-40469e369529` | (MYOB Confluence cloud) |
| spaceId | `10554835614` | (James Peck personal space) |

### Steps

1. **Open RSS reader.** Set the filter to "last 24 hours" (or "since Friday 18:00" if running the Monday weekend-special edition).
2. **Scan & export raw items.** Skim all T1–T6 feeds. For every item that looks plausibly above the bar, copy:
   - Title
   - Source name
   - URL
   - Publication date
   - First paragraph (or the post's TL;DR if it has one)

   Paste each into a single working file `daily/_raw/YYYY-MM-DD.md` as a list. Aim for 25–40 items.
3. **Open Claude.** Start a new chat. Paste in, in order:
   - The full contents of `prompts/editor-system.md`
   - The full contents of `prompts/daily-digest.md`
   - The raw items list from step 2
   - The date (e.g. `date: 2026-05-20`)
   - (Optional) yesterday's `daily/YYYY-MM-DD.md` for continuity context.
4. **Review the draft.** Claude returns the full Markdown briefing. Check:
   - Every claim has a source link.
   - Every item has "Why it matters (PM)".
   - Mid-market lens applied where it should be.
   - No invented facts (spot-check 2 random items by clicking through to the source).
   - Categories used are the eight stable ones; no ad-hoc names.
   - Read time ≤ 5 min.
5. **Edit lightly.** Tighten any over-long digests. Drop weak items into Quick Hits or remove. Don't rewrite — if Claude got it badly wrong, re-prompt with what was wrong.
6. **Save to the repo.** Write to `daily/YYYY-MM-DD.md`. Delete the `_raw/` working file (or keep it for one week as a debugging trail).
7. **Commit & push.** Single commit per day: `Daily briefing — 2026-05-20`.
8. **Convert Markdown to Confluence HTML.** The conversion is mechanical — see `scratchpad/convert.py` for the reference script. The format mirrors the existing posts: TL;DR panel, category sections, two-lens "why it matters" panels, source links, color-coded status macros for tags, collapsible Sources Scanned footer.
9. **Publish to Confluence.** Call `mcp__Atlassian__createConfluencePage`:
   - `cloudId`: `4fdd78ef-1f86-405c-ab28-40469e369529`
   - `spaceId`: `10554835614`
   - `parentId`: `12024578071` (the AI Daily Brief homepage)
   - `title`: `Daily AI Briefing — <Day> <D> <Month> <YYYY>` (e.g. `Daily AI Briefing — Mon 29 June 2026`) — keep the em-dash `—` exactly
   - `contentFormat`: `html`
   - `body`: the HTML from step 8
10. **Refresh tag pages and homepage.** For each tag the new issue uses:
    - If a tag page already exists under the Tags index (`12026511459`), update it to include this issue at the top of "Issues that cover this tag" with a one-line summary per item.
    - If a tag has reached the volume threshold (≥3 items across the corpus) and doesn't yet have a page, create one as a child of the Tags index.

    Then update the homepage (`12024578071`): add the new issue's preview card to the top of "Latest issues" (keep the most recent 6 visible; older ones live in the page tree), bump each tag's count in the sidebar, and update the "📊 So far" tally.
11. **Log the time.** Note the actual end-to-end minutes in the Time log below.

### Tier 2/3 automation notes
- **Tier 2:** n8n/Make.com runs steps 1–2 (RSS pull + dedupe), invokes Claude API for step 3, drops the draft into a PR. Steps 4–5 (human review) remain; steps 6–10 happen on PR merge via GitHub Action.
- **Tier 3:** Drops the human review step. Quality gate: if Claude's confidence-of-coverage flag is below threshold (fewer than N sources scanned successfully), draft a PR instead of auto-publishing to Confluence.

---

## Failure modes

| What goes wrong | What to do |
|---|---|
| Claude hallucinates a source/URL | Drop the item entirely. Re-prompt Claude with: "Item X had a URL that 404s — drop it and regenerate." |
| RSS feed is unreachable | Note `(scrape failed)` in the Sources footer of the day's briefing. Don't block the run. |
| `createConfluencePage` returns a duplicate-title error | The page is already live; fetch the existing page ID and skip the create. If the body is stale, call `updateConfluencePage` with the new body instead. |
| You forget to run a day | Run a "catch-up" the next morning covering both days; mark `notes: catch-up run` in the front-matter. Don't try to fake a missed day with backdated content. |
| You're travelling / on PTO | Pause the daily entirely. Do not auto-run unreviewed in Tier 1. |

---

## Time log

Track actual end-to-end times per run. Helps justify (or deprioritise) Tier 2/3 automation investment.

| Date | Wall-clock min | Human-attention min | Notes |
|---|---|---|---|
| 2026-05-20 | TBD | TBD | First pilot run; baseline. |
| | | | |

---

## Mission 7 transition plan

When this pipeline moves from Tier 1 (manual) to Tier 2 (semi-automated), the steps that disappear are:

- Daily steps 1–2 (RSS scanning + paste) → replaced by n8n RSS nodes + Firecrawl for non-RSS sources.
- Daily step 3 (paste into Claude) → replaced by Claude API call.
- Daily step 6 (save to file) and 7 (commit) → replaced by GitHub commit via PR or push.
- Daily steps 8–10 (convert + publish to Confluence + refresh tag pages) → replaced by a small Node/Python publish job that calls the Confluence v2 REST API.

What survives the transition unchanged:
- The three daily prompt files (`prompts/editor-system.md`, `prompts/daily-digest.md`, `prompts/categorisation.md`).
- The taxonomy (`design.md` §5).
- The output format (HTML structure of the Confluence post page).

So the design choices made for Tier 1 ARE the choices for Tier 2/3 — nothing thrown away.

> Earlier scope (weekly NotebookLM audio + monthly Claude Design deck) has been retired. The two pilot recap pages are kept in the Confluence tree as historical record but are no longer maintained. See `design.md` for the original framing.
