# Prompt: Monthly Trend Pack (Last Weekday of Month)

> Runs on the last weekday of each calendar month. Takes the month's daily and weekly briefings and produces a single monthly Markdown corpus, formatted to be pasted directly into [claude.ai/design](https://claude.ai/design) for an 8-12 slide stakeholder-ready deck.

---

## System prompt

Load `prompts/editor-system.md` as the base persona, then append the instructions below.

## Input

1. **`month_label`**: e.g. `2026-05`.
2. **`month_friendly`**: e.g. `May 2026`.
3. **`daily_files`**: all daily briefings from this month (typically 20-23 files).
4. **`weekly_files`**: all weekly recaps from this month (typically 4-5 files).
5. **(Optional) `prior_month_recap`**: last month's `monthly/YYYY-MM.md` for trend continuity.

## Task

Produce a single Markdown document at `monthly/<month_label>.md`. The document serves three jobs simultaneously:

1. **Standalone read:** ~10 minute read for the reader, end-of-month catch-up.
2. **Claude Design corpus:** structured Markdown that Claude Design can convert directly into an 8-12 slide deck.
3. **Indexed reference:** acts as the authoritative "what happened in <Month>" entry, linked from `index/recaps.md`.

### Length target

~1500-2500 words of body text. The deck needs ~150-300 words per slide of source content for Claude Design to produce informative slides — so even a short month should hit at least 1500 words. A very busy month can stretch to 2500.

### Step-by-step

1. **Read everything.** All daily files, all weekly files. Pay particular attention to weekly "Themes" sections — those are the editor's monthly raw material.
2. **Top 10 stories.** Rank the month's biggest stories using `importance_score` and corroboration. These will be the spine of the deck.
3. **Trend lines.** Identify 3-5 multi-week patterns. Each trend gets: a name, 2-3 sentences of evidence drawn from across the month, and a forward-looking implication.
4. **Concept timeline.** Every `concept:` introduced this month, in order of first appearance, with the explainer. A concept that's been mentioned 3+ times in the month gets a "(now recurring)" flag.
5. **Mid-market roundup.** Consolidate all `lens:mid-market` items from the month. Group by sub-theme. This is the section the reader's mid-market PM peer group will care about most.
6. **Entity movers.** Top 5 entities by mention count this month, with a one-line "what they did" each. Useful for the deck's "labs/companies" slide.
7. **Deep dives.** Picks consumed vs. picks still in the backlog. Three-column-style summary.
8. **What to watch next month.** 3-5 items: announcements expected, regulatory deadlines, events.
9. **(If `prior_month_recap` provided) "Last month, checked."** Score the prior month's "Watch next month" against what actually happened.

### Output format

```markdown
---
month: YYYY-MM
month_friendly: <Month YYYY>
days_covered: <integer>
weekly_recaps: <integer>
top_stories: 10
trends: <integer>
new_concepts: <integer>
mid_market_items: <integer>
total_daily_items: <integer>
deck_url: TBD  # populated manually after claude.ai/design run
deck_path: monthly/decks/YYYY-MM.pptx  # populated when exported PPTX is committed
---

# Monthly AI Briefing — <Month YYYY>

## The month at a glance
<One-paragraph executive summary, 4-6 sentences. Written for someone who didn't read a single daily this month and needs to be up to speed in 60 seconds. This becomes the deck's opening slide.>

## Top 10 stories

### 1. <Story headline>
<2-3 sentence summary>
**Why it matters (PM):** <1 sentence>
**Why it matters (mid-market):** <1 sentence, only if applicable>
**Sources:** [link] · [link]

[…repeat 1-10…]

## Trend lines

### <Trend name>
<2-3 sentence description of the pattern, citing specific stories from the month. Calls out the trend's likely 3-6 month implication for the reader.>

[…repeat for 3-5 trends…]

## Mid-Market Roundup
<Sub-grouped: Packaging & pricing / Vertical AI / Compliance & channel / Distribution. Each item: one-sentence summary + source link. If a sub-group is empty for the month, drop it — don't include empty headings.>

## Concept timeline
<Chronological list of every concept introduced this month with the explainer. Mark recurring concepts (3+ mentions in month) with `🔁`.>

## Entity movers
**Top 5 entities by mentions this month:**
1. **<Entity>** (N mentions) — <one-line "what they did this month">
2. …

## Deep dives
**Consumed:**
- [Title] — <one-line "what you took from it">

**Backlog (still worth your time):**
- [Title] — <runtime/length> — <one-line "why">

## Watch next month
- <Item>
- <Item>
- <Item>

## Last month, checked
<If `prior_month_recap` provided. Score format same as weekly: ✅ / ⚠️ / ❌ / 🕒>

---

## This month's recaps
- [Week W18 — Mon 27 Apr — Fri 1 May](weekly/2026-W18.md)
- [Week W19 — Mon 4 May — Fri 8 May](weekly/2026-W19.md)
- […]
```

## Slide-friendly writing rules

Claude Design will use this Markdown to draft 8-12 slides. To get a good deck on the first generation:

1. **One H2 (`##`) per slide-worthy section.** Claude Design tends to map H2s to slide titles.
2. **Hierarchy matters.** Major sections at H2, story headlines at H3, sub-details flat. Don't go deeper than H3 — Claude Design starts losing structure.
3. **Lead each section with a clear sentence**, then supporting bullets/details. Claude Design lifts the lead sentence into the slide title or subtitle.
4. **Include the executive summary at the top.** Claude Design typically uses the first paragraph for the opener slide.
5. **Top 10 stories format consistently.** Each numbered story → potentially its own slide or a "stories grid" slide. Consistent format makes the layout consistent.
6. **Avoid heavy Markdown tables** in the body — Claude Design renders them OK but they often need manual cleanup. Prefer prose + bullets.
7. **End with the "Watch next month" section** for a clean forward-looking closing slide.

### Recommended deck shape (Claude Design will produce something close to this)

1. Cover — Month + 1-sentence summary
2. The month at a glance (executive summary)
3-5. Top stories (1-3 stories per slide depending on density)
6-7. Trend lines (1-2 trends per slide)
8. Mid-Market Roundup
9. New concepts / vocabulary
10. Entity movers (top 5)
11. Watch next month
12. (Optional) Sources / how this briefing is built

## Hand-off to claude.ai/design (workflow step)

The runbook (`workflow.md`) covers this, but in brief: paste the full Markdown of this monthly file into a new Claude Design project, prompt with: *"Generate an 8-12 slide presentation deck from this monthly AI briefing. Follow the structure suggested in the document. Keep visuals minimal and corporate."* Export as PPTX, commit to `monthly/decks/YYYY-MM.pptx`, update front-matter with the share URL.
