# Daily AI Briefing — Requirements & Solution Design

**Mission:** Weekend 6 — The Information Pipeline
**Owner:** James Peck
**Status:** Draft v1 (design only — sources list pending research agent return)
**Last updated:** 2026-05-21 (v1.1 — added deep-dive picks, concept tracking, mid-market lens)

---

## 1. Problem & Goal

### Problem
There is more AI news every day than any PM can keep up with. Important signals (new frontier models, funding moves, regulation, paradigm-shifting essays) sit alongside enormous volumes of low-value chatter (recycled takes, marketing posts, listicles). The result: most PMs either over-invest time skimming feeds, or under-invest and lose track of the field.

### Goal
A daily AI briefing — a digestible, opinionated, source-linked newsletter that lets a tech PM (not deeply technical) understand what changed in AI in the last 24 hours in **under 5 minutes of reading**, with deeper context one click away.

### Non-goals
- Not a research tool for AI engineers (too technical).
- Not a hype feed (no breathless coverage of every model fine-tune).
- Not a replacement for long-form learning — it's a *radar*, not a *classroom*.

---

## 2. Target Reader Profile

- **Role:** Product Manager / Product Lead in a tech company serving the **mid-market segment**.
- **Technical depth:** Comfortable with technical concepts, but not reading arXiv. Wants to understand "what does this mean for products and users" not "what's the architecture".
- **Time budget:** 5 minutes weekday morning, ~10 minutes weekly catch-up — plus a separate, deliberate slot (commute / gym / evening) for 1-3 deeper reads or videos per day.
- **Reading context:** Phone or laptop, often before standup.
- **Two lenses, applied per item:**
  1. **PM lens** — what does this change about how products get built, scoped, or shipped?
  2. **Mid-market lens** — what does this mean for software/AI products serving mid-sized businesses (typically 50-1,000 employees)? Captures pricing, packaging, SMB/mid-market launches by labs, vertical agents, compliance, channel partner dynamics. The 2026 Anthropic "Claude for Small Business" plugin launch is the canonical example — high PM signal *and* high mid-market signal.
- **What they need to know:**
  - Big announcements (models, products, M&A, regulation).
  - PM-applicable thinking — frameworks, case studies, how teams are using AI.
  - Macro signals — funding, market shifts, strategy essays.
  - Mid-market-relevant moves — SMB/mid-market product launches, vertical AI, pricing/packaging shifts.
  - Just enough technical context to hold a conversation in eng-product syncs.
  - **Emerging concepts and vocabulary** — new terms entering the discourse (e.g. "Harness as a Service", "agentic eval", "context engineering") with a short explainer so the reader can recognise them next time.

---

## 3. Functional Requirements

### F1. Source ingestion
- Pull from a curated, versioned source list (see `sources.md`).
- Mix of formats: RSS/Atom (preferred), email-only newsletters (forwarded), web pages (scraped).
- Rolling 24-hour window for daily; rolling 7-day window for weekly catch-up.
- Deduplicate items that appear across multiple sources (same story → one entry, multi-source linking).

### F2. Signal filtering
- Drop low-signal: SEO blog reposts, pure marketing posts, recycled takes, off-topic content.
- Identify high-signal categories (see §5 taxonomy).
- Rank by importance signal: number of sources covering it, source reputation tier, novelty, and PM-relevance.

### F3. Distillation
- 2–3 sentence digest per item, plain English.
- Always include **"Why it matters"** — one PM-lens sentence by default, plus a second **mid-market lens** sentence when the item has specific mid-market relevance (tag `lens:mid-market`).
- Always link to the original source(s).
- No hype language — neutral, calibrated tone.

### F8. Deep Dive Picks
- Surface **1-3 long-form items per day** that don't fit the 2-3 sentence digest format but reward a 20-60 min investment: keynote videos, podcast episodes, essays >2,000 words, talks, research breakdowns.
- Example: on the day Sequoia publishes AI Ascent, the keynote video belongs here, not as a Quick Hit.
- Each pick has: title, format (video / podcast / essay / talk), runtime or word count, source, **why it's worth your time** (one sentence), and the link.
- Picks can be from earlier than the 24h window if they just surfaced or just became newsworthy.
- This section is intentionally selective — if nothing meets the bar on a given day, ship fewer (or zero) rather than padding.

