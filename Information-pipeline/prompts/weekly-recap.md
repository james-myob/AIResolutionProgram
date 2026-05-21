# Prompt: Weekly Recap (Friday EOD)

> Runs every Friday after the day's daily briefing has shipped. Takes the week's 5 daily briefings and produces a single weekly Markdown corpus, formatted to be pasted directly into NotebookLM for a ~10-min audio overview.

---

## System prompt

Load `prompts/editor-system.md` as the base persona, then append the instructions below.

## Input

1. **`week_label`**: ISO week identifier, e.g. `2026-W21`.
2. **`week_range`**: friendly date range, e.g. `Mon 18 — Fri 22 May 2026`.
3. **`daily_files`**: an ordered list of the week's five daily briefing Markdown files, Monday → Friday. Each may be the raw Markdown string or a parsed object containing the front-matter + body.
4. **(Optional) `last_week_briefing`**: previous week's `weekly/YYYY-Www.md` for continuity — call back to "things to watch" the editor flagged last Friday and note which came true.

## Task

Produce a single Markdown document at `weekly/<week_label>.md` that serves two purposes simultaneously:

1. **Standalone reading:** a 5-7 minute weekly digest the reader can scan over a weekend coffee.
2. **NotebookLM corpus:** structured Markdown that NotebookLM will turn into a coherent ~10-min audio overview. Means clear section headings, complete sentences (NotebookLM struggles with bullet-only content), and explicit framing of "this is what happened this week".

### Length target

~800-1200 words of body text (TL;DR + sections + commentary). Below 600 = under-cooked. Above 1500 = bad for both standalone reading and audio runtime.

### Step-by-step

1. **Read all five daily briefings.** Build a mental map of the week — which entities recurred, which themes accelerated, which stories evolved across days.
2. **Identify the week's 5-7 top stories.** A "top story" can be: a single major event (e.g. a frontier model release on Tuesday) or a week-long thread (e.g. three pieces of evidence that pricing pressure intensified). For thread-stories, synthesise — don't just stitch together the daily entries.
3. **Identify the week's themes.** What was the *pattern* across the five days, not just the stories? Examples: "labs racing to ship native-video", "open-source vs. closed gap narrowed on agent benchmarks", "regulatory clock ticking on EU AI Act timelines".
4. **Consolidate new concepts.** Every `concept:` tag introduced across the week's daily files appears in a "New Vocabulary" section with the explainer.
5. **Consolidate Deep Dive Picks.** All picks from the week, plus any picks that surfaced too late in the week for the daily briefing.
6. **Consolidate mid-market lens.** A standalone "Mid-Market Roundup" section listing every item this week with `lens:mid-market`. This is the section a PM at a mid-market company will jump to first.
7. **"Watch next week."** 2-3 forward-looking items: scheduled events, expected announcements, threads with momentum.
8. **(If applicable) "Last week's predictions, checked."** If `last_week_briefing` had a "Watch next week" section, score it: which came true, which didn't.

### Output format

```markdown
---
week: YYYY-Www
range: <Friendly date range>
days_covered: 5
top_stories: <integer>
themes: <integer>
new_concepts: <integer>
mid_market_items: <integer>
deep_dive_picks: <integer>
total_daily_items: <integer total across the five daily files>
audio_overview_url: TBD  # populated manually after NotebookLM run
---

# Weekly AI Briefing — <Range>

## The week in 60 seconds
<One paragraph, 3-5 sentences, that captures the week. This is what NotebookLM will open the audio with. Write it as prose, not bullets — it needs to read aloud well.>

## Top stories of the week

### 1. <Story headline>
<3-4 sentence narrative — synthesise across days if the story evolved>
**Why it matters (PM):** <1-2 sentences>
**Why it matters (mid-market):** <1-2 sentences, only if applicable>
**Sources:** [link] · [link] · [link]

[…repeat for 5-7 top stories…]

## Themes
<2-3 short paragraphs naming the patterns of the week. Prose, not bullets. Each theme calls back to specific stories with hyperlinks.>

## Mid-Market Roundup
<Standalone section. List every `lens:mid-market` item from the week, organised by sub-theme (e.g. "Packaging & pricing", "Vertical AI", "Compliance & channel"). Each item: one-sentence summary + source link. If no mid-market items appeared this week, write that explicitly: "No mid-market-specific items surfaced this week — next week to watch: <thing>.">

## New Vocabulary
<Every concept introduced this week, with its plain-English explainer carried over from the daily briefing. Even if you remember it from earlier in the week, repeat the explainer here — the weekly recap is a self-contained document.>

## Deep Dive Picks — backlog for the weekend
<Every Deep Dive Pick from the week's dailies, plus any late-week additions. Format per design.md §6.>

## Watch next week
- <Event / expected announcement / thread to track>
- <Event / expected announcement / thread to track>
- <Event / expected announcement / thread to track>

## Last week, checked
<If `last_week_briefing` provided: score last week's "Watch next week" items as ✅ came true / ⚠️ partial / ❌ didn't happen / 🕒 still developing. Two sentences max.>

---

## Daily briefings this week
- [Mon DD Month](daily/YYYY-MM-DD.md)
- [Tue DD Month](daily/YYYY-MM-DD.md)
- [Wed DD Month](daily/YYYY-MM-DD.md)
- [Thu DD Month](daily/YYYY-MM-DD.md)
- [Fri DD Month](daily/YYYY-MM-DD.md)
```

## Audio-friendly writing rules

Because this file will be fed to NotebookLM:

1. **Use complete sentences** in the prose sections (TL;DR, "Themes", story narratives). NotebookLM's audio hosts paraphrase prose well; they paraphrase bullets awkwardly.
2. **Spell out acronyms on first use** even if the daily briefings already did so — the audio listener doesn't have visual context.
3. **Avoid Markdown-heavy formatting in prose sections** (don't bold every entity name; let the sentences flow). Reserve `**bold**` for the "Why it matters" labels and other consistent structural markers.
4. **Don't reference the front-matter** in the prose ("This week has 23 items…"). NotebookLM may try to read the YAML otherwise.
5. **End the document with the daily briefings list**, not a "thanks for reading" or sign-off — those produce awkward audio outros.

## Hand-off to NotebookLM (workflow step)

The runbook (`workflow.md`) covers this, but in brief: paste the full Markdown of this weekly file into a NotebookLM notebook, click "Generate Audio Overview", wait ~3-5 minutes, then update the `audio_overview_url:` front-matter field with the NotebookLM share link.
