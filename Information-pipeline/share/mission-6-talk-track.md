# Mission 6 — Talk Track

> Speaking notes for the [`mission-6-team-share.html`](mission-6-team-share.html) deck. Target total: **7 minutes** plus Q&A. Each slide section has a time budget, the script itself, the key idea to land, and a transition cue to the next slide. Read the script in your own voice — these aren't lines to memorise, they're a scaffold for what to say.

---

## Before you start

**Have open in tabs (in this order, so they're easy to flip to during Q&A):**
1. The deck itself, full-screen
2. `daily/2026-05-20.md` rendered on GitHub
3. The NotebookLM audio share URL (so you can play 20 seconds of it if asked)
4. The Claude Design deck URL
5. The repo home page

**Tone:** plain-spoken, calibrated, no hype. You've actually built this thing — talk like someone who did, not someone selling it. Pauses are good. Don't fill every second.

**The single thing you want them to leave with:** *the pattern works for any content stream, not just AI news*. Slide 9 + 10 are where you push that. Everything before is setup.

---

## Slide 1 · Cover — **~15 seconds**

**What to say:**

> "Quick share-out on Mission 6 — the Information Pipeline mission. I built myself a daily AI briefing. Sources go in one end, a five-minute read lands in my inbox every weekday morning. I want to walk you through how it works and what I learned, because the pattern is more reusable than the topic."

**Key landing:** *the pattern is more reusable than the topic.* Plants the seed early.

**Click forward.**

---

## Slide 2 · The brief — **~30 seconds**

**What to say:**

> "Mission 6 asks for an information pipeline that pulls from multiple sources, processes with AI, and delivers insights in a useful format. Done-when: I can brief someone on the material in under seven minutes using my deck — which is what I'm doing right now.
>
> The brief unpacks into three things. Multi-source — not a one-shot summariser. AI-driven filtering — the editor has to make judgement calls about signal versus noise. And a repeatable workflow, so it ships every weekday, not just once."

**Key landing:** the brief wasn't "use NotebookLM and Gamma" — it was build a system. The tools are downstream of the system design.

**Click forward.**

---

## Slide 3 · What I built — **~90 seconds**

> *This is the slide where the diagram does most of the work. Walk left-to-right.*

**What to say:**

> "Three layers. On the left, sources — thirty-eight of them, tiered. Tier 1 is the labs themselves: Anthropic, OpenAI, Google, xAI. They're the primary source for anything about them. Tier 2 is the established AI newsletters and analysts — Stratechery, Ethan Mollick, The Neuron. Tier 3 is VC AI thinking — Sequoia, a16z, YC. Tier 4 is PM voices — Lenny, Marty Cagan, Platformer. Tier 5 is aggregators like Simon Willison and Hugging Face Papers. Tier 6 is what I call concept seeders — individual essayists who tend to name new ideas before the mainstream picks them up.
>
> *(pause, gesture to middle)*
>
> In the middle is the editor — a Claude session driven by five prompts. It reads, dedupes, categorises into eight stable categories, scores items by importance, and adds the 'why it matters' line we'll see in a minute.
>
> *(gesture right)*
>
> On the right, three cadences. Daily is a Markdown briefing — five-minute read, mailed weekday mornings. Weekly synthesises the week and gets fed into NotebookLM for a podcast-style audio overview I listen to on weekends. Monthly is a trend pack that gets turned into a slide deck via Claude Design for stakeholder briefings.
>
> All three commit to the repo. There's a small set of indexes — by category, by entity, by concept — that get updated each run. So on day thirty I can search 'everything that mentioned Anthropic this quarter' and actually get an answer."

**Key landing:** the system has three layers and a cadence ladder. Don't get into prompt details — that's repo-level.

**If running long:** skip the tier-by-tier walkthrough, just say "thirty-eight sources, six tiers".

**Click forward.**

---

## Slide 4 · The two-lens framing — **~45 seconds**

**What to say:**

> "If I had to name one thing that makes this useful versus subscribing to any AI newsletter on the market — it's this. Every item answers two questions, not one.
>
> The default lens is the PM lens — what does this change about how I build products? Roadmap, scoping, packaging, eng-product conversations. That's on every item.
>
> The second lens — added when relevant — is the mid-market lens. What does this mean for the segment MYOB plays in? Packaging changes, pricing moves, vertical AI, compliance dynamics. Most generic AI news doesn't carry that signal explicitly, but it often *contains* it.
>
> *(point at the Anthropic example)*
>
> Here's a real one. Anthropic shipped a Claude for Small Business plugin this week. The PM lens reads: labs are now packaging vertical products, not just selling APIs. The mid-market lens reads: this just set the baseline that Microsoft Copilot and Google Workspace will have to respond to — your mid-market pricing study is now a moving target."

**Key landing:** two lenses, low cost to add, big increase in usefulness.

**Click forward.**

---

## Slide 5 · Pilot in action — **~60 seconds**

> *This is the demo moment. Open the actual artifacts if you can.*

**What to say:**

> "Here's the proof point. Wednesday this week — Google I/O dropping a model family, Anthropic announcing first-profitable-quarter, and the SpaceX S-1 filing revealing the $45 billion Anthropic compute deal. Big news day.
>
> Thirty sources scanned. Twelve items in the briefing. Five-minute read.
>
> *(point at tiles, click each if presenting live)*
>
> The Markdown is what I read at my desk. The NotebookLM audio is the same content as an AI-podcast — about ten minutes, two hosts, surprisingly listenable. I had it playing on the walk home. The Claude Design deck is what I'd send to a leadership audience that needs the seven-minute context. All three artifacts from the same source corpus, no extra work — they each fit a different consumption moment.
>
> *(pause, point at pill)*
>
> Done-when criterion: brief someone in seven minutes using my deck. Hit. Right now in fact."

**Key landing:** one corpus, three formats, three consumption moments.

**If you want to play the audio:** play just twenty seconds of the intro. Don't lose the room to a ten-minute clip.

**Click forward.**

---

## Slide 6 · Routines vs GitHub Actions — **~60 seconds**

**What to say:**

> "Quick architectural moment, because I went a non-obvious way and I think it's the right call.
>
> Default answer for 'run this every weekday at 8am' is a GitHub Actions cron. I went the other way — I'm using Claude Code Routines, which are basically scheduled Claude sessions.
>
> *(walk through table briefly — point at the two extremes)*
>
> The reason is at the top of the table. News gathering means scraping HTML and parsing RSS — a GitHub Actions cron would mean a Python script doing that, and that script breaks the day any source changes its layout. Editorial judgement — deciding what's signal versus noise — can't be encoded in a script. That's literally the thing Claude is for.
>
> *(point at insight line)*
>
> The framing I came to: news gathering plus editorial judgement is *irreducibly agentic*. If I tried to script it, I'd be re-implementing Claude in Python — and losing every advantage the model gives me.
>
> The trade-off is it uses my Claude Code subscription quota rather than per-token billing. For something running once a day, that's the better deal."

**Key landing:** match the tool to the task. Agentic work in agents, deterministic work in scripts.

**If asked "why not use both?":** great question — Mission 7 will probably split it. Routine does the agentic part, a small GHA does the deterministic send-email-and-commit part. Future work.

**Click forward.**

---

## Slide 7 · What I didn't automate — **~30 seconds**

**What to say:**

> "Two things in the pipeline are still manual on purpose.
>
> NotebookLM doesn't have a public consumer API for the audio overview feature. Two minutes a week, paste the weekly Markdown in, click generate.
>
> Claude Design is research-preview only — same story. Five minutes a month for the monthly deck.
>
> *(point at thirteen-minute stat)*
>
> Total human-attention time across the whole pipeline: about thirteen minutes a month. Lesson I want to land — 'must automate everything' is a great way to never ship. A workflow that's ninety-five percent automated and runs for years beats one that's a hundred percent automated and never quite gets out the door."

**Key landing:** pragmatism beats perfectionism.

**Click forward.**

---

## Slide 8 · 5 transferable lessons — **~90 seconds**

> *Slowest slide deliberately. These are the takeaways — give each one a breath.*

**What to say:**

> "Five things I'd tell any of you about doing this kind of project.
>
> *(read or paraphrase each — pause briefly between)*
>
> One. Two-lens framing doubles value at low cost. Pick two lenses your audience actually has and ask both questions of every item. Cost of the second question is near zero; value of the second answer is huge.
>
> Two. Structured metadata is leverage. The YAML at the top of every Markdown file in this pipeline drives the email subject line, the deck URLs, the search indexes. None of it is hand-maintained. Invest in the structure on day one.
>
> Three. Tag discipline compounds. A consistent taxonomy looks like overkill on day one and pays off on day thirty when you can search a quarter of history in seconds.
>
> Four. Manual paste steps are acceptable. Most of the value lives in the corpus, not the delivery channel. If the API doesn't exist, design around it instead of waiting for it.
>
> Five. Match the tool to the task. Agentic work belongs in agents — judgement, synthesis, fuzzy inputs. Deterministic work belongs in scripts. Don't force one into the shape of the other."

**Key landing:** these are portable. Each one applies far beyond AI news pipelines.

**If running short on time:** drop lessons 3 and 4 — they're in the repo for anyone who reads it.

**Click forward.**

---

## Slide 9 · What's next — **~30 seconds**

**What to say:**

> "This is the bit I want you to take seriously. The pipeline shape — sources, editor, cadenced outputs, inbox — works for far more than AI news.
>
> *(point at three columns)*
>
> Competitive intel. Customer feedback synthesis. Regulatory tracking. Three really common PM problems where today you're either skimming feeds for an hour a day or you're not doing it at all. Same architecture solves all of them — the only thing that changes is the source list and one paragraph in the editor prompt.
>
> For this specific pipeline, Mission 7 automates the email step further — that's running from Monday. First monthly recap drops next Friday with a Claude Design deck attached. By August the concept timeline alone — the running glossary of new AI terms — will be a useful artifact on its own."

**Key landing:** pattern reusability. They should leave thinking about which of their own workflows fits this shape.

**Click forward.**

---

## Slide 10 · Steal this — **~30 seconds**

**What to say:**

> "Everything's in the repo. Three pieces are particularly easy to fork for your own missions.
>
> The source list — the structure is generic, the URLs are AI-specific. Swap one, keep the other.
>
> The editor prompt — change the audience and the two lenses, the rest carries.
>
> The weekly recap prompt — it has audio-friendly writing rules baked in, which is the kind of detail you don't realise you need until you've tried feeding NotebookLM bullet-only content and gotten an awkward audio.
>
> *(point at purple callout)*
>
> If you want to try this pattern for one of your own workflows, ping me. Easier to walk through it together than read the README cold.
>
> *(pause)*
>
> That's it. Happy to take questions."

**Key landing:** concrete offer — pair on setup. Lower the activation energy for them to try it.

---

## Q&A — anticipated questions

| Question | One-line answer |
|---|---|
| "How much does it cost to run?" | Uses my existing Claude Code subscription. No marginal cost per run. If you wanted a fully scripted version with Anthropic API directly, ballpark a dollar a day. |
| "What if a source goes down?" | The routine notes it in the briefing's Sources footer and continues. Doesn't block the run. One source being unreachable is normal — five would be a problem. |
| "What if Claude hallucinates a fact?" | Hard rule in the editor prompt: every claim has a source link. No claim survives without provenance. I spot-check one item a day. In a week of pilots, no fabrications. |
| "Could you do this without Claude Code on the Web?" | Yes — Mission 7 is the GitHub Actions fallback. Trade-off is brittleness as I described. For my use case Routines win. |
| "What about [other AI newsletter] — why not just subscribe?" | Two reasons. One, no other newsletter has the mid-market lens applied. Two, this gives me a searchable archive — by August the concept timeline is going to be its own artifact. Subscribing gives me reading material; this gives me a corpus. |
| "How long did this take to build?" | About a weekend. The expensive part was the taxonomy and prompts; everything else was scaffolding. |
| "Can I see the prompts?" | Yes — they're all in `Information-pipeline/prompts/` in the repo. The `editor-system.md` one is the most reusable. |
| "What did you learn that surprised you?" | Two things. First, how much the two-lens framing changed the output — it's a small prompt change with a big payoff. Second, how NotebookLM's audio quality depends on the input being prose, not bullets — the weekly prompt is specifically written for audio. |
| "Why didn't you use [Gamma / Manus / GenSpark] for the deck?" | Tried Claude Design first because it's already in my Claude subscription — no extra cost or login. Output quality was good enough for first iteration. Gamma is on the shortlist if I want polish; Claude Design wins on integration. |

---

## Recovery phrases — if you lose your place

- *"The thing I really wanted to land on this slide is…"* — gracefully drop to the key takeaway and move on
- *"There's more detail in the repo if anyone wants it — for time, let me skip to…"* — escape hatch to the next slide
- *"Quick test — is the size readable from the back?"* — pause without admitting you lost your spot

---

## After the talk

- Drop the deck URL in the team channel
- Open a GitHub issue titled `Mission 6 share session — questions and follow-ups` and post any open threads from Q&A
- Log the demo in `missions/my-resolutions.md` Resolution 4 table (Session 6)
- If anyone asked to pair on setting up a version for their own workflow, follow up within the week — momentum is the asset