### F9. Emerging Concept Tracking
- The editor flags any **new term, framing, or concept** that appears in source material and is likely to enter wider discourse.
- Example: "Harness as a Service" from vtrivedy.com on agent infrastructure — exactly the kind of term a PM will hear in a meeting next week and need to recognise.
- Each concept gets a short standalone entry: term, one-paragraph plain-English explainer, origin/source link, and a `concept:` tag.
- Concepts are indexed (see §10) so the reader can search the archive for "first mention of X".
- Threshold: only flag concepts that (a) name something genuinely new or (b) reframe something existing in a way that's catching on. Don't flag every neologism.

### F10. Weekly Recap (Friday EOD)
- **Trigger:** Friday after the day's daily briefing has shipped.
- **Input:** that week's 5 daily briefings (Mon-Fri).
- **Output 1 — `weekly/YYYY-Www.md`:** Auto-generated week-in-review Markdown. Sections: top stories (ranked across the week), themes that recurred, every new concept introduced, deep-dive picks that surfaced, things to watch next week. ~800-1200 words.
- **Output 2 — NotebookLM audio overview:** ~10 minute AI-podcast-style audio overview. **Best for weekend listening on a commute or run.**
- **Output 3 — NotebookLM FAQ + glossary** (free byproduct of Output 2).
- **Delivery:** Weekly Markdown committed to repo + emailed Friday afternoon. Audio file linked from the weekly Markdown once generated.

