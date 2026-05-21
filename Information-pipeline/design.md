# Daily AI Briefing — Requirements & Solution Design

**Mission:** Weekend 6 — The Information Pipeline
**Owner:** James Peck
**Status:** Draft v1 (design only — sources list pending research agent return)
**Last updated:** 2026-05-21

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

- **Role:** Product Manager / Product Lead in a tech company.
- **Technical depth:** Comfortable with technical concepts, but not reading arXiv. Wants to understand "what does this mean for products and users" not "what's the architecture".
- **Time budget:** 5 minutes weekday morning, ~10 minutes weekly catch-up.
- **Reading context:** Phone or laptop, often before standup.
- **What they need to know:**
  - Big announcements (models, products, M&A, regulation).
  - PM-applicable thinking — frameworks, case studies, how teams are using AI.
  - Macro signals — funding, market shifts, strategy essays.
  - Just enough technical context to hold a conversation in eng-product syncs.

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
- Always include **"Why it matters for a PM"** sentence — the single biggest differentiator from generic AI newsletters.
- Always link to the original source(s).
- No hype language — neutral, calibrated tone.

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
- **Source-tier:** `tier:lab-official`, `tier:newsletter`, `tier:vc`, `tier:analyst`, `tier:community`.

---

## 6. Output Template

Each `daily/YYYY-MM-DD.md` follows this shape:

```markdown
---
date: 2026-05-21
read_time_min: 4
items: 12
top_entities: [anthropic, openai, eu-ai-act]
categories_covered: [models, products, policy, industry]
sources_scanned: 32
---

# Daily AI Briefing — Thu 21 May 2026

## TL;DR
- [One-line] Anthropic ships X; matters because…
- [One-line] EU finalises Y; matters because…
- [One-line] $Nb funding into Z; matters because…

## 🧠 Models & Capabilities
### Anthropic releases Claude Opus 4.8 with native video
2-3 sentence distilled summary in plain English.
**Why it matters for a PM:** One sentence on product implications.
**Sources:** [Anthropic](url) · [The Neuron](url) · [Stratechery](url)
**Tags:** `entity:anthropic` `entity:claude-opus-4-8` `theme:multimodal`

[…repeat per item, grouped by category…]

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

Two derived indexes maintained alongside daily output:

- **`index/by-category.md`** — Reverse-chronological list per category. Lets you ask "what happened in Policy & Regulation this quarter?"
- **`index/by-entity.md`** — Items grouped by company/model/topic tag. Lets you ask "what's the rolling story on Anthropic this year?"

Both regenerated each run from the front-matter of daily files (so they're always in sync, no manual upkeep).

For v1, both indexes are plain Markdown. Future option: a small Next.js page in the existing tracker app that reads the Markdown and offers full-text search.

---

## 11. Quality Bar

A briefing is acceptable if:

1. ✅ Every item has a source link.
2. ✅ Every item answers "why it matters for a PM" in one sentence.
3. ✅ Tone is neutral — no "game-changing", "revolutionary", "mind-blowing".
4. ✅ Total read time ≤ 5 minutes.
5. ✅ At least one item from a T1 lab source (if there was T1-newsworthy activity).
6. ✅ No invented facts — anything I can't verify against a source gets dropped.
7. ✅ Categories are stable — same names every day, no ad-hoc one-offs.

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

- [ ] `design.md` — this document.
- [ ] `sources.md` — curated, tiered source list with RSS URLs.
- [ ] `taxonomy.md` — formal category + tag definitions.
- [ ] `prompts/editor-system.md`, `prompts/daily-digest.md`, `prompts/categorisation.md`.
- [ ] `workflow.md` — step-by-step runbook for Tier 1.
- [ ] `daily/<sample-date>.md` — one real pilot newsletter to prove the pipeline.
- [ ] **Gamma deck** (8-12 slides) explaining the pipeline + showcasing a sample day's output. Saved into the repo (PDF/link).
- [ ] **NotebookLM audio overview** of the sample newsletter — saved/linked from `README.md`.
- [ ] Time the pilot run end-to-end; record in `workflow.md`.

---

## 14. Path to Mission 7

This pipeline is intentionally designed to become Mission 7's First Automation:
- Tier 1 (manual) proves the prompts and taxonomy work.
- Tier 2 (semi-automated) replaces the human paste step with n8n/Make.com + Claude API.
- Tier 3 (fully automated) moves into the existing Next.js tracker repo as a Vercel cron + Resend email.

This means Mission 6 effort is not throwaway — every artifact (sources list, taxonomy, prompts, runbook) is the foundation for Mission 7.

---

## 15. Open Questions (need your input before implementation)

1. **Delivery channel:** Daily commit to repo only? Or also email-to-self via Resend / forward to a dedicated Gmail label?
2. **Cadence:** True daily (Mon-Fri), or 3x/week (Mon/Wed/Fri)? Daily is more work but builds a tighter habit.
3. **Pilot corpus:** Use *yesterday's* (20 May 2026) news as the live pilot, or a "synthetic" recent week to derisk?
4. **NotebookLM/Gamma output:** Do you want the deck/audio about *the pipeline itself* (meta — fits "brief someone in 7 min") or about *a sample day's news* (object-level)? I'd lean meta for Mission 6's Done When.
