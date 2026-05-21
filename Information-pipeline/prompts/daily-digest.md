# Prompt: Daily Digest

> The main daily run prompt. Takes a list of raw items (optionally pre-categorised) and the date, and returns the complete daily briefing Markdown.

---

## System prompt

Load `prompts/editor-system.md` as the base persona, then append the instructions below.

## Input

Two inputs:

1. **`date`**: ISO date string for the briefing, e.g. `2026-05-20`. Use this for the heading, front-matter, and "what shipped today" framing.
2. **`raw_items`**: a list of news items. Each item has at minimum `title`, `source`, `url`, and either `summary_or_body` or `body_excerpt`. May also include the pre-pass fields from `prompts/categorisation.md` (`category`, `entities`, `themes`, `importance_score`, etc.). If pre-pass fields are absent, perform categorisation inline using the rules from `categorisation.md`.

Optional inputs (use if provided):
- **`yesterday_briefing`**: yesterday's `daily/YYYY-MM-DD.md` — for continuity (don't repeat stories that were already covered unless materially updated).
- **`entity_index`** and **`concept_index`**: existing tag corpus, so you re-use tags consistently rather than inventing new ones.

## Task

Produce a single Markdown document that is the daily briefing for `date`. Follow `design.md` §6 output template *exactly*, including YAML front-matter.

### Step-by-step

1. **Triage.** For every item in `raw_items`, decide: include in a category, demote to Quick Hits, or drop. Apply `drop` rules from `categorisation.md`.
2. **Dedupe.** Cluster items that cover the same story across multiple sources. One entry per story; multi-source link list ordered by tier (T1 first).
3. **Cap at 2 items per source per day** (except T1 lab announcements, which are uncapped). If a single outlet has more, keep the strongest 2.
4. **Rank within each category** by `importance_score` (or your inline equivalent).
5. **Compose TL;DR.** Three one-line bullets, each ending with "matters because…". Pick the three highest-impact items across all categories.
6. **Write category sections.** Use the eight stable categories. Omit a category entirely if no items qualify — don't include empty sections. Each item follows the §6 template:
   - Heading: the story (not the outlet)
   - 2-3 sentence digest
   - **Why it matters (PM):** one sentence
   - **Why it matters (mid-market):** one sentence (only if `lens:mid-market`)
   - **Sources:** ordered list of all source links
   - **Tags:** entity / theme / concept / lens tags
7. **Deep Dive Picks.** Surface 0-3 long-form items (videos, podcasts, essays >2000 words). For each: title, format/runtime, source link, one-sentence "why it's worth your time". Skip the section if nothing qualifies.
8. **New Concepts.** For any item where the pre-pass identified `concepts_introduced`, produce a New Concept entry: term, plain-English paragraph, origin link, `concept:` tag. If you're flagging a concept inline (no pre-pass), apply the strict threshold from editor-system.md.
9. **Quick Hits.** One-liners for items that don't merit a full entry but are still worth knowing. Format: `Source — one-line summary [link]`. Cap at 8.
10. **Sources footer.** List of every source you scanned, comma-separated. Mark `(scrape failed)` for any source that was attempted but unreachable.
11. **Front-matter.** Populate with counts and tag lists derived from your output.

### Output format

```markdown
---
date: YYYY-MM-DD
read_time_min: <integer estimate>
items: <integer total count of category-section items, excluding Quick Hits and Deep Dive Picks>
deep_dive_picks: <0-3>
new_concepts: <integer>
top_entities: [entity:foo, entity:bar, entity:baz]  # top 3-5 by mention count
categories_covered: [models, products, ...]  # short slugs of categories that have content
lenses: [pm, mid-market]  # mid-market only if any item triggered it
concepts_introduced: [concept:foo]  # only if any
sources_scanned: <integer>
---

# Daily AI Briefing — <Day> <DD> <Month> <YYYY>

## TL;DR
- [Bullet 1] — matters because …
- [Bullet 2] — matters because …
- [Bullet 3] — matters because …

## 🧠 Models & Capabilities
### <Headline of story>
<2-3 sentence digest>
**Why it matters (PM):** <one sentence>
**Why it matters (mid-market):** <one sentence, only if applicable>
**Sources:** [Source 1](url) · [Source 2](url)
**Tags:** `entity:foo` `theme:bar`

[…repeat per item, grouped by the eight stable categories, in this order: Models & Capabilities → Products & Tooling → Business & Funding → Research & Papers → Policy/Safety & Regulation → Industry Analysis → Product Practice…]

## 🎓 Deep Dive Picks (0-3)
### 📺 <Title>
**Format:** Video · **Runtime:** N min · **Source:** [link]
**Why it's worth your time:** <one sentence>

## 📒 New Concepts
### <Term>
**Plain English:** <paragraph>
**Origin:** [Source](url)
**Tag:** `concept:term-as-kebab`

## ⚡ Quick Hits
- <Source> — <one-line summary> [link]
- …

---

## Sources scanned today (<N>)
<Source>, <Source>, <Source>, …
```

### Section emoji conventions

Use these consistently — they're how the reader scans:

- 🧠 Models & Capabilities
- 📦 Products & Tooling
- 💰 Business & Funding
- 🔬 Research & Papers
- ⚖️ Policy, Safety & Regulation
- 📈 Industry Analysis
- 🛠️ Product Practice
- 🎓 Deep Dive Picks
- 📒 New Concepts
- ⚡ Quick Hits

Deep Dive Pick format emojis:
- 📺 Video
- 🎙️ Podcast
- 📝 Essay
- 🎤 Talk / keynote

## Read-time budget

Aim for `read_time_min` between 3 and 5. Calculation: ~200 words/min, count body words (TL;DR + category sections + Quick Hits + New Concepts paragraphs). Exclude Deep Dive Picks (opt-in section) and the Sources footer. Round up.

If your draft pushes >5 min:
- Demote weaker category items to Quick Hits.
- Tighten digests to 2 sentences instead of 3.
- Drop items with the lowest `importance_score`.

If your draft is <2 min and you're confident you scanned the full source list, ship it short — don't pad. Short days exist.

## Worked example

For an example of the desired output, see the inline template in `design.md` §6. The `daily/2026-05-20.md` pilot file is the canonical reference once it exists.

## Hand-off to indexes

After producing the briefing, the workflow runbook regenerates `index/by-category.md`, `index/by-entity.md`, `index/by-concept.md`, `index/deep-dive-picks.md`, and `index/recaps.md` from the front-matter and content of all daily files. You do not need to update the indexes — they are derived. Just make sure the front-matter is accurate.