### F11. Monthly Trend Pack (last weekday of month)
- **Trigger:** Last weekday of the calendar month.
- **Input:** that month's daily + weekly outputs.
- **Output 1 — `monthly/YYYY-MM.md`:** Auto-generated month-in-review Markdown. Sections: month at a glance, top 10 stories, trend lines (which entities/themes accelerated), concept timeline (what entered the vocabulary this month), mid-market roundup (`lens:mid-market` items consolidated), deep dives consumed vs. backlog, "what to watch next month". ~1500-2500 words.
- **Output 2 — Presentation deck (8-12 slides):** Generated from the monthly Markdown via [claude.ai/design](https://claude.ai/design). Export as PPTX/PDF. Use this for the team AI share session (Resolution 4) or for stakeholder briefings.
- **Delivery:** Monthly Markdown committed + emailed. Deck PPTX/PDF committed under `monthly/decks/YYYY-MM.pptx` (or link if hosted in Claude Design).

### F4. Categorisation & indexing
- Consistent taxonomy (see §5).
- Tag each item with: category, entities (companies/models/people), and themes.
- Maintain searchable indexes by category and entity so historical lookups work.

### F5. Output format
- One Markdown file per day at `daily/YYYY-MM-DD.md`.
- Structured front-matter (YAML) with metadata for indexing.
- Body: TL;DR → categorised sections → footer with sources scanned.
- Optional: paste into NotebookLM for audio overview; paste week's batch into Gamma for a Friday recap deck.

### F6. Reusability & repeatability
- Configuration-driven (sources list, taxonomy, prompts all in version control).
- Reproducible — same prompts + same source list → consistent output style day to day.
- Documented workflow / runbook so a future automation (Mission 7) can take over.

### F7. Provenance & trust
- Every claim links to source material.
- Never invent facts. If unverifiable, say so or drop the item.
- Note when an item is opinion/analysis vs. announcement.

---

## 4. Non-functional Requirements

| Attribute | Target |
|---|---|
| Read time | < 5 min weekdays, < 10 min weekly recap |
| Generation time | < 15 min end-to-end (v1, semi-manual) |
| Source coverage | 25–40 curated sources, tiered |
| Cost | < $1/day in API costs at v1 scale |
| Storage | Markdown files in this repo (no DB needed for v1) |
| Failure mode | If a source is unreachable, skip it and note in footer — never block the whole run |

---

## 5. Taxonomy (Consistent Categories)

These are the **only** top-level categories. Stability matters — historical search depends on it. Items get exactly one primary category; multiple tags.

| # | Category | What goes here |
|---|---|---|
| 1 | **Models & Capabilities** | New model releases, capability updates, benchmark results, deprecations |
| 2 | **Products & Tooling** | New AI products, API/SDK changes, dev tools, IDE features, agent platforms |
| 3 | **Business & Funding** | Funding rounds, M&A, partnerships, hires, org changes, financial results |
| 4 | **Research & Papers** | Notable papers, technical breakthroughs (translated into PM-readable English) |
| 5 | **Policy, Safety & Regulation** | EU AI Act, US executive orders, state laws, safety research, alignment news |
| 6 | **Industry Analysis** | Market analysis, strategy essays, macro takes on AI's economic impact |
| 7 | **Product Practice** | How PMs/teams are using AI, frameworks, case studies, hiring/role evolution |
| 8 | **Quick Hits** | Notable items not worth a full entry (one-liners with links) |

### Tag schema
- **Entities:** `entity:openai`, `entity:anthropic`, `entity:gpt-5.3`, `entity:eu-ai-act`, etc. (lowercase, kebab-case).
- **Themes:** `theme:agents`, `theme:safety`, `theme:enterprise`, `theme:multimodal`, `theme:eval`, etc.
- **Concepts:** `concept:harness-as-a-service`, `concept:context-engineering`, `concept:agentic-eval`, etc. — for emerging terminology (F9). One tag per concept; reused on every future mention so the archive shows the concept's trajectory.
- **Lens:** `lens:pm` (default, implicit) and `lens:mid-market` (added when item carries specific mid-market relevance). Drives whether the "Why it matters (mid-market)" line is generated.
- **Source-tier:** `tier:lab-official`, `tier:newsletter`, `tier:vc`, `tier:analyst`, `tier:community`.

---

## 6. Output Template

Each `daily/YYYY-MM-DD.md` follows this shape:

```markdown
---
date: 2026-05-21
read_time_min: 4
items: 12
deep_dive_picks: 2
new_concepts: 1
top_entities: [anthropic, sequoia, eu-ai-act]
categories_covered: [models, products, business, industry]
lenses: [pm, mid-market]
concepts_introduced: [harness-as-a-service]
sources_scanned: 32
---

# Daily AI Briefing — Thu 21 May 2026

## TL;DR
- [One-line] Anthropic ships Claude for Small Business; matters because…
- [One-line] EU finalises Y; matters because…
- [One-line] $Nb funding into Z; matters because…

## 🧠 Models & Capabilities
### Anthropic releases Claude Opus 4.8 with native video
2-3 sentence distilled summary in plain English.
**Why it matters (PM):** One sentence on product implications.
**Sources:** [Anthropic](url) · [The Neuron](url) · [Stratechery](url)
**Tags:** `entity:anthropic` `entity:claude-opus-4-8` `theme:multimodal`

## 📦 Products & Tooling
### Anthropic launches Claude for Small Business plugin
2-3 sentence distilled summary in plain English.
**Why it matters (PM):** Shows labs are now shipping vertical packaging, not just horizontal APIs — pricing/onboarding becomes the product surface.
**Why it matters (mid-market):** First major lab offering a packaged SMB tier with built-in templates — sets the expected baseline for mid-market AI plays and likely forces competitive responses from Microsoft Copilot and Google Workspace AI.
**Sources:** [Anthropic](https://claude.com/plugins/small-business) · [The Neuron](url)
**Tags:** `entity:anthropic` `theme:packaging` `lens:mid-market`

[…repeat per item, grouped by category…]

## 🎓 Deep Dive Picks (1-3)
Long-form items worth a dedicated slot in your day.

### 📺 Sequoia AI Ascent 2026 keynote
**Format:** Video · **Runtime:** 47 min · **Source:** [YouTube](https://www.youtube.com/watch?v=96jN2OCOfLs)
**Why it's worth your time:** Sequoia's annual state-of-AI map; the framings here (market structure, agent economics, where moats actually sit) tend to become shared vocabulary across the industry for the following 6 months.

### 📝 The Anatomy of an Agent Harness — V. Trivedy
**Format:** Essay · **~3,200 words · **Source:** [vtrivedy.com](https://www.vtrivedy.com/posts/the-anatomy-of-an-agent-harness)
**Why it's worth your time:** Introduces the "Harness as a Service" framing for agent infrastructure — useful mental model for evaluating any agent-platform pitch you'll see this quarter.

## 📒 New Concepts
### Harness as a Service (HaaS)
**Plain English:** The runtime layer that wraps an LLM with tools, memory, permissions, and loop control — the thing that turns a model into an agent. Vendors are starting to sell the harness as a product separate from the model itself, the way infra companies sold orchestration separate from compute.
**Origin:** [V. Trivedy — The Anatomy of an Agent Harness](https://www.vtrivedy.com/posts/the-anatomy-of-an-agent-harness)
**Tag:** `concept:harness-as-a-service`

## ⚡ Quick Hits
- Mistral open-sources X — [link]
- Cohere hires Y from Z — [link]

---

## Sources scanned today (32)
Anthropic blog · OpenAI news · The Neuron Daily · …
```

---

## 7. Architecture — Three Build Tiers

I'm recommending we **start at Tier 1** for Mission 6 (the pipeline + first newsletter is the deliverable), then evolve toward Tier 2/3 in Mission 7 (First Automation).

### Tier 1 — Assistant-driven (v1, recommended for this weekend)
**Time to build:** ~half a day. **Cost:** ~$0.10/run. **Reliability:** Manual trigger.

```
Sources list (Markdown)
   │
   ▼
RSS aggregator (Feedly or Inoreader) collects last 24h
   │
   ▼
Export raw items → paste into Claude with system prompt
   │
   ▼
Claude drafts categorised newsletter → human reviews → commit to repo
   │
   ▼
(Weekly) Paste week's batch into NotebookLM for audio overview
(Weekly) Paste week's batch into Gamma → 8-12 slide recap deck
```

Pros: Ships this weekend. Hits Mission 6 Done When. Human-in-the-loop quality control.
Cons: Manual trigger; ~20 min of human time per run.

### Tier 2 — Semi-automated (Mission 7 candidate)
**Time to build:** ~1-2 days. **Cost:** ~$0.50/day. **Reliability:** Scheduled.

```
n8n / Make.com workflow runs at 06:00 daily
   │
   ├── Pull RSS feeds in parallel
   ├── Scrape non-RSS sources (Firecrawl / Apify)
   ├── Forward newsletters from a dedicated Gmail label
   │
   ▼
Dedupe + cluster (same story across sources)
   │
   ▼
Claude API: categorise + score importance + draft digests
   │
   ▼
Output to Markdown file → PR to repo (or commit to a daily branch)
   │
   ▼
Human reviews PR → merge → done
```

### Tier 3 — Fully automated (later, when trust is earned)
**Time to build:** ~3-5 days. **Cost:** ~$1/day. **Reliability:** Hands-off.

- Vercel cron or GitHub Actions cron triggers a Node script.
- Stored prompts/sources as code in this repo.
- Output: commit to repo + optional email send via Resend.
- Quality gates: if confidence is low or fewer than N sources scanned successfully, draft a PR instead of auto-merging.

---

## 7a. Automation Reality — What's Actually Hands-Off

API status verified May 2026. This table is the honest answer to *"can we just automate the whole thing?"*

| Output | API available? | Tier 1 (manual) | Tier 2 (recommended) | Tier 3 (fully hands-off) |
|---|---|---|---|---|
| **Daily Markdown** (F1-F9) | ✅ Claude API | Paste raw items into Claude.ai | n8n/Make.com pulls RSS → Claude API → repo commit | Vercel cron → Claude API → repo commit + Resend email |
| **Weekly Markdown** (F10) | ✅ Claude API | Paste week's 5 dailies into Claude.ai | Friday cron summarises this week's files | Same as Tier 2 |
| **Weekly audio** (F10) | ⚠️ Limited | Paste weekly Markdown into NotebookLM, click "generate audio" (~2 min) | Same — pipeline emails the corpus + a one-click NotebookLM link Friday at 4pm | NotebookLM Enterprise API (requires GCP Enterprise + NotebookLM Enterprise subscription, ~$$$) OR unofficial `notebooklm-py` (works but unofficial, may break) |
| **Monthly Markdown** (F11) | ✅ Claude API | Paste month into Claude.ai | Month-end cron summarises the month | Same as Tier 2 |
| **Monthly deck** (F11) | ⚠️ UI only | Paste monthly Markdown into [claude.ai/design](https://claude.ai/design), click generate, export PPTX/PDF (~5 min) | Same — pipeline emails the corpus + one-click link on the last weekday of the month | No public Claude Design API yet (research preview as of April 2026). Fallback for true zero-touch: Claude API generates standalone HTML/Reveal.js deck — less polished than Claude Design but no manual step. |

**Recommended automation path for this project:**
- **Daily + Weekly Markdown + Monthly Markdown:** Tier 3 (Vercel cron + Claude API). All three are purely text — fully hands-off.
- **Weekly audio:** Tier 2. NotebookLM consumer audio overview has no official API; semi-manual is the honest answer until Google ships one. The 2-min paste step is acceptable given the weekly cadence.
- **Monthly deck:** Tier 2 via [claude.ai/design](https://claude.ai/design). No extra subscription beyond existing Claude Pro/Max. ~5-min paste step once a month is acceptable for a stakeholder-facing artifact, and the output quality is closer to Gamma than the raw-HTML fallback.

This means the **two manual steps in the entire pipeline are ~2 min/week (NotebookLM audio) and ~5 min/month (Claude Design deck)** — total ~13 min of human time per month. Every other output lands in your inbox already done.

---

## 8. Prompts (v1 outline — to live in `prompts/`)

Three prompt files form the contract between sources and output:

1. **`prompts/editor-system.md`** — Editor persona: a calm, calibrated, PM-literate editor. Defines tone (neutral, no hype, plain English), audience (tech PM, not engineer), and absolute rules (always cite sources, never invent, always include "why it matters", drop low-signal).
2. **`prompts/daily-digest.md`** — The daily run prompt. Takes raw items + date + the editor system prompt; returns the structured Markdown digest.
3. **`prompts/categorisation.md`** — A lightweight categoriser used either as a pre-pass (Tier 2/3) or as part of the daily prompt (Tier 1).

These will be written next, after sources are finalised — the source tiers feed directly into the editor's source-trust weighting.

---

## 9. Sources Strategy (high level — full list in `sources.md`)

Sources are tiered by trust + signal density. The editor weights items from higher tiers more heavily when ranking.

| Tier | Type | Examples | Trust |
|---|---|---|---|
| T1 | Primary lab announcements | Anthropic news, OpenAI news, Google DeepMind blog, xAI news, Meta AI blog | Highest — primary source |
| T2 | Established AI analysts / newsletters | The Neuron, Stratechery, Import AI, The Batch, Latent Space, Ben's Bites | High — curated, opinionated |
| T3 | Top-tier VCs publishing AI thinking | Sequoia, a16z, Bessemer, Greylock, NfX, YC | High for strategy, lower for breaking news |
| T4 | PM thought leaders | Lenny, Aakash Gupta, Reforge, Shreyas Doshi, Marty Cagan | High for product practice |
| T5 | Aggregators / community | HN AI, Hugging Face Papers, Simon Willison, AlphaSignal | Medium — needs filtering |

Full curated list with URLs, RSS availability, cadence, and signal-to-noise rating will be populated in `sources.md` once the research pass completes.

---

## 10. Indexing & Search

Five derived indexes maintained alongside daily output:

- **`index/by-category.md`** — Reverse-chronological list per category. Lets you ask "what happened in Policy & Regulation this quarter?"
- **`index/by-entity.md`** — Items grouped by company/model/topic tag. Lets you ask "what's the rolling story on Anthropic this year?"
- **`index/by-concept.md`** — Each concept tag with its first-mention date, plain-English explainer, and every subsequent appearance. Lets you ask "when did 'Harness as a Service' first show up, and how has the conversation around it evolved?"
- **`index/deep-dive-picks.md`** — Reverse-chronological list of every Deep Dive Pick, with format, runtime/length, and the "why it's worth your time" line. Lets you build a backlog or revisit picks you missed.
- **`index/recaps.md`** — Reverse-chronological list of weekly (`weekly/YYYY-Www.md`) and monthly (`monthly/YYYY-MM.md`) recaps, with audio/deck links. Single hub for the long-form views.

All four are regenerated each run from the front-matter of daily files (so they're always in sync, no manual upkeep).

For v1, all indexes are plain Markdown. Future option: a small Next.js page in the existing tracker app that reads the Markdown and offers full-text search.

---

## 11. Quality Bar

A briefing is acceptable if:

1. ✅ Every item has a source link.
2. ✅ Every item answers "why it matters (PM)" in one sentence; mid-market lens added when `lens:mid-market` applies.
3. ✅ Tone is neutral — no "game-changing", "revolutionary", "mind-blowing".
4. ✅ Total read time ≤ 5 minutes (Deep Dive Picks excluded — they're opt-in).
5. ✅ At least one item from a T1 lab source (if there was T1-newsworthy activity).
6. ✅ No invented facts — anything I can't verify against a source gets dropped.
7. ✅ Categories are stable — same names every day, no ad-hoc one-offs.
8. ✅ Deep Dive Picks: between 0 and 3, never more. Each justified in one "why it's worth your time" sentence. If nothing meets the bar, omit the section — don't pad.
9. ✅ New Concepts: only flagged when the term is genuinely new or being repositioned. Each comes with a plain-English explainer a non-engineer can repeat.
10. ✅ Mid-market lens: applied whenever the item touches SMB/mid-market packaging, pricing, vertical AI, or compliance/channel dynamics — not only when a source explicitly says "mid-market".

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Hallucinated summaries | Always pass raw source text into the prompt; require citations; spot-check 1 item per day |
| Source rot (URLs change) | Version `sources.md`; archive snapshots quarterly |
| Echo chamber (same takes repeated) | Tier sources; cap items per source per day; explicitly weight contrarian/analyst pieces |
| LLM bias / model drift | Snapshot prompts in repo; document which model produced each run in front-matter |
| Over-coverage of US/big-lab news | Reserve 1-2 slots/day for non-US / open-source / smaller-lab news |
| Burnout — daily commitment is high | Weekly digest fallback if a day is skipped; pipeline supports both cadences |

---

## 13. Mission 6 Acceptance Criteria

Per the mission brief — *"You can brief someone on the material in under 7 minutes using your deck."*

Deliverables for this weekend:

- [x] `design.md` — this document.
- [x] `sources.md` — curated, tiered source list with RSS URLs.
- [ ] `taxonomy.md` — formal category + tag definitions (can also live as §5 here; promote to its own file only if it grows).
- [ ] `prompts/editor-system.md`, `prompts/daily-digest.md`, `prompts/categorisation.md`, `prompts/weekly-recap.md`, `prompts/monthly-recap.md`.
- [ ] `workflow.md` — step-by-step runbook for Tier 1, including the weekly NotebookLM paste step and monthly Gamma paste step (or API call).
- [ ] `daily/2026-05-20.md` — pilot daily briefing (per §15 decision 3).
- [ ] **claude.ai/design deck** (8-12 slides) generated from the 20 May pilot briefing — proves the monthly-deck flow.
- [ ] **NotebookLM audio overview** generated from the 20 May pilot briefing — proves the weekly-audio flow.
- [ ] Time the pilot run end-to-end; record in `workflow.md`.

---

## 14. Path to Mission 7

This pipeline is intentionally designed to become Mission 7's First Automation:
- Tier 1 (manual) proves the prompts and taxonomy work.
- Tier 2 (semi-automated) replaces the human paste step with n8n/Make.com + Claude API.
- Tier 3 (fully automated) moves into the existing Next.js tracker repo as a Vercel cron + Resend email.

This means Mission 6 effort is not throwaway — every artifact (sources list, taxonomy, prompts, runbook) is the foundation for Mission 7.

---

## 15. Decisions (locked)

| # | Decision | Resolution |
|---|---|---|
| 1 | Delivery channel | **Commit to repo + email to `james.peck@myob.com`.** |
| 2 | Cadence | **Weekdays only (Mon-Fri).** Monday edition is a "weekend special" that covers anything newsworthy from Sat-Sun. |
| 3 | Pilot corpus | **20 May 2026 news** as the live pilot for daily Markdown + NotebookLM audio + Claude Design deck. |
| 4 | NotebookLM/Claude Design scope | Both are run on the **daily/weekly/monthly briefing Markdown** as their corpus — not on the pipeline design itself. Mission 6 deliverables = audio + deck generated from the 20 May pilot briefing. |
| 5 | Weekly recap | Every Friday EOD: auto-generate `weekly/YYYY-Www.md` + paste into NotebookLM for ~10-min audio overview. Emailed Friday afternoon. |
| 6 | Monthly recap | Last weekday of month: auto-generate `monthly/YYYY-MM.md` + paste into [claude.ai/design](https://claude.ai/design) for 8-12 slide deck (PPTX/PDF export). No extra subscription needed beyond existing Claude Pro/Max. |
| 7 | Automation tier per output | See §7a matrix. Two manual steps total: ~2 min/week (NotebookLM audio) + ~5 min/month (Claude Design deck) = ~13 min human time per month. Everything else fully hands-off. |
