# Workflow — Runbook

> Step-by-step procedure for running the daily AI briefing pipeline. Covers all three cadences (daily / weekly / monthly), at Tier 1 (manual). Tier 2/3 automation steps are noted but not yet built — Mission 7 territory.

---

## At a glance

| Cadence | When | Human time | Output | Recipient |
|---|---|---|---|---|
| **Daily** | Every weekday morning | 15-20 min (Tier 1) → 0 min (Tier 3) | `daily/YYYY-MM-DD.md` | Repo + email |
| **Weekly** | Friday end of day | 5 min (paste step) | `weekly/YYYY-Www.md` + NotebookLM audio link | Repo + email |
| **Monthly** | Last weekday of the month | 10 min (paste step + light deck edit) | `monthly/YYYY-MM.md` + `monthly/decks/YYYY-MM.pptx` | Repo + email |

Monday is a **weekend special edition** of the daily — extended source window to cover Sat-Sun.

---

## Daily run (Tier 1 — manual)

### Prereqs
- An RSS reader with all sources from `sources.md` subscribed (Feedly, Inoreader, or NetNewsWire). Group by tier (T1-T6) for fast scanning.
- A Claude Pro/Max account (or Claude API access).
- The repo cloned locally with this branch checked out.

### Steps

1. **Open RSS reader.** Set the filter to "last 24 hours" (or "since Friday 18:00" if running the Monday weekend-special edition).
2. **Scan & export raw items.** Skim all T1-T6 feeds. For every item that looks plausibly above the bar, copy:
   - Title
   - Source name
   - URL
   - Publication date
   - First paragraph (or the post's TL;DR if it has one)
   Paste each into a single working file `daily/_raw/YYYY-MM-DD.md` as a list. Aim for 25-40 items.
3. **Open Claude.** Start a new chat. Paste in:
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
6. **Save.** Write to `daily/YYYY-MM-DD.md`. Delete the `_raw/` working file (or keep it for one week as a debugging trail — your call).
7. **Regenerate indexes.** Run `scripts/build-indexes.sh` (TODO — to be written in Mission 7). Until then, update indexes manually if you want them fresh:
   - `index/by-category.md` — append the day's items under their categories
   - `index/by-entity.md` — append each entity tag's new appearances
   - `index/by-concept.md` — only if a new concept was introduced
   - `index/deep-dive-picks.md` — append any picks from today
8. **Commit & push.** Single commit per day: `Daily briefing — 2026-05-20`.
9. **Email yourself.** Copy the rendered Markdown into an email to `james.peck@myob.com`. Subject: `Daily AI Briefing — Thu 20 May 2026`. (Tier 3 will automate via Resend.)
10. **Log the time.** Note the actual end-to-end minutes in a row at the bottom of this file (see §Time log).

### Tier 2/3 automation notes
- **Tier 2:** n8n/Make.com runs steps 1-2 (RSS pull + dedupe), invokes Claude API for step 3, drops the draft into a PR. Steps 4-5 (human review) remain; steps 6-9 happen on PR merge via GitHub Action.
- **Tier 3:** Drops the human review step. Quality gate: if Claude's confidence-of-coverage flag is below threshold (fewer than N sources scanned successfully), draft a PR instead of auto-merging.

---

## Weekly run (Friday EOD)

### Prereqs
- The week's five daily briefings must be committed.
- NotebookLM access (free tier is enough).

### Steps

1. **Verify daily files.** Confirm `daily/<Mon>.md` through `daily/<Fri>.md` exist for this week.
2. **Open Claude.** Paste in:
   - `prompts/editor-system.md`
   - `prompts/weekly-recap.md`
   - All five daily briefings (in order)
   - `week_label` (e.g. `2026-W21`) and `week_range`
   - (Optional) last week's `weekly/YYYY-Www.md` for continuity
3. **Save the weekly recap.** Claude returns the weekly Markdown. Save to `weekly/<week_label>.md`. Front-matter has `audio_overview_url: TBD` — that's normal at this stage.
4. **Open NotebookLM.** https://notebooklm.google.com → New notebook.
5. **Upload the corpus.** Two options that both work:
   - Paste the full Markdown content as a "Pasted text" source.
   - Or upload the `weekly/<week_label>.md` file directly.
6. **Generate audio overview.** Click "Studio" → "Audio Overview" → "Generate". Wait ~3-5 min.
7. **Customise (optional).** Before generating, you can add a "Customise" instruction like *"Focus on the week's top three stories and the mid-market roundup. Skip the New Vocabulary section in the audio."* Improves the result noticeably.
8. **Get the share link.** Once generated, click the share icon on the audio → copy the public share URL.
9. **Update front-matter.** Open `weekly/<week_label>.md`, replace `audio_overview_url: TBD` with the share URL.
10. **Commit & push.** Single commit: `Weekly recap — 2026-W21 + NotebookLM audio`.
11. **Email yourself.** Send the Markdown + a prominent link to the audio overview. Subject: `Weekly AI Recap — W21 (Mon 18 — Fri 22 May 2026)`. Note: schedule for Friday 17:00 ideally, so it's waiting when the work week ends.

### Time check
Expected total: ~8 min wall clock (most of it waiting for NotebookLM to render). Human-attention time: ~3 min.

---

## Monthly run (Last weekday of the month)

### Prereqs
- All daily briefings for the month committed.
- All weekly recaps for the month committed.
- A Claude Pro/Max account (Claude Design is included).

### Steps

1. **Verify files.** Confirm all daily and weekly files for the month exist.
2. **Open Claude.** Paste in:
   - `prompts/editor-system.md`
   - `prompts/monthly-recap.md`
   - All daily files for the month
   - All weekly files for the month
   - `month_label` (e.g. `2026-05`) and `month_friendly` (`May 2026`)
   - (Optional) last month's recap
3. **Save the monthly recap.** Claude returns the monthly Markdown. Save to `monthly/<month_label>.md`. Front-matter has `deck_url: TBD` and `deck_path: monthly/decks/YYYY-MM.pptx` — both populated later.
4. **Open Claude Design.** https://claude.ai/design → New project.
5. **Generate the deck.** Paste the full monthly Markdown as the project input. Prompt: *"Generate an 8-12 slide presentation deck from this monthly AI briefing. Follow the structure suggested in the document. Keep visuals minimal and corporate. The audience is a leadership team — concise, scannable, no fluff."* Wait ~2-3 min.
6. **Review & light-edit the deck.** Skim every slide. Common fixes:
   - Tighten any slide that has more than ~6 bullets — break into two slides.
   - Add a single visual to the cover and the "trend lines" slide (Claude Design can generate these on request).
   - Check that the "Watch next month" section made it onto a closing slide.
7. **Export.** Export the deck as PPTX. Save to `monthly/decks/<month_label>.pptx`. Also copy the share URL.
8. **Update front-matter.** In `monthly/<month_label>.md`: set `deck_url:` to the share URL and confirm `deck_path:` matches the PPTX file you committed.
9. **Commit & push.** Single commit: `Monthly recap — May 2026 + Claude Design deck`.
10. **Email yourself.** Send the Markdown + the deck PPTX + the share URL. Subject: `Monthly AI Briefing — May 2026`.

### Time check
Expected total: ~15 min wall clock. Human-attention time: ~8 min (most of it on the light-edit pass of the deck).

---

## Failure modes

| What goes wrong | What to do |
|---|---|
| Claude hallucinates a source/URL | Drop the item entirely. Re-prompt Claude with: "Item X had a URL that 404s — drop it and regenerate." |
| RSS feed is unreachable | Note `(scrape failed)` in the Sources footer of the day's briefing. Don't block the run. |
| NotebookLM audio sounds wrong (wrong focus, confusing intro) | Open NotebookLM's "Customise" instruction and add specific guidance. Regenerate. (~3 more min.) |
| Claude Design produces a 6-slide deck instead of 8-12 | Re-prompt: "Expand to 8-12 slides. Each of the top 10 stories should have meaningful presence — group them 2-3 per slide rather than one combined slide." |
| You forget to run a day | Run a "catch-up" the next morning covering both days; mark `notes: catch-up run` in the front-matter. Don't try to fake a missed day with backdated content. |
| You're travelling / on PTO | Pause the daily entirely. The weekly recap can summarise from the days that did ship. Do not auto-run unreviewed in Tier 1. |

---

## Time log

Track actual end-to-end times per run. Helps justify (or deprioritise) Tier 2/3 automation investment.

| Date | Cadence | Wall-clock min | Human-attention min | Notes |
|---|---|---|---|---|
| 2026-05-20 | Daily (pilot) | TBD | TBD | First pilot run; baseline. |
| | | | | |

---

## Mission 7 transition plan

When this pipeline moves from Tier 1 (manual) to Tier 2 (semi-automated), the steps that disappear are:

- Daily steps 1-2 (RSS scanning + paste) → replaced by n8n RSS nodes + Firecrawl for non-RSS sources.
- Daily step 3 (paste into Claude) → replaced by Claude API call.
- Daily step 6 (save to file) → replaced by GitHub commit via PR or push.
- Daily step 9 (email) → replaced by Resend automation.

What survives the transition unchanged:
- The five prompt files (`prompts/*.md`).
- The taxonomy (`design.md` §5).
- The output format (`design.md` §6).
- The weekly NotebookLM and monthly Claude Design paste steps (no API for either of those at the consumer tier yet).

So the design choices made for Tier 1 ARE the choices for Tier 2/3 — nothing thrown away.
