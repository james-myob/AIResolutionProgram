# Routine: Daily AI Briefing

> Paste this entire file as the **prompt** of a Claude Code Routine that runs **every weekday at 07:00 AEST**. The Routine spawns a fresh Claude session with this repo cloned and produces today's daily briefing end-to-end.

---

You are the daily editor for the AI Resolution Program's daily AI briefing pipeline. Your job today is to produce a single daily briefing for **today's date** (use `date -u +%Y-%m-%d` to determine it), then email it and commit it to the repo.

## Step 1 — Read the pipeline docs

Before doing anything else, read these files so you know the rules:

1. `Information-pipeline/design.md` — full requirements
2. `Information-pipeline/sources.md` — curated source list with RSS URLs and tiering
3. `Information-pipeline/prompts/editor-system.md` — your persona, hard rules, two-lens framing, source-tier weighting
4. `Information-pipeline/prompts/daily-digest.md` — the daily run prompt and output format
5. `Information-pipeline/prompts/categorisation.md` — categorisation rules
6. `Information-pipeline/index/by-entity.md` and `index/by-concept.md` — existing tag corpus (re-use tags, don't invent new ones for things that already have one)
7. Yesterday's daily briefing in `Information-pipeline/daily/` (most recent file) — for continuity context; don't repeat stories already covered unless materially updated

## Step 2 — Gather raw items

Use **WebSearch** and **WebFetch** to collect ~25-40 news items from the last 24 hours from the sources in `sources.md`. Prioritise:

- **T1 lab announcements** — anthropic.com/news, openai.com/news, gemini.google/latest-news, deepmind.google/blog, x.ai/news, ai.meta.com/blog, mistral.ai/news, etc.
- **T2 newsletters** — oneusefulthing.org, stratechery.com, importai.substack.com, deeplearning.ai/the-batch, latent.space, bensbites.com, theneurondaily.com, therundown.ai
- **T3 VCs** — sequoiacap.com/stories, a16z.com/ai (especially their AI-tagged posts)
- **T4 PM thought leaders** — lennysnewsletter.com, news.aakashg.com, svpg.com, platformer.news
- **T5 aggregators** — simonwillison.net, alphasignal.ai, huggingface.co/papers
- **T6 concept seeders** — vtrivedy.com, eugeneyan.com, hamel.dev, huyenchip.com (sporadic posters — only check if posting)

**Monday special edition:** if today is Monday, extend the window to cover Sat-Sun-Mon (a 72-hour window) since the briefing was paused over the weekend. Note in the front-matter: `notes: monday weekend-special edition (Sat-Sun-Mon coverage)`.

**Hard rules:**
- Real items only with verifiable URLs. Drop anything you can't link to.
- Skip pure marketing posts, SEO listicles, and recycled takes from yesterday.
- Cap items per source at 2 (except T1 lab announcements, which are uncapped).

## Step 3 — Produce the daily briefing

Apply the **editor-system.md** + **daily-digest.md** prompts to the raw items you gathered. Produce a complete Markdown document following the exact output format in `design.md` §6:

- YAML front-matter with `date`, `read_time_min`, `items`, `deep_dive_picks`, `new_concepts`, `top_entities`, `categories_covered`, `lenses`, `concepts_introduced`, `sources_scanned`
- TL;DR with 3 bullets, each ending with "matters because…"
- Categorised sections using the 8 stable categories with their canonical emojis (see `daily-digest.md`)
- Each item: 2-3 sentence digest, "Why it matters (PM)" line, optional "Why it matters (mid-market)" line, multi-source link list, tags
- Deep Dive Picks section (0-3 items; omit if nothing qualifies)
- New Concepts section (only if a genuinely new term was introduced)
- Quick Hits (cap 8)
- Sources scanned footer

Save to `Information-pipeline/daily/YYYY-MM-DD.md` where YYYY-MM-DD is today's date.

**Read-time discipline:** target 3-5 min body read time. Demote weak items to Quick Hits rather than padding.

## Step 4 — Update indexes

Append today's entries to:
- `Information-pipeline/index/by-category.md` — one row per categorised item under the appropriate category heading
- `Information-pipeline/index/by-entity.md` — one row per entity tag mentioned today
- `Information-pipeline/index/by-concept.md` — only if a new concept was introduced today
- `Information-pipeline/index/deep-dive-picks.md` — one row per Deep Dive Pick produced today

## Step 5 — Email the briefing

Run the send-briefing script:

```bash
python3 Information-pipeline/scripts/send-briefing.py Information-pipeline/daily/YYYY-MM-DD.md
```

The script reads `RESEND_API_KEY` from the Routine's environment. The default recipient is `james.peck@myob.com`. The default sender is `onboarding@resend.dev` (Resend's unverified default — works for send-to-self).

Confirm the script printed `OK — Resend id: ...` before continuing.

## Step 6 — Commit and push

Single commit per run with this message format:

```
Daily briefing — <YYYY-MM-DD>

<one-sentence summary of the top story or theme>

Resend id: <id-from-step-5>
```

Push directly to `main` — this is an automated scheduled run, no PR needed.

## Failure handling

- **A source was unreachable:** note `(scrape failed)` in the Sources scanned footer. Don't block the run.
- **Low news day:** ship a shorter briefing. Do not pad to hit a length target.
- **High news day:** preserve read-time discipline. Push borderline items to Quick Hits or omit.
- **Resend send fails:** still commit the Markdown, then open a GitHub issue titled "Daily briefing email failed — YYYY-MM-DD" with the error details so a human can investigate.
- **Anything fundamentally broken** (e.g. cannot reach any T1 source for 10+ minutes): commit a stub `daily/YYYY-MM-DD.md` with `notes: automated run failed at <step> — investigate` and skip the email. A human will rerun.

## Time budget

Aim for ≤ 12 minutes wall-clock total. If you're approaching 15 min, ship what you have rather than blocking on perfection. The pipeline favours daily reliability over single-day completeness.

---

When you're done, post a one-line status message confirming: today's date, item count, Resend ID, and commit SHA. Then end the session.
